export const domesticDemoDocumentV2 = {
  schema_version: 2,
  meta: {
    athlete_name: "Jake Thompson",
    destination: "East Lansing, MI, United States",
    club: "Michigan State University",
    club_logo_url: null,
    club_primary_color: "#18453b",
    generated_summary:
      "East Lansing is a classic Big Ten college town — energetic, walkable, and built around Michigan State's massive campus. Coming from Austin, Jake will notice the seasons immediately: real winters, stunning fall colors, and summers that feel like a reward. MSU is one of the best public universities in the Midwest and its campus has everything a student needs within a short walk.",
    welcome_letter:
      "Jake, welcome to Michigan State. Moving from Austin to East Lansing is a real change — different weather, different pace, a different kind of college energy. But MSU is one of those places that gets under your skin fast. The campus is beautiful, the people are genuinely friendly, and the city feels like it was built for students. Your first week is going to be a mix of logistics and exploring — this guide is here to make sure neither one catches you off guard.",
  },
  university_notes: null,
  university_links: null,
  sections: {
    first_week: {
      title: "Your First 7 Days",
      intro: "East Lansing rewards students who explore early — mix the admin tasks with getting to know the city.",
      days: [
        {
          label: "Day 1",
          tasks: [
            "Pick up your MSU student ID at the Student Services Building — you need it for everything: dining, the gym, the bus, library access.",
            "Walk the Red Cedar River trail after check-in. It runs through the heart of campus and gives you a real feel for the place in 30 minutes.",
          ],
        },
        {
          label: "Days 2–3",
          tasks: [
            "Get a Michigan prepaid SIM or add a Michigan number — your Texas number works but a local setup makes apartment and job applications smoother.",
            "Open a student checking account at a bank near campus — bring your ID and proof of enrollment. No need to switch your home bank, just have a local one.",
            "Head to Grand River Ave on a weekday evening — MSU's main strip. Find a coffee shop you like. You'll be there a lot.",
          ],
        },
        {
          label: "Days 4–7",
          tasks: [
            "Submit your health insurance enrollment or waiver through the MSU Student Health portal — missing this deadline means automatic enrollment and a charge to your account.",
            "Accept your financial aid award letter in your student portal — review each item and accept before the deadline.",
            "Check the MSU Student Employment portal for on-campus jobs — dining, recreation center, library. Spots fill up in the first two weeks.",
            "Drive or walk to Old Town Lansing on the weekend — 10 minutes from campus, great food scene, feels nothing like a college town.",
          ],
        },
      ],
    },
    city_essentials: {
      title: "Your New City",
      restaurants: [
        {
          name: "El Azteco",
          cuisine: "Mexican",
          location: "MAC Ave, East Lansing",
          why: "MSU institution since 1963 — cheap, filling, and packed with students. The margaritas are famous. A Tuesday night here is a rite of passage.",
        },
        {
          name: "Crunchy's",
          cuisine: "American / Bar food",
          location: "MAC Ave, East Lansing",
          why: "The most beloved dive bar and restaurant on campus — cheap burgers, great wings, and the best people-watching in East Lansing.",
        },
        {
          name: "HopCat",
          cuisine: "American / Craft beer",
          location: "Albert Ave, East Lansing",
          why: "Michigan's best craft beer bar with an excellent kitchen. The Crack Fries are legendary. Good spot for a team dinner or a night out with new friends.",
        },
        {
          name: "Saddleback BBQ",
          cuisine: "BBQ",
          location: "Grand River Ave, East Lansing",
          why: "Real smoked brisket and ribs — as close to Texas BBQ as you'll find in Michigan. Worth the trip when you're homesick for Austin.",
        },
      ],
      places_to_visit: [
        {
          name: "MSU Beaumont Tower & The Diag",
          type: "campus landmark",
          description:
            "The heart of MSU's campus — a beautiful open space surrounded by historic buildings. Walk it on a fall afternoon when the leaves are changing and you'll understand why MSU students love this place.",
        },
        {
          name: "Lansing River Trail",
          type: "outdoors",
          description:
            "A 20-mile paved trail system running through Lansing and East Lansing along the Grand and Red Cedar Rivers. Perfect for morning runs, bike rides, or just clearing your head between study sessions.",
        },
        {
          name: "Old Town Lansing",
          type: "neighborhood",
          description:
            "10 minutes from campus — independent restaurants, coffee shops, record stores, and galleries. A completely different vibe from the campus strip and worth exploring in your first month.",
        },
      ],
      transportation: {
        intro: "East Lansing is very walkable on campus but you'll want options for getting around Lansing and beyond.",
        options: [
          "Walking / biking: MSU's campus is huge but flat — a bike covers it fast. Michigan winters make this seasonal, so plan for both.",
          "CATA Bus: Free with your MSU student ID. Covers campus, East Lansing, and Lansing. Download the Token Transit app to track routes.",
          "Uber / Lyft: Active throughout the area. $8–$15 for most local trips. Essential for winter nights when you don't want to walk.",
        ],
      },
      housing: [
        {
          option: "On-campus residence hall",
          area: "MSU main campus",
          price_range: "$8,000–$11,000/year",
          why: "Best option for a first-year student — built-in social life, walking distance to everything, and no lease or utility hassle.",
        },
        {
          option: "Off-campus apartment near campus",
          area: "MAC Ave / Ann St corridor",
          price_range: "$700–$1,100/mo per person",
          why: "Most popular option for sophomores and up — more independence, lower cost when split with roommates, and still walkable to class.",
        },
        {
          option: "East Lansing apartment (further from campus)",
          area: "Trowbridge Rd / Lake Lansing area",
          price_range: "$600–$900/mo per person",
          why: "More affordable, quieter, requires a bike or bus — good if you want to save money and don't mind a 10-minute commute.",
        },
      ],
      healthcare: [
        {
          name: "MSU Olin Health Center",
          type: "Campus clinic",
          location: "West Circle Drive, MSU campus",
          note: "Primary care, urgent care, mental health, and pharmacy — all on campus and covered by your student health fee. First stop for anything non-emergency.",
        },
        {
          name: "Sparrow Hospital",
          type: "Regional hospital / ER",
          location: "Michigan Ave, Lansing (10 min from campus)",
          note: "Nearest full emergency and trauma center. For serious injuries or illnesses that Olin can't handle.",
        },
        {
          name: "MSU Counseling & Psychiatric Services (CAPS)",
          type: "Mental health",
          location: "Olin Health Center, MSU campus",
          note: "Free confidential counseling for all MSU students. Moving states and starting college is a big adjustment — booking a session early is smart, not a last resort.",
        },
      ],
      social: [
        {
          name: "MSU Intramural Sports",
          type: "sports / activity",
          description: "One of the best intramural programs in the Big Ten — flag football, basketball, soccer, volleyball. Sign up in the first week before rosters fill. Fastest way to meet people outside your dorm.",
        },
        {
          name: "MAC Ave on a game day",
          type: "social scene",
          description: "MSU football Saturdays are an experience — the whole city turns green and white. Walk MAC Ave before kickoff even if you don't have a ticket. The atmosphere is unlike anything in the Big 12.",
        },
        {
          name: "MSU Student Organization Fair",
          type: "campus event",
          description: "Held in the first two weeks of semester — 900+ student organizations on the lawn. Go with no plan and just talk to people. You'll find 3 things you want to join.",
        },
      ],
    },
    your_university: {
      title: "Your University",
      campus_spots: [
        {
          name: "MSU Main Library",
          type: "library",
          description:
            "One of the largest university libraries in the US — 24-hour study rooms during finals, private booking rooms, and a massive digital database. Download the MSU Library app to book rooms and access resources.",
        },
        {
          name: "MSU IM Sports Circle",
          type: "gym",
          description:
            "MSU's massive student recreation center — weight rooms, pools, basketball courts, climbing wall, and group fitness classes. Free with your student ID. One of the best campus gyms in the country.",
        },
        {
          name: "The Hub",
          type: "dining",
          description:
            "MSU's main dining complex — one of the top-rated university dining programs in the US. Multiple stations, dietary options, and a coffee shop. Your meal plan covers most of it.",
        },
        {
          name: "Spartan Stadium",
          type: "athletic",
          description:
            "75,000-seat Big Ten football stadium — a 10-minute walk from most dorms. Student tickets are discounted and game days are a core part of the MSU experience. Get your student ticket pass in week one.",
        },
      ],
      athletic_facilities: null,
      food_nearby: [
        { name: "Grand River Ave dining strip", location: "Adjacent to east campus", note: "Dozens of restaurants within a 5-minute walk — pizza, sushi, Mexican, Thai, coffee. Your daily lunch rotation lives here." },
        { name: "MSU Dairy Store", location: "Anthony Hall, MSU campus", note: "MSU's famous on-campus ice cream and cheese shop. The ice cream is made on site — go once in your first week." },
        { name: "Whole Foods", location: "Meridian Mall, 15 min from campus", note: "Best grocery run for quality produce and prepared foods. Use CATA bus Route 1 to get there without a car." },
      ],
      student_life: [
        {
          name: "MSU Associated Students (ASMSU)",
          type: "student government",
          description: "MSU's student government funds clubs, organizes campus events, and represents students to the administration. Great for getting involved and building leadership experience early.",
        },
        {
          name: "MSU Career Services Network",
          type: "resource",
          description: "Located in the Spartan Stadium complex. Resume reviews, internship fairs, and career coaching — start in semester one, not senior year. MSU's alumni network is one of the largest in the world.",
        },
        {
          name: "MSU Study Abroad Office",
          type: "resource",
          description: "MSU sends more students abroad than almost any US university. If you're interested, go to an info session in your first semester — the best programs fill up 12+ months in advance.",
        },
      ],
    },
    your_paperwork: {
      title: "What You Need to Do",
      eligibility: null,
      athletic_forms: null,
      health_insurance: {
        description: "Enroll in MSU's student health insurance plan or submit a waiver with proof of your own qualifying coverage through the MSU Student Health portal — missing the deadline means automatic enrollment and a charge to your student account.",
        deadline: "Before semester start",
        url: "https://studenthealth.msu.edu/insurance/",
      },
      financial_aid: [
        {
          title: "Accept your financial aid award letter",
          description: "Log into the MSU Student Aid portal, review your grants, scholarships, and loans, and accept or decline each item before the deadline — unaccepted aid is forfeited.",
          url: "https://studentaid.gov/",
        },
        {
          title: "Renew FAFSA every October",
          description: "FAFSA must be filed every year in October for the following academic year — set a recurring reminder now or you will miss aid you're entitled to.",
          url: "https://studentaid.gov/h/apply-for-aid/fafsa",
        },
      ],
      international_academic: null,
      post_arrival: {
        intro: "These are the practical steps to sort in your first two weeks — most take under 30 minutes each.",
        i94_check: null,
        social_security: null,
        ssa_office_url: null,
        itin: null,
        bank_account: null,
        us_taxes: null,
        opt_cpt: null,
        cv_tips: null,
        resume_tools_url: null,
        state_id: {
          description: "Transfer your Texas driver's license to a Michigan license at the Michigan Secretary of State office within 30 days of establishing Michigan residency — bring your TX license, proof of Michigan address, and Social Security card.",
          url: "https://www.michigan.gov/sos/license-id",
        },
        renters_insurance: {
          description: "Get renter's insurance before move-in — it costs $10–$15/month, covers theft, fire, and personal liability, and most East Lansing landlords require proof of it before handing over keys.",
          url: null,
        },
        voter_registration: {
          description: "Moving from Texas means your voter registration doesn't follow you — register in Michigan at michigan.gov/vote if you want to vote in local or national elections from your new address.",
          url: "https://mvic.sos.state.mi.us/RegisterVoter",
        },
        car_registration: {
          description: "If you drove your car from Texas, Michigan requires you to transfer your vehicle registration and get Michigan plates within 30 days of establishing residency — bring your TX title, proof of insurance, and Michigan address to the Secretary of State office.",
          url: "https://www.michigan.gov/sos/vehicles",
        },
        on_campus_jobs: {
          description: "MSU's student employment portal lists on-campus jobs in dining, the library, recreation center, and labs — these are the easiest first jobs, no commute needed, and spots fill up in the first two weeks of semester.",
          url: "https://seo.msu.edu/",
        },
      },
    },
  },
};
