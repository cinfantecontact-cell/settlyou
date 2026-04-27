import { collegeDemoDocumentV2 } from "@/app/report/sample/collegeDemoData";

// ── FAU ──────────────────────────────────────────────────────────────────────
// Reuse the existing V2 demo doc; override color + add sample institution notes.
const fauDemoDoc = {
  ...collegeDemoDocumentV2,
  meta: {
    ...collegeDemoDocumentV2.meta,
    club_primary_color: "#003366",
    club_logo_url: "/Florida_Atlantic_Owls_logo.svg.png",
  },
  university_notes:
    "Welcome to the FAU Owls family. Before you arrive, make sure you've completed your SEVIS check-in with the International Student Office (Building 96). Your compliance forms and pre-participation physical must be on file with Sports Medicine before your first team practice. If you have any questions, reach out to your academic advisor — they're expecting you.",
  university_links: [
    { label: "FAU Athlete Portal", url: "https://fausports.com" },
    { label: "International Student Services", url: "https://www.fau.edu/international" },
    { label: "NCAA Eligibility Center", url: "https://web3.ncaa.org/ecwr3/" },
  ],
  university_documents: [
    {
      id: "fau-medical",
      name: "Pre-Participation Physical Form",
      description: "Must be submitted to FAU Sports Medicine before your first practice.",
      url: "#",
    },
    {
      id: "fau-compliance",
      name: "Athletic Compliance & Drug Testing Consent",
      description: "Sign and return to the FAU Athletics Compliance Office.",
      url: "#",
    },
  ],
};

