export const generalStudentDemoDocument = {
  meta: {
    athlete_name: "Valentina Morales",
    destination: "Boca Raton, FL, United States",
    club: "Florida Atlantic University",
    club_logo_url: "/Florida_Atlantic_Owls_logo.svg.png",
    club_primary_color: "#003087",
    club_website: "https://www.fau.edu",
    generated_summary:
      "Boca Raton is one of Florida's most livable college cities — a sun-drenched coastal town with a warm Latin American community, excellent food, and easy access to Miami and Fort Lauderdale. Florida Atlantic University's International Business program is growing fast, and the city's blend of affordable neighborhoods, strong Colombian diaspora, and year-round beach lifestyle makes it an exceptional landing spot for an incoming student from Medellín.",
    welcome_letter:
      "Dear Valentina, welcome to Florida Atlantic University — and welcome to Boca Raton. Moving from Medellín to South Florida is a significant leap, and we want your first weeks here to feel organized and exciting, not stressful. This guide was built specifically around your situation: opening your first US bank account, finding an apartment near campus, connecting with the Colombian and Latin community at FAU, navigating F-1 life, and discovering what makes Boca Raton genuinely one of the best places in the US to be a young international student. You're going to love it here — this guide is just to make sure you arrive ready for all of it.",
  },
  sections: {
    neighborhoods: {
      title: "Neighborhoods Near Campus",
      intro:
        "These neighborhoods were chosen for their proximity to FAU, affordability for a student budget, and quality of life for a young international student.",
      items: [
        {
          name: "Boca Raton — Near Campus",
          fit_score: 94,
          fit_reason:
            "Walking or biking distance to FAU's campus, library, student union, and all classes — zero commute stress, maximum free time.",
          description:
            "The neighborhoods directly surrounding FAU's Boca Raton campus are the most popular choice for first-year international students. Purpose-built student apartments along NW 20th Street and the Glades Road corridor are filled with fellow FAU students and international students from around the world. Biking to class, the library, or campus dining takes under 10 minutes. Most landlords in this area are experienced with F-1 students and accept enrollment letters and I-20s in lieu of US credit history.",
          character: "Student-centered, flat, sunny South Florida",
          avg_rent_range: "$1,100–$1,600/month for a 1BR",
          commute_to_training: "5–10 min walk or bike to campus",
          pros: [
            "Walking distance to all classes, the library, and the Student Union",
            "Fellow international and Colombian students in the same buildings",
            "No transport costs — bike everywhere",
            "Easy access to FAU campus dining and health services",
          ],
          cons: ["Quieter social scene than Delray Beach", "Limited restaurant options within walking distance"],
          best_for: "First-year international students prioritizing academics, convenience, and community",
        },
        {
          name: "Delray Beach",
          fit_score: 86,
          fit_reason:
            "South Florida's most vibrant small-city beach scene — excellent restaurants, a walkable main street, and a growing Latin American community, 15 minutes from FAU.",
          description:
            "Delray Beach's Atlantic Avenue is one of the most celebrated streets in Florida — lined with outdoor restaurants, wine bars, art galleries, and boutiques, ending at a stunning Atlantic Ocean beach. Living here gives you a genuine South Florida social life while studying at FAU. The Colombian and Venezuelan communities in Delray are large and active, and the weekend social scene on Atlantic Avenue rivals Fort Lauderdale at a more manageable scale.",
          character: "Vibrant, coastal, young professional",
          avg_rent_range: "$1,300–$1,800/month for a 1BR",
          commute_to_training: "15 min drive / 25 min via Palm Tran bus",
          pros: [
            "Atlantic Avenue is one of Florida's best social strips",
            "Beach access — direct Atlantic beachfront 5 minutes away",
            "Large Latin American and Colombian community",
            "More vibrant social scene than near-campus neighborhoods",
          ],
          cons: ["Requires a car or transit planning to get to campus", "Slightly pricier than near-campus options"],
          best_for: "Students who want South Florida beach lifestyle alongside their studies",
        },
        {
          name: "Deerfield Beach",
          fit_score: 80,
          fit_reason:
            "Affordable, diverse, beach-adjacent — one of the best budget-friendly options in the region with a strong Colombian community.",
          description:
            "Deerfield Beach sits directly on the Atlantic coast, 20 minutes north of FAU. Rents are noticeably lower than Boca Raton or Delray Beach, and the city has a relaxed atmosphere with a very large Latin American population. International students often choose Deerfield Beach for roommate-share arrangements to keep monthly costs under $900. The Deerfield Beach pier area has good restaurants and weekend energy.",
          character: "Affordable, diverse, laid-back beach community",
          avg_rent_range: "$950–$1,350/month for a 1BR",
          commute_to_training: "20 min drive to FAU campus",
          pros: [
            "Most affordable quality housing in the area",
            "Large Colombian and Venezuelan community — Spanish everywhere",
            "Beach access within 10 minutes of most apartments",
          ],
          cons: ["Requires a car — public transit to FAU is slow", "More suburban, less student-focused atmosphere"],
          best_for: "Budget-conscious students who want affordability and a Latin American neighborhood feel",
        },
      ],
    },
    housing: {
      title: "Off-Campus Housing",
      intro:
        "Boca Raton's rental market is competitive — start searching 2–3 months before your semester and have your F-1 documents ready.",
      tips: [
        "Most landlords require first and last month's rent plus a security deposit upfront — have at least $3,000–$4,500 ready for move-in costs",
        "With no US credit history, offer a larger deposit or ask FAU International Student Services for an enrollment confirmation letter — most landlords near campus accept this",
        "Roommate-sharing a 2BR apartment with another FAU student is the most affordable first-year option — your per-person cost drops to $700–$950/month",
      ],
      search_platforms: [
        { name: "FAU Off-Campus Housing Portal", url: "https://www.fau.edu/housing/off-campus", note: "Official FAU portal — start here. Lists properties near campus familiar with international students." },
        { name: "Zillow", url: "https://www.zillow.com", note: "Best overall inventory near FAU campus" },
        { name: "Apartments.com", url: "https://www.apartments.com", note: "Good for larger apartment complexes with property management companies" },
        { name: "Facebook Marketplace", url: "https://www.facebook.com/marketplace", note: "Best for roommate matching with other FAU international students" },
      ],
      items: [
        {
          type: "Shared 2BR apartment",
          area: "Boca Raton — NW 20th St / Glades Rd corridor",
          description:
            "Splitting a 2-bedroom apartment with a fellow international student near FAU is the most popular and practical first-year choice. Per-person costs drop to $700–$950/month, you immediately have a built-in social connection, and the area is full of students in the same situation. Many FAU international student Facebook groups facilitate roommate matching before students even arrive.",
          price_range: "$700–$950/month per person",
          bedrooms: "1 private room in a 2BR",
          highlights: ["Most affordable option with meaningful savings vs. solo living", "Built-in community from day one", "Near FAU campus — walkable to class"],
          ideal_for: "First-year international student who values community, affordability, and proximity to campus",
        },
        {
          type: "1-bedroom apartment near campus",
          area: "Boca Raton — near Glades Rd and Congress Ave",
          description:
            "For students who want full independence, 1BR apartments near FAU range from $1,100–$1,600/month. Buildings like The Retreat at Boca Raton and University Village offer modern amenities including pool, gym, and in-unit laundry. Landlords are experienced with F-1 students and can process enrollment letters in lieu of US credit.",
          price_range: "$1,100–$1,600/month",
          bedrooms: "1",
          highlights: ["Full independence", "Modern amenities included", "Flexible landlords familiar with international student paperwork"],
          ideal_for: "Students who prioritize privacy and independence",
        },
      ],
    },
    banking: {
      title: "Banking & Financial Setup",
      intro:
        "Opening a US bank account is the single most important financial step when you arrive — everything else (rent, bills, Venmo, credit building) depends on it.",
      tips: [
        "Open your account in the first week — before you sign an apartment lease or need to pay rent",
        "As an F-1 student without a Social Security Number yet, you can open a bank account using your passport, I-20, and proof of FAU enrollment",
        "Start building US credit immediately with a secured credit card — your future apartment leases and any US financing will depend on your credit score",
        "Set up a Wise account before leaving Colombia — transfer money from Colombia to the US at real exchange rates without bank fees (far better than wire transfers through Colombian banks)",
      ],
      items: [
        {
          name: "Chase Bank — Student Checking Account",
          url: "https://www.chase.com",
          type: "US bank — best overall for FAU students",
          location: "Chase branch at 1900 N Military Trail, Boca Raton (near FAU campus)",
          description:
            "Chase is the most recommended US bank for international students at FAU. The Chase College Checking account has no monthly fees for students under 24, a strong mobile app, and a wide ATM network throughout South Florida. The Boca Raton branch near FAU's campus is experienced with international student account openings and can process your application with passport, I-20, and enrollment letter. If you don't yet have a Social Security Number, Chase can still open your account with an ITIN (Individual Taxpayer Identification Number) — ask your FAU financial aid advisor about getting an ITIN before you arrive.",
          what_to_bring: ["Passport + F-1 visa stamp", "I-20 document", "FAU enrollment confirmation letter", "Your Colombian address (temporary address accepted initially)"],
          price_range: "No monthly fee for students under 24",
        },
        {
          name: "Bank of America — Advantage Banking",
          url: "https://www.bankofamerica.com",
          type: "US bank — alternative option",
          location: "Multiple branches in Boca Raton",
          description:
            "Bank of America is another strong option for FAU international students. Their SafeBalance Banking account has no overdraft fees and no minimum balance requirement — important for a first-year student. Strong app, Zelle integration for rent splitting, and Spanish-speaking staff at several Boca Raton branches.",
          what_to_bring: ["Passport + F-1 visa stamp", "I-20", "FAU enrollment letter"],
          price_range: "$4.95/month (waivable with qualifying activity)",
        },
        {
          name: "Wise (formerly TransferWise)",
          url: "https://wise.com",
          type: "International money transfer — essential for Colombian students",
          location: "Online / app",
          description:
            "Set up a Wise account before you leave Colombia. Wise lets you send money from Colombian pesos to your US bank account at the real mid-market exchange rate — no hidden bank fees, no unfavorable exchange rates. For a student sending $500–$2,000/month from Colombia, Wise saves a meaningful amount compared to international wire transfers through Colombian banks.",
          what_to_bring: ["Colombian ID or passport", "Email address"],
          price_range: "~0.4–0.6% transfer fee — no monthly fee",
        },
        {
          name: "Capital One Platinum Secured Credit Card",
          url: "https://www.capitalone.com",
          type: "Credit building — essential for long-term US life",
          location: "Online application",
          description:
            "Building a US credit score starts from zero for international students. A secured credit card requires a deposit (typically $200–$500) as your credit limit, reports monthly to all three credit bureaus, and builds your credit history starting from your first statement. After 6–12 months of on-time payments, Capital One typically upgrades you to an unsecured card and returns your deposit. This is the fastest legitimate path to a US credit score as an F-1 student.",
          what_to_bring: ["US bank account", "SSN or ITIN"],
          price_range: "$200–$500 security deposit (refunded after upgrade)",
        },
      ],
    },
    dining: {
      title: "Food & Dining",
      intro:
        "South Florida's incredible Latin food scene will make Valentina feel right at home — from Colombian restaurants to performance-friendly everyday options near campus.",
      supermarkets: [
        { name: "Publix", url: "https://www.publix.com", type: "Full-service grocery", location: "Multiple locations near FAU campus", note: "Florida's best grocery chain — excellent produce, prepared meals, and a deli perfect for budget-friendly daily eating" },
        { name: "Trader Joe's", url: "https://www.traderjoes.com", type: "Affordable grocery", location: "Boca Raton", note: "Best value for healthy groceries — exceptional for prepared meals under $6, perfect for a student budget" },
        { name: "Presidente Supermarket", url: "https://www.presidentesupermarket.com", type: "Latin American grocery", location: "Pompano Beach / Deerfield Beach (20 min)", note: "Best for Colombian staples — arepas, hogao, ají, bandeja paisa ingredients, and everything that makes food feel like home" },
        { name: "Whole Foods Market", url: "https://www.wholefoodsmarket.com", type: "Premium organic", location: "1400 Glades Rd, Boca Raton", note: "Best for organic produce and specialty items — premium but worth it for specific ingredients" },
      ],
      restaurants: [
        {
          name: "Casablanca Colombian Restaurant",
          url: "https://www.google.com/maps/search/Colombian+restaurant+Boca+Raton",
          cuisine: "Colombian",
          location: "Boca Raton / Deerfield Beach area",
          why_recommended:
            "South Florida has a significant Colombian community and the Colombian restaurant scene reflects it. For Valentina, finding a good bandeja paisa, ajiaco, or empanadas in her first weeks is genuinely important for morale — the familiar tastes ease the cultural transition enormously. Ask at the FAU Colombian student community for the current favorites near campus.",
          price_range: "$$",
          must_try: "Bandeja paisa, sancocho, empanadas, aguardiente (on rest days)",
          athlete_note: null,
        },
        {
          name: "Bolay",
          url: "https://www.bolay.com",
          cuisine: "Performance bowl restaurant",
          location: "Multiple locations in Boca Raton",
          why_recommended:
            "Bolay is a South Florida fast-casual chain built around clean, fresh grain bowls — customizable with lean proteins, brown rice, quinoa, and roasted vegetables. Fast, affordable at $10–$13, and genuinely healthy. FAU students eat here constantly — it's a reliable daily option that's quick between classes.",
          price_range: "$",
          must_try: "Custom bowl: brown rice + chicken + roasted sweet potato + chimichurri",
          athlete_note: null,
        },
        {
          name: "El Camino",
          url: "https://www.elcaminofl.com",
          cuisine: "Modern Mexican / Latin",
          location: "Delray Beach, FL (15 min from campus)",
          why_recommended:
            "A vibrant, social restaurant on Delray Beach's Atlantic Avenue with excellent tacos, guacamole, and a great social atmosphere. Perfect for team dinners, celebrating good grades, or a fun night out with new friends. One of FAU students' most-visited spots in Delray.",
          price_range: "$$",
          must_try: "Al pastor tacos, loaded guacamole, churros",
          athlete_note: null,
        },
        {
          name: "Chop't Creative Salad Restaurant",
          url: "https://www.choptsalad.com",
          cuisine: "Healthy fast-casual",
          location: "Boca Raton area",
          why_recommended:
            "Fast, customizable salads and grain bowls that are perfect for a busy class schedule. Popular with health-conscious FAU students who need a quick, nutritious meal between afternoon classes and evening study sessions.",
          price_range: "$",
          must_try: "Mediterranean salad, Santa Fe bowl",
          athlete_note: null,
        },
      ],
    },
    transportation: {
      title: "Getting Around",
      intro:
        "Boca Raton is car-friendly, but a bike + rideshare combination covers most daily needs near FAU without needing to own a car in year one.",
      items: [
        {
          option: "Bicycle",
          description:
            "A reliable bike is the best investment for campus life at FAU — the campus is flat, the weather is warm year-round, and biking to class, the library, and nearby restaurants is genuinely practical. Lock it with a quality U-lock (bike theft is common on Florida campuses) and register it with FAUPD for free.",
          price_range: "$150–$350 for a reliable commuter bike",
          tips: ["Trek FX Series at Total Cycling in Boca Raton is the recommended choice for South Florida durability", "Register your bike with FAUPD — aids recovery if stolen", "Citibike does not currently operate in Boca Raton — own bike is needed"],
        },
        {
          option: "Palm Tran — Public Bus (Free with FAU ID)",
          description:
            "Palm Tran's routes connect FAU campus to Delray Beach, Deerfield Beach, and West Palm Beach. Free with your FAU student ID. Slower than driving but reliable and completely free — ideal for regular trips to Delray Beach or Deerfield Beach when you don't need the flexibility of rideshare.",
          price_range: "Free with FAU student ID",
          tips: ["Download the Palm Tran Connection app to track buses in real time", "Route 1 (US-1) runs every 30 minutes — check timing before heading to the stop", "FAU Transportation Services at the Student Union has all schedules"],
        },
        {
          option: "Uber / Lyft",
          description:
            "Rideshare is the most flexible transport option — affordable for short trips and essential for nights out in Delray Beach, trips to Fort Lauderdale, or airport transfers. Both are active throughout Boca Raton and South Florida.",
          price_range: "$8–$20 for most local trips",
          tips: ["Compare Uber and Lyft — prices vary significantly by time of day", "Fort Lauderdale airport (FLL) is 30 minutes away — about $35–$45 by rideshare", "Miami International (MIA) is 1 hour — about $60–$75"],
        },
      ],
      public_transport_note:
        "Tri-Rail commuter rail has a Boca Raton station 2 miles from FAU campus — connects directly to Miami and Fort Lauderdale for day trips and airport runs.",
    },
    healthcare: {
      title: "Healthcare & Wellbeing",
      intro:
        "FAU offers accessible, affordable healthcare for all enrolled international students — here's what Valentina needs to know.",
      insurance_note:
        "All enrolled international students at FAU are required to maintain health insurance as a condition of their F-1 status. FAU's Student Health Insurance Plan is available during enrollment — international students should enroll in the first week and keep their insurance card easily accessible.",
      items: [
        {
          name: "FAU Student Health Services",
          url: "https://www.fau.edu/studenthealth",
          type: "Campus health clinic",
          location: "Student Services Building, FAU Boca Raton campus",
          description:
            "FAU Student Health Services provides primary care, urgent care, mental health counseling, lab work, and prescription services. Appointments are free or very low-cost with student insurance. As an international student, this is your first call for any non-emergency health concern — the staff are experienced with international students and Spanish-speaking providers are available.",
          specialties: ["Primary care", "Urgent care", "Mental health counseling", "Women's health", "Travel medicine"],
          languages: ["English", "Spanish"],
          tip: "Book an initial enrollment appointment in your first week — this establishes your patient record and makes all future appointments significantly faster.",
        },
        {
          name: "FAU Counseling & Psychological Services (CAPS)",
          url: "https://www.fau.edu/caps",
          type: "Mental health counseling",
          location: "FAU Student Services Building",
          description:
            "Adjusting to international student life — new country, new culture, far from family — is genuinely challenging. FAU's CAPS provides free, confidential counseling for all enrolled students. Spanish-speaking counselors are available. Seeking support is normal and smart — many of the most successful international students at FAU use CAPS regularly in their first year.",
          specialties: ["Adjustment counseling", "Anxiety & stress", "Cultural transition", "Group therapy for international students"],
          languages: ["English", "Spanish"],
          tip: "CAPS offers a free 30-minute initial consultation — no commitment required. Book it in your first month, especially if you're finding the cultural transition harder than expected.",
        },
        {
          name: "Boca Raton Regional Hospital",
          url: "https://www.brrh.com",
          type: "Regional hospital",
          location: "800 Meadows Rd, Boca Raton (10 min from campus)",
          description:
            "The closest major hospital to FAU's campus. Level II trauma center — for any serious medical emergency. Spanish-speaking physicians and patient coordinators are available. Always call 911 first in a genuine emergency.",
          specialties: ["Emergency care", "Urgent care", "Primary care", "Specialist referrals"],
          languages: ["English", "Spanish"],
          tip: "For non-emergencies, always call FAU Student Health first before going to the hospital — it's faster, cheaper, and the right first step for 90% of health issues.",
        },
      ],
    },
    social_life: {
      title: "Social Life & Student Community",
      intro:
        "South Florida has one of the largest Colombian and Latin American communities in the US — Valentina will find familiar culture, food, and faces immediately.",
      language_tip:
        "English will improve dramatically in the first semester — push yourself to use it in class, in study groups, and with American students. Spanish is everywhere in South Florida, which is comforting, but the faster your English develops, the more opportunities open up in business, networking, and post-graduation careers.",
      expat_community:
        "South Florida is home to over 100,000 Colombian nationals — one of the largest Colombian communities in the United States, concentrated in Miami-Dade, Broward, and Palm Beach Counties. The FAU Colombian Students Association is active on campus, and Valentina will find Colombians in her classes, her neighborhood, and throughout FAU from day one.",
      items: [
        {
          name: "FAU Colombian Students Association",
          url: "https://fauengage.fau.edu",
          type: "Student organization",
          description:
            "FAU's Colombian Students Association organizes cultural events, welcome programs, and community gatherings for Colombian students throughout the year. This is Valentina's most direct path to immediate community and friendship from day one. Message the association through FAU Engage before arriving — they typically organize welcome dinners for new Colombian students at the start of each semester.",
          tip: "Reach out to the CSA leadership on Instagram before your first week — they can connect you with current Colombian students who can answer questions and show you around.",
        },
        {
          name: "FAU Latin American Student Association (LASA)",
          url: "https://fauengage.fau.edu",
          type: "Student organization",
          description:
            "LASA is one of the largest student organizations at FAU — representing students from every Latin American country. Regular social events, cultural celebrations, and a strong academic peer support network. An immediate social home for any Latin American student arriving at FAU.",
          tip: "Attend LASA's welcome fair in the first week of semester — every Latin American student organization is represented and it's the single best way to build a broad social network immediately.",
        },
        {
          name: "FAU International Student Services — Social Programs",
          url: "https://www.fau.edu/international",
          type: "University support office",
          description:
            "Beyond administrative F-1 support, FAU ISS runs monthly social events for international students — cultural showcases, food fairs, and peer mentoring programs. The ISS peer mentor program pairs newly arrived international students with experienced international upperclassmen. Request a Spanish-speaking Colombian or Latin American mentor in your first week.",
          tip: "Request a peer mentor through ISS before your first week — an upperclassman who has already navigated everything you're about to face is the most underused resource at FAU.",
        },
        {
          name: "Delray Beach Atlantic Avenue — Social Hub",
          url: "https://www.google.com/maps/search/Atlantic+Avenue+Delray+Beach",
          type: "Local social scene",
          description:
            "Atlantic Avenue in Delray Beach (15 minutes from FAU) is the social center of gravity for FAU students — outdoor restaurants, bars, art galleries, and events every weekend. A great place to explore South Florida's social scene, make friends outside of class, and experience what makes this part of Florida genuinely special.",
          tip: "First Friday Art Walk on Atlantic Avenue is a monthly free event — a great, low-pressure way to explore Delray Beach and meet people in a fun social setting.",
        },
      ],
    },
    practical: {
      title: "Practical Setup — First Two Weeks",
      intro:
        "Arriving as an F-1 international student has a specific sequence of steps — complete these in order and everything else becomes straightforward.",
      items: [
        {
          category: "F-1 Visa & SEVIS Check-in",
          title: "Check in with FAU International Student Services on day one",
          description:
            "Your I-20 is the most important document in the US — keep it with your passport at all times. Within 10 days of arriving at FAU, you must check in with International Student Services (ISS) to validate your SEVIS record. Failure to check in jeopardizes your visa status. ISS is located in the Student Services Building on the Boca Raton campus.",
          tips: [
            "Bring your passport, visa stamp, I-20, and proof of FAU enrollment to the ISS check-in",
            "Never travel outside the US without confirming your I-20 is valid for re-entry",
            "Never work off-campus without CPT or OPT authorization from ISS — it is a federal visa violation",
            "Save the ISS phone number in your phone before arriving: 1-561-297-3049",
          ],
          url: "https://www.fau.edu/international",
        },
        {
          category: "Banking",
          title: "Open your US bank account in week one",
          description:
            "Without a US bank account, you cannot pay rent, use Zelle or Venmo, or build credit. Chase and Bank of America near FAU both open accounts for F-1 students with passport, I-20, and enrollment letter. Set up Wise before you leave Colombia to transfer money from your Colombian account at real exchange rates.",
          tips: [
            "Chase Bank on Glades Rd (near campus) is the most convenient location",
            "Open a Wise account before leaving Colombia — dramatically better rates than Colombian bank wire transfers",
            "Start a secured credit card (Capital One) immediately — your future US credit score starts today",
          ],
          url: "https://www.chase.com",
        },
        {
          category: "Social Security Number",
          title: "Apply for your SSN (if eligible)",
          description:
            "F-1 students may be eligible for a Social Security Number under certain conditions — confirm with FAU ISS before applying. You will need a SSN for full US banking access, apartment leases, and eventually filing US taxes. The process takes 2–4 weeks after applying at the Social Security Administration.",
          tips: [
            "Get an eligibility letter from FAU ISS before going to the SSA",
            "Nearest SSA office: 7301 W Palmetto Park Rd, Boca Raton",
            "Bring passport, visa, I-20, and the ISS eligibility letter",
          ],
          url: "https://www.ssa.gov",
        },
        {
          category: "Phone Plan",
          title: "Get a US SIM in week one",
          description:
            "A US phone number is required for apartment applications, campus communication, rideshare apps, and everyday life. T-Mobile's student plan is the best value in South Florida — unlimited data, strong coverage in Boca Raton, and free international calling to Colombia included.",
          tips: [
            "T-Mobile Magenta student plan: $45/month — get it at T-Mobile Boca Town Center",
            "Keep your Colombian number active via WhatsApp on WiFi indefinitely",
            "Bring your passport and I-20 — no US credit history required for T-Mobile student accounts",
          ],
          url: "https://www.t-mobile.com/iphone-for-students",
        },
        {
          category: "Practical Apps",
          title: "Download these before you land",
          description:
            "A handful of apps make the first weeks dramatically easier. Download all of these before your flight so they're ready when you land.",
          tips: [
            "Uber & Lyft — getting from the airport and around Boca Raton",
            "Canvas — FAU's coursework portal (all assignments, grades, professor communications)",
            "Zelle / Venmo — splitting rent and everyday expenses",
            "Wise — sending money from Colombia at real exchange rates",
            "Waze — best navigation app for South Florida driving",
            "FAU Safe app — campus safety and emergency contacts",
          ],
          url: "https://www.fau.edu/it/services/apps",
        },
      ],
    },
    international: {
      title: "International Student Resources",
      intro:
        "FAU has strong support for international students — here's the full resource map for F-1 life in Boca Raton.",
      items: [
        {
          name: "FAU International Student Services (ISS)",
          url: "https://www.fau.edu/international",
          type: "Primary support office",
          location: "Student Services Building, FAU Boca Raton campus",
          description:
            "FAU ISS is the hub for all international student administrative needs — SEVIS check-in, I-20 renewals, OPT/CPT applications, travel signatures, and F-1 compliance guidance. Spanish-speaking advisors are available. For any F-1 question or concern, ISS is always the first call before taking any action that might affect your visa status.",
          contact: "1-561-297-3049 | iss@fau.edu",
          tip: "Save the ISS phone number before you land and call them first for ANY question about your F-1 status. Acting on bad advice or guesswork about visa rules has serious consequences.",
        },
        {
          name: "WES — World Education Services (Transcript Evaluation)",
          url: "https://www.wes.org",
          type: "Credential evaluation service",
          location: "Online",
          description:
            "If FAU requires a foreign transcript evaluation (common for graduate programs and some undergraduate transfer credits), WES is the most widely accepted NACES-approved evaluation service in the US. WES evaluates Colombian university transcripts and converts grades to the US GPA scale. The process takes 7–10 business days with the standard service and 3–5 with rush.",
          contact: "wes.org",
          tip: "Submit your WES evaluation request as soon as you know it's required — processing takes 2–4 weeks and FAU deadlines do not move for late submissions.",
        },
        {
          name: "TOEFL / IELTS Resources",
          url: "https://www.ets.org/toefl",
          type: "English proficiency test preparation",
          location: "Multiple test centers in Boca Raton and Fort Lauderdale",
          description:
            "If Valentina needs to maintain or improve English proficiency for academic requirements, FAU's English Language Institute offers comprehensive academic English courses. The nearest TOEFL testing center is at Florida Atlantic University itself. The nearest IELTS testing center is in Fort Lauderdale (30 min from campus).",
          contact: "FAU English Language Institute: 1-561-297-3000",
          tip: "If you need to take TOEFL or IELTS, register at least 4–6 weeks in advance — test slots in South Florida fill up quickly near semester start dates.",
        },
      ],
    },
    emergency_contacts: {
      title: "Emergency Contacts",
      intro:
        "Save these before you land — the first weeks in a new country are when you're most likely to need them.",
      items: [
        { category: "Emergency", name: "911 — All Emergencies", number: "911", note: "Police, fire, ambulance. Operators speak English and Spanish. Works from any US phone including international SIMs." },
        { category: "Campus Security", name: "FAU Police Department", number: "1-561-297-3500", note: "24/7 campus police non-emergency line. Safety escorts, incident reports, bike registration." },
        { category: "Student Health", name: "FAU Student Health Services", number: "1-561-297-3512", note: "Non-emergency medical, prescription refills, nurse advice line." },
        { category: "F-1 Visa", name: "FAU International Student Services", number: "1-561-297-3049", note: "Any F-1 visa issue, SEVIS problem, or travel authorization question — call before taking action." },
        { category: "Mental Health", name: "FAU CAPS (Counseling Services)", number: "1-561-297-3540", note: "Free confidential counseling for all FAU students — adjusting to international student life is hard. Seeking support is smart." },
        { category: "Consulate", name: "Colombian Consulate Miami", number: "1-786-268-1788", note: "80 SW 8th St, Suite 2600, Miami. Passport renewal, emergency travel documents, and consular services for Colombian nationals." },
        { category: "Hospital", name: "Boca Raton Regional Hospital", number: "1-561-955-7100", note: "800 Meadows Rd, Boca Raton — nearest Level II trauma center to FAU campus." },
      ],
    },
  },
};

