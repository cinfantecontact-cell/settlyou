export const collegeDemoDocument = {
  meta: {
    athlete_name: "Sebastián Mora",
    destination: "Miami, FL, United States",
    club: "University of Miami",
    club_logo_url: null,
    club_primary_color: "#005030",
    club_website: "https://www.miami.edu",
    generated_summary:
      "Miami is one of the most vibrant, diverse cities in the United States — a place where Latin culture, world-class athletics, and a year-round warm climate make the transition from Colombia feel surprisingly natural. For Sebastián, an incoming student-athlete at the University of Miami on a full athletic scholarship, this guide covers everything from finding your first off-campus apartment to navigating your F-1 visa, getting your SSN, and building a life in one of the most exciting college cities in the country.",
    welcome_letter:
      "Dear Sebastián, welcome to the University of Miami — and welcome to Coral Gables. Arriving from Medellín to play Division I soccer on scholarship is a huge achievement, and we want to make sure your first weeks feel grounded and organized, not overwhelming. Miami has a warmth and energy that Colombians consistently find familiar — the Spanish is everywhere, the food is incredible, and the football culture runs deep. We've built this guide around your specific situation: your F-1 visa steps, affordable neighborhoods close to campus, the best spots to eat and train, and how to connect with the international athlete community at UM. You've got this.",
  },
  sections: {
    neighborhoods: {
      title: "Neighborhoods Near Campus",
      intro:
        "These neighborhoods were selected for proximity to the UM Coral Gables campus, walkability, affordability on a student budget, and a strong Latin community that will feel familiar.",
      items: [
        {
          name: "Coral Gables",
          fit_score: 95,
          fit_reason:
            "Campus is located here — walking or biking distance to classes, training facilities, and everything you need as a student-athlete.",
          description:
            "Coral Gables is a beautiful, tree-lined city built around the University of Miami campus. The area is safe, walkable, and has a strong mix of students, young professionals, and established families. Living here means zero commute to training and classes, with excellent restaurants, coffee shops, and the Miracle Mile shopping district all within easy reach. Rents are higher than surrounding areas but the convenience is unmatched.",
          character: "Upscale, walkable, university-centered",
          avg_rent_range: "$1,400–$1,900/month for a 1BR",
          commute_to_training: "5–10 min walk or bike",
          pros: [
            "Walking distance to campus, Cobb Stadium, and training facilities",
            "Safe, well-maintained neighborhood",
            "Strong café and restaurant scene on Miracle Mile",
            "Many fellow student-athletes live here",
          ],
          cons: ["More expensive than neighboring areas", "Less nightlife than Brickell or Wynwood"],
          best_for: "Athletes who want zero commute and a campus-centered lifestyle",
        },
        {
          name: "South Miami",
          fit_score: 88,
          fit_reason:
            "Residential, affordable, and just 10 minutes from campus — a great option if you want more space for less money.",
          description:
            "South Miami is a quiet, family-oriented neighborhood directly south of Coral Gables. It has a strong Latin American community, excellent local grocery stores and restaurants, and noticeably lower rents than Coral Gables itself. The Metrorail South Miami station puts you on campus in two stops without a car.",
          character: "Residential, Latin-American, laid-back",
          avg_rent_range: "$1,100–$1,500/month for a 1BR",
          commute_to_training: "10 min by Metrorail or 15 min by bike",
          pros: [
            "20–30% cheaper than Coral Gables",
            "Large Colombian and Venezuelan community nearby",
            "Direct Metrorail access to campus",
            "Local Latin restaurants and bakeries",
          ],
          cons: ["Requires bike or transit — not walkable to campus", "Less student atmosphere"],
          best_for: "Athletes who want affordability and a Latin neighborhood feel",
        },
        {
          name: "Coconut Grove",
          fit_score: 82,
          fit_reason:
            "Miami's most charming waterfront neighborhood — artsy, relaxed, and just 15 minutes from campus on a bike.",
          description:
            "Coconut Grove is one of Miami's oldest and most distinctive neighborhoods — a bohemian, tree-covered enclave right on Biscayne Bay. It has a vibrant café and arts culture, waterfront parks, and a genuinely relaxed atmosphere that contrasts with the energy of the rest of Miami. Rent is moderate and many UM students and grad students live here. It's a great choice if you want Miami character without the noise of downtown.",
          character: "Artsy, waterfront, relaxed",
          avg_rent_range: "$1,300–$1,800/month for a 1BR",
          commute_to_training: "15–20 min by bike or 10 min by car",
          pros: [
            "Beautiful waterfront parks for recovery runs and walks",
            "Strong arts and café culture",
            "Close enough to campus without being on top of it",
            "Vibrant weekend life without being loud",
          ],
          cons: ["Slightly longer bike commute", "Parking can be tight"],
          best_for: "Athletes who want character, waterfront access, and a social scene",
        },
      ],
    },
    housing: {
      title: "Off-Campus Housing",
      intro:
        "Miami's rental market moves fast — start your search 2–3 months before your semester starts and have your documents ready.",
      tips: [
        "Have your I-20, passport, and scholarship letter ready — landlords often ask for them as proof of enrollment and income",
        "Most leases start August 1 to align with the academic year — contact landlords in May or June for the best selection",
        "Look for apartments that include water and trash in the rent — electricity and WiFi are almost always separate in Miami",
      ],
      search_platforms: [
        { name: "Zillow", url: "https://www.zillow.com", note: "Best overall inventory for Miami rentals" },
        { name: "Apartments.com", url: "https://www.apartments.com", note: "Good for larger apartment complexes" },
        { name: "Facebook Marketplace", url: "https://www.facebook.com/marketplace", note: "Best for finding roommates and sublets from other UM students" },
        { name: "UM Off-Campus Housing Board", url: "https://miami.edu/housing", note: "Official university listing board — start here" },
      ],
      items: [
        {
          type: "1-bedroom apartment",
          area: "Coral Gables — near Ponce de Leon Blvd",
          description:
            "Modern 1BR apartments within 10 minutes' walk of the UM campus. Many buildings are purpose-built for students and young professionals, with in-unit laundry, gym access, and secure parking. Ideal if you want your own space and can budget $1,400–$1,800/month.",
          price_range: "$1,400–$1,800/month",
          bedrooms: "1",
          highlights: ["Walking distance to campus", "In-unit laundry in most buildings", "Many UM athletes in the same buildings"],
          ideal_for: "Solo athlete who wants independence and easy campus access",
        },
        {
          type: "Shared apartment (2BR split)",
          area: "South Miami or Coconut Grove",
          description:
            "Splitting a 2-bedroom apartment with a teammate or fellow international student is the most common living arrangement for student-athletes at UM. You get your own room, shared common areas, and cut your rent to $800–$1,000/month — leaving more budget for food, transport, and going out.",
          price_range: "$800–$1,100/month per person",
          bedrooms: "1 private room in 2BR",
          highlights: ["Most affordable option", "Many UM athletes prefer this model", "More social — easier for your first year abroad"],
          ideal_for: "First-year international athletes who want community and affordability",
        },
      ],
    },
    campus_life: {
      title: "Campus Life & Athletics",
      intro:
        "The University of Miami is an ACC Division I program — Sebastián will be part of one of the most competitive college soccer programs in the country.",
      items: [
        {
          name: "UM Men's Soccer — Cobb Stadium",
          url: "https://hurricanesports.com/sports/mens-soccer",
          type: "Athletic facility",
          location: "University of Miami campus, Coral Gables",
          description:
            "Cobb Stadium is the home of UM Men's Soccer — a 2,000-seat stadium with a natural grass pitch and dedicated training areas. As a scholarship athlete, Sebastián will have full access to the athletic training center, strength and conditioning facilities, and sports medicine staff. Team training sessions typically run twice daily in pre-season and once daily in-season.",
          highlights: ["Division I ACC program", "Full athletic training staff and sports medicine", "Academic support center exclusively for student-athletes"],
        },
        {
          name: "Shalala Student Center",
          url: "https://studentaffairs.miami.edu/shalala",
          type: "Student hub",
          location: "Central campus, Coral Gables",
          description:
            "The Shalala Student Center is the heart of campus life at UM — home to student organizations, dining, the bookstore, and dozens of clubs. The International Student and Scholar Services (ISSS) office is also here, which is Sebastián's first stop for any F-1 visa questions.",
          highlights: ["ISSS office for F-1 visa support", "Latin Student Union and Colombian community organizations", "Career and academic advising"],
        },
        {
          name: "Lakeside Village & Campus Green",
          url: "https://miami.edu/campus-life",
          type: "Campus social space",
          location: "Central campus, Coral Gables",
          description:
            "The UM campus is centered around Lake Osceola — a genuinely beautiful setting with hammocks, outdoor seating, and a constant stream of student life. It's where you'll spend your downtime between classes, meet people, and absorb the culture of an American university.",
          highlights: ["Social hub of campus life", "Outdoor study and relaxation areas", "Campus events and sports festivals throughout the year"],
        },
      ],
    },
    fitness: {
      title: "Fitness & Training",
      intro:
        "As a scholarship athlete, Sebastián has access to UM's elite athletic facilities — but here are additional options for personal training and recovery.",
      items: [
        {
          name: "UM Wellness Center",
          url: "https://recreation.miami.edu",
          type: "Student gym",
          location: "University of Miami campus",
          description:
            "The Ponce de Leon Garage Wellness Center is available to all UM students and is free with your student ID. It has full gym equipment, cardio machines, a pool, and group fitness classes. As an athlete, you also have access to the dedicated athletic training facilities — but the Wellness Center is great for personal workouts outside of team sessions.",
          price_range: "Free with UM student ID",
          highlights: ["Free for all enrolled students", "Pool, gym, and group classes", "Open 6am–10pm on weekdays"],
        },
        {
          name: "Life Time Coral Gables",
          url: "https://www.lifetime.life/life-time-locations/fl-coral-gables.html",
          type: "Premium fitness club",
          location: "396 Alhambra Cir, Coral Gables",
          description:
            "Life Time is a premium club 5 minutes from campus with an outdoor pool, tennis courts, spa, and high-end gym equipment. It's a step up from the student gym — good for personal training sessions, recovery, and the full athlete lifestyle experience. Student discounts are available.",
          price_range: "$80–$120/month (student rate available)",
          highlights: ["Outdoor pool and tennis courts", "Recovery and spa facilities", "Personal training available"],
        },
        {
          name: "Tropical Park Athletic Complex",
          url: "https://www.miamidade.gov/parks/tropical.asp",
          type: "Public outdoor sports facility",
          location: "7900 SW 40th St, Miami",
          description:
            "Tropical Park has multiple outdoor soccer fields available to rent by the hour — ideal for individual training sessions, informal pickup games, and staying sharp during the off-season. A 15-minute drive from campus.",
          price_range: "Free public access / field rentals from $25/hour",
          highlights: ["Multiple soccer pitches", "Open to public — great for pickup games", "Miami FC sometimes trains here"],
        },
      ],
    },
    dining: {
      title: "Dining & Groceries",
      intro:
        "Miami's food scene is exceptional for a Colombian student — the Latin food culture is deeply embedded in the city, and you'll find familiar flavors everywhere.",
      diet_note:
        "Miami has outstanding options for high-protein, athlete-friendly eating — Colombian, Venezuelan, and Brazilian restaurants are everywhere, and meal-prep services popular with athletes are widely available.",
      supermarkets: [
        {
          name: "Whole Foods Market",
          url: "https://www.wholefoodsmarket.com",
          type: "Premium grocery",
          location: "2990 Ponce de Leon Blvd, Coral Gables (10 min walk from campus)",
          note: "Best for organic produce and athlete nutrition products — more expensive but very convenient",
        },
        {
          name: "Presidente Supermarket",
          url: "https://www.presidentesupermarket.com",
          type: "Latin grocery",
          location: "Multiple locations in South Miami and Hialeah",
          note: "The go-to for Colombian staples — arepas, bandeja ingredients, aguardiente, and all the familiar products from home at reasonable prices",
        },
        {
          name: "Trader Joe's",
          url: "https://www.traderjoes.com",
          type: "Affordable grocery",
          location: "8627 SW 136th St, Miami (near South Miami)",
          note: "Best value for day-to-day grocery shopping — popular with UM students on a budget",
        },
      ],
      restaurants: [
        {
          name: "Ariete",
          url: "https://www.arietecoconutgrove.com",
          cuisine: "Modern American / Local",
          location: "3540 Main Hwy, Coconut Grove",
          why_recommended: "One of Miami's most celebrated restaurants by a James Beard-nominated chef — affordable lunch service and a great introduction to Miami's serious food culture",
          price_range: "$18–$35 per person",
          must_try: "The smash burger at lunch — legendary in Miami",
        },
        {
          name: "Lila's Colombian Cuisine",
          url: "https://www.lilasdiner.com",
          cuisine: "Colombian",
          location: "7300 SW 57th Ave, South Miami",
          why_recommended: "Authentic Colombian home cooking close to campus — bandeja paisa, sancocho, and arepas exactly like home. Sebastián will appreciate this on tired days.",
          price_range: "$12–$20 per person",
          must_try: "Bandeja paisa and the freshly squeezed lulo juice",
        },
        {
          name: "Taquerias el Mexicano",
          url: "https://www.taqueriaselm.com",
          cuisine: "Mexican / Latin",
          location: "521 SW 8th St, Little Havana",
          why_recommended: "Cheap, fresh, and fast — a student staple for high-protein eating on a budget. Excellent for post-training meals when you need calories fast.",
          price_range: "$8–$14 per person",
          must_try: "Carne asada tacos and the rice bowl",
        },
      ],
    },
    healthcare: {
      title: "Health & Wellness",
      intro:
        "As a scholarship athlete at UM, Sebastián has access to dedicated sports medicine staff — but here's what to know about student health coverage and off-campus care.",
      insurance_note:
        "All University of Miami student-athletes on scholarship are enrolled in the university's student health insurance plan (Aetna), which covers medical, dental, and vision. Athletic injuries are covered by the athletic department's insurance. Make sure to visit the ISSS office to confirm your insurance is active before your first appointment.",
      items: [
        {
          name: "UM Student Health Center",
          url: "https://studenthealth.miami.edu",
          type: "Campus health clinic",
          location: "Ashe Building, University of Miami campus",
          description:
            "The primary healthcare resource for all UM students — primary care, mental health counseling, travel medicine, and urgent care. Appointments are free or low-cost with student insurance. As an international student, this should be your first call for any non-emergency health issue.",
          specialties: ["Primary care", "Mental health", "Travel and international health", "Sexual health"],
          languages: ["English", "Spanish"],
          tip: "Book appointments online — walk-in is available but wait times can be long during exam periods",
        },
        {
          name: "UHealth — University of Miami Health System",
          url: "https://umiamihealth.org",
          type: "Hospital system",
          location: "1400 NW 12th Ave, Miami (15 min from campus)",
          description:
            "UHealth is the University of Miami's affiliated hospital system — one of the top medical centers in Florida. For anything more serious than the student health center can handle, UHealth specialists are the natural referral destination and are familiar with student insurance.",
          specialties: ["Sports medicine", "Orthopedics", "Cardiology", "All specialties"],
          languages: ["English", "Spanish"],
          tip: "Referrals from the UM Student Health Center are processed quickly within the UHealth system",
        },
      ],
    },
    safety: {
      title: "Safety & Campus Security",
      intro:
        "The University of Miami campus is safe and well-monitored — here's what Sebastián needs to know to stay aware and prepared.",
      items: [
        {
          category: "Campus Security",
          title: "UM Campus Police — 24/7",
          description:
            "The University of Miami has its own police department (UMPD) operating 24/7 across the Coral Gables campus. Emergency blue-light phones are posted throughout campus. The LiveSafe app allows students to share location, request a safety escort, and contact UMPD directly from their phone.",
          tips: [
            "Download the LiveSafe app before your first week — it's the UM safety system",
            "UMPD offers free safety escorts across campus at night (1-305-284-6666)",
            "Register your bike with UMPD to help recover it if stolen",
          ],
          url: "https://police.miami.edu",
        },
        {
          category: "Neighborhood Awareness",
          title: "Staying aware off-campus",
          description:
            "Coral Gables and Coconut Grove are among Miami's safest neighborhoods. Like any large US city, common sense applies — stay aware of your surroundings at night, use rideshare apps (Uber/Lyft) after late nights out, and avoid walking alone in unfamiliar areas of Miami after dark.",
          tips: [
            "Coral Gables and South Miami are genuinely safe — don't be overly anxious",
            "Use Uber/Lyft at night rather than walking in areas you don't know",
            "Little Havana and Overtown require more awareness late at night — avoid those areas after midnight",
          ],
          url: "https://www.coralgables.com/departments/police",
        },
        {
          category: "Emergency Numbers",
          title: "Key numbers to save",
          description:
            "Save these numbers before you arrive — you won't have time to look them up in an emergency.",
          tips: [
            "911 — all emergencies (police, fire, ambulance)",
            "UMPD non-emergency: 1-305-284-6666",
            "UM Student Health urgent line: 1-305-284-9293",
            "Colombian Consulate Miami: 1-786-268-9999",
          ],
          url: "https://police.miami.edu",
        },
      ],
    },
    transportation: {
      title: "Getting Around",
      intro:
        "Miami is a car-heavy city, but as a student near the UM campus, a combination of bike, Metrorail, and rideshare will cover most of what Sebastián needs.",
      items: [
        {
          option: "Bicycle",
          description:
            "A good bike is the single best investment for daily campus life — the Coral Gables campus is flat and bike-friendly, and riding to class, training, and nearby restaurants saves both time and money. Lock it well (UMPD recommends a U-lock) and register it with campus police.",
          price_range: "$150–$400 for a reliable commuter bike",
          tips: ["Trek and Giant bikes available at The Cyclery in Coral Gables", "Register your bike with UMPD for theft recovery", "Citibike Miami e-bike share also available near campus ($15/month student rate)"],
        },
        {
          option: "Metrorail",
          description:
            "The Metrorail University station is on the edge of campus — a direct above-ground rail that connects to downtown Miami, Brickell, and Miami International Airport. It's the cheapest and most reliable way to get around the city without a car.",
          price_range: "$2.25 per ride / $30 monthly EASY Card (student discount available)",
          tips: ["Get the EASY Card at any Metrorail station — reloadable and cheaper than paying each ride", "The University station is a 10-minute walk from the center of campus", "Direct service to Miami Airport — very useful for travel home"],
        },
        {
          option: "Uber / Lyft",
          description:
            "Rideshare is affordable and widely used in Miami — both Uber and Lyft are active across the city. Essential for late nights, airport runs, and going to areas not served by Metrorail.",
          price_range: "$8–$20 for most in-city trips",
          tips: ["Download both Uber and Lyft — prices vary", "Miami airport rides are often cheaper via Lyft", "Rideshare pick-up zone on campus is at the Shalala Student Center"],
        },
      ],
      public_transport_note:
        "Miami's public bus network (Miami-Dade Transit) covers the whole city — useful for longer trips but the Metrorail is faster for anything near the UM corridor.",
    },
    practical: {
      title: "Practical Information",
      intro:
        "Arriving as an F-1 international student means there's a specific sequence of steps to complete in your first weeks — get these done early and everything else falls into place.",
      items: [
        {
          category: "F-1 Visa & SEVIS",
          title: "Check in with ISSS on day one",
          description:
            "Your I-20 is your most important document in the US — keep it with you at all times. Within 10 days of arriving, you must check in with the International Student and Scholar Services (ISSS) office at UM to validate your SEVIS record. Missing this step can jeopardize your visa status.",
          tips: [
            "Bring your passport, visa, I-20, and proof of enrollment to the ISSS check-in",
            "ISSS office is in the Shalala Student Center — go in week one",
            "Keep your I-20 valid for re-entry to the US every time you travel abroad",
            "Never work off-campus without authorization from ISSS (CPT/OPT) — it's a visa violation",
          ],
          url: "https://isss.miami.edu",
        },
        {
          category: "Social Security Number",
          title: "Apply for your SSN (if eligible)",
          description:
            "F-1 students can apply for a Social Security Number if they have on-campus employment or are on CPT/OPT. As a scholarship athlete, your athletic grant may qualify as a form of employment — confirm with ISSS. You'll need a SSN to open a US bank account, sign a lease, and eventually file US taxes.",
          tips: [
            "Get a letter from ISSS confirming your eligibility before going to the SSA office",
            "Social Security Administration office nearest to campus: 11401 SW 40th St, Miami",
            "Bring passport, visa, I-20, and ISSS employment letter",
            "Processing takes 2–4 weeks after applying",
          ],
          url: "https://www.ssa.gov",
        },
        {
          category: "Banking",
          title: "Open a US bank account in week one",
          description:
            "Open a US bank account immediately upon arrival — you'll need it for rent, direct deposit from the university, and daily life. Chase and Bank of America have branches near campus and are student-friendly for international accounts. Bring your passport, I-20, and proof of address.",
          tips: [
            "Chase Bank on Miracle Mile (Coral Gables) is the closest to campus",
            "Ask specifically for a student checking account — no monthly fees",
            "Wise or Revolut are excellent for sending money home to Colombia cheaply",
            "Avoid currency exchange at the airport — the rates are very poor",
          ],
          url: "https://www.chase.com",
        },
        {
          category: "Phone Plan",
          title: "Get a US SIM immediately",
          description:
            "You'll need a US phone number for almost everything — apartment applications, campus communication, and Uber/Lyft. T-Mobile and Mint Mobile offer the best value for international students without a US credit history.",
          tips: [
            "T-Mobile student plan: ~$40/month unlimited data — best coverage in Miami",
            "Mint Mobile (online only): ~$25/month — cheapest option, same T-Mobile network",
            "You can keep your Colombian number active via WhatsApp on WiFi",
          ],
          url: "https://www.t-mobile.com/iphone-for-students",
        },
      ],
    },
    integration: {
      title: "Integration & Student Community",
      intro:
        "Miami is one of the easiest US cities for a Colombian student-athlete to feel at home — the Latin community is enormous and the university is deeply international.",
      language_tip:
        "Your English will improve dramatically in the first semester — embrace it. In Miami you'll speak Spanish everywhere outside campus, which is a comfort, but push yourself to use English in class, with teammates, and in daily life. UM offers free English conversation practice sessions through the ISSS office.",
      expat_community:
        "The University of Miami has over 3,500 international students from 120 countries — the Colombian student community is one of the most active on campus, with a Colombian Students Association that organizes cultural events, asados, and welcome dinners for new arrivals.",
      items: [
        {
          name: "UM Colombian Students Association",
          url: "https://engage.miami.edu",
          type: "Student organization",
          description:
            "The Colombian Students Association at UM organizes cultural events, study groups, and social gatherings throughout the year. Reaching out before you arrive is the single best thing you can do for your first month.",
          tip: "Find them on the UM Engage platform — they typically host a welcome dinner for new Colombian students at the start of each semester",
        },
        {
          name: "UM Latin Student Union",
          url: "https://engage.miami.edu",
          type: "Student organization",
          description:
            "The Latin Student Union is one of the largest and most active student organizations at UM — a natural home for Sebastián and an immediate social network from day one.",
          tip: "Attend the Canes welcome fair in the first week — every student organization sets up tables and it's the fastest way to meet people",
        },
        {
          name: "UM International Student Community (ISSS)",
          url: "https://isss.miami.edu",
          type: "Support resource",
          description:
            "ISSS runs regular social events for international students — cultural mixers, visa workshops, and orientation programs. Beyond the administrative support, it's one of the best places to meet other international athletes navigating the same experience.",
          tip: "The international student orientation in week one is mandatory — but also genuinely useful and a great way to meet people",
        },
      ],
    },
    religious_cultural: null,
    local_life: {
      title: "Local Life & Student Tips",
      intro:
        "A few things that will make day-to-day life in Miami much easier from day one.",
      apps: [
        { name: "Uber / Lyft", purpose: "Getting around Miami without a car", note: "Download both — prices vary and it helps to compare" },
        { name: "Citibike Miami", purpose: "Bike share near campus", note: "Monthly student rate of ~$15 — great for short trips around Coral Gables" },
        { name: "Duolingo / Babbel", purpose: "English practice", note: "15 minutes a day accelerates your academic English significantly" },
        { name: "Zelle / Venmo", purpose: "Splitting rent and expenses with roommates", note: "Standard payment apps in the US — set up with your US bank account" },
        { name: "Rate My Professors", purpose: "Choosing classes and professors", note: "Essential for picking the right sections — student reviews are honest and very useful" },
      ],
      tips: [
        { category: "Weather", tip: "Miami has a hurricane season from June to November — take storm warnings seriously. Download the Miami-Dade Emergency app and know your campus evacuation protocol." },
        { category: "Sun", tip: "The Miami sun is genuinely intense — SPF 30+ daily and hydration are important, especially for outdoor training. Heat exhaustion is a real risk in August pre-season." },
        { category: "Tipping", tip: "Tipping is standard in the US — 18–20% at restaurants, $1–2 per drink at bars, and $1–2 per bag for hotel/delivery. It will feel unusual at first but becomes natural quickly." },
        { category: "Academic culture", tip: "Professors in the US expect participation in class — it counts toward your grade and they notice. Showing up, sitting in the front rows, and engaging is valued differently than in Colombia." },
        { category: "Credit history", tip: "Start building US credit early — open a secured credit card through your bank in your first semester. Good credit makes everything easier: apartments, car leases, and eventually post-graduation opportunities." },
      ],
    },
    day_trips: {
      title: "Day Trips & Weekend Getaways",
      intro:
        "Miami's location makes it one of the best cities in the US for quick escapes — keys, everglades, and beaches are all within easy reach.",
      items: [
        {
          name: "Florida Keys",
          description:
            "The Florida Keys — a 125-mile chain of islands south of Miami — are one of the most spectacular day trip destinations in the US. Key Largo is an hour from campus; Key West is three hours. Snorkeling, diving, fishing, and the laid-back Keys culture make this a must-visit in your first semester.",
          distance_km: "65 km to Key Largo",
          travel_time: "1 hour by car",
          best_for: "Weekend getaways, snorkeling, exploring American beach culture",
          highlights: ["John Pennekamp State Park snorkeling — one of the best in the US", "Key West for a full weekend trip", "Fresh seafood everywhere"],
        },
        {
          name: "Everglades National Park",
          description:
            "The Everglades is one of the most unique ecosystems in the world — and it's 40 minutes from campus. Airboat tours, alligator sightings, kayaking, and birdwatching make it an unforgettable experience. Very popular with international students visiting for the first time.",
          distance_km: "55 km",
          travel_time: "40 minutes by car",
          best_for: "Unique nature experience, group outings, something completely different",
          highlights: ["Airboat tours from $30–50", "Alligators, manatees, and tropical birds", "Sunset views over the sawgrass plains"],
        },
        {
          name: "Fort Lauderdale",
          description:
            "Fort Lauderdale is 45 minutes north of Miami on the Tri-Rail — wider beaches, a more relaxed atmosphere than Miami Beach, and a great day-trip option when you want to get out of the city. The Las Olas Boulevard area has excellent restaurants and a beautiful waterfront.",
          distance_km: "45 km",
          travel_time: "45 min by Tri-Rail from Miami Central",
          best_for: "Beach day, relaxed weekend, exploring South Florida beyond Miami",
          highlights: ["Less crowded beaches than Miami Beach", "Las Olas Boulevard for dining", "Bonnet House Museum and Gardens"],
        },
      ],
    },
    emergency_contacts: {
      title: "Emergency Contacts",
      intro:
        "Save these numbers before you arrive — the first week in a new country is when you're most likely to need them.",
      items: [
        { category: "Emergency", name: "911 — All emergencies", number: "911", note: "Police, fire, ambulance — works from any US phone including international SIMs" },
        { category: "Campus Security", name: "UM Police Department", number: "1-305-284-6666", note: "24/7 campus police non-emergency line — also for safety escorts at night" },
        { category: "Student Health", name: "UM Student Health Center", number: "1-305-284-9293", note: "Medical urgent line — call before going to the ER for non-life-threatening issues" },
        { category: "Visa Support", name: "UM ISSS Office", number: "1-305-284-2928", note: "Any F-1 visa questions, SEVIS issues, or travel authorization — call before doing anything that might affect your status" },
        { category: "Consulate", name: "Colombian Consulate Miami", number: "1-786-268-9999", note: "Passport renewal, emergency travel documents, consular services for Colombian nationals" },
        { category: "Mental Health", name: "UM Counseling Center", number: "1-305-284-5511", note: "Free confidential counseling for all UM students — adjusting to life abroad is hard, and asking for support is smart" },
      ],
    },
  },
};
