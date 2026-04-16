import { NextResponse, after } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendAdminNewSubmission } from "@/lib/email/send";
import { generateRelocationDocument } from "@/lib/ai/generate-document";

export async function POST(request, { params }) {
  const admin = createAdminClient();
  const { slug } = await params;

  // Load club by slug
  const { data: club, error: clubError } = await admin
    .from("clubs")
    .select("id, name, type, seat_limit, seats_used, active")
    .eq("slug", slug)
    .single();

  if (clubError || !club) {
    return NextResponse.json({ error: "Club not found" }, { status: 404 });
  }

  if (!club.active) {
    return NextResponse.json({ error: "This link is no longer active" }, { status: 403 });
  }

  if (club.seat_limit && club.seats_used >= club.seat_limit) {
    return NextResponse.json({ error: "This club has reached its report limit" }, { status: 403 });
  }

  const body = await request.json();

  const token = crypto.randomUUID();

  const { data: inserted, error: insertError } = await admin.from("requests").insert({
    club_id: club.id,
    athlete_link_token: token,
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
    is_international: body.is_international ?? true,
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
  }).select("id").single();

  if (insertError) {
    return NextResponse.json({ error: insertError.message }, { status: 500 });
  }

  // Increment seats_used
  await admin
    .from("clubs")
    .update({ seats_used: club.seats_used + 1 })
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
          .from("clubs").select("custom_notes, logo_url, primary_color").eq("id", club.id).single();

        if (clubData?.custom_notes) relocationRequest.club_custom_notes = clubData.custom_notes;
        if (clubData?.logo_url) relocationRequest.club_logo_url = clubData.logo_url;
        if (clubData?.primary_color) relocationRequest.club_primary_color = clubData.primary_color;

        await admin.from("requests").update({ status: "generating" }).eq("id", requestId);

        const document = await generateRelocationDocument(relocationRequest);

        if (clubData?.logo_url) document.meta.club_logo_url = clubData.logo_url;
        if (clubData?.primary_color) document.meta.club_primary_color = clubData.primary_color;

        const { error: docError } = await admin
          .from("documents").insert({ request_id: requestId, content: document, language: "en" });

        if (docError) throw new Error(docError.message);

        await admin.from("requests").update({ status: "under_review" }).eq("id", requestId);
        console.log("[auto-generate] done, status set to under_review");
      } catch (err) {
        await admin.from("requests").update({ status: "submitted" }).eq("id", requestId);
        console.error("[auto-generate] error:", err);
      }
    });
  }

  return NextResponse.json({ ok: true });
}
