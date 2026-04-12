export const demoDocument = {
  meta: {
    athlete_name: "Gabriel Santos",
    destination: "Madrid, Spain",
    club: "Real Madrid CF",
    club_logo_url: null,
    club_primary_color: "#1a1a2e",
    generated_summary:
      "Madrid is one of Europe's most vibrant, cosmopolitan capitals — a city that combines world-class infrastructure, outstanding international schools, and a warm, family-friendly culture that makes it one of the best cities in the world for a professional footballer and his family to call home. For Gabriel, Ana, Mateus, Sofia, and Simba, this city will feel like a place you never want to leave.",
    welcome_letter:
      "Dear Gabriel, welcome to Real Madrid — and welcome to the city that breathes football like nowhere else on earth. Moving from Rio with Ana, Mateus, Sofia, and Simba is a big step, and we want you to feel completely ready for it. Madrid has a warmth and energy that Brazilians consistently find familiar — the people, the food, the passion for the game. We've built this guide around your family's life specifically: great schools for the kids, a city perfect for a Golden Retriever, golf courses worthy of your handicap, and neighborhoods where you'll feel at home from day one. Let's get you settled.",
  },
  sections: {
    neighborhoods: {
      title: "Recommended Neighborhoods",
      intro:
        "These four areas were selected based on proximity to Ciudad Real Madrid in Valdebebas, quality of international schools, family-friendly character, and availability of large homes with outdoor space for Simba.",
      items: [
        {
          name: "La Moraleja",
          fit_score: 96,
          fit_reason:
            "The definitive address for elite footballers in Madrid — gated residential estate with large villas, exceptional security, and the closest premium neighborhood to Valdebebas training ground.",
          description:
            "La Moraleja is Madrid's most exclusive residential estate, home to dozens of Real Madrid and Atlético players, diplomats, and international executives. The area is built around large private villas with gardens, swimming pools, and 24-hour security, making it ideal for a family with young children and a dog. The international community is deeply embedded here — you'll find neighbors from Brazil, France, England, and beyond, many of whom share the same lifestyle.",
          avg_rent_range: "$8,000–$15,000 USD/month",
          commute_to_training: "12 minutes to Valdebebas",
          pros: [
            "Largest concentration of professional footballer families in Madrid",
            "Large villas with gardens — perfect for Simba",
            "12-minute commute to Valdebebas training ground",
            "Gated security with 24-hour surveillance",
          ],
        },
        {
          name: "Pozuelo de Alarcón",
          fit_score: 91,
          fit_reason:
            "Madrid's most prestigious western suburb — large family homes, top international schools on the doorstep, and the Club de Campo golf course minutes away.",
          description:
            "Pozuelo is a leafy, affluent suburb west of Madrid that consistently ranks as one of Spain's highest-income municipalities. It has a strong international school cluster, excellent private healthcare, and a calm residential atmosphere that suits a family with young children. The Somosaguas area in particular offers large modern villas with private gardens. Golf access is outstanding — the Real Club de Golf La Dehesa and Club de Campo are both nearby.",
          avg_rent_range: "$5,000–$10,000 USD/month",
          commute_to_training: "35 minutes to Valdebebas",
          pros: [
            "Direct access to three of Madrid's best golf courses",
            "King's College and Colegio Europeo de Madrid both nearby",
            "More spacious and affordable than La Moraleja",
            "Strong Brazilian expat community in the area",
          ],
        },
        {
          name: "Las Rozas de Madrid",
          fit_score: 87,
          fit_reason:
            "Suburban town with large residential properties, excellent international schools, and Real Madrid's own training complex nearby — a natural choice for the club's foreign players.",
          description:
            "Las Rozas is a modern, well-planned suburban town northwest of Madrid that has become the unofficial village of Real Madrid — the club's Ciudad Real Madrid training facility is here, meaning many squad members and staff live locally. The town has excellent amenities, multiple international schools, spacious villas with pools and gardens, and a genuine small-town feel that works beautifully for families with young children.",
          avg_rent_range: "$4,000–$8,000 USD/month",
          commute_to_training: "5 minutes to Valdebebas",
          pros: [
            "Closest neighborhood to the training ground — 5 minutes",
            "Several teammates and club staff live nearby",
            "More space and garden for the same budget",
            "International School of Las Rozas on the doorstep",
          ],
        },
        {
          name: "Barrio de Salamanca",
          fit_score: 82,
          fit_reason:
            "Madrid's most elegant urban neighborhood — ideal if Gabriel and Ana want to be in the heart of the city with access to top restaurants, culture, and the best shopping in Spain.",
          description:
            "Salamanca is Madrid's most prestigious central neighborhood, known for its wide Haussmann-style boulevards, luxury boutiques, fine dining, and a sophisticated residential atmosphere. It is the neighborhood of choice for wealthy Madrileños who want to live in the city rather than the suburbs. Apartments here are spacious and beautifully appointed. The trade-off is a longer commute to Valdebebas and smaller outdoor spaces, though several buildings have terraces and communal gardens.",
          avg_rent_range: "$6,000–$12,000 USD/month",
          commute_to_training: "25 minutes to Valdebebas",
          pros: [
            "The most prestigious central address in Madrid",
            "Walking distance to the best restaurants and shops in Spain",
            "Perfect for Ana's design career — surrounded by culture and inspiration",
            "Strong expat community in luxury apartment buildings",
          ],
        },
      ],
    },
    housing: {
      title: "Housing Options",
      intro:
        "Madrid's premium rental market offers genuine choice at Gabriel's budget — from large suburban villas with gardens to elegant city apartments.",
      search_platforms: [
        { name: "Idealista", url: "https://www.idealista.com" },
        { name: "Fotocasa", url: "https://www.fotocasa.es" },
        { name: "Lucas Fox", url: "https://www.lucasfox.com" },
        { name: "Engel & Völkers", url: "https://www.engelvoelkers.com/es-es" },
      ],
      items: [
        {
          type: "Luxury villa with garden",
          area: "La Moraleja — Urbanización La Moraleja",
          description:
            "Detached villas of 400–600m² with private gardens of 500–1,000m², private pool, double garage, and 24-hour gated community security. These properties are the standard choice for Real Madrid players — spacious enough for a family of four, a large dog, and visiting family from Brazil. Finishes are high-end throughout, with modern kitchens, multiple bathrooms, and large terraces.",
          price_range: "$9,000–$14,000 USD/month",
          bedrooms: "4–6",
          highlights: [
            "Private garden and pool — perfect for Simba and the kids",
            "24-hour gated security",
            "12 minutes to Valdebebas training ground",
          ],
        },
        {
          type: "Large family villa",
          area: "Pozuelo de Alarcón — Somosaguas or La Finca",
          description:
            "Premium semi-detached and detached villas in Madrid's most sought-after western suburbs. La Finca in Pozuelo is particularly notable — a private gated estate of around 400 luxury villas that has historically been home to Raúl, Ronaldo, and many other Real Madrid legends. Properties offer large gardens, private pools, and high-end finishes at slightly lower prices than La Moraleja.",
          price_range: "$6,500–$11,000 USD/month",
          bedrooms: "4–5",
          highlights: [
            "La Finca has historically housed Real Madrid legends",
            "Direct access to golf clubs and international schools",
            "More affordable than La Moraleja for equivalent space",
          ],
        },
        {
          type: "Luxury penthouse apartment",
          area: "Barrio de Salamanca — Calle Velázquez or Calle Serrano",
          description:
            "Duplex penthouses in Salamanca's grand residential buildings offer 300–450m² of living space, large terraces with Madrid skyline views, private parking, and 24-hour concierge. These properties suit the family if Ana wants to be in the cultural heart of Madrid and Gabriel is comfortable with the longer commute. Many buildings in Salamanca have undergone full renovations in the past decade and offer contemporary interiors within classic architecture.",
          price_range: "$8,000–$13,000 USD/month",
          bedrooms: "4",
          highlights: [
            "Large terrace with Madrid skyline views",
            "Walking distance to the best of the city",
            "24-hour concierge and underground parking",
          ],
        },
      ],
    },
    schools: {
      title: "Schools",
      intro:
        "Madrid has an exceptional international school ecosystem — for Mateus (age 6) and Sofia (age 3), the priority is English-medium instruction, a strong pastoral team for new arrivals, and a diverse international community.",
      items: [
        {
          name: "King's College Madrid",
          url: "https://www.kingscollegeschools.org/madrid",
          type: "International / Private",
          curriculum: "British (IGCSE & A-Levels)",
          age_range: "2–18",
          fee_range: "$14,000–$22,000 USD/year per child",
          description:
            "King's College is Madrid's most prestigious British school and consistently ranks among the top international schools in Spain. The school has a large, beautifully equipped campus in La Moraleja, putting it minutes from where Gabriel's family is most likely to live. The school is known for its exceptional pastoral care for new international students — the transition team actively supports families arriving mid-year.",
        },
        {
          name: "American School of Madrid",
          url: "https://www.asmadrid.org",
          type: "International / American",
          curriculum: "American (AP) with IB option",
          age_range: "3–18",
          fee_range: "$16,000–$24,000 USD/year per child",
          description:
            "The American School of Madrid is the flagship American curriculum school in Spain, serving the US Embassy community and international families. The school has outstanding facilities including dedicated early childhood buildings for children Sofia's age, strong sports programs, and a multicultural student body from over 50 nationalities. The Early Childhood program for ages 3–5 is particularly strong for Sofia.",
        },
        {
          name: "Colegio Europeo de Madrid",
          url: "https://www.colegio-europeo.es",
          type: "International / European",
          curriculum: "IB (PYP, MYP, Diploma)",
          age_range: "3–18",
          fee_range: "$10,000–$16,000 USD/year per child",
          description:
            "Colegio Europeo offers a full IB program from nursery through diploma in a warm, family-centered environment. The school has a strong focus on multilingualism — children are educated in English, Spanish, and French from an early age — which is particularly valuable for Mateus and Sofia as they settle into Spanish life. The school has an active Brazilian parent community.",
        },
      ],
    },
    transportation: {
      title: "Transportation & Cars",
      intro:
        "Having two cars is essential for the Santos family in Madrid — Ana will need full independence for school runs and her design work while Gabriel is at training.",
      license_info:
        "A valid Brazilian driver's license (CNH) is recognized in Spain for up to 6 months for residents. After that, Gabriel and Ana must obtain Spanish licenses (permiso de conducir) through the DGT. The process requires a theory exam (available in Portuguese at some centers) and a practical driving test. The club's legal team will guide the process — budget 6–10 weeks and drive on your Brazilian license in the meantime.",
      items: [
        {
          option: "Buy — Primary Family Vehicle",
          description:
            "The Range Rover Sport or BMW X5 are the standard choices among Real Madrid players — excellent resale value, widely serviced in Madrid, and large enough for a family of four plus a Golden Retriever. Buying outright over a 4-year contract avoids monthly lease costs and gives full flexibility to sell when the contract ends.",
          price_range: "$85,000–$120,000 USD at current Madrid market prices",
          tips: [
            "Purchase through an authorized dealer — Madrid has a significant grey market for luxury vehicles",
            "Register in Gabriel's name immediately with a Spanish NIE number",
            "Annual road tax (impuesto de circulación) is handled by the municipality",
          ],
        },
        {
          option: "Buy — Ana's Daily Vehicle",
          description:
            "The Volvo XC60 or Porsche Macan are ideal for Ana's daily school runs and city driving — premium, safe, practical, and well-suited to Madrid's urban roads. Both hold value well and are serviced across the city.",
          price_range: "$60,000–$90,000 USD",
          tips: [
            "Madrid's Low Emission Zone (ZBE) restricts older vehicles in the city center — both models are compliant",
            "Underground parking in La Moraleja villas is standard — city center neighborhoods require separate parking contracts",
          ],
        },
      ],
    },
    fitness: {
      title: "Fitness & Sports",
      intro:
        "Madrid has world-class fitness infrastructure — and for a professional athlete with a golf handicap, the city's private clubs are among the best in Europe.",
      items: [
        {
          name: "Real Club de Golf La Moraleja",
          url: "https://www.realclubdegolflamoraleja.com",
          type: "Golf club",
          location: "La Moraleja, Alcobendas — 10 minutes from training ground",
          description:
            "One of Spain's most prestigious golf clubs, with two championship 18-hole courses (Moraleja I & II), a full clubhouse, driving range, and professional instruction. The club has historically had a large membership of Real Madrid players and Spanish football royalty. For a professional athlete who takes golf seriously, membership here is the natural choice in Madrid.",
          price_range: "Annual membership approximately €15,000–€20,000",
        },
        {
          name: "Club de Campo Villa de Madrid",
          url: "https://www.clubdecampo.es",
          type: "Multi-sport club",
          location: "Carretera de Castilla, Madrid — 20 minutes from La Moraleja",
          description:
            "Spain's oldest and most prestigious multi-sport club, with a championship golf course, 40+ tennis courts, swimming pools, a full gym, squash courts, and riding facilities. The club has an exceptional social scene among Madrid's sports and business elite and hosts major ATP and WTA events. A membership here covers golf, tennis, and swimming in one.",
          price_range: "Annual membership approximately €8,000–€12,000",
        },
        {
          name: "Holmes Place Premium — Velázquez",
          url: "https://www.holmesplace.es",
          type: "Premium gym",
          location: "Calle Velázquez 62, Salamanca — multiple locations across Madrid",
          description:
            "Holmes Place is Madrid's leading premium gym chain, with state-of-the-art equipment, recovery facilities, swimming pools, yoga and pilates studios, and personal training. It's the gym of choice for professional athletes in the city for supplementary conditioning work. Multiple locations across La Moraleja, Las Rozas, and Salamanca mean there's always a facility near wherever the family settles.",
          price_range: "€120–€180/month",
        },
        {
          name: "Metropolitan Club — La Moraleja",
          url: "https://www.metropolitan.es",
          type: "Premium sports & wellness club",
          location: "La Moraleja, Alcobendas",
          description:
            "Metropolitan is the premier wellness club in La Moraleja, offering a full gym, indoor and outdoor swimming pools, tennis courts, spa, and a dedicated recovery zone. The club is family-oriented with extensive children's programs — Sofia and Mateus can be enrolled in swimming lessons and tennis camps while Gabriel trains. Ana will find a strong social community here.",
          price_range: "Family membership approximately €300–€450/month",
        },
      ],
    },
    healthcare: {
      title: "Healthcare",
      intro:
        "Madrid has one of the best private healthcare systems in Europe — particularly for sports medicine and pediatrics.",
      insurance_note:
        "As an EU resident on a Spanish work visa, Gabriel and Ana must enroll in the Spanish social security system (Seguridad Social) through the club. However, for a family at this level, private health insurance through companies like Sanitas Élite or Adeslas Premium is strongly recommended — covering faster access, English-speaking consultants, and the city's top private hospitals.",
      items: [
        {
          name: "Clínica Universitaria de Navarra — Madrid",
          url: "https://www.cun.es",
          type: "Private hospital — full service",
          location: "Calle del Marqués de Villamagna 5, Salamanca",
          description:
            "Consistently ranked as Spain's best private hospital and among the top 10 in Europe, the CUN Madrid campus offers internationally trained physicians, state-of-the-art oncology, orthopedics, cardiology, and pediatrics. The hospital has a dedicated international patient service with Portuguese-speaking coordinators and is the gold standard for a professional athlete's healthcare in Spain.",
          specialties: ["Sports medicine & orthopedics", "Pediatrics", "International patient services"],
        },
        {
          name: "Hospital Ruber Internacional",
          url: "https://www.ruberinternacional.es",
          type: "Private hospital — full service",
          location: "Calle de la Masó 38, La Florida",
          description:
            "Hospital Ruber Internacional is Madrid's leading hospital for international patients, with Portuguese, English, and French-speaking medical staff throughout. The hospital has an outstanding sports injury unit and is the closest major private hospital to La Moraleja and the northern suburbs where most footballers live.",
          specialties: ["Sports injury & rehabilitation", "Pediatrics", "24h emergency"],
        },
        {
          name: "Clínica CEMTRO",
          url: "https://www.cemtro.com",
          type: "Sports medicine clinic",
          location: "Ventisquero de la Condesa 42, Madrid",
          description:
            "CEMTRO is Madrid's most specialized sports medicine and orthopedics clinic, used by professional athletes across football, basketball, tennis, and cycling in Spain. The clinic offers advanced imaging, biomechanical analysis, physiotherapy, and rehabilitation programs. It is the preferred independent clinical resource for Real Madrid players seeking second opinions or off-season rehabilitation.",
          specialties: ["Sports medicine", "Physiotherapy", "Biomechanics & injury prevention"],
        },
      ],
    },
    dining: {
      title: "Dining & Restaurants",
      intro:
        "Madrid has one of Europe's most exciting food scenes — from Michelin-starred fine dining to the best Brazilian churrascaria outside of São Paulo.",
      diet_note:
        "With no dietary restrictions, Gabriel and Ana have full access to Madrid's extraordinary food ecosystem. Spanish cuisine is naturally protein-rich and varied — exceptional Iberian meat, fresh Atlantic and Mediterranean seafood, and outstanding produce. Brazilian products are widely available at specialized Latin American supermarkets in the Lavapiés neighborhood and online via Amazon Spain.",
      supermarkets: [
        {
          name: "El Corte Inglés Gourmet",
          url: "https://www.elcorteingles.es",
          location: "Calle Serrano 52, Salamanca",
        },
        {
          name: "Mercadona",
          url: "https://www.mercadona.es",
          location: "Multiple locations — La Moraleja, Las Rozas",
        },
        {
          name: "Supermercado Tropical",
          url: "#",
          location: "Calle Embajadores, Lavapiés — Brazilian & Latin American products",
        },
        {
          name: "La Vaguada Hipercor",
          url: "https://www.elcorteingles.es",
          location: "Av. Monforte de Lemos 36 — closest major supermarket to La Moraleja",
        },
      ],
      restaurants: [
        {
          name: "DiverXO",
          url: "https://www.diverxo.com",
          cuisine: "Spanish avant-garde",
          location: "Calle del Padre Damián 23, Chamartín",
          why_recommended:
            "Spain's only 3-Michelin-star restaurant in Madrid — chef David Muñoz's extraordinary creative cuisine is an unmissable experience for a special occasion. This is the dinner you take Ana to on your first wedding anniversary in Madrid.",
          price_range: "$$$$",
        },
        {
          name: "Amazónico",
          url: "https://www.amazonicorestaurant.com",
          cuisine: "Brazilian / Latin American",
          location: "Calle de Jorge Juan 20, Salamanca",
          why_recommended:
            "Amazónico is one of Madrid's most spectacular restaurants — a full jungle immersion experience serving exceptional Brazilian-influenced cuisine with outstanding cocktails. The perfect place to bring the family from Brazil when they visit, and where many Real Madrid players celebrate big wins.",
          price_range: "$$$",
        },
        {
          name: "El Capricho de Extremadura",
          url: "#",
          cuisine: "Traditional Spanish — Iberian meat",
          location: "Calle de Villanueva 4, Salamanca",
          why_recommended:
            "The best Iberian ham and roast suckling pig in Madrid in an elegant, traditional setting. For Gabriel and Ana, this is the authentic Madrid dining experience — the kind of meal you remember for years.",
          price_range: "$$$",
        },
        {
          name: "Churrascaria Brasileira Las Rozas",
          url: "#",
          cuisine: "Brazilian churrascaria",
          location: "Las Rozas de Madrid",
          why_recommended:
            "A taste of home when you need it — this Brazilian steakhouse in Las Rozas is popular with the Brazilian player community at Real Madrid and serves authentic rodízio with all the cuts Gabriel and Ana grew up with in Rio.",
          price_range: "$$",
        },
      ],
    },
    religious_cultural: {
      title: "Religious & Cultural",
      intro:
        "Madrid has a deep Catholic tradition and several outstanding parishes with Brazilian communities and Portuguese-language services.",
      items: [
        {
          name: "Iglesia del Sagrado Corazón — La Moraleja",
          url: "#",
          type: "Roman Catholic parish",
          location: "La Moraleja, Alcobendas",
          description:
            "The primary Catholic parish serving the La Moraleja community, with regular Sunday masses and an active family congregation that includes many international residents. The church has a children's program and catechesis classes in English and Spanish.",
        },
        {
          name: "Parroquia de Nuestra Señora del Pilar",
          url: "#",
          type: "Roman Catholic parish",
          location: "Calle Cea Bermúdez, Chamberí",
          description:
            "One of Madrid's most active Catholic parishes, known for its welcoming attitude toward international families and its pastoral care team for newly arrived residents. The parish has a Brazilian community group that meets monthly.",
        },
        {
          name: "Catedral de la Almudena",
          url: "https://www.catedraldelaalmudena.es",
          type: "Roman Catholic Cathedral",
          location: "Calle de Bailén 10, Madrid Centro",
          description:
            "Madrid's magnificent Gothic-neoclassical cathedral, completed in 1993, sits directly opposite the Royal Palace and is one of the most spiritually and architecturally significant Catholic sites in Spain. Attending Sunday mass here is a genuinely moving experience and a deep connection to Madrid's Catholic heritage.",
        },
      ],
    },
    family_life: {
      title: "Family Life & Weekends",
      intro:
        "Madrid is an exceptional city for a young family — world-class parks, theme parks, museums, and outdoor spaces that will keep Mateus, Sofia, and even Simba fully entertained.",
      items: [
        {
          name: "Parque de El Retiro",
          url: "https://www.esmadrid.com/retiro",
          type: "Park & outdoor space",
          location: "Plaza de la Independencia, Salamanca/Retiro",
          description:
            "Madrid's most iconic park — 125 hectares of gardens, a lake for rowing, the Crystal Palace, puppet shows, and open-air cafes. Weekend mornings here with Simba, Mateus, and Sofia is the quintessential Madrid family experience. Dog-friendly throughout.",
          best_for: "Weekend walks, rowboat on the lake, outdoor play",
          price_range: "Free",
        },
        {
          name: "Parque Warner Madrid",
          url: "https://www.parquewarner.com",
          type: "Theme park",
          location: "Carretera M-301, San Martín de la Vega — 40 minutes from La Moraleja",
          description:
            "Spain's best theme park, with Warner Bros. and DC Universe themed zones — roller coasters, shows, and rides across all age groups. Mateus (6) will love the Batman and Superman zones; Sofia (3) has dedicated gentle rides and a dedicated children's area. An ideal full-day family outing.",
          best_for: "Full-day family adventure — kids ages 3 and up",
          price_range: "€35–€55/person",
        },
        {
          name: "Museo del Prado",
          url: "https://www.museodelprado.es",
          type: "Museum",
          location: "Calle de Ruiz de Alarcón 23, Retiro",
          description:
            "One of the world's great art museums — for Ana in particular, as an interior designer, the Prado is a constant source of inspiration. The museum offers family tours in English and Portuguese on weekends, designed specifically for children aged 4–10.",
          best_for: "Cultural exploration — particularly for Ana's design practice",
          price_range: "€15/adult, free under 18",
        },
        {
          name: "Aquópolis Villanueva de la Cañada",
          url: "https://www.aquopolis.es",
          type: "Water park",
          location: "Villanueva de la Cañada — 25 minutes from La Moraleja",
          description:
            "The best water park in the Madrid region — huge slides, wave pools, and dedicated children's areas for all ages. Essential for the family during Madrid's long, hot summer months (June–September). The perfect weekend activity when pre-season training gives Gabriel some afternoon downtime.",
          best_for: "Summer weekends — kids of all ages",
          price_range: "€25–€35/person",
        },
        {
          name: "Zoo Aquarium de Madrid",
          url: "https://www.zoomadrid.com",
          type: "Zoo & aquarium",
          location: "Casa de Campo, Madrid",
          description:
            "One of Europe's finest zoos, with over 6,000 animals and a full aquarium. Located in the Casa de Campo — Madrid's enormous urban park. A regular weekend destination for families with young children across the city.",
          best_for: "Young children — Sofia and Mateus will love it",
          price_range: "€25/adult, €19/child",
        },
      ],
    },
    guest_accommodation: {
      title: "For Visiting Family & Guests",
      intro:
        "With family visiting from Rio a few times a year, Madrid has outstanding hotel options across all budgets — and the city is genuinely exciting for first-time visitors.",
      neighborhoods_tip:
        "The best areas for visiting family to stay are Barrio de Salamanca (upscale, central, walking distance to everything) and Gran Vía / Centro (lively, affordable, best for first-time visitors to Madrid).",
      hotels: [
        {
          name: "Hotel Villamagna",
          url: "https://www.hotelvillamagna.es",
          stars: 5,
          location: "Paseo de la Castellana 22, Salamanca",
          description:
            "One of Madrid's most legendary luxury hotels, recently fully renovated, on the Paseo de la Castellana — the city's grand boulevard. Outstanding service, exceptional restaurant, and a location that puts guests in the heart of Madrid's best neighborhood.",
          price_range: "$400–$700 USD/night",
          why_recommended:
            "The perfect choice for Gabriel's parents visiting from Rio — a hotel that communicates success and makes family feel truly looked after.",
        },
        {
          name: "Hotel Orfila",
          url: "https://www.hotelorfila.com",
          stars: 5,
          location: "Calle de Orfila 6, Alonso Martínez",
          description:
            "A small, intimate 5-star boutique hotel in a beautifully restored 19th-century palace — Madrid's most charming luxury property. Only 32 rooms, exceptional personal service, and a garden courtyard that is one of the best-kept secrets in the city.",
          price_range: "$350–$600 USD/night",
          why_recommended: "Ideal for a couple (Ana's parents, for example) who want an intimate, romantic Madrid experience.",
        },
        {
          name: "NH Collection Madrid Gran Vía",
          url: "https://www.nhcollection.com",
          stars: 4,
          location: "Gran Vía 21, Madrid Centro",
          description:
            "A beautifully designed 4-star hotel on the iconic Gran Vía, in the heart of Madrid's most energetic street. Modern rooms with excellent city views, a rooftop terrace, and immediate access to everything central Madrid has to offer — shopping, theatres, restaurants, and metro connections.",
          price_range: "$150–$250 USD/night",
          why_recommended:
            "The best mid-range option for larger family groups or extended visits — great value, central location, and genuinely stylish.",
        },
      ],
    },
    day_trips: {
      title: "Day Trips & Weekend Getaways",
      intro:
        "Madrid's central location makes it one of Europe's best cities for day trips — mountains, UNESCO World Heritage cities, vineyards, and the coast are all within easy reach.",
      items: [
        {
          name: "Toledo",
          description:
            "A UNESCO World Heritage City and Spain's former imperial capital, Toledo sits on a dramatic rocky outcrop surrounded by the Tagus River, with a skyline of Gothic cathedrals, medieval walls, and ancient synagogues. The old city is one of the most beautiful in Europe — a full day of wandering, eating incredible roast lamb, and soaking in 2,000 years of history.",
          distance_km: "75 km south of Madrid",
          travel_time: "45 minutes by car or 30 minutes by high-speed train",
          best_for: "Cultural exploration — perfect for Ana and visiting family from Brazil",
          highlights: ["Catedral de Toledo", "Alcázar fortress", "El Greco Museum", "Traditional marzipan"],
        },
        {
          name: "Sierra de Guadarrama — Navacerrada",
          description:
            "Madrid's mountain range — the Sierra de Guadarrama — is one of the city's greatest assets for families. In winter, Navacerrada ski resort offers skiing and snowboarding for all levels, including a dedicated children's ski school. In summer, the mountains offer hiking trails, waterfalls, and pine forests at altitude — a perfect escape from Madrid's heat.",
          distance_km: "55 km north of Madrid",
          travel_time: "45 minutes by car",
          best_for: "Skiing in winter, hiking and nature in summer — Simba will love it",
          highlights: ["Navacerrada ski resort", "Peñalara peak hike", "Cascada del Purgatorio waterfall"],
        },
        {
          name: "Segovia",
          description:
            "Segovia is arguably the most spectacular day trip from Madrid — a fairy-tale city with a towering Roman aqueduct (in use for 2,000 years), a Disney-esque castle (Alcázar) that inspired Walt Disney himself, and the best roast suckling pig (cochinillo) in Spain at the legendary Mesón de Cándido.",
          distance_km: "90 km northwest of Madrid",
          travel_time: "30 minutes by high-speed train or 1 hour by car",
          best_for: "Family day out — the Alcázar is magical for children",
          highlights: ["Roman aqueduct", "Alcázar castle", "Cochinillo at Mesón de Cándido"],
        },
        {
          name: "Ribera del Duero Wine Region",
          description:
            "Spain's most prestigious red wine region is 150 km north of Madrid — a landscape of rolling golden vineyards, medieval castles, and world-class wineries. Bodegas like Vega Sicilia, Pingus, and Arzuaga offer tours and tastings. An excellent trip for Gabriel and Ana for a rare weekend without the kids.",
          distance_km: "150 km north of Madrid",
          travel_time: "1.5 hours by car",
          best_for: "Couple's weekend getaway — one of Europe's great wine regions",
          highlights: ["Vega Sicilia winery tour", "Peñafiel castle", "Aranda de Duero old town"],
        },
      ],
    },
    local_life: {
      title: "Local Life & Daily Tips",
      intro:
        "Madrid has an outstanding app ecosystem for daily life — these are the tools that will make Gabriel and Ana's day-to-day in Madrid seamless from week one.",
      apps: [
        {
          name: "Glovo",
          purpose: "Food delivery & grocery delivery",
          note: "The dominant delivery app in Madrid — restaurants, supermarkets, and pharmacies all deliverable within 30 minutes.",
        },
        {
          name: "Cabify",
          purpose: "Premium ride-hailing",
          note: "More professional and reliable than Uber in Madrid — widely used by footballers and executives. Fixed prices, professional drivers.",
        },
        {
          name: "Idealista",
          purpose: "Real estate search",
          note: "Spain's dominant property portal — use it to browse neighborhoods before deciding where to live.",
        },
        {
          name: "Google Maps",
          purpose: "Navigation",
          note: "Works flawlessly in Madrid. Use it to find parking (Madrid has a complex paid parking zone system in the center).",
        },
        {
          name: "CITA Previa",
          purpose: "Government appointments",
          note: "Used to book NIE registration, driving license exchanges, and all government appointments in Spain.",
        },
        {
          name: "Sanitas App",
          purpose: "Private healthcare",
          note: "If enrolled with Sanitas private insurance, the app lets you book appointments, access prescriptions, and speak to a doctor via video.",
        },
      ],
      tips: [
        {
          category: "Tipping",
          tip: "Tipping is appreciated but not obligatory in Spain. 5–10% is generous at restaurants; rounding up is standard at bars. No expectation of 15–20% like in Brazil or the US.",
        },
        {
          category: "Meal times",
          tip: "Madrid eats late — lunch is 2–4pm, dinner rarely before 9pm. As a Brazilian, Gabriel will adapt quickly, but Ana should know that 7pm dinner reservations mark you as a tourist.",
        },
        {
          category: "NIE Number",
          tip: "The NIE (Número de Identidad de Extranjero) is Spain's equivalent of the Brazilian CPF — required for everything from opening a bank account to registering a car. The club's legal team will arrange this on arrival.",
        },
        {
          category: "Language",
          tip: "Madrileños speak clearly and slowly compared to other Spanish accents — as a Portuguese speaker, Gabriel will find Spanish highly intelligible from day one. Within 3 months, daily conversation will be natural.",
        },
        {
          category: "Weather",
          tip: "Madrid has extreme weather: scorching summers (35–40°C July–August) and cold winters with occasional snow. The city is at 650m altitude — which surprises many Brazilians. Pack accordingly and enjoy the guaranteed sunshine.",
        },
        {
          category: "Simba & Dogs",
          tip: "Madrid is extremely dog-friendly — dogs are welcome in most outdoor cafes and terraces, in public parks, and on public transport. The Retiro and Casa de Campo parks are packed with dogs every weekend.",
        },
        {
          category: "Banking",
          tip: "Open a Santander or BBVA account as soon as NIE is obtained — both have Portuguese-speaking staff and extensive English-language online banking. Wise is ideal for converting salary reais or USD to euros in the meantime.",
        },
      ],
    },
    emergency_contacts: {
      title: "Emergency Contacts",
      intro:
        "Save these numbers on day one — Spain's emergency system is excellent, but knowing who to call and when is essential for any family living abroad.",
      items: [
        {
          category: "Emergency",
          name: "Pan-European Emergency Number",
          number: "112",
          note: "Police, ambulance, and fire. Operators speak English and Portuguese. Use this for any life-threatening emergency.",
        },
        {
          category: "Police",
          name: "Spanish National Police (Policía Nacional)",
          number: "091",
          note: "For non-emergency police matters, theft reports, and documentation. The Alcobendas station (near La Moraleja) has English-speaking officers.",
        },
        {
          category: "Medical",
          name: "Hospital Ruber Internacional — 24h Emergency",
          number: "+34 91 387 08 00",
          note: "Closest premium private hospital to La Moraleja with Portuguese-speaking staff. First choice for non-life-threatening emergencies.",
        },
        {
          category: "Medical",
          name: "Clínica Universitaria de Navarra — Appointments",
          number: "+34 91 353 19 20",
          note: "Spain's top private hospital. Use for specialist appointments, second opinions, and sports medicine.",
        },
        {
          category: "Club",
          name: "Real Madrid CF — Player Liaison",
          number: "Via club management",
          note: "The club's player services team is the first point of contact for any administrative emergency — housing issues, documentation, legal matters.",
        },
        {
          category: "Embassy",
          name: "Brazilian Embassy in Madrid",
          number: "+34 91 700 40 00",
          note: "Calle de Fernando el Santo 6, Almagro. For passport renewal, emergency consular assistance, and official Brazilian documentation.",
        },
        {
          category: "Roadside",
          name: "RACE — Spanish Automobile Club",
          number: "900 200 093",
          note: "Spain's leading roadside assistance service — covers breakdowns, accidents, and towing. Annual membership is approximately €80 and is worth every euro.",
        },
      ],
    },
    integration: {
      title: "Integration & Community",
      intro:
        "Madrid has one of the largest Brazilian communities in Europe — Gabriel and Ana will find a social network faster than in almost any other European city.",
      expat_community:
        "Madrid is home to over 50,000 registered Brazilian residents, with a particularly active community in the La Moraleja, Las Rozas, and Pozuelo areas — precisely where footballers and their families tend to live. The Real Madrid squad has consistently included multiple Brazilian players, meaning Gabriel will likely have Portuguese-speaking teammates from day one who can help Ana and the kids settle.",
      items: [
        {
          name: "Comunidade Brasileira em Madrid",
          url: "#",
          type: "Brazilian expat community",
          description:
            "A large, active community of Brazilians in Madrid, with regular social events, WhatsApp groups by neighborhood, a monthly community lunch, and an active Facebook group with thousands of members. For Ana in particular, this community is the fastest path to friendships, trusted service provider recommendations, and a genuine sense of home.",
        },
        {
          name: "InterNations Madrid",
          url: "https://www.internations.org/madrid-expats",
          type: "International expat network",
          description:
            "InterNations Madrid is one of the most active chapters in Europe, with monthly events for thousands of international professionals across Salamanca, Chamberí, and Las Rozas. Regular social events, professional networking groups, and a new arrivals program make it excellent for Ana to build a broader international social network alongside the Brazilian community.",
        },
        {
          name: "Berlitz Spain — Madrid",
          url: "https://www.berlitz.com/es-es",
          type: "Language school",
          description:
            "Berlitz has extensive centers across Madrid and offers intensive Spanish courses tailored to Latin American Portuguese speakers — the transition from Brazilian Portuguese to Spanish is the easiest language acquisition in the world, and Berlitz instructors understand exactly which false friends and pronunciation habits to target. Gabriel and Ana can expect conversational fluency within 6–8 weeks of intensive lessons.",
        },
      ],
    },
    practical: {
      title: "Practical Information",
      intro:
        "The administrative side of moving to Spain as a professional athlete is well-structured — the club handles the bulk of it, but there are personal steps Gabriel and Ana must take proactively.",
      items: [
        {
          category: "Residency",
          title: "Spanish Work Visa & Residency",
          url: "https://www.exteriores.gob.es",
          description:
            "Real Madrid's legal team will process Gabriel's work visa (Tarjeta de Residencia por cuenta ajena) — the club handles this routinely for every foreign signing. Ana and the children enter as dependents. On arrival, all family members must register at the local Oficina de Extranjería to receive their NIE numbers, which unlock everything else: banking, schools, healthcare, and car registration.",
          tips: [
            "Apostille all Brazilian documents before leaving — birth certificates, marriage certificate, and academic records must all be apostilled for Spanish use",
            "Bring 10 passport photos on arrival — they are required for almost every administrative process",
          ],
        },
        {
          category: "Banking",
          title: "Opening a Spanish Bank Account",
          url: "https://www.santander.es",
          description:
            "Banco Santander and BBVA are the strongest choices for foreign professionals — both have English and Portuguese-language services, online banking in multiple languages, and dedicated international client teams. Santander in particular has strong ties to the Brazilian banking system. The club's payroll team will advise on which branch and account type is standard for Real Madrid players.",
          tips: [
            "Open a Wise account before leaving Brazil — use it for USD/EUR conversions at real exchange rates until your Spanish account is set up",
            "Request a premium account (Santander Select or BBVA Wealth) — these offer dedicated relationship managers and faster service",
          ],
        },
        {
          category: "Tax",
          title: "Beckham Law — Spanish Tax Regime for Inpatriates",
          url: "https://www.agenciatributaria.es",
          description:
            "Spain offers the 'Beckham Law' (Régimen Especial para Trabajadores Desplazados) to newly arrived foreign professionals — named after David Beckham who famously used it at Real Madrid. Under this regime, Gabriel can opt to pay a flat 24% income tax on his Spanish salary (vs. up to 47% progressive rate) for 6 years. This is a major financial benefit and Real Madrid's legal team will handle the application.",
          tips: [
            "Apply within 6 months of starting work in Spain — missing this deadline forfeits the benefit",
            "Brazilian worldwide income may still be subject to Brazilian tax obligations — engage a dual-qualified Spanish/Brazilian tax advisor",
          ],
        },
        {
          category: "Pet",
          title: "Bringing Simba to Spain",
          url: "https://www.mapa.gob.es",
          description:
            "Spain has straightforward pet import rules for dogs from Brazil. Simba must have: a valid rabies vaccination, an EU-format pet passport or official health certificate endorsed by MAPA (Spain's agriculture ministry), and a microchip. Brazil is not on the EU's approved country list, so an additional serological antibody test (titration test) may be required — check current requirements with the Spanish consulate in Rio at least 3 months before travel.",
          tips: [
            "Use a professional pet relocation service — they navigate the Brazilian export requirements and Spanish import clearance end-to-end",
            "Register Simba with the local municipality (Alcobendas or Madrid) within 3 months of arrival — required by Spanish law",
          ],
        },
      ],
    },
  },
};
