import { NextResponse, after } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendAdminNewSubmission, sendGenerationFailureAlert, sendAthleteReportReady } from "@/lib/email/send";
import { sendAthleteUploadLink } from "@/lib/whatsapp/send";
import { generateRelocationDocument } from "@/lib/ai/generate-document";

export async function POST(request, { params }) {
  const admin = createAdminClient();
  const { slug } = await params;

  // Load club by slug
  const { data: club, error: clubError } = await admin
    .from("clubs")
    .select("id, name, type, plan, seat_limit, seats_used, active")
    .eq("slug", slug)
    .single();

  if (clubError || !club) {
    return NextResponse.json({ error: "Club not found" }, { status: 404 });
  }

  if (!club.active) {
    return NextResponse.json({ error: "This link is no longer active" }, { status: 403 });
  }

  // Derive effective limit from plan if seat_limit not explicitly set
  const effectiveLimit = club.seat_limit ?? (club.plan === "premium" ? 100 : 40);
  if ((club.seats_used ?? 0) >= effectiveLimit) {
    return NextResponse.json({ error: "This institution has reached its guide limit for the year. Please contact hello@settlyou.com." }, { status: 403 });
  }

  const body = await request.json();

  // Duplicate prevention — check for existing active submission from same student
  if (body.athlete_email) {
    const { data: existing } = await admin
      .from("requests")
      .select("id, status")
      .eq("club_id", club.id)
      .eq("athlete_email", body.athlete_email)
      .neq("status", "delivered")
      .limit(1)
      .single();

    if (existing) {
      return NextResponse.json(
        { error: "A guide request for this email already exists. Please contact your institution if you need a new guide." },
        { status: 409 }
      );
    }
  } else if (body.athlete_name) {
    const { data: existing } = await admin
      .from("requests")
      .select("id, status")
      .eq("club_id", club.id)
      .eq("athlete_name", body.athlete_name)
      .neq("status", "delivered")
      .limit(1)
      .single();

    if (existing) {
      return NextResponse.json(
        { error: "A guide request for this name already exists. Please contact your institution if you need a new guide." },
        { status: 409 }
      );
    }
  }

  // Coach sport validation — athlete's sport must have a registered coach
  if (body.sport) {
    const { data: coachForSport } = await admin
      .from("profiles")
      .select("id")
      .eq("club_id", club.id)
      .eq("role", "coach")
      .eq("sport", body.sport)
      .limit(1)
      .single();

    if (!coachForSport) {
      return NextResponse.json(
        { error: `${club.name} has not registered a ${body.sport} coach yet. Please contact your institution for assistance.` },
        { status: 422 }
      );
    }
  }

  const token = crypto.randomUUID();
  const uploadToken = crypto.randomUUID();

  const { data: inserted, error: insertError } = await admin.from("requests").insert({
    club_id: club.id,
    athlete_link_token: token,
    upload_token: uploadToken,
    submitted_by_athlete: true,
    status: "submitted",
    athlete_type: body.athlete_type || "pro",
    // Athlete
    athlete_name: body.athlete_name,
    athlete_age: body.athlete_age ? parseInt(body.athlete_age) : null,
    athlete_nationality: body.athlete_nationality,
    athlete_languages: body.athlete_languages,
    sport: body.sport || null,
    current_city: body.current_city || null,
    current_country: body.current_country || null,
    report_language: body.report_language || "English",
    // Pro only
    club_joining: body.club_joining || null,
    training_ground_address: body.training_ground_address || null,
    contract_duration: body.contract_duration || null,
    // College only
    university: body.university || null,
    major: body.major || null,
    has_scholarship: body.has_scholarship || false,
    on_campus_housing: body.on_campus_housing || false,
    semester_start: body.semester_start || null,
    is_part_of_team: body.is_part_of_team ?? false,
    is_international: body.is_international ?? true,
    student_level: body.student_level || null,
    study_style: body.study_style || null,
    work_plans: body.work_plans || null,
    social_goals: body.social_goals || [],
    training_schedule: body.training_schedule || null,
    // Family
    family_size: body.family_size || 1,
    children_ages: body.children_ages || [],
    partner_name: body.partner_name || null,
    partner_languages: body.partner_languages || [],
    partner_profession: body.partner_profession || null,
    has_pets: body.has_pets || false,
    pet_details: body.pet_details || null,
    medical_needs: body.medical_needs || null,
    guest_visit_frequency: body.guest_visit_frequency || null,
    guest_hotel_budget: body.guest_hotel_budget || null,
    // Destination
    destination_city: body.destination_city,
    destination_country: body.destination_country,
    move_date: body.move_date || null,
    budget_usd: body.budget_usd || null,
    // Housing
    housing_type: body.housing_type || "No preference",
    min_bedrooms: body.min_bedrooms ? parseInt(body.min_bedrooms) : null,
    housing_must_haves: body.housing_must_haves || [],
    neighborhood_type: body.neighborhood_type || [],
    max_commute_minutes: body.max_commute_minutes ? parseInt(body.max_commute_minutes) : null,
    // Lifestyle
    diet: body.diet || [],
    fitness: body.fitness || [],
    hobbies: body.hobbies || [],
    family_activities: body.family_activities || [],
    social_preference: body.social_preference || null,
    nightlife_interest: body.nightlife_interest || null,
    religious_needs: body.religious_needs || null,
    interested_in_language_classes: body.interested_in_language_classes || false,
    community_preference: body.community_preference || null,
    // Schools
    needs_school: body.needs_school || false,
    school_type: body.school_type || [],
    school_curriculum: body.school_curriculum || [],
    // Cars
    needs_car: body.needs_car || false,
    num_cars: body.num_cars || null,
    car_type: body.car_type || null,
    car_buy_or_rent: body.car_buy_or_rent || null,
    license_country: body.license_country || null,
    // Healthcare
    needs_private_healthcare: body.needs_private_healthcare || false,
    medical_specialists: body.medical_specialists || null,
    // Service
    service_tier: body.service_tier || "basic",
    athlete_email: body.athlete_email || null,
    additional_notes: body.additional_notes || null,
    athlete_phone: body.athlete_phone || null,
  }).select("id").single();

  if (insertError) {
    return NextResponse.json({ error: insertError.message }, { status: 500 });
  }

  // Increment seats_used
  await admin
    .from("clubs")
    .update({ seats_used: (club.seats_used ?? 0) + 1 })
    .eq("id", club.id);

  // Notify admin of new submission
  try {
    await sendAdminNewSubmission({
      athleteName: body.athlete_name || "Unknown athlete",
      clubName: club.name,
      destinationCity: body.destination_city || "",
      destinationCountry: body.destination_country || "",
    });
  } catch (e) {
    console.error("Failed to send admin notification:", e.message);
  }

  // Auto-generate guide in background
  const requestId = inserted?.id;
  if (requestId) {
    after(async () => {
      console.log("[auto-generate] starting for request", requestId);
      try {
        // Fetch full request + club branding
        const { data: relocationRequest } = await admin
          .from("requests").select("*").eq("id", requestId).single();

        const { data: clubData } = await admin
          .from("clubs").select("custom_notes, logo_url, primary_color, division").eq("id", club.id).single();

        if (clubData?.logo_url) relocationRequest.club_logo_url = clubData.logo_url;
        if (clubData?.primary_color) relocationRequest.club_primary_color = clubData.primary_color;
        if (clubData?.division) relocationRequest.division = clubData.division;

        // Fetch coach notes for this sport — normalize both sides to avoid case/apostrophe mismatches
        let coachNotes = null;
        let coachLinks = [];
        if (relocationRequest.sport) {
          const normSport = s => (s || "").toLowerCase().replace(/[^a-z0-9]/g, "");
          const { data: allSportNotes } = await admin
            .from("coach_sport_notes")
            .select("sport, custom_notes, custom_links")
            .eq("club_id", club.id);
          const sportNotes = allSportNotes?.find(n => normSport(n.sport) === normSport(relocationRequest.sport));
          if (sportNotes?.custom_notes) coachNotes = sportNotes.custom_notes;
          if (sportNotes?.custom_links?.length) coachLinks = sportNotes.custom_links;
          if (!sportNotes) console.warn("[auto-generate] no coach notes found for sport:", relocationRequest.sport, "| available:", allSportNotes?.map(n => n.sport));
        }

        // Merge institution notes + coach notes (coach notes take priority — they're sport-specific)
        const allNotes = [clubData?.custom_notes, coachNotes].filter(Boolean).join("\n\n");
        if (allNotes) relocationRequest.club_custom_notes = allNotes;
        if (coachLinks.length) relocationRequest.club_custom_links = coachLinks;

        // Store coach identity for document rendering
        if (coachNotes && relocationRequest.sport) {
          relocationRequest.coach_sport = relocationRequest.sport;
          // Fetch coach name
          const { data: coachProfile } = await admin
            .from("profiles")
            .select("full_name")
            .eq("club_id", club.id)
            .eq("role", "coach")
            .eq("sport", relocationRequest.sport)
            .single();
          if (coachProfile?.full_name) {
            const lastName = coachProfile.full_name.split(" ").pop();
            relocationRequest.coach_name = lastName;
          }
        }

        await admin.from("requests").update({ status: "generating" }).eq("id", requestId);

        // Look up pre-generated base data for this club
        let baseData = null;
        const { data: base } = await admin
          .from("city_base_data")
          .select("content")
          .eq("club_id", club.id)
          .eq("language", "en")
          .eq("status", "ready")
          .single();
        if (base?.content) {
          baseData = base.content;
          console.log("[auto-generate] using pre-generated base data (two-tier)");
        }

        const document = await generateRelocationDocument(relocationRequest, baseData);

        if (clubData?.logo_url) document.meta.club_logo_url = clubData.logo_url;
        if (clubData?.primary_color) document.meta.club_primary_color = clubData.primary_color;
        if (relocationRequest.coach_sport) document.meta.coach_sport = relocationRequest.coach_sport;
        if (relocationRequest.coach_name) document.meta.coach_name = relocationRequest.coach_name;
        if (coachNotes) document.meta.coach_notes = coachNotes;
        if (coachLinks?.length) document.meta.coach_links = coachLinks;

        const { error: docError } = await admin
          .from("documents").insert({ request_id: requestId, content: document, language: "en" });

        if (docError) throw new Error(docError.message);

        // Hard guarantee: verify coach notes are in the saved document — patch if missing
        if (coachNotes) {
          const { data: savedDoc } = await admin
            .from("documents").select("id, content").eq("request_id", requestId).single();
          if (savedDoc && !savedDoc.content?.meta?.coach_notes) {
            console.error("[auto-generate] CRITICAL: coach notes missing from saved document, patching...");
            await admin.from("documents").update({
              content: {
                ...savedDoc.content,
                meta: { ...savedDoc.content.meta, coach_notes: coachNotes, ...(coachLinks?.length && { coach_links: coachLinks }) },
              },
            }).eq("id", savedDoc.id);
          }
        }

        // Auto-deliver: send email + WhatsApp, set status to delivered
        await admin.from("requests").update({ status: "delivered" }).eq("id", requestId);
        await admin.from("documents")
          .update({ approved_at: new Date().toISOString() })
          .eq("request_id", requestId);

        if (relocationRequest.athlete_email && relocationRequest.athlete_link_token) {
          try {
            await sendAthleteReportReady({
              athleteName: relocationRequest.athlete_name || "Athlete",
              athleteEmail: relocationRequest.athlete_email,
              clubName: club.name,
              reportToken: relocationRequest.athlete_link_token,
            });
          } catch (e) {
            console.error("[auto-generate] failed to send athlete email:", e.message);
          }
        }

        if (relocationRequest.athlete_phone && relocationRequest.upload_token) {
          try {
            await sendAthleteUploadLink({
              athleteName: relocationRequest.athlete_name || "",
              athletePhone: relocationRequest.athlete_phone,
              uploadToken: relocationRequest.upload_token,
              institutionName: club.name,
              sport: relocationRequest.sport || "",
            });
          } catch (e) {
            console.error("[auto-generate] failed to send WhatsApp:", e.message);
          }
        }

        await admin.from("events").insert({
          event_type: "guide_delivered",
          request_id: requestId,
          club_id: club.id,
          metadata: {
            athlete_name: relocationRequest.athlete_name || "Athlete",
            athlete_email: relocationRequest.athlete_email || null,
            report_token: relocationRequest.athlete_link_token,
            sport: relocationRequest.sport || null,
          },
        });

        console.log("[auto-generate] done, guide auto-delivered to", relocationRequest.athlete_email);
      } catch (err) {
        await admin.from("requests").update({ status: "submitted" }).eq("id", requestId);
        console.error("[auto-generate] error:", err);
        try {
          const { data: failedRequest } = await admin
            .from("requests").select("athlete_name").eq("id", requestId).single();
          await sendGenerationFailureAlert({
            athleteName: failedRequest?.athlete_name || "Unknown student",
            clubName: club.name,
            requestId,
            errorMessage: err.message,
          });
        } catch (alertErr) {
          console.error("[auto-generate] failed to send alert:", alertErr.message);
        }
      }
    });
  }

  return NextResponse.json({ ok: true });
}