export const generalStudentDemoDocumentV2 = {
  schema_version: 2,
  meta: {
    athlete_name: "Valentina Morales",
    destination: "Boca Raton, FL, United States",
    club: "Florida Atlantic University",
    club_logo_url: "/Florida_Atlantic_Owls_logo.svg.png",
    club_primary_color: "#003087",
    generated_summary:
      "Boca Raton is one of Florida's most livable college cities — a sun-drenched coastal town with a warm Latin American community, excellent food, and easy access to Miami and Fort Lauderdale. Florida Atlantic University's International Business program is growing fast, and the city's blend of affordable neighborhoods, strong Colombian diaspora, and year-round beach lifestyle makes it an exceptional landing spot for an incoming student from Medellín.",
    welcome_letter:
      "Dear Valentina, welcome to Florida Atlantic University — and welcome to Boca Raton. Moving from Medellín to South Florida is a significant leap, and we want your first weeks here to feel organized and exciting, not stressful. This guide was built specifically around your situation: opening your first US bank account, finding an apartment near campus, connecting with the Colombian and Latin community at FAU, navigating F-1 life, and discovering what makes Boca Raton genuinely one of the best places in the US to be a young international student. You're going to love it here — this guide is just to make sure you arrive ready for all of it.",
  },
  university_notes: null,
  university_links: null,
  sections: {
    city_essentials: {
      title: "Your New City",
      restaurants: [
        {
          name: "Casablanca Colombian Restaurant",
          cuisine: "Colombian",
          location: "Boca Raton / Deerfield Beach area",
          why: "Bandeja paisa, sancocho, and empanadas — a genuine taste of Medellín minutes from campus. Ask FAU's Colombian student community for the current go-to spot.",
        },
        {
          name: "Bolay",
          cuisine: "Performance bowl restaurant",
          location: "Multiple locations in Boca Raton",
          why: "Fast, clean grain bowls under $13 — brown rice, lean protein, roasted vegetables. FAU's most popular weekday lunch between classes.",
        },
        {
          name: "El Camino",
          cuisine: "Modern Mexican / Latin",
          location: "Atlantic Ave, Delray Beach (15 min)",
          why: "Best social dinner spot near campus — excellent tacos, guacamole, and a vibrant Atlantic Avenue atmosphere on weekends.",
        },
        {
          name: "Trader Joe's",
          cuisine: "Grocery / Prepared Foods",
          location: "Boca Raton",
          why: "Best value healthy groceries in the area — exceptional prepared meals under $6, perfect for a student budget and a busy class schedule.",
        },
      ],
      places_to_visit: [
        {
          name: "Red Reef Park Beach",
          type: "beach",
          description:
            "A calm Atlantic beach 10 minutes from FAU's campus. Free on weekdays. Perfect for decompressing after exams, open-water swimming, or running along the shore.",
        },
        {
          name: "Mizner Park",
          type: "cultural / social",
          description:
            "Boca Raton's main outdoor dining and arts promenade — restaurants, galleries, and a free amphitheater. Great for Sunday walks, coffee meetings, and exploring the city.",
        },
        {
          name: "Atlantic Avenue, Delray Beach",
          type: "social scene",
          description:
            "South Florida's best small-city social strip — outdoor restaurants, bars, and weekend events 15 minutes from campus. The most popular off-campus destination for FAU students.",
        },
      ],
      transportation: {
        intro:
          "Boca Raton is car-friendly but the FAU campus is very bikeable. A bike plus rideshare covers most daily needs without owning a car in year one.",
        options: [
          "Bike: Campus is flat and compact — a $150–$200 used bike from Facebook Marketplace covers 90% of daily needs on and near campus.",
          "Palm Tran Bus (free with FAU ID): Routes connect FAU to Delray Beach and Deerfield Beach. Download the Palm Tran Connection app for real-time tracking.",
          "Uber / Lyft: $8–$15 to most Boca destinations. Fort Lauderdale airport (FLL) is 30 min / ~$40 by rideshare.",
          "Tri-Rail: Commuter rail with a Boca Raton station 2 miles from campus — connects directly to Miami and Fort Lauderdale for day trips.",
        ],
      },
      housing: [
        { option: "Shared 2BR near campus", area: "Glades Rd corridor, Boca Raton", price_range: "$700–$950/mo per person", why: "Most popular first-year option — roommate-share with another FAU international student keeps costs low and gives you a built-in social connection." },
        { option: "1BR apartment near campus", area: "NW 20th St, Boca Raton", price_range: "$1,100–$1,600/mo", why: "Full independence near FAU — most landlords accept I-20 and enrollment letters in lieu of US credit history." },
        { option: "Deerfield Beach 1BR", area: "Deerfield Beach (20 min north)", price_range: "$950–$1,350/mo", why: "Most affordable quality option in the area with a strong Colombian community; requires a car or consistent rideshare." },
      ],
      healthcare: [
        { name: "FAU Student Health Services", type: "Campus clinic", location: "Building 98, FAU campus", note: "Covered by student health fees — book your intake appointment in week one to establish your patient record and get faster access to all future appointments." },
        { name: "FAU CAPS (Counseling & Psychological Services)", type: "Mental health", location: "Student Services Building", note: "Free, confidential counseling for all enrolled students. Spanish-speaking counselors available — the first semester away from home is genuinely hard." },
        { name: "CareNow Urgent Care", type: "Urgent care", location: "Glades Rd, Boca Raton (5 min from FAU)", note: "Walk-in urgent care for non-emergency illness — faster and cheaper than the ER for things like infections, sprains, or respiratory issues." },
      ],
      social: [
        { name: "FAU Colombian Students Association", type: "student org", description: "Organizes welcome programs and cultural events every semester — message them on Instagram before you arrive and you'll have a community waiting when you land." },
        { name: "Atlantic Avenue, Delray Beach", type: "social scene", description: "South Florida's best small-city social strip, 15 minutes from campus — outdoor dining, events every weekend, and the most popular off-campus destination for FAU students." },
        { name: "FAU International Student Services — Social Programs", type: "resource", description: "Monthly social events, peer mentoring, and cultural showcases for international students — request a Spanish-speaking mentor in your first week." },
      ],
    },
    your_university: {
      title: "Your University",
      campus_spots: [
        {
          name: "S.E. Wimberly Library",
          type: "library",
          description:
            "Open until midnight on weekdays. Private study rooms bookable online — essential during finals. The ground floor cafe is a popular spot for study groups and collaborative work.",
        },
        {
          name: "FAU Student Recreation Center",
          type: "gym",
          description:
            "Full fitness facility — weight rooms, group classes, a pool, and basketball courts. Free with your student ID. Open daily 6am–11pm. Excellent for stress relief and staying active between classes.",
        },
        {
          name: "FAU Student Health Services",
          type: "health-center",
          description:
            "Located in Building 98. Primary care, urgent care, mental health counseling, and lab work. Your student health fee covers most visits. First stop for any health concern — Spanish-speaking providers available.",
        },
        {
          name: "Student Union",
          type: "hub",
          description:
            "The central hub of campus life — dining hall, Starbucks, student organization offices, and the Career Center. The place to go between classes, pick up event flyers, and find FAU's hundreds of student clubs.",
        },
      ],
      food_nearby: [
        { name: "FAU Dining Hall (The Market)", location: "Student Union", note: "Open 7am–10pm. Included in most meal plans. Wide variety including international and vegetarian options." },
        { name: "Starbucks on campus", location: "Student Union", note: "Quick breakfast between morning classes. Most common meeting spot for study groups." },
        { name: "Pei Wei Asian Kitchen", location: "Glades Rd, 1.5 miles from FAU", note: "Under $15 for a full meal — fast, filling, and popular with FAU students." },
        { name: "Publix Supermarket", location: "Yamato Rd, 2 miles from FAU", note: "Best everyday grocery store in the area. Deli counter for quick ready-made meals." },
      ],
      student_life: [
        {
          name: "FAU Colombian Students Association",
          type: "club",
          description:
            "FAU's most active Latin student group for Colombian students — cultural events, welcome programs, and community gatherings every semester. Message the CSA on Instagram before arriving to connect with current Colombian students.",
        },
        {
          name: "FAU Latin American Student Association (LASA)",
          type: "organization",
          description:
            "One of FAU's largest student organizations, representing students from every Latin American country. Regular social events, academic peer support, and cultural celebrations. Attend LASA's welcome fair in the first week.",
        },
        {
          name: "FAU International Student Services — Peer Mentor Program",
          type: "resource",
          description:
            "ISS pairs newly arrived international students with experienced international upperclassmen. Request a Spanish-speaking Colombian or Latin American mentor in your first week — the most underused resource at FAU for incoming international students.",
        },
      ],
    },
    your_paperwork: {
      title: "What You Need to Do",
      eligibility: null,
      athletic_forms: null,
      health_insurance: {
        description: "FAU international students are automatically enrolled in the FAU Student Health Insurance Plan — confirm your enrollment and review your coverage at studentinsurance.fau.edu before your first semester starts.",
        deadline: "Before semester start",
        url: "https://www.fau.edu/studenthealth/insurance/",
      },
      financial_aid: null,
      international_academic: {
        intro:
          "As an F-1 international student from Colombia, you need to complete several administrative steps before and right after arriving. Start these as early as possible — some processes take 4–8 weeks.",
        pre_arrival_docs: [
          "Valid Colombian passport (at least 6 months validity beyond your program end date)",
          "F-1 Student Visa — obtained from the US Embassy/Consulate in Bogotá",
          "Form I-20 — issued by FAU International Student Services. Do not travel without this.",
          "SEVIS fee payment receipt (Form I-901) — pay at fmjfee.com before your visa interview. Cost: $350.",
          "FAU acceptance letter",
          "Proof of financial support (bank statements showing $25,000+ for the academic year)",
          "Health insurance documentation — FAU international students are automatically enrolled in the FAU student health insurance plan",
        ],
        required_vaccines: [
          "MMR (Measles, Mumps, Rubella) — 2 doses required. Get proof of vaccination from your doctor in Colombia before leaving.",
          "Meningococcal vaccine — required for all students living in residence halls. Can be obtained at FAU Student Health Services on arrival.",
          "COVID-19 vaccination — recommended. Check fau.edu/health for the latest policy.",
          "Tuberculosis (TB) screening — international students from Colombia are required to complete a TB test within 30 days of arrival. FAU Student Health can administer this ($25).",
        ],
        vaccines_url: "https://www.fau.edu/studenthealth/immunization/",
      },
      post_arrival: {
        intro:
          "These are the most important things to take care of in your first 30 days. Do them in order — some require others to be complete first.",
        i94_check: {
          description: "Within your first 3 days in the US, go to i94.cbp.dhs.gov and confirm your arrival record shows 'D/S' (Duration of Status) — if the date or status looks wrong, call FAU International Student Services before doing anything else.",
          url: "https://i94.cbp.dhs.gov",
        },
        ssa_office_url: "https://www.google.com/maps/search/Social+Security+Administration+Boca+Raton+FL",
        social_security: [
          {
            step: 1,
            title: "Check in with FAU International Student Services on day one",
            description:
              "Within 10 days of arriving at FAU, you must check in with ISS (Building 96, Room 204) to validate your SEVIS record. Bring your passport, F-1 visa, I-20, and proof of FAU enrollment. Failing to check in jeopardizes your visa status.",
          },
          {
            step: 2,
            title: "Wait 10 days before applying for your SSN",
            description:
              "The Social Security Administration requires your entry to be recorded in the SEVIS system first. After 10 business days, gather: passport with F-1 visa, I-94 arrival record (i94.cbp.dhs.gov), I-20, and an ISS enrollment confirmation letter.",
          },
          {
            step: 3,
            title: "Visit the Boca Raton Social Security Office",
            description:
              "Located at 500 NW Spanish River Blvd, Suite 21, Boca Raton (Mon–Fri 9am–4pm). No appointment needed for first-time applications. Bring all original documents — no photocopies. Your card arrives by mail in 2–4 weeks.",
          },
        ],
        bank_account: [
          {
            step: 1,
            title: "Open a student checking account at a major US bank",
            description:
              "Most large national banks — such as Chase, Bank of America, and Wells Fargo — offer student checking accounts with no monthly fees and are experienced with international student account openings. You do NOT need an SSN — your passport, I-20, and FAU enrollment letter are sufficient. Look for a branch near campus and call ahead to confirm they process international student accounts.",
          },
          {
            step: 2,
            title: "Set up Wise before leaving Colombia",
            description:
              "Wise (wise.com) lets you send money from Colombian pesos to your US Chase account at the real exchange rate with minimal fees (~0.5%). Far better than wire transfers through Colombian banks. Set it up before your flight so it's ready when you land.",
          },
          {
            step: 3,
            title: "Apply for a secured credit card to start building US credit history",
            description:
              "Without US credit history you cannot rent independently in future years. A Capital One Platinum Secured Card requires a $200–$500 deposit as collateral. Use it for groceries and pay it off every month. After 12 months you'll have a real US credit score.",
          },
        ],
        itin: {
          description: "If you cannot yet get an SSN, apply for an ITIN (IRS Form W-7) through FAU's international student office — you'll need it to file US taxes and open certain bank accounts while waiting for SSN eligibility.",
          url: "https://www.irs.gov/individuals/individual-taxpayer-identification-number",
        },
        us_taxes: {
          description: "Every F-1 student must file Form 8843 with the IRS each spring even with zero US income; if your scholarship or stipend generates US income, you'll receive a 1042-S and must also file Form 1040-NR — use Sprintax, which is built specifically for international students.",
          url: "https://www.sprintax.com",
        },
        opt_cpt: {
          text: "OPT lets you work in the US in your field for up to 12 months after graduation (36 months for STEM). CPT lets you work during your studies through an approved internship. Both require authorization from FAU International Student Services — apply at least 90 days before you want to start. Unauthorized work is a federal visa violation.",
          url: "https://www.fau.edu/international/current-students/opt-cpt/",
        },
        cv_tips: [
          "US resumes are 1 page for undergraduates — remove photos, date of birth, and marital status.",
          "Your bilingual Spanish/English skills and international background are genuine differentiators for US employers — highlight them.",
          "Use your .edu email on your resume — it signals current enrollment.",
        ],
        resume_tools_url: "https://www.canva.com/resumes/",
      },
    },
  },
};
