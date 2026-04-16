import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

function buildPrompt(request) {
  const r = request;

  return `You are Settl's athletic performance relocation analyst. Your job is to help professional athletes not just live in their new city — but perform at their best there. Every recommendation must be filtered through the lens of athletic performance, recovery, and wellbeing. Return ONLY valid JSON — no markdown, no explanation.

CRITICAL LANGUAGE RULE: You MUST write the ENTIRE document in ${r.report_language || "English"}. Every single word — section titles, descriptions, tips, recommendations, labels, notes, welcome letter, everything — must be in ${r.report_language || "English"}. Do NOT use English if the language is not English. This is mandatory.

ATHLETE: ${r.athlete_name}, ${r.athlete_nationality}, age ${r.athlete_age || "N/A"}
SPORT: ${r.sport || "N/A"}
MOVING TO: ${r.destination_city}, ${r.destination_country}
CLUB: ${r.club_joining || "N/A"} | TRAINING GROUND: ${r.training_ground_address || "N/A"}
CURRENTLY IN: ${r.current_city ? `${r.current_city}, ${r.current_country}` : "N/A"}
LANGUAGES: ${r.athlete_languages?.join(", ") || "N/A"}
FAMILY: ${r.family_size} people moving | Children ages: ${r.children_ages?.length ? r.children_ages.join(", ") : "none"} | Partner: ${r.partner_name || "none"}
PETS: ${r.has_pets ? r.pet_details : "none"}
HOUSING: ${r.housing_type}, ${r.min_bedrooms || "N/A"} bedrooms, budget $${r.budget_usd?.toLocaleString() || "N/A"}/mo, max ${r.max_commute_minutes || "N/A"}min commute
DIET: ${r.diet?.join(", ") || "none"} | RELIGION: ${r.religious_needs || "none"} | FITNESS: ${r.fitness?.join(", ") || "N/A"}
HOBBIES: ${r.hobbies?.join(", ") || "N/A"} | NIGHTLIFE: ${r.nightlife_interest || "N/A"}
SCHOOLS NEEDED: ${r.needs_school ? `Yes, ages ${r.children_ages?.join(", ")}, type: ${r.school_type?.join(", ") || "any"}` : "No"}
CAR: ${r.needs_car ? `${r.num_cars}x ${r.car_type}, ${r.car_buy_or_rent}, license from ${r.license_country || "N/A"}` : "Not needed"}
HEALTHCARE: ${r.needs_private_healthcare ? "Private preferred" : "Standard"} | Specialists: ${r.medical_specialists || "none"}
MOVE DATE: ${r.move_date || "N/A"} | CONTRACT: ${r.contract_duration || "N/A"}
FAMILY ACTIVITIES: ${r.family_activities?.join(", ") || "N/A"}
GUEST VISITS: ${r.guest_visit_frequency || "not specified"} | GUEST BUDGET: ${r.guest_hotel_budget || "mid-range"}
${r.additional_notes ? `ATHLETE NOTES: ${r.additional_notes}` : ""}
${r.club_custom_notes ? `CLUB NOTES (include this information in the guide): ${r.club_custom_notes}` : ""}

Rules:
- Use real, specific places in ${r.destination_city} — no generic advice
- Every place must have a "url" field (real website)
- Max 3 items per section, descriptions under 2 sentences
- Prices must be real estimates for ${r.destination_city}
- Tone: warm, personal, and performance-focused
- ATHLETE LENS: Always think about how each recommendation impacts training, recovery, and performance. A neighborhood recommendation should mention commute to training ground and proximity to recovery facilities. A restaurant recommendation should note whether it's good for pre/post-training nutrition. A fitness recommendation should be athlete-grade, not a commercial gym.
- PERFORMANCE FIRST: This is not a generic relocation guide. It is a high-performance athlete relocation guide. Every section should feel like it was written by someone who understands elite sport.
${r.additional_notes ? `- IMPORTANT: The athlete wrote this personal note — you MUST incorporate it into the guide: "${r.additional_notes}"` : ""}
${r.club_custom_notes ? `- IMPORTANT: The club added these notes — you MUST include this information somewhere in the guide: "${r.club_custom_notes}"` : ""}

{
  "meta": {
    "athlete_name": "${r.athlete_name}",
    "destination": "${r.destination_city}, ${r.destination_country}",
    "club": "${r.club_joining || ""}",
    "club_logo_url": "official club crest URL (.png/.jpg/.svg)",
    "club_primary_color": "hex color e.g. #1A1A2E",
    "club_website": "official club website URL",
    "generated_summary": "2-3 sentence intro to the city for this athlete — mention what makes it great for a professional athlete specifically",
    "welcome_letter": "3-4 sentence personal welcome letter to ${r.athlete_name} — acknowledge their sport, the challenge of relocating as a professional, and express confidence in their success on and off the field"
  },
  "sections": {
    "neighborhoods": {
      "title": "Recommended Neighborhoods",
      "intro": "one sentence — mention proximity to training ground and athlete lifestyle",
      "items": [{"name":"","fit_score":90,"fit_reason":"","description":"","character":"","avg_rent_range":"","commute_to_training":"","pros":[],"cons":[],"best_for":""}]
    },
    "housing": {
      "title": "Housing Options",
      "intro": "one sentence",
      "tips": ["","",""],
      "search_platforms": [{"name":"","url":"","note":""}],
      "items": [{"type":"","area":"","description":"","price_range":"","bedrooms":"","highlights":[],"ideal_for":""}]
    },
    "performance_recovery": {
      "title": "Performance & Recovery",
      "intro": "one sentence on the recovery culture and sports infrastructure in ${r.destination_city}",
      "recovery_centers": [{"name":"","url":"","type":"e.g. Cryotherapy, Float Tank, Sports Massage, Physiotherapy","location":"","description":"","price_range":"","athlete_note":"why this is valuable for a ${r.sport || "professional"} athlete"}],
      "sports_nutrition": [{"name":"","url":"","type":"e.g. Performance dietitian, Meal prep service, Supplement store","location":"","description":"","price_range":"","athlete_note":"how this supports performance"}],
      "mental_performance": "one sentence on mental health or sports psychology resources available in ${r.destination_city}"
    },
    "schools": ${r.needs_school ? `{
      "title": "Schools",
      "intro": "one sentence",
      "items": [{"name":"","url":"","type":"","curriculum":"","age_range":"","language_of_instruction":"","description":"","location":"","fee_range":"","highlights":[],"application_tip":""}]
    }` : "null"},
    "transportation": {
      "title": "${r.needs_car ? "Transportation & Cars" : "Getting Around"}",
      "intro": "one sentence",
      ${r.needs_car ? `"license_info": "info about using ${r.license_country || "foreign"} license in ${r.destination_country}",` : ""}
      "items": [{"option":"","${r.needs_car ? "brand_models" : "description"}":${r.needs_car ? '[""]' : '""'},"price_range":"","description":"","tips":[]}],
      "public_transport_note": "one sentence"
    },
    "fitness": {
      "title": "Training & Fitness Facilities",
      "intro": "one sentence — focus on athlete-grade facilities beyond the club training ground",
      "items": [{"name":"","url":"","type":"","location":"","description":"","price_range":"","athlete_note":"why this is worth it for a professional athlete","highlights":[]}]
    },
    "healthcare": {
      "title": "Sports Medicine & Healthcare",
      "intro": "one sentence — emphasize sports medicine and athlete-specific care",
      "insurance_note": "one sentence on health insurance for foreigners in ${r.destination_country}",
      "items": [{"name":"","url":"","type":"e.g. Sports Medicine Clinic, Orthopedic Specialist, Physiotherapist, General Practitioner","location":"","description":"","specialties":[],"languages":[],"tip":""}]
    },
    "dining": {
      "title": "Nutrition & Dining",
      "intro": "one sentence — frame through the lens of fueling an athlete",
      "performance_tip": "one sentence on the best eating strategy for an athlete in ${r.destination_city} — local foods that are great for performance",
      "diet_note": "specific note for ${r.diet?.join(", ") || "this athlete's"} diet in ${r.destination_city}",
      "supermarkets": [{"name":"","url":"","type":"","location":"","note":""}],
      "restaurants": [{"name":"","url":"","cuisine":"","location":"","why_recommended":"","price_range":"","must_try":"","athlete_note":"why this works for an athlete's diet"}]
    },
    "religious_cultural": ${r.religious_needs ? `{
      "title": "Religious & Cultural",
      "intro": "one sentence",
      "items": [{"name":"","url":"","type":"","location":"","description":"","tip":""}]
    }` : "null"},
    "nightlife_entertainment": ${r.nightlife_interest && r.nightlife_interest !== "Not important" ? `{
      "title": "Nightlife & Entertainment",
      "intro": "one sentence",
      "items": [{"name":"","url":"","type":"","location":"","description":"","vibe":""}]
    }` : "null"},
    "integration": {
      "title": "Integration & Community",
      "intro": "one sentence",
      "language_tip": "one sentence",
      "expat_community": "one sentence on the athlete/footballer community in ${r.destination_city} and how to connect",
      "items": [{"name":"","url":"","type":"","description":"","tip":""}]
    },
    "practical": {
      "title": "Practical Information",
      "intro": "one sentence",
      "items": [{"category":"","title":"","description":"","tips":[],"url":""}]
    },
    "family_life": {
      "title": "Family Life & Weekends",
      "intro": "one sentence",
      "items": [{"name":"","url":"","type":"","location":"","description":"","best_for":"","price_range":""}]
    },
    "guest_accommodation": {
      "title": "For Visiting Family & Guests",
      "intro": "one sentence",
      "neighborhoods_tip": "one sentence on best areas for guests to stay",
      "hotels": [{"name":"","url":"","stars":0,"location":"","description":"","price_range":"","why_recommended":""}]
    },
    "day_trips": {
      "title": "Day Trips & Weekend Getaways",
      "intro": "one sentence",
      "items": [{"name":"","description":"","distance_km":"","travel_time":"","best_for":"","highlights":[]}]
    },
    "local_life": {
      "title": "Local Life & Daily Tips",
      "intro": "one sentence",
      "apps": [{"name":"","purpose":"","note":""}],
      "tips": [{"category":"","tip":""}]
    },
    "emergency_contacts": {
      "title": "Emergency Contacts",
      "intro": "one sentence",
      "items": [{"category":"","name":"","number":"","note":""}]
    }
  }
}`;
}

