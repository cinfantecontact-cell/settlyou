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
RELOCATION EXPERIENCE: ${r.previous_relocation || "not specified"}
CLIMATE USED TO: ${r.climate_preference || "not specified"}
TRAINING SCHEDULE: ${r.training_schedule || "not specified"}
COOKING HABITS: ${r.cooking_habits || "not specified"}
${r.biggest_concerns ? `BIGGEST CONCERNS: ${r.biggest_concerns}` : ""}
${r.additional_notes ? `ATHLETE NOTES: ${r.additional_notes}` : ""}
${r.club_custom_notes ? `CLUB NOTES (include this information in the guide): ${r.club_custom_notes}` : ""}

Rules:
- Use real, specific places in ${r.destination_city} — no generic advice. Be detailed and thorough.
- URLs: For every "url" field, use a Google Maps search link: https://www.google.com/maps/search/PLACE+NAME+${encodeURIComponent(r.destination_city)} — this guarantees working links. Do NOT invent website URLs.
- If the athlete has BIGGEST CONCERNS, directly address each concern in the welcome letter and relevant sections. Make them feel heard.
- If this is their FIRST TIME ABROAD, include extra practical detail (banking, phone plans, tipping culture, social norms). If experienced, keep practical info concise.
- Use CLIMATE USED TO to add clothing/weather adjustment tips in practical info.
- Use COOKING HABITS to tailor dining and grocery recommendations (meal preppers need bulk stores, eat-out types need more restaurant recs).
- Use TRAINING SCHEDULE to optimize neighborhood and commute recommendations around their training time.
- 4-5 items per section minimum — be generous with recommendations
- Descriptions should be 3-4 sentences, rich with specific detail — street names, what to expect, insider tips
- Prices must be real estimates for ${r.destination_city} in 2026
- Tone: warm, personal, and performance-focused — like advice from a trusted teammate who already lives there
- ATHLETE LENS: Always think about how each recommendation impacts training, recovery, and performance. A neighborhood recommendation should mention commute to training ground and proximity to recovery facilities. A restaurant recommendation should note whether it's good for pre/post-training nutrition. A fitness recommendation should be athlete-grade, not a commercial gym.
- PERFORMANCE FIRST: This is not a generic relocation guide. It is a high-performance athlete relocation guide. Every section should feel like it was written by someone who understands elite sport.
- DEPTH: Go deep. Include opening hours, specific addresses, what to ask for, who to talk to. The athlete should feel like they have a local friend guiding them.
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

function buildCollegeAthletePrompt(request) {
  const r = request;

  return `You are Settl's athletic performance relocation analyst. Your job is to help college student-athletes not just survive their new city — but thrive academically, athletically, and personally. Every recommendation must consider their dual role as a student AND a high-performance athlete. Return ONLY valid JSON — no markdown, no explanation.

CRITICAL LANGUAGE RULE: You MUST write the ENTIRE document in ${r.report_language || "English"}. Every single word — section titles, descriptions, tips, recommendations, labels, notes, welcome letter, everything — must be in ${r.report_language || "English"}. Do NOT use English if the language is not English. This is mandatory.

ATHLETE: ${r.athlete_name}, ${r.athlete_nationality}, age ${r.athlete_age || "N/A"}
STUDENT TYPE: ${r.is_international ? "International student (F-1 visa)" : "Domestic US student (relocating within the US)"}
SPORT: ${r.sport || "N/A"}
UNIVERSITY: ${r.university || "N/A"} | CAMPUS CITY: ${r.destination_city}, ${r.destination_country}
CURRENTLY IN: ${r.current_city ? `${r.current_city}, ${r.current_country}` : "N/A"}
LANGUAGES: ${r.athlete_languages?.join(", ") || "N/A"}
MAJOR: ${r.major || "N/A"} | STUDENT LEVEL: ${r.student_level || "N/A"} | SCHOLARSHIP: ${r.has_scholarship ? "Yes" : "No"} | SEMESTER START: ${r.semester_start || "N/A"}
HOUSING: ${r.on_campus_housing ? "On-campus housing" : `Off-campus, ${r.housing_type || "apartment"}, ${r.min_bedrooms || "1"} bedroom(s), budget $${r.budget_usd?.toLocaleString() || "N/A"}/mo`}
DIET: ${r.diet?.join(", ") || "none"} | RELIGION: ${r.religious_needs || "none"} | FITNESS: ${r.fitness?.join(", ") || "N/A"}
HOBBIES: ${r.hobbies?.join(", ") || "N/A"}
STUDY STYLE: ${r.study_style || "not specified"} | WORK PLANS: ${r.work_plans || "not specified"}
SOCIAL GOALS: ${r.social_goals?.join(", ") || "not specified"}
AGE: ${r.athlete_age || "N/A"}${r.athlete_age ? (parseInt(r.athlete_age) >= 21 ? " — 21 or over, nightlife recommendations appropriate" : " — under 21, do not recommend alcohol-focused venues") : ""}
FAMILY: ${r.family_size > 1 ? `${r.family_size} people moving` : "Moving alone"}
TRAINING SCHEDULE: ${r.training_schedule || "not specified"}
${r.division ? `ATHLETIC DIVISION: ${r.division}` : ""}
${r.additional_notes ? `ATHLETE NOTES: ${r.additional_notes}` : ""}
${r.club_custom_notes ? `INSTITUTION NOTES (include this information in the guide): ${r.club_custom_notes}` : ""}

Rules:
- Use real, specific places near ${r.university || r.destination_city} — no generic advice. Be detailed and thorough.
- URLs: For every "url" field, use a Google Maps search link: https://www.google.com/maps/search/PLACE+NAME+${encodeURIComponent(r.destination_city)} — this guarantees working links. Do NOT invent website URLs.
- 4-5 items per section minimum — be generous with recommendations
- Descriptions should be 3-4 sentences, rich with specific detail — street names, what to expect, insider tips
- Prices must be real estimates for ${r.destination_city} in 2026
- Tone: warm and encouraging — this may be their first time far from home. Like advice from a senior teammate who's been there.
- ATHLETE LENS: This is a student-ATHLETE. Balance student life advice with high-performance athletic needs. Recovery, nutrition, and physical wellbeing are as important as academics.
- PERFORMANCE FIRST: Always think about how recommendations affect training load, recovery, sleep, and performance. A dining recommendation should note performance nutrition value. Healthcare must include sports medicine.
- Use TRAINING SCHEDULE to avoid recommending activities that conflict with practice times. If INSTITUTION NOTES mention team schedules, honor those constraints in every time-based recommendation.
- Use STUDY STYLE to recommend appropriate study spots (library lovers need quiet spaces, coffee shop types need good cafes near campus).
- Use WORK PLANS to understand time constraints — a student with a part-time job has less free time for activities.
- Use SOCIAL GOALS to tailor the integration and social life sections — someone wanting to meet people needs different recs than someone focused on studies.
- AGE: If the student is 21 or over, nightlife recommendations are appropriate. If under 21 or age unknown, recommend non-alcohol venues and skip bar recommendations.
- If this is their FIRST TIME ABROAD, include extra practical detail (banking, phone plans, tipping culture, social norms). If experienced, keep practical info concise.
${r.division ? `- ATHLETIC DIVISION is set to "${r.division}". Use this to give precise eligibility guidance: academic GPA minimums, enrollment requirements, transfer rules, amateurism rules, and paperwork timelines specific to ${r.division}. For international athletes, include the exact English test requirements (TOEFL/IELTS minimums) and transcript evaluation services (WES, ECE, NACES-approved) required by ${r.division}. Do NOT generalize — the student is in ${r.division} specifically.` : `- ATHLETIC ASSOCIATION: Do NOT assume the university is NCAA. Many universities are NAIA, NJCAA, or other associations. If you are not 100% certain which association the university belongs to, do NOT mention any specific association (NCAA, NAIA, etc.) by name. Only mention the association if you are certain it is correct. Getting this wrong is a critical error.`}
- ELIGIBILITY: Include practical guidance on athletic eligibility compliance in the eligibility section. For international athletes, mention transcript evaluation services (WES, ECE, NACES-approved) and language test (TOEFL/IELTS) requirements for athletic eligibility, plus the timeline to submit documents before the semester starts.
- DEPTH: Go deep. Include opening hours, specific addresses, what to ask for, who to talk to. The athlete should feel like they have a local friend guiding them.
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
    "eligibility": {
      "title": "Athletic Eligibility & Compliance",
      "intro": "one sentence overview of what student-athletes need to know about eligibility at ${r.university || "this university"}",
      "key_requirements": [{"title":"","description":""}],
      "international_notes": ${r.is_international ? `"guidance on transcript evaluation services (WES, ECE, NACES-approved), language test requirements (TOEFL/IELTS) for athletic eligibility, and timeline to submit documents before the semester starts"` : "null"},
      "resources": [{"name":"","url":"https://www.google.com/maps/search/","description":""}]
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
    "guest_accommodation": {
      "title": "For Visiting Family & Guests",
      "intro": "one sentence — parents and family visiting for games and events",
      "neighborhoods_tip": "one sentence on best areas near campus for guests to stay",
      "hotels": [{"name":"","url":"","stars":0,"location":"","description":"","price_range":"","why_recommended":""}]
    },
    "emergency_contacts": {
      "title": "Emergency Contacts",
      "intro": "one sentence",
      "items": [{"category":"","name":"","number":"","note":""}]
    }
  }
}`;
}