// ── Stanford ─────────────────────────────────────────────────────────────────
const stanfordDemoDoc = {
  schema_version: 2,
  meta: {
    athlete_name: "Sofia Martinez",
    destination: "Stanford, CA, United States",
    club: "Stanford University",
    club_logo_url: "/stanford-logo.png",
    club_primary_color: "#8C1515",
    generated_summary:
      "Stanford's campus is one of the most stunning in the world — 8,000 acres of California sunshine, world-class athletic facilities, and a Latin American community that will make Sofia feel at home immediately. The Bay Area's year-round mild climate and proximity to San Francisco gives student-athletes a unique mix of elite competition and one of the best cities in the world on their doorstep.",
    welcome_letter:
      "Sofia, welcome to Stanford University. Earning a Division I soccer scholarship from Bogotá is an extraordinary achievement, and this guide is here to make sure your first weeks in Palo Alto feel organized and confident. The Bay Area has a growing Colombian and Latin American community — Spanish is easy to find, and the food culture is diverse and warm. Your first priority on Day 1 is checking in with the Bechtel International Center to validate your F-1 status. Everything else follows from there.",
  },
  university_notes:
    "Welcome to Stanford Athletics. Your compliance packet must be completed and returned to the Athletic Compliance Office (Arrillaga Family Sports Center, Room 120) before your first official training session. Please review the Stanford Cardinal Athletics Student-Athlete Handbook — it covers NIL policy, academic support, and the Cardinal Together orientation schedule. We're thrilled to have you on The Farm.",
  university_links: [
    { label: "Stanford Athlete Portal", url: "https://gostanford.com" },
    { label: "Bechtel International Center", url: "https://bechtel.stanford.edu" },
    { label: "Cardinal Together Orientation", url: "https://cardinal-together.stanford.edu" },
  ],
  university_documents: [
    {
      id: "stanford-physical",
      name: "Pre-Participation Physical Exam Form",
      description: "Must be submitted to Stanford Sports Medicine before your first official practice.",
      url: "#",
    },
    {
      id: "stanford-compliance",
      name: "NCAA Compliance & Amateurism Declaration",
      description: "Complete and return to Athletic Compliance (AFSC Room 120).",
      url: "#",
    },
    {
      id: "stanford-nil",
      name: "Stanford NIL Registration",
      description: "Register with Stanford's Opendorse platform before any NIL activity.",
      url: "#",
    },
  ],
  sections: {
    first_week: {
      title: "Your First 7 Days",
      intro: "Stanford Orientation week is structured — follow this checklist and you'll arrive confident and ready.",
      days: [
        {
          label: "Day 1",
          tasks: [
            "Check in with the Bechtel International Center (Main Quad, Building 590) — bring your passport, I-20, and F-1 visa. Your SEVIS record gets validated here.",
            "Walk The Oval and Main Quad after check-in — the most iconic spot on campus. Takes 20 minutes and gives you a real sense of where you are.",
          ],
        },
        {
          label: "Days 2–3",
          tasks: [
            "[ATHLETE] Report to Stanford Sports Medicine (Arrillaga Family Sports Center) for your pre-participation physical — no clearance means no practice.",
            "Open a student checking account — Chase and Bank of America both have branches near campus. Passport + I-20 is enough, no SSN required.",
            "[ATHLETE] Attend Cardinal Together Orientation — this is how you meet teammates and get your access credentials for the Arrillaga Sports Center.",
          ],
        },
        {
          label: "Days 4–7",
          tasks: [
            "[ATHLETE] Complete your NCAA compliance packet at the Athletic Compliance Office (AFSC, Room 120) — emergency contacts, drug testing consent, travel forms.",
            "Get your student ID (Cardinal Card) at the ID Office in Old Union — you need it for everything from the gym to dining halls.",
            "Walk down to University Avenue in Palo Alto — coffee shops, restaurants, and a feel for what life off campus looks like.",
            "[ATHLETE] Book a free nutrition consultation with the Stanford Sports Dietitian — available to all scholarship athletes.",
          ],
        },
      ],
    },
    city_essentials: {
      title: "Your New City",
      restaurants: [
        {
          name: "Zareen's",
          cuisine: "Pakistani / Indian",
          location: "219 Castro St, Mountain View",
          why: "Exceptional halal food 10 minutes from campus. The butter chicken and naan are extraordinary — popular with international students across Stanford.",
        },
        {
          name: "Oren's Hummus",
          cuisine: "Israeli / Mediterranean",
          location: "261 University Ave, Palo Alto",
          why: "High-quality protein, Mediterranean staples, and excellent for an athlete's nutrition. Walking distance from campus.",
        },
        {
          name: "Coupa Café",
          cuisine: "Venezuelan / Coffee",
          location: "538 Ramona St, Palo Alto",
          why: "A taste of home — Venezuelan arepas, cachapas, and fresh café con leche. One of the few Venezuelan-owned cafés in the Bay Area.",
        },
        {
          name: "Tacolicious",
          cuisine: "Mexican",
          location: "University Ave, Palo Alto",
          why: "Affordable, filling, great for a post-training meal with teammates. Popular with the Stanford athletic community.",
        },
      ],
      places_to_visit: [
        {
          name: "The Dish",
          type: "outdoor / trail",
          description:
            "A 3.8-mile loop trail through the hills above campus with views of the Bay. One of the most popular spots for Stanford athletes on active recovery days — open sunrise to sunset, free entry.",
        },
        {
          name: "Rodin Sculpture Garden",
          type: "cultural",
          description:
            "Free outdoor sculpture garden on campus featuring 20 original Rodin bronzes. A beautiful place for a quiet walk or to reset between training sessions.",
        },
        {
          name: "San Francisco",
          type: "city / weekend",
          description:
            "30 minutes by Caltrain from Palo Alto. The Castro, the Mission District, Golden Gate Park, and some of the best food in the world. A must for any first year at Stanford.",
        },
        {
          name: "Shoreline Park, Mountain View",
          type: "nature",
          description:
            "Flat trail system along the Bay with a lake, wind sports, and open sky. Perfect for bike rides and open-air decompression on rest days.",
        },
      ],
      transportation: {
        intro:
          "Stanford's campus is built for cycling. Most student-athletes bike everywhere on campus and use Caltrain for Bay Area access.",
        options: [
          "Bike: Absolutely essential — a $150–$250 used bike covers 90% of daily movement on campus. Campus is completely flat.",
          "Caltrain: $3–$7 to San Francisco and San Jose. The Palo Alto station is a 15-minute bike ride from campus.",
          "Marguerite Shuttle: Free Stanford bus service connecting campus to the train station, Palo Alto downtown, and nearby neighborhoods.",
          "Uber / Lyft: $12–$20 to most Palo Alto or Mountain View destinations. Useful for off-hours errands.",
        ],
      },
      housing: [
        {
          option: "Stanford on-campus dorms (freshman requirement)",
          area: "Main campus, Stanford",
          price_range: "Included in financial aid for scholarship athletes",
          why: "Most freshmen live on campus — especially student-athletes. Close to training facilities, meals included, and the fastest way to build friendships.",
        },
        {
          option: "Shared house near campus",
          area: "College Terrace, Palo Alto",
          price_range: "$1,200–$1,600/mo per person",
          why: "The closest neighborhood to campus — a 10-minute bike ride. Quieter than downtown Palo Alto but walkable to the Marguerite shuttle stops.",
        },
        {
          option: "East Palo Alto shared housing",
          area: "East Palo Alto",
          price_range: "$900–$1,300/mo per person",
          why: "The most affordable option near campus. 15 minutes by bike to the main campus. Diverse neighborhood with great Latin American food options.",
        },
      ],
    },
    your_university: {
      title: "Your University",
      campus_spots: [
        {
          name: "The Oval",
          type: "landmark",
          description:
            "Stanford's iconic front lawn — the heart of campus life. Bordered by palm trees and open to the Main Quad. The best orientation landmark to get your bearings on day one.",
        },
        {
          name: "Green Library",
          type: "library",
          description:
            "Cecil H. Green Library is Stanford's main research library. Open 24/7 during finals. Has private group study rooms you can reserve online — essential for student-athletes working around training schedules.",
        },
        {
          name: "Cantor Arts Center",
          type: "cultural",
          description:
            "Free admission museum on campus with over 38,000 works of art. A quiet space to explore on a rest day — also the entrance to the Rodin Sculpture Garden.",
        },
        {
          name: "Tresidder Memorial Union",
          type: "student union",
          description:
            "Stanford's student hub — food options, study spaces, student organization offices, and the ID card center. Your first stop on arrival to get your Cardinal Card.",
        },
      ],
      athletic_facilities: [
        {
          name: "Arrillaga Family Sports Center",
          description:
            "Stanford's central athletic complex — weight room, athletic training room, team meeting spaces, and sports medicine. Access is controlled for scholarship athletes. Your coach will walk you through the check-in process on arrival. Open daily for team training and individual use.",
        },
        {
          name: "Maloney Field at Laird Q. Cagan Stadium",
          description:
            "Stanford women's soccer home venue — a natural grass field with stadium seating. You'll train here daily. Equipment room and athletic training access are adjacent to the pitch.",
        },
        {
          name: "DeGuerre Pool",
          description:
            "Competition-level aquatic facility open to scholarship athletes for active recovery swimming. One of the best recovery tools available for high-load periods during the season.",
        },
      ],
      food_nearby: [
        {
          name: "Arrillaga Family Dining Commons",
          location: "Main campus",
          note: "The largest and most popular dining hall on campus. Scholarship athletes get priority meal access. Has a dedicated performance nutrition station.",
        },
        {
          name: "CoHo (Coffee House)",
          location: "Tresidder Union",
          note: "Stanford's beloved student café. Open late — ideal for study sessions after evening training.",
        },
        {
          name: "Coupa Café (campus location)",
          location: "Tresidder Union",
          note: "Venezuelan arepas and exceptional coffee on campus. One of the few places on campus where Sofia will find a taste of home.",
        },
        {
          name: "Whole Foods Market",
          location: "El Camino Real, Palo Alto",
          note: "15-minute bike ride from campus. Best for NSF-certified supplements, organic protein, and performance nutrition staples.",
        },
      ],
      student_life: [
        {
          name: "Stanford LASA (Latin American Student Association)",
          type: "club",
          description:
            "One of Stanford's most active cultural organizations. Monthly events, mentorship from upper-class Latin students, and a strong alumni network. A natural first connection for an incoming Colombian student-athlete.",
        },
        {
          name: "Bechtel International Center",
          type: "resource",
          description:
            "Your primary contact for all F-1 visa matters — OPT, CPT, SEVIS updates, travel signatures, and I-20 extensions. Check in within 48 hours of arriving on campus — it's required by federal law.",
        },
        {
          name: "Student Athlete Support Services (SASS)",
          type: "resource",
          description:
            "Stanford's academic support system for all scholarship athletes. Tutoring, study hall, academic advising, and eligibility monitoring. Use the tutoring services aggressively — Stanford's academics are demanding alongside Division I competition.",
        },
      ],
    },
    your_paperwork: {
      title: "What You Need to Do",
      eligibility: {
        intro:
          "As an NCAA Division I student-athlete at Stanford, your academic eligibility is monitored every semester. Falling out of compliance can cost you your scholarship and your spot on the roster.",
        steps: [
          {
            step: 1,
            title: "Submit transcripts to the NCAA Eligibility Center",
            description:
              "Go to eligibilitycenter.org and submit all high school and university transcripts from Colombia. Stanford's compliance office will guide you — contact them at athletics-compliance@stanford.edu before your first training session.",
            deadline: "Before your first official practice",
            url: "https://web3.ncaa.org/ecwr3/",
          },
          {
            step: 2,
            title: "Complete your Amateurism Certification",
            description:
              "Disclose any time you've been paid to play soccer — including youth contracts, academy fees, or tournament bonuses. Contact the Stanford Athletic Compliance Office to review your history. When in doubt, disclose.",
            deadline: null,
          },
          {
            step: 3,
            title: "Maintain full-time enrollment (12+ credit hours)",
            description:
              "NCAA D1 requires full-time enrollment to compete. Your academic advisor will help you build a schedule around training. Do not drop below 12 credits without notifying compliance first.",
            deadline: "Each semester",
          },
          {
            step: 4,
            title: "Maintain a minimum 2.0 GPA",
            description:
              "Stanford's academic support resources are excellent — use them. SASS provides tutoring and academic advising for all scholarship athletes. If you're struggling, tell your advisor in the first two weeks, not at midterms.",
            deadline: "Every semester",
          },
        ],
      },
      athletic_forms: [
        {
          title: "Pre-Participation Physical / Medical Clearance",
          description:
            "Submit your completed physical to Stanford Sports Medicine (Arrillaga Sports Center) before your first official practice. No clearance on file means no practice.",
          url: "https://gostanford.com",
        },
        {
          title: "NIL — Name, Image & Likeness",
          description:
            "Stanford uses the Opendorse platform for NIL disclosure. Register before signing any endorsement, social media deal, or personal appearance contract. All deals must be disclosed to Athletic Compliance.",
          url: "https://www.ncaa.org/sports/2021/6/3/student-athletes-name-image-likeness.aspx",
        },
        {
          title: "Drug Testing Consent & Emergency Contact Forms",
          description:
            "Sign the NCAA drug testing consent, emergency contact form, and travel consent form — all submitted to Athletic Compliance (AFSC Room 120) before the first team meeting.",
          url: null,
        },
      ],
      health_insurance: {
        description:
          "International students at Stanford are required to have health insurance and are automatically enrolled in Stanford's Cardinal Care plan. Confirm your enrollment at vaden.stanford.edu and check that your insurance card arrives before the semester starts.",
        deadline: "Before semester start",
        url: "https://vaden.stanford.edu/insurance-referral/student-health-insurance",
      },
      financial_aid: null,
      international_academic: {
        intro:
          "As an F-1 student from Colombia, you need to complete several steps before and right after arriving at Stanford. Start these early — some take 6–8 weeks.",
        transcript_evaluation: [
          {
            step: 1,
            title: "Order a transcript evaluation through WES",
            description:
              "The NCAA Eligibility Center requires your Colombian transcripts to be evaluated by a NACES-approved service. Use World Education Services (wes.org). Your school in Colombia must send transcripts directly to WES. Express service takes 7 business days and costs approximately $220.",
            url: "https://www.wes.org",
          },
          {
            step: 2,
            title: "Apostille your Colombian transcripts",
            description:
              "Colombian academic documents require an apostille stamp from the Ministerio de Relaciones Exteriores before they can be accepted as official by WES. Coordinate this with a trusted contact in Colombia before you leave — without the apostille, WES cannot process your documents.",
            url: null,
          },
          {
            step: 3,
            title: "Submit TOEFL/IELTS scores",
            description:
              "Stanford requires TOEFL of 100+ (iBT) or IELTS of 7.0+. Submit scores directly to Stanford (code 4704) and to the NCAA Eligibility Center. If you haven't tested yet, register at ets.org immediately.",
            url: "https://www.ets.org/toefl",
          },
        ],
        gpa_conversion:
          "Colombian grades use a 0–5.0 scale (5.0 being perfect). When WES evaluates your transcripts, they convert your grades to the US 4.0 scale. A Colombian grade of 4.5/5.0 typically converts to approximately 3.8/4.0 in the US system.",
        required_vaccines: [
          "MMR (Measles, Mumps, Rubella) — 2 doses required. Bring proof of vaccination from Colombia.",
          "Meningococcal vaccine — required for students in residence halls. Available at Vaden Health Center upon arrival.",
          "COVID-19 vaccination — check stanford.edu/health for current policy before arrival.",
          "TB screening — Stanford requires a TB test for international students within 30 days of arrival. Available at Vaden Health Center.",
        ],
        vaccines_url: "https://vaden.stanford.edu/immunization-requirements",
        pre_arrival_docs: [
          "Valid Colombian passport (at least 6 months validity beyond program end date)",
          "F-1 Student Visa — obtained from the US Embassy in Bogotá",
          "Form I-20 — issued by Stanford's Bechtel International Center. Do not travel without it.",
          "SEVIS fee payment receipt (Form I-901) — pay at fmjfee.com before your visa interview. Cost: $350.",
          "Stanford acceptance letter and athletic scholarship award letter",
          "Proof of financial support (bank statements for the academic year)",
          "Cardinal Care health insurance enrollment confirmation",
        ],
      },
      post_arrival: {
        intro:
          "Complete these in your first 30 days — some depend on others being done first.",
        i94_check: {
          description:
            "Within your first 3 days in the US, confirm your I-94 arrival record shows 'D/S' at i94.cbp.dhs.gov. If anything looks wrong, contact the Bechtel International Center immediately.",
          url: "https://i94.cbp.dhs.gov",
        },
        ssa_office_url: "https://www.google.com/maps/search/Social+Security+Administration+Palo+Alto+CA",
        social_security: [
          {
            step: 1,
            title: "Wait 10 days after arriving before applying",
            description:
              "The SSA requires your SEVIS record to show your entry before processing. This takes approximately 10 business days.",
          },
          {
            step: 2,
            title: "Gather your documents",
            description:
              "You'll need: passport with F-1 visa, I-94 record (printed from i94.cbp.dhs.gov), I-20, enrollment letter from Bechtel International Center, and proof of campus address.",
          },
          {
            step: 3,
            title: "Visit the Palo Alto Social Security Office",
            description:
              "Located at 425 Sherman Ave, Suite 100, Palo Alto, CA 94306. Monday–Friday 9am–4pm. No appointment needed for first-time applications. Bring all original documents.",
          },
        ],
        bank_account: [
          {
            step: 1,
            title: "Open a student checking account",
            description:
              "Chase and Bank of America both have branches near campus on El Camino Real. Open an account with your passport + I-20 — no SSN required. Look for a student checking account with no monthly fees.",
          },
          {
            step: 2,
            title: "Set up a Wise account for transfers from Colombia",
            description:
              "Wise (wise.com) lets you receive money from Colombia at near the real exchange rate with minimal fees. Link it to your US bank account once it's open.",
          },
          {
            step: 3,
            title: "Apply for a secured credit card",
            description:
              "A secured card (Chase Secured Visa or Discover it Secured) requires a $200–$500 deposit. Use it for groceries and pay it off every month — after 12 months your credit score is established.",
          },
        ],
        itin: {
          description:
            "If you can't yet get an SSN, apply for an ITIN (IRS Form W-7) through Bechtel International Center — you'll need it to file US taxes.",
          url: "https://www.irs.gov/individuals/individual-taxpayer-identification-number",
        },
        us_taxes: {
          description:
            "Every F-1 student must file Form 8843 each spring even with zero US income. Use Sprintax, which is built for international students, to file correctly.",
          url: "https://www.sprintax.com",
        },
        opt_cpt: {
          text: "OPT allows you to work in the US in your field for 12 months after graduation (36 months for STEM). CPT allows internship work during your studies. Both require Bechtel International Center authorization — apply at least 90 days in advance.",
          url: "https://bechtel.stanford.edu/students/work-authorization",
        },
        cv_tips: [
          "US resumes are 1 page for undergraduates — remove photos, date of birth, and marital status.",
          "List 'NCAA Division I Athlete, Stanford Soccer' prominently — US employers and grad schools deeply respect it.",
          "Use your stanford.edu email on every application and professional profile.",
        ],
        resume_tools_url: "https://www.canva.com/resumes/",
      },
    },
  },
};

