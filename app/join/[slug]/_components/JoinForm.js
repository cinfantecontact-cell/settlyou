"use client";

import { useState, useEffect, useRef } from "react";

const LANGUAGES = [
  "English", "Spanish", "Portuguese", "French", "German", "Italian",
  "Dutch", "Arabic", "Japanese", "Korean", "Mandarin", "Russian",
  "Turkish", "Swedish", "Danish", "Norwegian", "Polish", "Other",
];

const COUNTRIES = [
  "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda",
  "Argentina", "Armenia", "Australia", "Austria", "Azerbaijan",
  "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium",
  "Belize", "Benin", "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana",
  "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi",
  "Cabo Verde", "Cambodia", "Cameroon", "Canada", "Central African Republic",
  "Chad", "Chile", "China", "Colombia", "Comoros", "Congo (Brazzaville)",
  "Congo (Kinshasa)", "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czech Republic",
  "Denmark", "Djibouti", "Dominica", "Dominican Republic",
  "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia",
  "Eswatini", "Ethiopia",
  "Fiji", "Finland", "France",
  "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada",
  "Guatemala", "Guinea", "Guinea-Bissau", "Guyana",
  "Haiti", "Honduras", "Hungary",
  "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy",
  "Jamaica", "Japan", "Jordan",
  "Kazakhstan", "Kenya", "Kiribati", "Kuwait", "Kyrgyzstan",
  "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein",
  "Lithuania", "Luxembourg",
  "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands",
  "Mauritania", "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco",
  "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar",
  "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua",
  "Niger", "Nigeria", "North Korea", "North Macedonia", "Norway",
  "Oman",
  "Pakistan", "Palau", "Palestine", "Panama", "Papua New Guinea", "Paraguay",
  "Peru", "Philippines", "Poland", "Portugal",
  "Qatar",
  "Romania", "Russia", "Rwanda",
  "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines",
  "Samoa", "San Marino", "São Tomé and Príncipe", "Saudi Arabia", "Senegal",
  "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia",
  "Solomon Islands", "Somalia", "South Africa", "South Korea", "South Sudan",
  "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland", "Syria",
  "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Timor-Leste", "Togo",
  "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Tuvalu",
  "UAE", "Uganda", "Ukraine", "United Kingdom", "United States", "Uruguay",
  "Uzbekistan",
  "Vanuatu", "Vatican City", "Venezuela", "Vietnam",
  "Yemen",
  "Zambia", "Zimbabwe",
  "Other",
];

const SPORTS = [
  "Men's Soccer", "Women's Soccer",
  "Men's Basketball", "Women's Basketball",
  "Baseball", "Softball",
  "American Football",
  "Men's Tennis", "Women's Tennis",
  "Men's Swimming", "Women's Swimming",
  "Men's Track & Field", "Women's Track & Field",
  "Men's Volleyball", "Women's Volleyball",
  "Men's Golf", "Women's Golf",
  "Wrestling",
  "Men's Gymnastics", "Women's Gymnastics",
  "Men's Rowing", "Women's Rowing",
  "Men's Cross Country", "Women's Cross Country",
  "Men's Lacrosse", "Women's Lacrosse",
  "Other",
];

const HOBBIES = ["Golf", "Tennis", "Swimming", "Surfing", "Gaming", "Music", "Fishing", "Cooking", "Travel", "Art", "Reading", "Hiking", "Photography", "Other"];
const FAMILY_ACTIVITIES = ["Outdoors & Nature", "Museums & Culture", "Theme Parks", "Sports Events", "Beach & Water", "Concerts & Shows", "City Exploration", "Playgrounds & Parks"];
const FITNESS = ["CrossFit", "Traditional gym", "Swimming", "Yoga / Pilates", "Cycling", "Martial arts", "Running", "No preference"];
const DIET = ["No restrictions", "Halal", "Kosher", "Vegetarian", "Vegan", "Gluten-free", "Dairy-free"];
const MUST_HAVES = ["Pool", "Garden / Terrace", "Parking", "In-building gym", "Security / Gated", "Pet-friendly", "Furnished", "Elevator", "Storage"];
const COLLEGE_MUST_HAVES = ["In-unit laundry", "Furnished", "High-speed WiFi", "Parking", "Pet-friendly", "Near campus shuttle", "Gym access", "Study room"];
const HOUSING_TYPES = ["Apartment", "House", "Villa", "Penthouse", "No preference"];
const COLLEGE_HOUSING = ["Studio", "1-bedroom apartment", "Shared apartment", "No preference"];
const SCHOOL_TYPE = ["International", "Bilingual", "Local / Public", "Religious", "No preference"];
const CURRICULUM = ["IB (International Baccalaureate)", "American", "British", "French", "Local curriculum", "No preference"];
const CAR_TYPE = ["Economy", "SUV", "Luxury sedan", "Luxury SUV", "Van / Family", "No preference"];
const GUIDE_LANGUAGES = ["English", "Spanish", "Portuguese", "French", "German", "Italian", "Dutch", "Arabic"];