function buildGeneralStudentPrompt(request) {
  const r = request;

  return `You are Settl's student relocation guide. Your job is to help students arriving from another city or country settle into their new university city quickly and comfortably. Return ONLY valid JSON — no markdown, no explanation.

CRITICAL LANGUAGE RULE: You MUST write the ENTIRE document in ${r.report_language || "English"}. Every single word — section titles, descriptions, tips, recommendations, labels, notes, welcome letter, everything — must be in ${r.report_language || "English"}. Do NOT use English if the language is not English. This is mandatory.

STUDENT: ${r.athlete_name}, ${r.athlete_nationality}, age ${r.athlete_age || "N/A"}
STUDENT TYPE: ${r.is_international ? "International student (F-1 visa)" : "Domestic US student (relocating within the US)"}
UNIVERSITY: ${r.university || "N/A"} | CAMPUS CITY: ${r.destination_city}, ${r.destination_country}
CURRENTLY IN: ${r.current_city ? `${r.current_city}, ${r.current_country}` : "N/A"}
LANGUAGES: ${r.athlete_languages?.join(", ") || "N/A"}
MAJOR: ${r.major || "N/A"} | STUDENT LEVEL: ${r.student_level || "N/A"} | SEMESTER START: ${r.semester_start || "N/A"}
HOUSING: ${r.on_campus_housing ? "On-campus housing" : `Off-campus, ${r.housing_type || "apartment"}, ${r.min_bedrooms || "1"} bedroom(s), budget $${r.budget_usd?.toLocaleString() || "N/A"}/mo`}
DIET: ${r.diet?.join(", ") || "none"} | RELIGION: ${r.religious_needs || "none"} | FITNESS: ${r.fitness?.join(", ") || "N/A"}
HOBBIES: ${r.hobbies?.join(", ") || "N/A"}
STUDY STYLE: ${r.study_style || "not specified"} | WORK PLANS: ${r.work_plans || "not specified"}
SOCIAL GOALS: ${r.social_goals?.join(", ") || "not specified"}
AGE: ${r.athlete_age || "N/A"}${r.athlete_age ? (parseInt(r.athlete_age) >= 21 ? " — 21 or over, nightlife recommendations appropriate" : " — under 21, do not recommend alcohol-focused venues") : ""}
FAMILY: ${r.family_size > 1 ? `${r.family_size} people moving` : "Moving alone"}
CAR: ${r.needs_car ? `${r.num_cars}x ${r.car_type}, ${r.car_buy_or_rent}, license from ${r.license_country || "N/A"}` : "Not needed"}
HEALTHCARE: ${r.needs_private_healthcare ? "Private preferred" : "Standard"} | Specialists: ${r.medical_specialists || "none"}
${r.division ? `INSTITUTION DIVISION: ${r.division}` : ""}
${r.additional_notes ? `STUDENT NOTES: ${r.additional_notes}` : ""}
${r.club_custom_notes ? `INSTITUTION NOTES (include this information in the guide): ${r.club_custom_notes}` : ""}

Rules:
- Use real, specific places near ${r.university || r.destination_city} — no generic advice. Be detailed and thorough.
- URLs: For every "url" field, use a Google Maps search link: https://www.google.com/maps/search/PLACE+NAME+${encodeURIComponent(r.destination_city)} — this guarantees working links. Do NOT invent website URLs.
- 4-5 items per section minimum — be generous with recommendations
- Descriptions should be 3-4 sentences, rich with specific detail — street names, what to expect, insider tips
- Prices must be real estimates for ${r.destination_city} in 2026
- Tone: warm, practical, and encouraging — like advice from a senior student who's already been through it
- STUDENT FOCUS: This is a guide for a general student, NOT an athlete. Do not frame recommendations through an athletic or performance lens. Focus on practical settling-in, academic life, social integration, and everyday wellbeing.
- Use STUDY STYLE to recommend appropriate study spots — library lovers need quiet spaces and good study cafes, coffee shop types need great cafe recommendations near campus.
- Use WORK PLANS to understand time constraints — a student with a part-time job has less free time for activities and needs efficient recommendations.
- Use SOCIAL GOALS to tailor social life and integration sections. Someone who wants to meet people needs very different recommendations than someone focused on staying disciplined. If goals include "Meeting people romantically", include places and activities where singles naturally meet.
- AGE: If the student is 21 or over, nightlife recommendations (bars, late-night spots) are appropriate. If under 21 or age unknown, recommend only non-alcohol venues and skip bar recommendations entirely.
- If INSTITUTION NOTES mention schedules, events, or campus-specific info — incorporate that into relevant sections naturally.
- BANKING IS CRITICAL: Opening a bank account is one of the biggest hurdles for any new student, especially internationals. Give specific, actionable guidance — which banks, what documents to bring, how long it takes, student-friendly accounts with no minimums.
${r.division ? `- INSTITUTION DIVISION is "${r.division}". If relevant (e.g. if this student is part of an athletic program), use this to inform any eligibility or compliance references in the guide.` : ""}
- DEPTH: Go deep. Include opening hours, specific addresses, what to ask for. The student should feel like they have a local friend guiding them.
${r.is_international ? `- This is an international student on an F-1 visa — the international section MUST cover F-1 requirements, SEVIS check-ins, OPT/CPT overview, SSN application process, and transcript/credential evaluation services (WES, ECE, NACES-approved)` : `- This is a domestic US student relocating within the US — practical info should cover state ID/driver's license transfer, setting up utilities, and settling into a new city`}
${r.on_campus_housing ? `- IMPORTANT: This student lives ON CAMPUS. The "neighborhoods" section MUST be null. Do NOT recommend apartments or off-campus neighborhoods.` : ""}
${r.additional_notes ? `- IMPORTANT: The student wrote this personal note — you MUST incorporate it: "${r.additional_notes}"` : ""}
${r.club_custom_notes ? `- IMPORTANT: The institution added these notes — you MUST include this information somewhere in the guide: "${r.club_custom_notes}"` : ""}

{
  "meta": {
    "athlete_name": "${r.athlete_name}",
    "destination": "${r.destination_city}, ${r.destination_country}",
    "club": "${r.university || ""}",
    "club_logo_url": "official university logo URL (.png/.jpg/.svg)",
    "club_primary_color": "hex color e.g. #1A1A2E",
    "club_website": "official university website URL",
    "generated_summary": "2-3 sentence intro to ${r.destination_city} and ${r.university || "the university"} for this incoming student",
    "welcome_letter": "3-4 sentence personal welcome letter to ${r.athlete_name} starting at ${r.university || "the university"} — acknowledge the excitement of moving to a new city, the challenge of starting fresh, and express confidence in their ability to thrive"
  },
  "sections": {
    ${r.on_campus_housing ? `"neighborhoods": null,
    "housing": {
      "title": "On-Campus Housing",
      "intro": "one sentence about the residence halls at ${r.university || "the university"}",
      "tips": ["tip about settling in on campus","tip about what to bring","tip about campus resources"],
      "search_platforms": [],
      "items": [{"type":"Residence Hall","area":"On Campus","description":"describe on-campus housing options and what to expect","price_range":"included or typical dorm cost","bedrooms":"shared or single","highlights":[],"ideal_for":""}]
    },` : `"neighborhoods": {
      "title": "Neighborhoods Near Campus",
      "intro": "one sentence — mention proximity to campus and student-friendly character",
      "items": [{"name":"","fit_score":85,"fit_reason":"","description":"","character":"","avg_rent_range":"","commute_to_campus":"commute time to campus","pros":[],"cons":[],"best_for":""}]
    },
    "housing": {
      "title": "Off-Campus Housing",
      "intro": "one sentence",
      "tips": ["","",""],
      "search_platforms": [{"name":"","url":"","note":""}],
      "items": [{"type":"","area":"","description":"","price_range":"","bedrooms":"","highlights":[],"ideal_for":""}]
    },`}
    "banking": {
      "title": "Banking & Finances",
      "intro": "one sentence on setting up your finances in ${r.destination_city} as a new student",
      "tips": ["specific tip on opening a bank account as a student","tip on documents needed","tip on student account benefits"],
      "items": [{"name":"","url":"","type":"e.g. National bank, Credit union, Digital bank","location":"","description":"","student_note":"why this works for students — fees, minimums, ease of opening","highlights":[]}],
      "digital_options": [{"name":"","url":"","type":"e.g. Wise, Revolut, Zelle, Venmo","description":"","best_for":""}]${r.is_international ? `,
      "international_note": "specific guidance on banking as an international student — ITIN, what to bring, how long it takes, alternatives while waiting for SSN"` : ""}
    },
    "dining": {
      "title": "Food & Groceries",
      "intro": "one sentence on the food scene and grocery options in ${r.destination_city} for students",
      "budget_tip": "one sentence on eating well on a student budget in ${r.destination_city}",
      "diet_note": "specific note for ${r.diet?.join(", ") || "this student's"} diet near ${r.destination_city}",
      "supermarkets": [{"name":"","url":"","type":"","location":"","note":""}],
      "restaurants": [{"name":"","url":"","cuisine":"","location":"","why_recommended":"","price_range":"","must_try":""}]
    },
    "transportation": {
      "title": "${r.needs_car ? "Transportation & Getting Around" : "Getting Around"}",
      "intro": "one sentence",
      ${r.needs_car ? `"license_info": "info about using ${r.license_country || "foreign"} license in ${r.destination_country}",` : ""}
      "items": [{"option":"","description":"","price_range":"","tips":[]}],
      "public_transport_note": "one sentence on public transit options for students in ${r.destination_city}"
    },
    "healthcare": {
      "title": "Health & Wellness",
      "intro": "one sentence on healthcare options for students in ${r.destination_city}",
      "insurance_note": "one sentence on student health insurance — campus plan vs. marketplace options",
      "items": [{"name":"","url":"","type":"e.g. Campus health center, Local clinic, Urgent care, Mental health","location":"","description":"","specialties":[],"tip":""}]
    },
    "social_life": {
      "title": "Social Life & Activities",
      "intro": "one sentence on the social scene for students in ${r.destination_city}",
      "items": [{"name":"","url":"","type":"e.g. Student organization, Venue, Park, Event series, Volunteer opportunity","location":"","description":"","best_for":"","highlights":[]}]
    },
    "practical": {
      "title": "Practical Information",
      "intro": "${r.is_international ? "one sentence about the first things to do when arriving as a new international student" : "one sentence about settling into a new US city as a student"}",
      "items": [{"category":"","title":"","description":"","tips":[],"url":""}]
    },
    ${r.is_international ? `"international": {
      "title": "International Student Resources",
      "intro": "one sentence on support available for international students at ${r.university || "the university"}",
      "visa_tips": [{"title":"","description":""}],
      "language_resources": [{"name":"","url":"","type":"e.g. TOEFL prep, Duolingo Plus, Campus language tutoring, Language exchange meetup","description":"","price_range":"","note":""}],
      "transcript_evaluation": [{"name":"","url":"","description":"","timeline":"","cost":"","note":"what it is used for and when to submit"}],
      "cultural_tips": [""]
    },` : `"international": null,`}
    "religious_cultural": ${r.religious_needs ? `{
      "title": "Religious & Cultural",
      "intro": "one sentence",
      "items": [{"name":"","url":"","type":"","location":"","description":"","tip":""}]
    }` : "null"},
    "schools": ${r.needs_school ? `{
      "title": "Schools",
      "intro": "one sentence",
      "items": [{"name":"","url":"","type":"","curriculum":"","age_range":"","language_of_instruction":"","description":"","location":"","fee_range":"","highlights":[],"application_tip":""}]
    }` : "null"},
    "emergency_contacts": {
      "title": "Emergency Contacts",
      "intro": "one sentence",
      "items": [{"category":"","name":"","number":"","note":""}]
    }
  }
}`;
}

async function callModel(model, maxTokens, prompt) {
  const stream = await client.messages.stream({
    model,
    max_tokens: maxTokens,
    messages: [{ role: "user", content: prompt }],
  });

  const response = await stream.finalMessage();

  const text = response.content.find((b) => b.type === "text")?.text;
  if (!text) throw new Error("No text in response");

  const cleaned = text.replace(/^```json\n?/, "").replace(/\n?```$/, "").trim();

  try {
    return JSON.parse(cleaned);
  } catch (parseErr) {
    console.error("[generate] JSON parse failed. Stop reason:", response.stop_reason, "Raw length:", text.length);
    console.error("[generate] Last 500 chars:", text.slice(-500));
    throw new Error(`JSON parse error (stop_reason: ${response.stop_reason}): ${parseErr.message}`);
  }
}

const MODELS = [
  "claude-sonnet-4-6",
  "claude-sonnet-4-5-20241022",
  "claude-haiku-4-5-20251001",
];

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function callWithFallback(maxTokens, prompt) {
  for (const model of MODELS) {
    try {
      console.log(`[generate] trying ${model}...`);
      return await callModel(model, maxTokens, prompt);
    } catch (err) {
      console.warn(`[generate] ${model} failed: ${err.message}`);
      if (err.status === 529) {
        console.log("[generate] overloaded, trying next model...");
        await sleep(2000);
        continue;
      }
      try {
        console.log(`[generate] retrying ${model}...`);
        await sleep(1000);
        return await callModel(model, maxTokens, prompt);
      } catch (retryErr) {
        console.warn(`[generate] ${model} retry failed: ${retryErr.message}`);
        continue;
      }
    }
  }
  throw new Error("All models failed — API may be overloaded. Try again later.");
}

// ─── Base Data Prompts (generated once per club) ───

function buildProBaseDataPrompt(club) {
  const c = club;
  const city = c.city || "the city";
  const country = c.country || "";
  const clubName = c.name || "";
  const address = c.address || "";
  const encodedCity = encodeURIComponent(city);

  return `You are Settl's city research specialist. Your job is to compile comprehensive, real data about ${city}, ${country} for professional athletes relocating there. This data will be reused across multiple athletes, so do NOT include any athlete-specific personalization. Return ONLY valid JSON — no markdown, no explanation.

CITY: ${city}, ${country}
CLUB: ${clubName}
TRAINING GROUND: ${address || "N/A"}
${c.custom_notes ? `INSTITUTION NOTES: ${c.custom_notes}` : ""}

Rules:
- Use real, specific places in ${city} — no generic advice. Be detailed and thorough.
- URLs: For every "url" field, use a Google Maps search link: https://www.google.com/maps/search/PLACE+NAME+${encodedCity} — this guarantees working links. Do NOT invent website URLs.
- 5-6 items per section — be generous with recommendations
- Descriptions should be 3-4 sentences, rich with specific detail — street names, what to expect, insider tips
- Prices must be real estimates for ${city} in 2026
- Tone: warm and informative — like a trusted local sharing insider knowledge
- DEPTH: Go deep. Include opening hours, specific addresses, what to ask for. The reader should feel like they have a local friend guiding them.
- Do NOT include personalized fields like fit_score, fit_reason, athlete_note, diet_note, or welcome letters. This is city reference data only.

{
  "city": "${city}",
  "country": "${country}",
  "club": "${clubName}",
  "sections": {
    "neighborhoods": {
      "title": "Neighborhoods",
      "intro": "one sentence overview of the residential landscape in ${city}",
      "items": [{"name":"","description":"detailed description of the neighborhood character, streets, vibe","character":"","avg_rent_range":"","commute_to_training":"commute to ${address || clubName || "city center"}","pros":[],"cons":[],"best_for":""}]
    },
    "housing": {
      "title": "Housing Options",
      "intro": "one sentence on the housing market in ${city}",
      "tips": ["","",""],
      "search_platforms": [{"name":"","url":"","note":""}],
      "items": [{"type":"","area":"","description":"","price_range":"","bedrooms":"","highlights":[],"ideal_for":""}]
    },
    "performance_recovery": {
      "title": "Performance & Recovery",
      "intro": "one sentence on recovery culture and sports infrastructure in ${city}",
      "recovery_centers": [{"name":"","url":"","type":"e.g. Cryotherapy, Float Tank, Sports Massage, Physiotherapy","location":"","description":"","price_range":""}],
      "sports_nutrition": [{"name":"","url":"","type":"e.g. Performance dietitian, Meal prep service, Supplement store","location":"","description":"","price_range":""}],
      "mental_performance": "one sentence on mental health or sports psychology resources in ${city}"
    },
    "fitness": {
      "title": "Training & Fitness Facilities",
      "intro": "one sentence on athlete-grade fitness facilities in ${city}",
      "items": [{"name":"","url":"","type":"","location":"","description":"","price_range":"","highlights":[]}]
    },
    "healthcare": {
      "title": "Sports Medicine & Healthcare",
      "intro": "one sentence on sports medicine and healthcare in ${city}",
      "insurance_note": "one sentence on health insurance for foreigners in ${country}",
      "items": [{"name":"","url":"","type":"e.g. Sports Medicine Clinic, Orthopedic Specialist, Physiotherapist, General Practitioner","location":"","description":"","specialties":[],"languages":[],"tip":""}]
    },
    "dining": {
      "title": "Nutrition & Dining",
      "intro": "one sentence on the food scene in ${city}",
      "supermarkets": [{"name":"","url":"","type":"","location":"","note":""}],
      "restaurants": [{"name":"","url":"","cuisine":"","location":"","why_recommended":"","price_range":"","must_try":""}]
    },
    "transportation": {
      "title": "Getting Around",
      "intro": "one sentence",
      "items": [{"option":"","description":"","price_range":"","tips":[]}],
      "public_transport_note": "one sentence"
    },
    "integration": {
      "title": "Integration & Community",
      "intro": "one sentence",
      "language_tip": "one sentence",
      "expat_community": "one sentence on the expat/athlete community in ${city}",
      "items": [{"name":"","url":"","type":"","description":"","tip":""}]
    },
    "practical": {
      "title": "Practical Information",
      "intro": "one sentence",
      "items": [{"category":"","title":"","description":"","tips":[],"url":""}]
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

function buildCollegeBaseDataPrompt(club) {
  const c = club;
  const city = c.city || "the city";
  const country = c.country || "";
  const uniName = c.name || "";
  const address = c.address || "";
  const encodedCity = encodeURIComponent(city);

  return `You are Settl's campus city research specialist. Your job is to compile comprehensive, real data about ${city}, ${country} and ${uniName} for students relocating there. This data will be reused across multiple students, so do NOT include any student-specific personalization. Return ONLY valid JSON — no markdown, no explanation.

CITY: ${city}, ${country}
UNIVERSITY: ${uniName}
CAMPUS ADDRESS: ${address || "N/A"}
${c.division ? `ATHLETIC DIVISION: ${c.division}` : ""}
${c.custom_notes ? `INSTITUTION NOTES: ${c.custom_notes}` : ""}

Rules:
- Use real, specific places near ${uniName || city} — no generic advice. Be detailed and thorough.
- URLs: For every "url" field, use a Google Maps search link: https://www.google.com/maps/search/PLACE+NAME+${encodedCity} — this guarantees working links. Do NOT invent website URLs.
- 5-6 items per section — be generous with recommendations
- Descriptions should be 3-4 sentences, rich with specific detail — street names, what to expect, insider tips
- Prices must be real estimates for ${city} in 2026
- Tone: warm and informative — like a trusted local sharing insider knowledge about the campus area
- DEPTH: Go deep. Include opening hours, specific addresses, what to ask for.
- Do NOT include personalized fields like fit_score, fit_reason, athlete_note, diet_note, or welcome letters. This is city/campus reference data only.

{
  "city": "${city}",
  "country": "${country}",
  "university": "${uniName}",
  "sections": {
    "neighborhoods": {
      "title": "Neighborhoods Near Campus",
      "intro": "one sentence overview of neighborhoods around ${uniName || city}",
      "items": [{"name":"","description":"detailed description of the neighborhood","character":"","avg_rent_range":"","commute_to_campus":"commute to ${uniName || "campus"}","pros":[],"cons":[],"best_for":""}]
    },
    "housing": {
      "title": "Housing Options",
      "intro": "one sentence on housing near ${uniName || city}",
      "tips": ["","",""],
      "search_platforms": [{"name":"","url":"","note":""}],
      "items": [{"type":"","area":"","description":"","price_range":"","bedrooms":"","highlights":[],"ideal_for":""}]
    },
    "campus_life": {
      "title": "Campus Life",
      "intro": "one sentence on campus culture at ${uniName}",
      "items": [{"name":"","url":"","type":"","location":"","description":"","highlights":[]}]
    },
    "performance_recovery": {
      "title": "Performance & Recovery",
      "intro": "one sentence on recovery resources near ${uniName || city}",
      "recovery_centers": [{"name":"","url":"","type":"e.g. Athletic Training Room, Cryotherapy, Sports Massage, Physiotherapy","location":"","description":"","price_range":""}],
      "sports_nutrition": [{"name":"","url":"","type":"e.g. Campus dietitian, Performance meal plan, Supplement store","location":"","description":"","price_range":""}],
      "mental_performance": "one sentence on mental health and sports psychology resources at ${uniName || city}"
    },
    "fitness": {
      "title": "Training & Fitness Facilities",
      "intro": "one sentence on fitness facilities near ${uniName || city}",
      "items": [{"name":"","url":"","type":"","location":"","description":"","price_range":"","highlights":[]}]
    },
    "dining": {
      "title": "Food & Dining",
      "intro": "one sentence on the food scene near ${uniName || city}",
      "supermarkets": [{"name":"","url":"","type":"","location":"","note":""}],
      "restaurants": [{"name":"","url":"","cuisine":"","location":"","why_recommended":"","price_range":"","must_try":""}]
    },
    "healthcare": {
      "title": "Healthcare",
      "intro": "one sentence on healthcare near ${uniName || city}",
      "insurance_note": "one sentence on student health insurance options",
      "items": [{"name":"","url":"","type":"e.g. Campus Health Center, Sports Medicine, Urgent Care, Mental Health","location":"","description":"","specialties":[],"languages":[],"tip":""}]
    },
    "banking": {
      "title": "Banking & Finances",
      "intro": "one sentence on banking options for students in ${city}",
      "tips": ["tip on opening a bank account","tip on documents needed","tip on student benefits"],
      "items": [{"name":"","url":"","type":"e.g. National bank, Credit union, Digital bank","location":"","description":"","student_note":"","highlights":[]}],
      "digital_options": [{"name":"","url":"","type":"e.g. Wise, Revolut, Zelle, Venmo","description":"","best_for":""}]
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
      "public_transport_note": "one sentence on public transit for students in ${city}"
    },
    "integration": {
      "title": "Integration & Community",
      "intro": "one sentence",
      "language_tip": "one sentence",
      "expat_community": "one sentence on the international/student community in ${city}",
      "items": [{"name":"","url":"","type":"","description":"","tip":""}]
    },
    "practical": {
      "title": "Practical Information",
      "intro": "one sentence on settling into ${city}",
      "items": [{"category":"","title":"","description":"","tips":[],"url":""}]
    },
    "guest_accommodation": {
      "title": "For Visiting Family & Guests",
      "intro": "one sentence",
      "neighborhoods_tip": "one sentence on best areas near campus for guests",
      "hotels": [{"name":"","url":"","stars":0,"location":"","description":"","price_range":"","why_recommended":""}]
    },
    "day_trips": {
      "title": "Day Trips & Weekend Getaways",
      "intro": "one sentence",
      "items": [{"name":"","description":"","distance_km":"","travel_time":"","best_for":"","highlights":[]}]
    },
    "local_life": {
      "title": "Local Life & Student Tips",
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

// ─── Personalization Prompts (use base data as context) ───

function buildProPersonalizationPrompt(request, baseData) {
  const r = request;
  const baseJSON = JSON.stringify(baseData, null, 2);

  return `You are Settl's athletic performance relocation analyst. You have pre-researched city data for ${r.destination_city}. Your job is to create a personalized, high-performance relocation guide for this specific athlete using the city data as your foundation. Return ONLY valid JSON — no markdown, no explanation.

CRITICAL LANGUAGE RULE: You MUST write the ENTIRE document in ${r.report_language || "English"}. Every single word must be in ${r.report_language || "English"}. This is mandatory.

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
RELOCATION EXPERIENCE: ${r.previous_relocation || "not specified"}
CLIMATE USED TO: ${r.climate_preference || "not specified"}
TRAINING SCHEDULE: ${r.training_schedule || "not specified"}
COOKING HABITS: ${r.cooking_habits || "not specified"}
${r.biggest_concerns ? `BIGGEST CONCERNS: ${r.biggest_concerns}` : ""}
${r.additional_notes ? `ATHLETE NOTES: ${r.additional_notes}` : ""}
${r.club_custom_notes ? `CLUB NOTES (include this information in the guide): ${r.club_custom_notes}` : ""}

PRE-RESEARCHED CITY DATA (use these real places as your foundation):
${baseJSON}

Rules:
- USE THE CITY DATA ABOVE as your foundation. These are real, verified places. Build on them — do not ignore them.
- You may add additional places beyond the base list if uniquely relevant to this athlete.
- For each neighborhood, add a fit_score (0-100) and fit_reason personalized to this athlete's needs (budget, commute, family size).
- For each restaurant, add an athlete_note explaining why it works for their diet and performance.
- For recovery centers, fitness facilities, add athlete_note specific to their sport.
- For dining, add performance_tip and diet_note specific to their diet.
- Generate from scratch: meta (welcome_letter, generated_summary), schools (if needed), religious_cultural (if needed), nightlife (if applicable), family_life sections.
- URLs: Keep Google Maps search links from the base data. For new places use: https://www.google.com/maps/search/PLACE+NAME+${encodeURIComponent(r.destination_city)}
- If the athlete has BIGGEST CONCERNS, address each in the welcome letter and relevant sections.
- ATHLETE LENS: Every recommendation must consider impact on training, recovery, and performance.
- Tone: warm, personal, and performance-focused — like advice from a trusted teammate.
${r.additional_notes ? `- IMPORTANT: The athlete wrote this personal note — you MUST incorporate it: "${r.additional_notes}"` : ""}
${r.club_custom_notes ? `- IMPORTANT: The club added these notes — you MUST include this information: "${r.club_custom_notes}"` : ""}

Return the COMPLETE final document in this exact JSON structure:
{
  "meta": {
    "athlete_name": "${r.athlete_name}",
    "destination": "${r.destination_city}, ${r.destination_country}",
    "club": "${r.club_joining || ""}",
    "club_logo_url": "official club crest URL",
    "club_primary_color": "hex color",
    "club_website": "official club website URL",
    "generated_summary": "2-3 sentence personalized intro",
    "welcome_letter": "3-4 sentence personal welcome letter to ${r.athlete_name}"
  },
  "sections": {
    "neighborhoods": { "title":"Recommended Neighborhoods", "intro":"", "items": [{"name":"","fit_score":90,"fit_reason":"personalized reason","description":"","character":"","avg_rent_range":"","commute_to_training":"","pros":[],"cons":[],"best_for":""}] },
    "housing": { "title":"Housing Options", "intro":"", "tips":[], "search_platforms":[], "items":[] },
    "performance_recovery": { "title":"Performance & Recovery", "intro":"", "recovery_centers":[{"name":"","url":"","type":"","location":"","description":"","price_range":"","athlete_note":"sport-specific note"}], "sports_nutrition":[{"name":"","url":"","type":"","location":"","description":"","price_range":"","athlete_note":""}], "mental_performance":"" },
    "schools": ${r.needs_school ? '{ "title":"Schools", "intro":"", "items":[] }' : "null"},
    "transportation": { "title":"${r.needs_car ? "Transportation & Cars" : "Getting Around"}", "intro":"", ${r.needs_car ? `"license_info":"",` : ""} "items":[], "public_transport_note":"" },
    "fitness": { "title":"Training & Fitness Facilities", "intro":"", "items":[{"name":"","url":"","type":"","location":"","description":"","price_range":"","athlete_note":"","highlights":[]}] },
    "healthcare": { "title":"Sports Medicine & Healthcare", "intro":"", "insurance_note":"", "items":[] },
    "dining": { "title":"Nutrition & Dining", "intro":"", "performance_tip":"", "diet_note":"specific to ${r.diet?.join(", ") || "this athlete"}", "supermarkets":[], "restaurants":[{"name":"","url":"","cuisine":"","location":"","why_recommended":"","price_range":"","must_try":"","athlete_note":""}] },
    "religious_cultural": ${r.religious_needs ? '{ "title":"Religious & Cultural", "intro":"", "items":[] }' : "null"},
    "nightlife_entertainment": ${r.nightlife_interest && r.nightlife_interest !== "Not important" ? '{ "title":"Nightlife & Entertainment", "intro":"", "items":[] }' : "null"},
    "integration": { "title":"Integration & Community", "intro":"", "language_tip":"", "expat_community":"", "items":[] },
    "practical": { "title":"Practical Information", "intro":"", "items":[] },
    "family_life": { "title":"Family Life & Weekends", "intro":"", "items":[] },
    "guest_accommodation": { "title":"For Visiting Family & Guests", "intro":"", "neighborhoods_tip":"", "hotels":[] },
    "day_trips": { "title":"Day Trips & Weekend Getaways", "intro":"", "items":[] },
    "local_life": { "title":"Local Life & Daily Tips", "intro":"", "apps":[], "tips":[] },
    "emergency_contacts": { "title":"Emergency Contacts", "intro":"", "items":[] }
  }
}`;
}

function buildCollegePersonalizationPrompt(request, baseData) {
  const r = request;
  const isAthlete = r.is_part_of_team;
  const baseJSON = JSON.stringify(baseData, null, 2);

  return `You are Settl's ${isAthlete ? "student-athlete" : "student"} relocation specialist. You have pre-researched city and campus data for ${r.destination_city}. Your job is to create a personalized relocation guide for this specific ${isAthlete ? "student-athlete" : "student"} using the city data as your foundation. Return ONLY valid JSON — no markdown, no explanation.

CRITICAL LANGUAGE RULE: You MUST write the ENTIRE document in ${r.report_language || "English"}. Every single word must be in ${r.report_language || "English"}. This is mandatory.

STUDENT: ${r.athlete_name}, ${r.athlete_nationality}, age ${r.athlete_age || "N/A"}
STUDENT TYPE: ${r.is_international ? "International student (F-1 visa)" : "Domestic US student"}
${isAthlete ? `SPORT: ${r.sport || "N/A"}` : ""}
UNIVERSITY: ${r.university || "N/A"} | CAMPUS CITY: ${r.destination_city}, ${r.destination_country}
CURRENTLY IN: ${r.current_city ? `${r.current_city}, ${r.current_country}` : "N/A"}
LANGUAGES: ${r.athlete_languages?.join(", ") || "N/A"}
MAJOR: ${r.major || "N/A"} | STUDENT LEVEL: ${r.student_level || "N/A"} | ${isAthlete ? `SCHOLARSHIP: ${r.has_scholarship ? "Yes" : "No"} | ` : ""}SEMESTER START: ${r.semester_start || "N/A"}
HOUSING: ${r.on_campus_housing ? "On-campus housing" : `Off-campus, ${r.housing_type || "apartment"}, ${r.min_bedrooms || "1"} bedroom(s), budget $${r.budget_usd?.toLocaleString() || "N/A"}/mo`}
DIET: ${r.diet?.join(", ") || "none"} | RELIGION: ${r.religious_needs || "none"} | FITNESS: ${r.fitness?.join(", ") || "N/A"}
HOBBIES: ${r.hobbies?.join(", ") || "N/A"}
STUDY STYLE: ${r.study_style || "not specified"} | WORK PLANS: ${r.work_plans || "not specified"}
SOCIAL GOALS: ${r.social_goals?.join(", ") || "not specified"}
AGE: ${r.athlete_age || "N/A"}${r.athlete_age ? (parseInt(r.athlete_age) >= 21 ? " — 21+, nightlife appropriate" : " — under 21, no alcohol venues") : ""}
FAMILY: ${r.family_size > 1 ? `${r.family_size} people moving` : "Moving alone"}
${isAthlete ? `TRAINING SCHEDULE: ${r.training_schedule || "not specified"}` : ""}
${r.division ? `ATHLETIC DIVISION: ${r.division}` : ""}
${r.additional_notes ? `STUDENT NOTES: ${r.additional_notes}` : ""}
${r.club_custom_notes ? `INSTITUTION NOTES: ${r.club_custom_notes}` : ""}

PRE-RESEARCHED CITY DATA (use these real places as your foundation):
${baseJSON}

Rules:
- USE THE CITY DATA ABOVE as your foundation. Build on these real, verified places.
- You may add additional places beyond the base list if uniquely relevant to this student.
- For neighborhoods: add fit_score (0-100) and fit_reason based on their budget, commute needs, and lifestyle.
${isAthlete ? `- For restaurants: add athlete_note explaining performance nutrition value. Add diet_note for their specific diet.
- For recovery/fitness: add athlete_note specific to their sport.
- ATHLETE LENS: Balance student life with high-performance athletic needs.` : `- For restaurants: personalize based on their diet and budget.
- STUDENT FOCUS: This is a general student guide, NOT an athlete guide. Focus on practical settling-in and social integration.`}
- Generate from scratch: meta (welcome_letter, generated_summary), ${isAthlete ? "eligibility," : ""} ${r.is_international ? "international resources," : ""} religious_cultural (if needed), housing personalization.
- URLs: Keep Google Maps links from base data. For new places: https://www.google.com/maps/search/PLACE+NAME+${encodeURIComponent(r.destination_city)}
${r.is_international ? `- International student on F-1 visa: include F-1 requirements, SEVIS, OPT/CPT, SSN application, international student office` : `- Domestic student: cover state ID transfer, setting up utilities, out-of-state tuition`}
${r.on_campus_housing ? `- Lives ON CAMPUS: neighborhoods section MUST be null. Housing is about on-campus dorms only.` : ""}
${isAthlete && r.division ? `- ATHLETIC DIVISION is "${r.division}". Give precise eligibility guidance for ${r.division} specifically.` : ""}
${r.additional_notes ? `- IMPORTANT: Student wrote this note — incorporate it: "${r.additional_notes}"` : ""}
${r.club_custom_notes ? `- IMPORTANT: Institution notes — include this: "${r.club_custom_notes}"` : ""}

Return the COMPLETE final document. Use this JSON structure:
{
  "meta": {
    "athlete_name": "${r.athlete_name}",
    "destination": "${r.destination_city}, ${r.destination_country}",
    "club": "${r.university || ""}",
    "club_logo_url": "university logo URL",
    "club_primary_color": "hex color",
    "club_website": "university website URL",
    "generated_summary": "2-3 sentence personalized intro",
    "welcome_letter": "3-4 sentence personal welcome letter to ${r.athlete_name}"
  },
  "sections": {
    ${r.on_campus_housing ? `"neighborhoods": null,
    "housing": { "title":"On-Campus Housing", "intro":"", "tips":[], "search_platforms":[], "items":[] },` : `"neighborhoods": { "title":"Neighborhoods Near Campus", "intro":"", "items":[{"name":"","fit_score":85,"fit_reason":"","description":"","character":"","avg_rent_range":"","commute_to_${isAthlete ? "training" : "campus"}":"","pros":[],"cons":[],"best_for":""}] },
    "housing": { "title":"Off-Campus Housing", "intro":"", "tips":[], "search_platforms":[], "items":[] },`}
    ${isAthlete ? `"campus_life": { "title":"Campus Life & Athletics", "intro":"", "items":[] },
    "eligibility": { "title":"Athletic Eligibility & Compliance", "intro":"", "key_requirements":[{"title":"","description":""}], "international_notes":${r.is_international ? '""' : "null"}, "resources":[] },
    "performance_recovery": { "title":"Performance & Recovery", "intro":"", "recovery_centers":[{"name":"","url":"","type":"","location":"","description":"","price_range":"","athlete_note":""}], "sports_nutrition":[{"name":"","url":"","type":"","location":"","description":"","price_range":"","athlete_note":""}], "mental_performance":"" },
    "fitness": { "title":"Training & Fitness Facilities", "intro":"", "items":[{"name":"","url":"","type":"","location":"","description":"","price_range":"","athlete_note":"","highlights":[]}] },
    "dining": { "title":"Nutrition & Dining", "intro":"", "performance_tip":"", "diet_note":"", "supermarkets":[], "restaurants":[{"name":"","url":"","cuisine":"","location":"","why_recommended":"","price_range":"","must_try":"","athlete_note":""}] },` : `"banking": { "title":"Banking & Finances", "intro":"", "tips":[], "items":[], "digital_options":[]${r.is_international ? ', "international_note":""' : ""} },
    "dining": { "title":"Food & Groceries", "intro":"", "budget_tip":"", "diet_note":"", "supermarkets":[], "restaurants":[] },
    "social_life": { "title":"Social Life & Activities", "intro":"", "items":[] },`}
    "healthcare": { "title":"${isAthlete ? "Sports Medicine & Health" : "Health & Wellness"}", "intro":"", "insurance_note":"", "items":[] },
    "safety": { "title":"Safety & Campus Security", "intro":"", "items":[] },
    "transportation": { "title":"Getting Around", "intro":"", "items":[], "public_transport_note":"" },
    "practical": { "title":"Practical Information", "intro":"", "items":[] },
    ${r.is_international ? `"international": { "title":"International Student Resources", "intro":"", "visa_tips":[], "language_resources":[], "transcript_evaluation":[], "cultural_tips":[] },` : `"international": null,`}
    "integration": { "title":"Integration & ${isAthlete ? "Student" : ""} Community", "intro":"", "language_tip":"", "expat_community":"", "items":[] },
    "religious_cultural": ${r.religious_needs ? '{ "title":"Religious & Cultural", "intro":"", "items":[] }' : "null"},
    "local_life": { "title":"Local Life & ${isAthlete ? "Student" : ""} Tips", "intro":"", "apps":[], "tips":[] },
    "day_trips": { "title":"Day Trips & Weekend Getaways", "intro":"", "items":[] },
    "guest_accommodation": { "title":"For Visiting Family & Guests", "intro":"", "neighborhoods_tip":"", "hotels":[] },
    "emergency_contacts": { "title":"Emergency Contacts", "intro":"", "items":[] }
  }
}`;
}

// ─── Public API ───

export async function generateBaseData(club) {
  const prompt = club.type === "college"
    ? buildCollegeBaseDataPrompt(club)
    : buildProBaseDataPrompt(club);

  console.log(`[generate-base] generating base data for ${club.name} (${club.type})...`);
  return await callWithFallback(16000, prompt);
}

export async function generateRelocationDocument(request, baseData) {
  // Two-tier: if base data available, use personalization prompt (faster + cheaper)
  if (baseData) {
    console.log("[generate] using two-tier personalization...");
    let prompt;
    if (request.athlete_type === "college") {
      prompt = buildCollegePersonalizationPrompt(request, baseData);
    } else {
      prompt = buildProPersonalizationPrompt(request, baseData);
    }
    return await callWithFallback(24000, prompt);
  }

  // Fallback: monolithic generation (no base data available)
  console.log("[generate] no base data, using monolithic generation...");
  let prompt;
  if (request.athlete_type === "college") {
    prompt = request.is_part_of_team
      ? buildCollegeAthletePrompt(request)
      : buildGeneralStudentPrompt(request);
  } else {
    prompt = buildPrompt(request);
  }
  return await callWithFallback(32000, prompt);
}