function buildCollegePrompt(request) {
  const r = request;

  return `You are Settl's athletic performance relocation analyst. Your job is to help college student-athletes not just survive their new city — but thrive academically, athletically, and personally. Every recommendation must consider their dual role as a student AND a high-performance athlete. Return ONLY valid JSON — no markdown, no explanation.

CRITICAL LANGUAGE RULE: You MUST write the ENTIRE document in ${r.report_language || "English"}. Every single word — section titles, descriptions, tips, recommendations, labels, notes, welcome letter, everything — must be in ${r.report_language || "English"}. Do NOT use English if the language is not English. This is mandatory.

ATHLETE: ${r.athlete_name}, ${r.athlete_nationality}, age ${r.athlete_age || "N/A"}
STUDENT TYPE: ${r.is_international ? "International student (F-1 visa)" : "Domestic US student (relocating within the US)"}
SPORT: ${r.sport || "N/A"}
UNIVERSITY: ${r.university || "N/A"} | CAMPUS CITY: ${r.destination_city}, ${r.destination_country}
CURRENTLY IN: ${r.current_city ? `${r.current_city}, ${r.current_country}` : "N/A"}
LANGUAGES: ${r.athlete_languages?.join(", ") || "N/A"}
MAJOR: ${r.major || "N/A"} | SCHOLARSHIP: ${r.has_scholarship ? "Yes" : "No"} | SEMESTER START: ${r.semester_start || "N/A"}
HOUSING: ${r.on_campus_housing ? "On-campus housing" : `Off-campus, ${r.housing_type || "apartment"}, ${r.min_bedrooms || "1"} bedroom(s), budget $${r.budget_usd?.toLocaleString() || "N/A"}/mo`}
DIET: ${r.diet?.join(", ") || "none"} | RELIGION: ${r.religious_needs || "none"} | FITNESS: ${r.fitness?.join(", ") || "N/A"}
HOBBIES: ${r.hobbies?.join(", ") || "N/A"}
FAMILY: ${r.family_size > 1 ? `${r.family_size} people moving` : "Moving alone"}
${r.additional_notes ? `ATHLETE NOTES: ${r.additional_notes}` : ""}
${r.club_custom_notes ? `INSTITUTION NOTES (include this information in the guide): ${r.club_custom_notes}` : ""}

Rules:
- Use real, specific places near ${r.university || r.destination_city} — no generic advice
- Every place must have a "url" field (real website)
- Max 3 items per section, descriptions under 2 sentences
- Prices must be real estimates for ${r.destination_city}
- Tone: warm and encouraging — this may be their first time far from home
- ATHLETE LENS: This is a student-ATHLETE. Balance student life advice with high-performance athletic needs. Recovery, nutrition, and physical wellbeing are as important as academics.
- PERFORMANCE FIRST: Always think about how recommendations affect training load, recovery, sleep, and performance. A dining recommendation should note performance nutrition value. Healthcare must include sports medicine.
${r.is_international ? `- This is an international student on an F-1 visa — practical info must cover F-1 requirements, SEVIS, OPT/CPT, SSN application, and campus international student office` : `- This is a domestic US student relocating within the US — practical info should cover things like state ID/driver's license transfer, out-of-state tuition implications, setting up utilities, and settling into a new city`}
${r.on_campus_housing ? `- IMPORTANT: This athlete lives ON CAMPUS. The "neighborhoods" section MUST be null. Do NOT recommend apartments, rental listings, or off-campus neighborhoods. The housing section is about on-campus dorms only.` : ""}
${r.additional_notes ? `- IMPORTANT: The athlete wrote this personal note — you MUST incorporate it into the guide: "${r.additional_notes}"` : ""}
${r.club_custom_notes ? `- IMPORTANT: The institution added these notes — you MUST include this information somewhere in the guide: "${r.club_custom_notes}"` : ""}

{
  "meta": {
    "athlete_name": "${r.athlete_name}",
    "destination": "${r.destination_city}, ${r.destination_country}",
    "club": "${r.university || ""}",
    "club_logo_url": "official university logo URL (.png/.jpg/.svg)",
    "club_primary_color": "hex color e.g. #1A1A2E",
    "club_website": "official university website URL",
    "generated_summary": "2-3 sentence intro to the city and university for this student-athlete — mention both the academic opportunity and what makes it a great environment for athletic performance",
    "welcome_letter": "3-4 sentence personal welcome letter to ${r.athlete_name} arriving at ${r.university || "the university"} — acknowledge the challenge of balancing sport and academics, and express genuine excitement for their journey"
  },
  "sections": {
    ${r.on_campus_housing ? `"neighborhoods": null,
    "housing": {
      "title": "On-Campus Housing",
      "intro": "one sentence about the residence halls at ${r.university || "the university"}",
      "tips": ["tip about settling in on campus","tip about what to bring","tip about campus resources"],
      "search_platforms": [],
      "items": [{"type":"Residence Hall","area":"On Campus","description":"describe the on-campus housing options and what to expect","price_range":"included or typical dorm cost","bedrooms":"shared or single","highlights":[],"ideal_for":""}]
    },` : `"neighborhoods": {
      "title": "Neighborhoods Near Campus",
      "intro": "one sentence — mention proximity to campus and athlete lifestyle",
      "items": [{"name":"","fit_score":90,"fit_reason":"","description":"","character":"","avg_rent_range":"","commute_to_training":"commute to campus/facilities","pros":[],"cons":[],"best_for":""}]
    },
    "housing": {
      "title": "Off-Campus Housing",
      "intro": "one sentence",
      "tips": ["","",""],
      "search_platforms": [{"name":"","url":"","note":""}],
      "items": [{"type":"","area":"","description":"","price_range":"","bedrooms":"","highlights":[],"ideal_for":""}]
    },`}
    "campus_life": {
      "title": "Campus Life & Athletics",
      "intro": "one sentence on the athletic culture at ${r.university || "the university"}",
      "items": [{"name":"","url":"","type":"","location":"","description":"","highlights":[]}]
    },
    "performance_recovery": {
      "title": "Performance & Recovery",
      "intro": "one sentence on recovery resources available to student-athletes at ${r.university || r.destination_city}",
      "recovery_centers": [{"name":"","url":"","type":"e.g. Athletic Training Room, Cryotherapy, Sports Massage, Physiotherapy","location":"","description":"","price_range":"","athlete_note":"why this matters for a ${r.sport || "college"} athlete"}],
      "sports_nutrition": [{"name":"","url":"","type":"e.g. Campus dietitian, Performance meal plan, Supplement store","location":"","description":"","price_range":"","athlete_note":"how this supports training and recovery"}],
      "mental_performance": "one sentence on mental health and sports psychology resources for student-athletes at ${r.university || r.destination_city}"
    },
    "fitness": {
      "title": "Training & Fitness Facilities",
      "intro": "one sentence — beyond the team facilities, what else is available for extra training",
      "items": [{"name":"","url":"","type":"","location":"","description":"","price_range":"","athlete_note":"how this complements team training","highlights":[]}]
    },
    "dining": {
      "title": "Nutrition & Dining",
      "intro": "one sentence — frame through fueling a student-athlete",
      "performance_tip": "one sentence on the best eating strategy for a student-athlete in ${r.destination_city} — affordable and performance-focused",
      "diet_note": "specific note for ${r.diet?.join(", ") || "this athlete's"} diet near ${r.destination_city}",
      "supermarkets": [{"name":"","url":"","type":"","location":"","note":""}],
      "restaurants": [{"name":"","url":"","cuisine":"","location":"","why_recommended":"","price_range":"","must_try":"","athlete_note":"why this works for an athlete's diet"}]
    },
    "healthcare": {
      "title": "Sports Medicine & Health",
      "intro": "one sentence — emphasize campus sports medicine and athlete-specific care",
      "insurance_note": "one sentence on student health insurance and campus health services",
      "items": [{"name":"","url":"","type":"e.g. Campus Sports Medicine, Athletic Trainer, Physiotherapist, Sports Psychologist","location":"","description":"","specialties":[],"languages":[],"tip":""}]
    },
    "safety": {
      "title": "Safety & Campus Security",
      "intro": "one sentence",
      "items": [{"category":"","title":"","description":"","tips":[],"url":""}]
    },
    "transportation": {
      "title": "Getting Around",
      "intro": "one sentence",
      "items": [{"option":"","description":"","price_range":"","tips":[]}],
      "public_transport_note": "one sentence"
    },
    "practical": {
      "title": "Practical Information",
      "intro": "${r.is_international ? `one sentence about arriving as an F-1 student and what to do first` : `one sentence about settling into a new US city as a student`}",
      "items": [{"category":"","title":"","description":"","tips":[],"url":""}]
    },
    "integration": {
      "title": "Integration & Student Community",
      "intro": "one sentence",
      "language_tip": "one sentence",
      "expat_community": "${r.is_international ? `one sentence on international student-athlete community at ${r.university || r.destination_city} and how to connect` : `one sentence on student athlete community and how to connect with teammates at ${r.university || r.destination_city}`}",
      "items": [{"name":"","url":"","type":"","description":"","tip":""}]
    },
    "religious_cultural": ${r.religious_needs ? `{
      "title": "Religious & Cultural",
      "intro": "one sentence",
      "items": [{"name":"","url":"","type":"","location":"","description":"","tip":""}]
    }` : "null"},
    "local_life": {
      "title": "Local Life & Student Tips",
      "intro": "one sentence",
      "apps": [{"name":"","purpose":"","note":""}],
      "tips": [{"category":"","tip":""}]
    },
    "day_trips": {
      "title": "Day Trips & Weekend Getaways",
      "intro": "one sentence",
      "items": [{"name":"","description":"","distance_km":"","travel_time":"","best_for":"","highlights":[]}]
    },
    "emergency_contacts": {
      "title": "Emergency Contacts",
      "intro": "one sentence",
      "items": [{"category":"","name":"","number":"","note":""}]
    }
  }
}`;
}

async function callModel(model, maxTokens, prompt) {
  const response = await client.messages.create({
    model,
    max_tokens: maxTokens,
    messages: [{ role: "user", content: prompt }],
  });

  const text = response.content.find((b) => b.type === "text")?.text;
  if (!text) throw new Error("No text in response");

  const cleaned = text.replace(/^```json\n?/, "").replace(/\n?```$/, "").trim();
  return JSON.parse(cleaned);
}

export async function generateRelocationDocument(request) {
  const prompt = request.athlete_type === "college" ? buildCollegePrompt(request) : buildPrompt(request);

  try {
    console.log("[generate] trying Haiku...");
    return await callModel("claude-haiku-4-5-20251001", 8192, prompt);
  } catch (err) {
    console.warn("[generate] Haiku failed, falling back to Sonnet:", err.message);
    return await callModel("claude-sonnet-4-6", 16000, prompt);
  }
}