// ── University of Miami (Admissions) ─────────────────────────────────────────
const miamiDemoDoc = {
  schema_version: 2,
  meta: {
    athlete_name: "Alex Chen",
    destination: "Coral Gables, FL, United States",
    club: "University of Miami",
    club_logo_url: null,
    club_primary_color: "#f47321",
    generated_summary:
      "Coral Gables is one of the most beautiful and livable cities in South Florida — a walkable, tree-lined community 20 minutes from Miami Beach, with outstanding food, great weather year-round, and a student culture that mixes ambition with Florida warmth. The University of Miami's Coral Gables campus is intimate, academically rigorous, and surrounded by everything South Florida has to offer.",
    welcome_letter:
      "Alex, welcome to the University of Miami. Moving from Chicago to Coral Gables is one of the best decisions you'll make — the weather, the energy, and the city will change your perspective on what a college experience can be. Miami is a city that rewards curiosity: the food is extraordinary, the culture is genuinely international, and the connections you'll build here will follow you for decades. Your first week has a few important steps — this guide is here to make sure none of them fall through the cracks.",
  },
  university_notes:
    "Welcome to the University of Miami. Please complete your CaneID account setup at caneid.miami.edu before arriving so you're ready to activate services on day one. Your academic advisor will reach out during orientation week — confirm that meeting. If you have any questions about housing, financial aid, or orientation, the Dean of Students Office (Ashe Building) is your first stop.",
  university_links: [
    { label: "Student Portal (CaneID)", url: "https://caneid.miami.edu" },
    { label: "UM Orientation", url: "https://orientation.miami.edu" },
    { label: "Financial Aid Office", url: "https://financialaid.miami.edu" },
  ],
  university_documents: [
    {
      id: "um-immunization",
      name: "Immunization Compliance Form",
      description: "Submit your immunization records to University Health Services before the first day of class.",
      url: "#",
    },
    {
      id: "um-housing",
      name: "Residence Hall Agreement",
      description: "Sign and return your housing contract to UM Housing & Residential Life.",
      url: "#",
    },
  ],
  sections: {
    first_week: {
      title: "Your First 7 Days",
      intro: "Orientation week at UM is dense — follow this checklist to stay on top of everything.",
      days: [
        {
          label: "Day 1",
          tasks: [
            "Pick up your Cane Card (student ID) at the Cane Card Office in the University Center — you need it for housing, dining, and campus access.",
            "After getting your card, walk to the Coral Gables Merrick Park for coffee and a first look at the neighborhood. You'll understand why everyone loves it.",
          ],
        },
        {
          label: "Days 2–3",
          tasks: [
            "Attend Ibis Orientation — UM's freshman orientation program. This is where you meet your advisor, your residential team, and make your first friends.",
            "Activate your CaneID at caneid.miami.edu and set up Blackboard (your course portal) before classes start.",
            "Set up your University Health Services patient account — submit your immunization records to avoid a hold on your account.",
          ],
        },
        {
          label: "Days 4–7",
          tasks: [
            "Walk Miracle Mile in Coral Gables — coffee shops, restaurants, and a feel for the city you'll be living in. The main drag is 10 minutes from campus.",
            "Explore the Student Activities Center — find 2 or 3 clubs or organizations you're interested in. The best students at UM are involved.",
            "Set up your Florida driver's license or state ID — schedule an appointment at the DHSMV Doral office, which is the closest location and least busy.",
          ],
        },
      ],
    },
    city_essentials: {
      title: "Your New City",
      restaurants: [
        {
          name: "Versailles Restaurant",
          cuisine: "Cuban",
          location: "SW 8th St (Calle Ocho), Miami",
          why: "The most iconic Cuban restaurant in the US. Cuban sandwich, ropa vieja, and café con leche. A UM tradition — every student goes at least once a month.",
        },
        {
          name: "La Palma Ristorante",
          cuisine: "Italian",
          location: "Miracle Mile, Coral Gables",
          why: "Walking distance from campus. Excellent pasta and a great spot for a nicer dinner with family visiting or after a big exam.",
        },
        {
          name: "Drinking Pig BBQ",
          cuisine: "American BBQ",
          location: "Miracle Mile, Coral Gables",
          why: "Affordable, filling, and popular with the UM student community. Great for group dinners after a long study session.",
        },
        {
          name: "The Wharf Miami",
          cuisine: "Food Market / Waterfront",
          location: "SW 3rd Ave, Miami",
          why: "Open-air waterfront market with 10+ food vendors and live music on weekends. One of the best group outing spots in Miami for students.",
        },
      ],
      places_to_visit: [
        {
          name: "Coconut Grove",
          type: "neighborhood",
          description:
            "Miami's oldest neighborhood — 10 minutes from campus. Bohemian energy, great coffee shops, waterfront parks, and the Coconut Grove Arts Festival. A must on weekends.",
        },
        {
          name: "South Beach",
          type: "beach",
          description:
            "20 minutes from campus — the Atlantic Ocean, Art Deco architecture, and one of the most famous beaches in the world. Go on a Tuesday morning for the real thing without the crowds.",
        },
        {
          name: "Pérez Art Museum Miami (PAMM)",
          type: "cultural",
          description:
            "World-class contemporary art museum on Biscayne Bay in downtown Miami. Free for students on select nights. The architecture and waterfront location alone are worth the visit.",
        },
        {
          name: "Wynwood Walls",
          type: "cultural / social",
          description:
            "Miami's open-air street art district — murals, galleries, food trucks, and nightlife. 25 minutes from campus. One of the most photographed neighborhoods in the US.",
        },
      ],
      transportation: {
        intro:
          "Coral Gables is walkable near campus, but getting around Miami requires more planning. Most UM students have a car by sophomore year.",
        options: [
          "Bike / walk: The UM campus and immediate Coral Gables area is very walkable. A bike covers anything within 2 miles quickly.",
          "Uber / Lyft: $10–$20 to most Miami neighborhoods. The most common mode for students without cars.",
          "Miami-Dade Transit: Bus routes connect Coral Gables to downtown Miami and Brickell. $2.25/ride, Metrocard available.",
          "Coral Gables Trolley: Free trolley service connecting the campus area to Miracle Mile and the Brickell Metrorail station.",
        ],
      },
      housing: [
        {
          option: "UM Residence Halls (freshman priority)",
          area: "On-campus, Coral Gables",
          price_range: "~$8,000–$12,000/year (included in financial aid packages)",
          why: "Living on campus in your first year is the fastest way to build friendships and stay connected to the UM community. Freshmen have priority — apply early.",
        },
        {
          option: "Shared apartment near Miracle Mile",
          area: "Coral Gables, near campus",
          price_range: "$900–$1,400/mo per person",
          why: "Popular for sophomore and junior students. Walking distance to campus, access to Coral Gables dining and nightlife.",
        },
        {
          option: "Brickell apartment share",
          area: "Brickell, Miami",
          price_range: "$1,200–$1,800/mo per person",
          why: "More urban, connected to downtown Miami. 20 minutes from campus by Metrorail. Popular with business and finance students.",
        },
      ],
      healthcare: [
        {
          name: "University Health Services",
          type: "Campus clinic",
          location: "Coral Gables campus",
          note: "Primary care, urgent care, mental health, and lab services for all enrolled students. Free with student health fee. First stop for any illness or prescription.",
        },
        {
          name: "UM Counseling Center",
          type: "Mental health",
          location: "Student Services Building",
          note: "Free confidential counseling for all UM students. Transitioning from Chicago to Miami is a genuine adjustment — use this resource early if needed.",
        },
        {
          name: "Baptist Hospital — Coral Gables",
          type: "Emergency / Hospital",
          location: "8900 N Kendall Dr, Miami",
          note: "Nearest major hospital. For serious injuries or emergencies only — always call UHS first for non-emergencies.",
        },
      ],
      social: [
        {
          name: "Student Activities Center",
          type: "hub",
          description: "UM's main student hub with 200+ registered organizations. Find your club, sport, or interest group in your first week — campus life at UM is built around involvement.",
        },
        {
          name: "Coconut Grove Farmers Market",
          type: "weekly event",
          description: "Saturday mornings at Peacock Park — local produce, food vendors, and a great social scene. 10 minutes from campus.",
        },
        {
          name: "South Beach on weekdays",
          type: "outdoors",
          description: "Tuesday or Wednesday morning at South Beach before 9am is one of the best experiences in Miami — quiet, beautiful, and 20 minutes from campus.",
        },
      ],
    },
    your_university: {
      title: "Your University",
      campus_spots: [
        {
          name: "Richter Library",
          type: "library",
          description:
            "UM's main academic library — open until 2am during finals. Private group study rooms bookable online. The most popular study destination for business and law students.",
        },
        {
          name: "Lowe Art Museum",
          type: "cultural",
          description:
            "Free admission with UM student ID. One of the best university art museums in Florida, with a rotating collection of contemporary and Latin American art.",
        },
        {
          name: "University Center",
          type: "student union",
          description:
            "The hub of student life at UM — Cane Card office, dining, student organization offices, and the campus bookstore. Your first stop on day one.",
        },
        {
          name: "Lake Osceola",
          type: "outdoor / social",
          description:
            "The beautiful lake at the heart of UM's campus — the most iconic outdoor gathering spot. Paddleboarding, walks around the water, and the best place to decompress between classes.",
        },
      ],
      athletic_facilities: [
        {
          name: "Herbert Wellness Center",
          description:
            "UM's main student recreation center — full gym, aquatic center, group fitness classes, and indoor courts. Open to all enrolled students with student ID. One of the best campus recreation facilities in the Southeast.",
        },
        {
          name: "Hard Rock Stadium (Hurricanes football)",
          description:
            "UM football plays at Hard Rock Stadium in Miami Gardens — student tickets are available through the CaneID portal. Attending a Hurricanes game is one of the quintessential UM experiences.",
        },
      ],
      food_nearby: [
        {
          name: "UM Food Court (UC Food Hall)",
          location: "University Center",
          note: "Main campus dining — various cuisines, open daily. Your meal plan is loaded to your Cane Card. Performance nutrition station available.",
        },
        {
          name: "Starbucks at the Library",
          location: "Richter Library, ground floor",
          note: "Open late during the semester. Popular between classes and during late-night study sessions.",
        },
        {
          name: "Miracle Mile restaurants",
          location: "Coral Gables, 10-min walk",
          note: "The best dining outside of campus — Italian, Cuban, American, and more. Walking distance from all main academic buildings.",
        },
        {
          name: "Whole Foods Market",
          location: "Dadeland, 10 min by car",
          note: "Best for weekly grocery shopping. Popular with students looking for healthy meal prep options.",
        },
      ],
      student_life: [
        {
          name: "Toppel Career Center",
          type: "resource",
          description:
            "UM's career services office — résumé reviews, interview prep, networking events, and recruiting partnerships with major firms in Miami and beyond. Business students should book a session in their first month.",
        },
        {
          name: "IBIS (Ibis Orientation)",
          type: "program",
          description:
            "UM's official freshman orientation — a week-long program connecting you with your class, your advisor, and the campus community. Mandatory for all incoming freshmen.",
        },
        {
          name: "Student Activities Board (SAB)",
          type: "organization",
          description:
            "UM's largest student programming organization. Concerts, movie nights, and annual events like Homecoming and Canes Week. Great way to meet people outside your major.",
        },
      ],
    },
    your_paperwork: {
      title: "What You Need to Do",
      eligibility: null,
      athletic_forms: null,
      health_insurance: {
        description:
          "UM offers a student health insurance plan through Aetna. Domestic students who have their own insurance can waive the plan at studentinsurance.miami.edu. Review your coverage options and confirm your insurance before the semester starts.",
        deadline: "Before semester start",
        url: "https://studentinsurance.miami.edu",
      },
      financial_aid: null,
      international_academic: null,
      post_arrival: {
        intro:
          "Complete these in your first 30 days to make sure your academic and administrative setup is complete.",
        i94_check: null,
        ssa_office_url: null,
        social_security: null,
        bank_account: [
          {
            step: 1,
            title: "Set up or transfer your US bank account",
            description:
              "If you're coming from Chicago, transfer or open a new account at a bank with branches in Miami — Chase and Bank of America both have locations near campus. Set up mobile banking before you arrive.",
          },
          {
            step: 2,
            title: "Get a credit card if you don't have one",
            description:
              "If you're a first-time cardholder, apply for a student credit card (Chase Freedom Student, Discover it Student) before arriving. Building credit during college makes the post-graduation rental and loan process much easier.",
          },
        ],
        itin: null,
        us_taxes: {
          description:
            "Domestic students with scholarship income may receive a 1098-T tax form from UM. Review it with a tax professional or use FreeTaxUSA — scholarship funds above tuition may be taxable.",
          url: "https://www.freetaxusa.com",
        },
        opt_cpt: null,
        cv_tips: [
          "US resumes are 1 page for undergraduates — no photos, no date of birth.",
          "Miami has a unique job market — banking, real estate, and international trade are all strong. UM's Latin American and Miami business connections are a real advantage.",
          "Use your miami.edu email and LinkedIn. Recruiters notice UM affiliations in Miami, New York, and internationally.",
        ],
        resume_tools_url: "https://toppel.miami.edu",
      },
    },
  },
};

// ── Registry ──────────────────────────────────────────────────────────────────
const DEMO_GUIDES = {
  fau: fauDemoDoc,
  stanford: stanfordDemoDoc,
  "miami-admissions": miamiDemoDoc,
};

export function getDemoGuide(slug) {
  return DEMO_GUIDES[slug] ?? null;
}
