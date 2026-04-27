import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, organization_id")
    .eq("id", user.id)
    .single();

  if (!profile?.organization_id) {
    return NextResponse.json({ error: "No organization found for this account." }, { status: 403 });
  }

  const body = await request.json();

  const { error } = await supabase.from("requests").insert({
    organization_id: profile.organization_id,
    created_by: profile.id,
    // Athlete
    athlete_name: body.athlete_name,
    athlete_age: body.athlete_age ? parseInt(body.athlete_age) : null,
    athlete_nationality: body.athlete_nationality,
    athlete_languages: body.athlete_languages,
    current_city: body.current_city || null,
    current_country: body.current_country || null,
    club_joining: body.club_joining || null,
    training_ground_address: body.training_ground_address || null,
    contract_duration: body.contract_duration || null,
    // Family
    family_size: body.family_size,
    children_ages: body.children_ages,
    partner_name: body.partner_name || null,
    partner_languages: body.partner_languages,
    partner_profession: body.partner_profession || null,
    has_pets: body.has_pets,
    pet_details: body.pet_details || null,
    medical_needs: body.medical_needs || null,
    // Destination
    destination_city: body.destination_city,
    destination_country: body.destination_country,
    move_date: body.move_date || null,
    budget_usd: body.budget_usd,
    // Housing
    housing_type: body.housing_type,
    min_bedrooms: body.min_bedrooms ? parseInt(body.min_bedrooms) : null,
    housing_must_haves: body.housing_must_haves,
    neighborhood_type: body.neighborhood_type,
    max_commute_minutes: body.max_commute_minutes ? parseInt(body.max_commute_minutes) : null,
    // Lifestyle
    diet: body.diet,
    fitness: body.fitness,
    hobbies: body.hobbies,
    social_preference: body.social_preference || null,
    nightlife_interest: body.nightlife_interest || null,
    religious_needs: body.religious_needs || null,
    interested_in_language_classes: body.interested_in_language_classes,
    community_preference: body.community_preference || null,
    // Schools
    needs_school: body.needs_school,
    school_type: body.school_type,
    school_curriculum: body.school_curriculum,
    // Cars
    needs_car: body.needs_car,
    num_cars: body.num_cars || null,
    car_type: body.car_type || null,
    car_buy_or_rent: body.car_buy_or_rent || null,
    license_country: body.license_country || null,
    // Healthcare
    needs_private_healthcare: body.needs_private_healthcare,
    medical_specialists: body.medical_specialists || null,
    // Service
    service_tier: body.service_tier,
    additional_notes: body.additional_notes || null,
    athlete_phone: body.athlete_phone || null,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