const DIAL_CODES = [
  { code: "+1",   label: "+1 (US/CA)" },
  { code: "+52",  label: "+52 (MX)" },
  { code: "+54",  label: "+54 (AR)" },
  { code: "+55",  label: "+55 (BR)" },
  { code: "+56",  label: "+56 (CL)" },
  { code: "+57",  label: "+57 (CO)" },
  { code: "+58",  label: "+58 (VE)" },
  { code: "+34",  label: "+34 (ES)" },
  { code: "+44",  label: "+44 (UK)" },
  { code: "+49",  label: "+49 (DE)" },
  { code: "+33",  label: "+33 (FR)" },
  { code: "+39",  label: "+39 (IT)" },
  { code: "+351", label: "+351 (PT)" },
  { code: "+31",  label: "+31 (NL)" },
  { code: "+32",  label: "+32 (BE)" },
  { code: "+46",  label: "+46 (SE)" },
  { code: "+47",  label: "+47 (NO)" },
  { code: "+45",  label: "+45 (DK)" },
  { code: "+90",  label: "+90 (TR)" },
  { code: "+966", label: "+966 (SA)" },
  { code: "+971", label: "+971 (UAE)" },
  { code: "+81",  label: "+81 (JP)" },
  { code: "+82",  label: "+82 (KR)" },
  { code: "+61",  label: "+61 (AU)" },
  { code: "+7",   label: "+7 (RU)" },
];


// Returns #ffffff for dark backgrounds, #0f0f0f for light backgrounds
function getTextColor(hex) {
  if (!hex || hex.length < 7) return "#ffffff";
  try {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return (r * 299 + g * 587 + b * 114) / 1000 > 145 ? "#0f0f0f" : "#ffffff";
  } catch { return "#ffffff"; }
}

// Input styles — colors injected via CSS vars in style tag
const iClass = "w-full bg-transparent border-b-2 sf-border club-input outline-none sf-text text-xl py-3 sf-placeholder transition-colors";
const sClass = "w-full sf-surface sf-border-subtle club-input outline-none sf-text text-base py-3 px-4 rounded-xl sf-placeholder transition-colors appearance-none";
const taClass = "w-full sf-surface sf-border-subtle club-input outline-none sf-text text-base py-3 px-4 rounded-xl sf-placeholder transition-colors resize-none";

function Chip({ label, selected, onClick, primary }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-4 py-2 rounded-full text-sm border transition-all ${
        selected
          ? "club-chip-selected"
          : "border-white/20 text-white/70 hover:border-white/50 hover:text-white"
      }`}
    >
      {label}
    </button>
  );
}

function Label({ children }) {
  return <p className="text-white/50 text-sm mb-3">{children}</p>;
}

export default function JoinForm({ club }) {
  const t = (s) => s;
  const isCollege = club.type === "college";
  const DRAFT_KEY = `settl_draft_${club.slug}`;

  const [pinUnlocked, setPinUnlocked] = useState(!club.hasPin);
  const [pinInput, setPinInput] = useState("");
  const [pinError, setPinError] = useState(null);
  const [pinChecking, setPinChecking] = useState(false);

  const [welcomeSeen, setWelcomeSeen] = useState(false);
  const [qIndex, setQIndex] = useState(0);
  const [animKey, setAnimKey] = useState(0);
  const [formStarted, setFormStarted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);
  const [consented, setConsented] = useState(false);

  const [form, setForm] = useState({
    athlete_type: isCollege ? "college" : "professional",
    athlete_name: "",
    athlete_age: "",
    athlete_nationality: "",
    athlete_languages: [],
    sport: "",
    current_city: "",
    current_country: "",
    athlete_email: "",
    phone_code: "+1",
    phone_number: "",
    report_language: "English",
    club_joining: club.type === "pro" ? club.name : "",
    training_ground_address: "",
    contract_duration: "",
    university: isCollege ? club.name : "",
    major: "",
    has_scholarship: false,
    is_part_of_team: true,
    on_campus_housing: false,
    semester_start: "",
    is_international: true,
    family_size: 1,
    children_ages: "",
    partner_name: "",
    partner_languages: [],
    partner_profession: "",
    has_pets: false,
    pet_details: "",
    medical_needs: "",
    guest_visit_frequency: "",
    guest_hotel_budget: "",
    destination_city: club.city || "",
    destination_state: "",
    destination_country: club.country || "",
    move_date: "",
    budget_usd: "",
    housing_type: "No preference",
    min_bedrooms: "",
    housing_must_haves: [],
    neighborhood_type: [],
    max_commute_minutes: "",
    diet: [],
    fitness: [],
    hobbies: [],
    family_activities: [],
    nightlife_interest: "",
    religious_needs: "",
    needs_school: false,
    school_type: [],
    school_curriculum: [],
    needs_car: false,
    num_cars: "1",
    car_type: "No preference",
    car_buy_or_rent: "rent",
    license_country: "",
    needs_private_healthcare: false,
    medical_specialists: "",
    previous_relocation: "",
    climate_preference: "",
    training_schedule: "",
    cooking_habits: "",
    student_level: "",
    study_style: "",
    work_plans: "",
    social_goals: [],
    biggest_concerns: "",
    additional_notes: "",
  });

  function set(field, value) { setForm((f) => ({ ...f, [field]: value })); }

  // Auto-fill club address when club name is available
  useEffect(() => {
    const name = form.club_joining;
    if (!name || name.trim().length < 3) return;
    if (form.training_ground_address || form.destination_city) return;
    fetch("/api/lookup-club", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, type: club.type }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.address) set("training_ground_address", data.address);
        if (data.city) set("destination_city", data.city);
        if (data.country) set("destination_country", data.country);
      })
      .catch(() => {});
  }, [form.club_joining]);
  function toggle(field, value) {
    setForm((f) => ({
      ...f,
      [field]: f[field].includes(value)
        ? f[field].filter((v) => v !== value)
        : [...f[field], value],
    }));
  }

  // Restore draft on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(DRAFT_KEY);
      if (!saved) return;
      const { form: savedForm, qIndex: savedQ, timestamp } = JSON.parse(saved);
      if (Date.now() - timestamp > 24 * 60 * 60 * 1000) {
        localStorage.removeItem(DRAFT_KEY);
        return;
      }
      setForm((f) => ({ ...f, ...savedForm }));
      if (savedQ > 0) {
        setQIndex(savedQ);
        setFormStarted(true);
      }
    } catch {}
  }, []);

  // Save draft whenever form or step changes
  useEffect(() => {
    if (!formStarted && qIndex === 0) return;
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify({ form, qIndex, timestamp: Date.now() }));
    } catch {}
  }, [form, qIndex, formStarted]);

  function trackEvent(event_type, metadata = {}) {
    fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ event_type, club_id: club.id, metadata }),
    });
  }

  const primary = club.primary_color || "#6d28d9";
  const textColor = getTextColor(primary);
  const isLight = textColor === "#0f0f0f";
  const bg = `linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(0,0,0,0.18) 100%), ${primary}`;

  // ── COLLEGE QUESTIONS ──
  const collegeQuestions = [
    {
      id: "name",
      question: t("What's your name?"),
      valid: form.athlete_name.trim().length > 0,
      content: (
        <div className="flex flex-col gap-6">
          <div>
            <Label>{t("Full name")}</Label>
            <input autoFocus className={iClass} value={form.athlete_name}
              onChange={(e) => set("athlete_name", e.target.value)}
              placeholder="Carlos Mendoza"
              onKeyDown={(e) => e.key === "Enter" && form.athlete_name && goNext()} />
          </div>
        </div>
      ),
    },
    {
      id: "origin",
      question: t("Where are you from?"),
      valid: !!form.athlete_nationality,
      content: (
        <div className="flex flex-col gap-6">
          <div>
            <Label>{t("Your nationality")}</Label>
            <select className={sClass} value={form.athlete_nationality}
              onChange={(e) => set("athlete_nationality", e.target.value)}>
              <option value="">Select country...</option>
              {COUNTRIES.map((c) => <option key={c} className="bg-zinc-900">{c}</option>)}
            </select>
          </div>
        </div>
      ),
    },
    {
      id: "sport",
      question: t("What sport do you play?"),
      valid: !!form.sport,
      content: (
        <div>
          <Label>{t("Pick your sport")}</Label>
          <div className="flex flex-wrap gap-2">
            {SPORTS.map((s) => (
              <Chip key={s} label={s} selected={form.sport === s} onClick={() => set("sport", s)} />
            ))}
          </div>
        </div>
      ),
    },
    {
      id: "languages",
      question: t("Which languages do you speak?"),
      hint: t("Select all that apply"),
      valid: form.athlete_languages.length > 0,
      content: (
        <div className="flex flex-wrap gap-2">
          {LANGUAGES.map((l) => (
            <Chip key={l} label={l} selected={form.athlete_languages.includes(l)}
              onClick={() => toggle("athlete_languages", l)} />
          ))}
        </div>
      ),
    },
    {
      id: "university",
      question: t("Where are you heading?"),
      valid: !!form.destination_city && !!form.destination_country,
      content: (
        <div className="flex flex-col gap-6">
          <div>
            <Label>{t("University / College")}</Label>
            <input className={iClass} value={form.university}
              onChange={(e) => set("university", e.target.value)} placeholder="University of Miami" />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label>{t("Campus city")}</Label>
              <input className={iClass} value={form.destination_city}
                onChange={(e) => set("destination_city", e.target.value)} placeholder="Pueblo" />
            </div>
            <div>
              <Label>{t("State")}</Label>
              <input className={iClass} value={form.destination_state}
                onChange={(e) => set("destination_state", e.target.value)} placeholder="CO" />
            </div>
            <div>
              <Label>{t("Country")}</Label>
              <select className={sClass} value={form.destination_country}
                onChange={(e) => set("destination_country", e.target.value)}>
                <option value="">Select...</option>
                {COUNTRIES.map((c) => <option key={c} className="bg-zinc-900">{c}</option>)}
              </select>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "studies",
      question: t("Tell us about your studies."),
      valid: !!form.student_level && !!form.semester_start && !!form.budget_usd,
      content: (
        <div className="flex flex-col gap-6">
          <div>
            <Label>{t("Student level")}</Label>
            <div className="flex flex-wrap gap-2">
              {["Freshman", "Sophomore", "Junior", "Senior", "Graduate"].map((l) => (
                <Chip key={l} label={t(l)} selected={form.student_level === l} onClick={() => set("student_level", l)} />
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>{t("Semester start")}</Label>
              <input className={iClass} type="date" value={form.semester_start}
                onChange={(e) => set("semester_start", e.target.value)} />
            </div>
            <div>
              <Label>{t("Monthly budget in USD")}</Label>
              <input className={iClass} type="number" value={form.budget_usd}
                onChange={(e) => set("budget_usd", e.target.value)} placeholder="1500" />
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "routine",
      question: t("Your routine and habits."),
      valid: !!form.study_style && !!form.work_plans,
      content: (
        <div className="flex flex-col gap-6">
          <div>
            <Label>{t("How do you prefer to study?")}</Label>
            <div className="flex flex-wrap gap-2">
              {["Library", "Coffee shops", "At home", "Flexible / wherever"].map((s) => (
                <Chip key={s} label={t(s)} selected={form.study_style === s} onClick={() => set("study_style", s)} />
              ))}
            </div>
          </div>
          <div>
            <Label>{t("Work while studying?")}</Label>
            <div className="flex flex-wrap gap-2">
              {["No job — studies only", "Work-study on campus", "Part-time job", "Covered by scholarship"].map((w) => (
                <Chip key={w} label={t(w)} selected={form.work_plans === w} onClick={() => set("work_plans", w)} />
              ))}
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "situation",
      question: t("A few quick things."),
      valid: true,
      content: (
        <div className="flex flex-col gap-5">
          {[
            { field: "has_scholarship", label: t("I have an athletic scholarship") },
            { field: "on_campus_housing", label: t("I'll be living on campus (dorms)") },
            { field: "is_international", label: t("I'm coming from outside the US") },
          ].map(({ field, label }) => (
            <label key={field} className="flex items-center gap-4 cursor-pointer group">
              <div onClick={() => set(field, !form[field])}
                className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all ${
                  form[field] ? "club-check" : "border-white/30 group-hover:border-white/50"
                }`}>
                {form[field] && (
                  <svg className="w-3.5 h-3.5" style={{ color: textColor }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <span className="text-white/80 text-base">{label}</span>
            </label>
          ))}
        </div>
      ),
    },
    ...(form.on_campus_housing ? [] : [
      {
        id: "housing",
        question: t("What kind of place are you looking for?"),
        valid: true,
        content: (
          <div className="flex flex-col gap-6">
            <div>
              <Label>{t("Property type")}</Label>
              <div className="flex flex-wrap gap-2">
                {COLLEGE_HOUSING.map((h) => (
                  <Chip key={h} label={t(h)} selected={form.housing_type === h} onClick={() => set("housing_type", h)} />
                ))}
              </div>
            </div>
            <div>
              <Label>{t("Must-haves (optional)")}</Label>
              <div className="flex flex-wrap gap-2">
                {COLLEGE_MUST_HAVES.map((h) => (
                  <Chip key={h} label={t(h)} selected={form.housing_must_haves.includes(h)}
                    onClick={() => toggle("housing_must_haves", h)} />
                ))}
              </div>
            </div>
            <div>
              <Label>{t("Max commute to campus in minutes (optional)")}</Label>
              <input className={iClass} type="number" value={form.max_commute_minutes}
                onChange={(e) => set("max_commute_minutes", e.target.value)} placeholder="20" />
            </div>
          </div>
        ),
      },
    ]),
    {
      id: "lifestyle",
      question: t("How do you eat?"),
      valid: true,
      content: (
        <div className="flex flex-col gap-6">
          <div>
            <Label>{t("Dietary needs")}</Label>
            <div className="flex flex-wrap gap-2">
              {DIET.map((d) => (
                <Chip key={d} label={t(d)} selected={form.diet.includes(d)} onClick={() => toggle("diet", d)} />
              ))}
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "hobbies",
      question: t("What do you do in your free time?"),
      valid: true,
      content: (
        <div className="flex flex-col gap-6">
          <div>
            <Label>{t("Hobbies & interests")}</Label>
            <div className="flex flex-wrap gap-2">
              {HOBBIES.map((h) => (
                <Chip key={h} label={h} selected={form.hobbies.includes(h)} onClick={() => toggle("hobbies", h)} />
              ))}
            </div>
          </div>
          <div>
            <Label>{t("What are your social goals?")}</Label>
            <div className="flex flex-wrap gap-2">
              {["Making new friends", "Meeting people romantically", "Professional networking", "Exploring the city", "Staying focused on studies", "Building a close friend group"].map((g) => (
                <Chip key={g} label={t(g)} selected={form.social_goals.includes(g)} onClick={() => toggle("social_goals", g)} />
              ))}
            </div>
          </div>
          <div>
            <Label>{t("Religious or cultural needs (optional)")}</Label>
            <input className={iClass} value={form.religious_needs}
              onChange={(e) => set("religious_needs", e.target.value)}
              placeholder="Mosque nearby, halal food, Sunday church..." />
          </div>
        </div>
      ),
    },
    {
      id: "final",
      question: t("Almost there."),
      hint: t("Last few things and your guide is on its way."),
      valid: consented,
      isLast: true,
      content: null,
    },
  ];

  // ── PRO QUESTIONS ──
  const proQuestions = [
    {
      id: "name",
      question: t("What's your name?"),
      valid: form.athlete_name.trim().length > 0,
      content: (
        <div className="flex flex-col gap-6">
          <div>
            <Label>{t("Full name")}</Label>
            <input autoFocus className={iClass} value={form.athlete_name}
              onChange={(e) => set("athlete_name", e.target.value)}
              placeholder="Gabriel Santos"
              onKeyDown={(e) => e.key === "Enter" && form.athlete_name && goNext()} />
          </div>
        </div>
      ),
    },
    {
      id: "origin",
      question: "Where are you from?",
      valid: !!form.athlete_nationality,
      content: (
        <div className="flex flex-col gap-6">
          <div>
            <Label>Nationality</Label>
            <select className={sClass} value={form.athlete_nationality}
              onChange={(e) => set("athlete_nationality", e.target.value)}>
              <option value="">Select country...</option>
              {COUNTRIES.map((c) => <option key={c} className="bg-zinc-900">{c}</option>)}
            </select>
          </div>
        </div>
      ),
    },
    {
      id: "sport_lang",
      question: "Sport and languages.",
      valid: form.athlete_languages.length > 0,
      content: (
        <div className="flex flex-col gap-6">
          <div>
            <Label>Sport</Label>
            <div className="flex flex-wrap gap-2">
              {SPORTS.map((s) => (
                <Chip key={s} label={s} selected={form.sport === s} onClick={() => set("sport", s)} />
              ))}
            </div>
          </div>
          <div>
            <Label>Languages spoken</Label>
            <div className="flex flex-wrap gap-2">
              {LANGUAGES.map((l) => (
                <Chip key={l} label={l} selected={form.athlete_languages.includes(l)}
                  onClick={() => toggle("athlete_languages", l)} />
              ))}
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "club",
      question: t("Your new club."),
      valid: !!form.destination_city && !!form.destination_country && !!form.move_date,
      content: (
        <div className="flex flex-col gap-6">
          <div>
            <Label>{t("Club name")}</Label>
            <input className={iClass} value={form.club_joining}
              onChange={(e) => set("club_joining", e.target.value)} placeholder="Real Madrid CF" />
          </div>
          <div>
            <Label>{t("Training ground address (optional)")}</Label>
            <input className={iClass} value={form.training_ground_address}
              onChange={(e) => set("training_ground_address", e.target.value)}
              placeholder="Ciudad Real Madrid, Valdebebas" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>{t("Destination city")}</Label>
              <input className={iClass} value={form.destination_city}
                onChange={(e) => set("destination_city", e.target.value)} placeholder="Madrid" />
            </div>
            <div>
              <Label>{t("Country")}</Label>
              <select className={sClass} value={form.destination_country}
                onChange={(e) => set("destination_country", e.target.value)}>
                <option value="">Select...</option>
                {COUNTRIES.map((c) => <option key={c} className="bg-zinc-900">{c}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>{t("Move date")}</Label>
              <input className={iClass} type="date" value={form.move_date}
                onChange={(e) => set("move_date", e.target.value)} />
            </div>
            <div>
              <Label>{t("Contract duration (optional)")}</Label>
              <input className={iClass} value={form.contract_duration}
                onChange={(e) => set("contract_duration", e.target.value)} placeholder="3 years" />
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "housing",
      question: t("What kind of home are you looking for?"),
      valid: !!form.budget_usd,
      content: (
        <div className="flex flex-col gap-6">
          <div>
            <Label>{t("Property type")}</Label>
            <div className="flex flex-wrap gap-2">
              {HOUSING_TYPES.map((h) => (
                <Chip key={h} label={h} selected={form.housing_type === h} onClick={() => set("housing_type", h)} />
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>{t("Minimum bedrooms (optional)")}</Label>
              <input className={iClass} type="number" min={1} max={10} value={form.min_bedrooms}
                onChange={(e) => set("min_bedrooms", e.target.value)} placeholder="3" />
            </div>
            <div>
              <Label>{t("Monthly budget USD")}</Label>
              <input className={iClass} type="number" value={form.budget_usd}
                onChange={(e) => set("budget_usd", e.target.value)} placeholder="5000" />
            </div>
          </div>
          <div>
            <Label>{t("Must-haves (optional)")}</Label>
            <div className="flex flex-wrap gap-2">
              {MUST_HAVES.map((h) => (
                <Chip key={h} label={h} selected={form.housing_must_haves.includes(h)}
                  onClick={() => toggle("housing_must_haves", h)} />
              ))}
            </div>
          </div>
          <div>
            <Label>{t("Max commute to training in minutes (optional)")}</Label>
            <input className={iClass} type="number" value={form.max_commute_minutes}
              onChange={(e) => set("max_commute_minutes", e.target.value)} placeholder="30" />
          </div>
        </div>
      ),
    },
    {
      id: "family",
      question: t("Who's moving with you?"),
      valid: true,
      content: (
        <div className="flex flex-col gap-6">
          <div>
            <Label>{t("Total people moving (including yourself)")}</Label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5, "6+"].map((n) => (
                <Chip key={n} label={String(n)} selected={String(form.family_size) === String(n)}
                  onClick={() => set("family_size", n === "6+" ? 6 : n)} />
              ))}
            </div>
          </div>
          {form.family_size > 1 && (
            <>
              <div>
                <Label>{t("Partner's name (optional)")}</Label>
                <input className={iClass} value={form.partner_name}
                  onChange={(e) => set("partner_name", e.target.value)} placeholder="Sofia" />
              </div>
              <div>
                <Label>{t("Children's ages, comma separated (optional)")}</Label>
                <input className={iClass} value={form.children_ages}
                  onChange={(e) => set("children_ages", e.target.value)} placeholder="4, 7, 11" />
              </div>
            </>
          )}
          <div>
            <Label>{t("Pets?")}</Label>
            <div className="flex gap-3">
              <Chip label={t("Yes, I have a pet")} selected={form.has_pets} onClick={() => set("has_pets", true)} />
              <Chip label={t("No pets")} selected={!form.has_pets} onClick={() => set("has_pets", false)} />
            </div>
          </div>
          {form.has_pets && (
            <div>
              <Label>{t("Tell us about your pet")}</Label>
              <input className={iClass} value={form.pet_details}
                onChange={(e) => set("pet_details", e.target.value)} placeholder="Small dog, labrador..." />
            </div>
          )}
        </div>
      ),
    },
    {
      id: "lifestyle",
      question: t("How do you live day to day?"),
      valid: true,
      content: (
        <div className="flex flex-col gap-6">
          <div>
            <Label>{t("Diet")}</Label>
            <div className="flex flex-wrap gap-2">
              {DIET.map((d) => (
                <Chip key={d} label={t(d)} selected={form.diet.includes(d)} onClick={() => toggle("diet", d)} />
              ))}
            </div>
          </div>
          <div>
            <Label>{t("Hobbies")}</Label>
            <div className="flex flex-wrap gap-2">
              {HOBBIES.map((h) => (
                <Chip key={h} label={h} selected={form.hobbies.includes(h)} onClick={() => toggle("hobbies", h)} />
              ))}
            </div>
          </div>
          <div>
            <Label>{t("Religious or cultural needs (optional)")}</Label>
            <input className={iClass} value={form.religious_needs}
              onChange={(e) => set("religious_needs", e.target.value)}
              placeholder="Mosque nearby, halal food, Sunday church..." />
          </div>
        </div>
      ),
    },
    {
      id: "extras",
      question: form.family_size > 1 ? t("Schools, cars & healthcare.") : t("Cars & healthcare."),
      valid: true,
      content: (
        <div className="flex flex-col gap-6">
          {/* Schools — only shown if traveling with family */}
          {form.family_size > 1 && (
            <div>
              <Label>{t("Do you need schools for your children?")}</Label>
              <div className="flex gap-3 mb-3">
                <Chip label={t("Yes, I need schools")} selected={form.needs_school} onClick={() => set("needs_school", true)} />
                <Chip label={t("No, not needed")} selected={!form.needs_school} onClick={() => set("needs_school", false)} />
              </div>
              {form.needs_school && (
                <div className="flex flex-wrap gap-2">
                  {SCHOOL_TYPE.map((s) => (
                    <Chip key={s} label={s} selected={form.school_type.includes(s)}
                      onClick={() => toggle("school_type", s)} />
                  ))}
                </div>
              )}
            </div>
          )}
          <div>
            <Label>{t("Do you need a car?")}</Label>
            <div className="flex gap-3 mb-3">
              <Chip label={t("Yes")} selected={form.needs_car} onClick={() => set("needs_car", true)} />
              <Chip label={t("No")} selected={!form.needs_car} onClick={() => set("needs_car", false)} />
            </div>
            {form.needs_car && (
              <div className="flex flex-wrap gap-2">
                {CAR_TYPE.map((c) => (
                  <Chip key={c} label={c} selected={form.car_type === c} onClick={() => set("car_type", c)} />
                ))}
              </div>
            )}
          </div>
          <div>
            <Label>{t("Healthcare preference")}</Label>
            <div className="flex gap-3">
              <Chip label={t("Private preferred")} selected={form.needs_private_healthcare}
                onClick={() => set("needs_private_healthcare", true)} />
              <Chip label={t("Standard / public")} selected={!form.needs_private_healthcare}
                onClick={() => set("needs_private_healthcare", false)} />
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "final",
      question: t("Almost there."),
      hint: t("Last few things and your guide is on its way."),
      valid: consented,
      isLast: true,
      content: null,
    },
  ];

  const questions = isCollege ? collegeQuestions : proQuestions;
  const current = questions[qIndex];
  const progress = ((qIndex + 1) / questions.length) * 100;

  function goNext() {
    if (!current?.valid) return;
    if (qIndex === 0 && !formStarted) {
      setFormStarted(true);
      trackEvent("form_started", { club_slug: club.slug, athlete_type: form.athlete_type });
    }
    if (current.isLast) {
      handleSubmit();
      return;
    }
    setAnimKey((k) => k + 1);
    setQIndex((i) => i + 1);
  }

  function goBack() {
    if (qIndex === 0) return;
    setAnimKey((k) => k + 1);
    setQIndex((i) => i - 1);
  }

  async function handleSubmit() {
    setSubmitting(true);
    setError(null);

    const res = await fetch(`/api/join/${club.slug}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        destination_city: form.destination_state
          ? `${form.destination_city}, ${form.destination_state}`
          : form.destination_city,
        budget_usd: form.budget_usd ? parseInt(form.budget_usd) : null,
        children_ages: form.children_ages
          ? form.children_ages.split(",").map((a) => parseInt(a.trim())).filter(Boolean)
          : [],
        athlete_phone: form.phone_number ? `${form.phone_code} ${form.phone_number}` : null,
      }),
    });

    if (res.ok) {
      trackEvent("form_submitted", { club_slug: club.slug, athlete_type: form.athlete_type });
      try { localStorage.removeItem(DRAFT_KEY); } catch {}
      setSubmitted(true);
    } else {
      const data = await res.json();
      setError(data.error ?? "Something went wrong. Please try again.");
      setSubmitting(false);
    }
  }

  async function verifyPin() {
    setPinChecking(true);
    setPinError(null);
    const res = await fetch(`/api/join/${club.slug}/verify-pin`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pin: pinInput }),
    });
    if (res.ok) {
      setPinUnlocked(true);
    } else {
      setPinError("Incorrect PIN. Check with your club and try again.");
    }
    setPinChecking(false);
  }

  const formCSS = `
    @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
    @keyframes slideUp{from{opacity:0;transform:translateY(28px)}to{opacity:1;transform:translateY(0)}}
    .fade-up{animation:fadeUp 0.4s ease-out}
    .slide-up{animation:slideUp 0.35s ease-out}
    select option{background:${primary}}
    .club-btn{background-color:${primary};color:${textColor};filter:brightness(1)}
    .club-btn:hover{filter:brightness(1.12)}
    .club-btn:disabled{opacity:0.4}
    .club-chip-selected{background-color:${textColor} !important;border-color:${textColor} !important;color:${primary} !important}
    .club-progress{background-color:${textColor}55}
    .club-accent{color:${textColor};opacity:0.6}
    .club-check{background-color:${primary};border-color:${textColor}60}
    .club-input:focus{border-bottom-color:${textColor}90}
    .sf-text{color:${textColor}}
    .sf-surface{background-color:${isLight ? "rgba(0,0,0,0.06)" : "rgba(255,255,255,0.06)"}}
    .sf-border{border-bottom-color:${isLight ? "rgba(0,0,0,0.2)" : "rgba(255,255,255,0.2)"}}
    .sf-border-subtle{border:1px solid ${isLight ? "rgba(0,0,0,0.15)" : "rgba(255,255,255,0.15)"}}
    .sf-placeholder::placeholder{color:${isLight ? "rgba(0,0,0,0.3)" : "rgba(255,255,255,0.3)"}}
    .settl-form .text-white{color:${textColor} !important}
    .settl-form .text-white\\/40{color:${textColor}66 !important}
    .settl-form .text-white\\/50{color:${textColor}80 !important}
    .settl-form .text-white\\/30{color:${textColor}4d !important}
    .settl-form .text-white\\/25{color:${textColor}40 !important}
    .settl-form .text-white\\/20{color:${textColor}33 !important}
    .settl-form .text-white\\/15{color:${textColor}26 !important}
    .settl-form .bg-white\\/5{background-color:${isLight ? "rgba(0,0,0,0.06)" : "rgba(255,255,255,0.06)"} !important}
    .settl-form .border-white\\/15{border-color:${isLight ? "rgba(0,0,0,0.15)" : "rgba(255,255,255,0.15)"} !important}
    .settl-form .border-white\\/20{border-color:${isLight ? "rgba(0,0,0,0.2)" : "rgba(255,255,255,0.2)"} !important}
    .settl-form .border-white\\/30{border-color:${isLight ? "rgba(0,0,0,0.3)" : "rgba(255,255,255,0.3)"} !important}
  `;

  // ── PIN GATE ──
  if (!pinUnlocked) {
    return (
      <div className="settl-form min-h-screen flex flex-col items-center justify-center px-6" style={{ background: bg }}>
        <style>{formCSS}</style>
        <div className="fade-up text-center max-w-sm w-full">
          {club.logo_url
            ? <img src={club.logo_url} alt={club.name} className="w-24 h-24 object-contain mx-auto mb-6 mix-blend-multiply" />
            : <img src="/settlyou-logo-white.png" alt="Settl" className="h-7 object-contain mx-auto mb-6 opacity-90" />
          }
          <h2 className="text-2xl font-bold text-white mb-2">{t("Enter your PIN")}</h2>
          <p className="text-white/40 text-sm mb-8">{t("Your institution sent you a 4-digit PIN with this link.")}</p>
          <input
            type="text"
            inputMode="numeric"
            maxLength={4}
            value={pinInput}
            onChange={(e) => setPinInput(e.target.value.replace(/\D/g, ""))}
            onKeyDown={(e) => e.key === "Enter" && pinInput.length === 4 && verifyPin()}
            className="bg-white/5 border border-white/15 rounded-xl px-4 py-4 text-3xl font-mono tracking-[0.5em] text-center text-white w-48 outline-none mb-4 transition-colors"
            style={{ "--tw-ring-color": primary }}
            placeholder="····"
            autoFocus
          />
          {pinError && <p className="text-red-400 text-sm mb-4">{pinError}</p>}
          <button
            type="button"
            onClick={verifyPin}
            disabled={pinInput.length !== 4 || pinChecking}
            className="text-white px-8 py-3 rounded-xl text-sm font-semibold transition-all disabled:opacity-40 w-full"
            style={{ backgroundColor: primary }}
          >
            {pinChecking ? "Checking..." : "Continue"}
          </button>
        </div>
      </div>
    );
  }

  // ── WELCOME ──
  if (!welcomeSeen) {
    return (
      <div className="settl-form min-h-screen flex flex-col items-center justify-center px-6" style={{ background: bg }}>
        <style>{formCSS}</style>
        <div className="fade-up text-center max-w-sm w-full flex flex-col items-center">
          {club.logo_url
            ? <img src={club.logo_url} alt={club.name} className="w-24 h-24 object-contain mx-auto mb-6 mix-blend-multiply" />
            : <img src="/settlyou-logo-white.png" alt="Settl" className="h-8 object-contain mx-auto mb-6 opacity-90" />
          }
          <h1 className="text-3xl font-bold text-white mb-3">Welcome to {club.name}</h1>
          <p className="text-white/50 text-sm leading-relaxed mb-8">
            {t("We'd love to get to know you a little — it takes under 5 minutes and helps us build a personalized guide with the best recommendations for your new city.")}
          </p>
          <button
            type="button"
            onClick={() => setWelcomeSeen(true)}
            className="club-btn w-full py-3.5 rounded-xl text-sm font-semibold transition-all"
          >
            {t("Let's get started")}
          </button>
          <p className="text-white/25 text-xs mt-5">{t("Powered by Settlyou")}</p>
        </div>
      </div>
    );
  }

  // ── SUCCESS ──
  if (submitted) {
    if (typeof window !== "undefined") {
      setTimeout(() => { window.location.href = "/"; }, 4000);
    }
    return (
      <div className="settl-form min-h-screen flex flex-col items-center justify-center px-6" style={{ background: bg }}>
        <style>{formCSS}</style>
        <div className="fade-up text-center max-w-md">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6" style={{ backgroundColor: `${textColor}15`, border: `1px solid ${textColor}30` }}>
            <svg className="w-8 h-8" style={{ color: textColor }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-white mb-3">{t("You're all set!")}</h2>
          <p className="text-white/50 leading-relaxed">
            {t("Your personalized relocation guide is being built.")}{form.athlete_email ? ` ${t("We'll send it to your email once it's ready.")}` : ` ${t("Your institution will share it with you once it's ready.")}`}
          </p>
        </div>
      </div>
    );
  }

  const secondary = club.secondary_color || "#ffffff";

  // ── MAIN FORM ──

  return (
    <div className="settl-form min-h-screen flex flex-col" style={{ background: bg }}>
      <style>{formCSS}</style>

      {/* Progress bar */}
      <div className="h-1 bg-white/10 fixed top-0 left-0 right-0 z-10">
        <div className="club-progress h-full transition-all duration-500 ease-out rounded-r-full" style={{ width: `${progress}%` }} />
      </div>

      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 pt-5">
        <div className="flex items-center gap-2">
          {club.logo_url
            ? <img src={club.logo_url} alt={club.name} className="w-6 h-6 object-contain opacity-80" />
            : <img src="/settlyou-logo-white.png" alt="Settl" className="h-5 object-contain opacity-80" />
          }
          <span className="text-sm text-white/40 font-medium">{club.name}</span>
        </div>
        <span className="text-xs text-white/50 font-medium">{qIndex + 1} / {questions.length}</span>
      </div>

      {/* Question */}
      <div key={animKey} className="slide-up flex-1 flex flex-col justify-center px-6 sm:px-12 max-w-2xl mx-auto w-full py-10">
        <div className="mb-8">
          <span className="club-accent text-sm font-bold mb-3 block">{qIndex + 1} →</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white leading-tight mb-2">
            {current.question}
          </h2>
          {current.hint && <p className="text-white/40 text-base mt-2">{current.hint}</p>}
        </div>

        {/* Final screen content */}
        {current.isLast ? (
          <div className="flex flex-col gap-6">
            <div>
              <Label>{t("Your email address — for email delivery")}</Label>
              <input
                className={iClass}
                type="email"
                value={form.athlete_email}
                onChange={(e) => set("athlete_email", e.target.value)}
                placeholder="carlos@email.com"
              />
            </div>
            <div>
              <Label>{t("Phone number (optional)")}</Label>
              <div className="flex gap-3">
                <select
                  value={form.phone_code}
                  onChange={(e) => set("phone_code", e.target.value)}
                  className="shrink-0 w-32 bg-white/10 border border-white/20 rounded-xl outline-none text-white text-base py-3 px-3 appearance-none"
                >
                  {DIAL_CODES.map((d) => (
                    <option key={d.code} value={d.code} className="bg-zinc-900">{d.label}</option>
                  ))}
                </select>
                <input
                  className="flex-1 min-w-0 bg-transparent border-b-2 border-white/40 outline-none text-white text-xl py-3 placeholder-white/30"
                  type="text"
                  value={form.phone_number}
                  onChange={(e) => set("phone_number", e.target.value)}
                  placeholder="555 123 4567"
                />
              </div>
            </div>
            <div>
              <Label>{t("Anything else we should know? (optional)")}</Label>
              <textarea className={taClass} rows={4}
                value={form.additional_notes}
                onChange={(e) => set("additional_notes", e.target.value)}
                placeholder="Allergies, specific needs, favorite surf spots..." />
            </div>
            <label className="flex items-start gap-3 cursor-pointer mt-2">
              <div onClick={() => setConsented((c) => !c)}
                className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all ${
                  consented ? "club-check" : "border-white/30"
                }`}>
                {consented && (
                  <svg className="w-3 h-3" style={{ color: textColor }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <span className="text-white/50 text-sm leading-relaxed">
                {t("I agree that my information will be used to generate my relocation guide and shared with")} {club.name}.{" "}
                <a href="/privacy" className="text-brand-400 hover:underline">{t("Privacy policy")}</a>
                <span className="block text-white/30 text-xs mt-1">Data handled in accordance with FERPA institutional disclosure policies.</span>
              </span>
            </label>
            {error && (
              <div className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
                {error}
              </div>
            )}
          </div>
        ) : (
          current.content
        )}
      </div>

      {/* Navigation */}
      <div className="px-6 sm:px-12 pb-8 max-w-2xl mx-auto w-full flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={goBack}
          className={`text-white/30 hover:text-white/60 text-sm transition-colors ${qIndex === 0 ? "invisible" : ""}`}
        >
          {t("Back")}
        </button>
        <div className="flex items-center gap-4">
          <span className="text-white/20 text-xs hidden sm:block">{t("Press Enter ↵")}</span>
          <button
            type="button"
            onClick={goNext}
            disabled={!current?.valid || submitting}
            className="club-btn text-white px-8 py-3 rounded-xl text-sm font-semibold transition-all"
          >
            {submitting ? "Submitting..." : current.isLast ? t("Get my guide") : t("Continue")}
          </button>
        </div>
      </div>

      {/* Powered by */}
      <div className="text-center pb-4">
        <span className="text-white/15 text-xs">{t("Powered by Settlyou")}</span>
      </div>
    </div>
  );
}
