"use client";

import { useState, useEffect, useRef } from "react";

const LANGUAGES = [
  "English", "Spanish", "Portuguese", "French", "German", "Italian",
  "Dutch", "Arabic", "Japanese", "Korean", "Mandarin", "Russian",
  "Turkish", "Swedish", "Danish", "Norwegian", "Polish", "Other",
];

const COUNTRIES = [
  "United States", "Chile", "Mexico", "Argentina", "Brazil", "Colombia",
  "Uruguay", "Paraguay", "Peru", "Ecuador", "Venezuela", "Bolivia",
  "Spain", "England", "Germany", "France", "Italy", "Portugal",
  "Netherlands", "Belgium", "Scotland", "Turkey", "Saudi Arabia",
  "UAE", "Japan", "South Korea", "Australia", "Other",
];

const SPORTS = [
  "Soccer / Football", "Basketball", "Baseball", "American Football", "Tennis",
  "Swimming", "Track & Field", "Volleyball", "Golf", "Wrestling",
  "Gymnastics", "Rowing", "Cross Country", "Lacrosse", "Other",
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

// All translatable strings — keys are English originals
const FORM_STRINGS = {
  "What language do you prefer?": "What language do you prefer?",
  "We'll switch the whole form to your language right away.": "We'll switch the whole form to your language right away.",
  "Translating...": "Translating...",
  "What's your name?": "What's your name?",
  "Where are you from?": "Where are you from?",
  "Sport and languages.": "Sport and languages.",
  "Which languages do you speak?": "Which languages do you speak?",
  "Select all that apply": "Select all that apply",
  "What sport do you play?": "What sport do you play?",
  "Pick your sport": "Pick your sport",
  "Your new club.": "Your new club.",
  "Where are you heading?": "Where are you heading?",
  "Tell us about your studies.": "Tell us about your studies.",
  "A few quick things.": "A few quick things.",
  "What kind of place are you looking for?": "What kind of place are you looking for?",
  "What kind of home are you looking for?": "What kind of home are you looking for?",
  "Who's moving with you?": "Who's moving with you?",
  "How do you eat and move?": "How do you eat and move?",
  "How do you live day to day?": "How do you live day to day?",
  "What do you do in your free time?": "What do you do in your free time?",
  "Schools, cars & healthcare.": "Schools, cars & healthcare.",
  "Almost there.": "Almost there.",
  "Last few things and your guide is on its way.": "Last few things and your guide is on its way.",
  "Full name": "Full name",
  "Age (optional)": "Age (optional)",
  "Nationality": "Nationality",
  "Your nationality": "Your nationality",
  "Current city (optional)": "Current city (optional)",
  "Current country (optional)": "Current country (optional)",
  "Sport": "Sport",
  "Languages spoken": "Languages spoken",
  "Club name": "Club name",
  "Training ground address (optional)": "Training ground address (optional)",
  "Destination city": "Destination city",
  "Country": "Country",
  "Move date (optional)": "Move date (optional)",
  "Contract duration (optional)": "Contract duration (optional)",
  "University / College": "University / College",
  "Campus city": "Campus city",
  "Major / Field of study (optional)": "Major / Field of study (optional)",
  "Semester start (optional)": "Semester start (optional)",
  "Monthly budget in USD (optional)": "Monthly budget in USD (optional)",
  "I have an athletic scholarship": "I have an athletic scholarship",
  "I'm part of a team": "I'm part of a team",
  "I'll be living on campus (dorms)": "I'll be living on campus (dorms)",
  "I'm coming from outside the US": "I'm coming from outside the US",
  "Studio": "Studio",
  "1-bedroom apartment": "1-bedroom apartment",
  "Shared apartment": "Shared apartment",
  "No preference": "No preference",
  "In-unit laundry": "In-unit laundry",
  "Furnished": "Furnished",
  "High-speed WiFi": "High-speed WiFi",
  "Parking": "Parking",
  "Pet-friendly": "Pet-friendly",
  "Near campus shuttle": "Near campus shuttle",
  "Gym access": "Gym access",
  "Study room": "Study room",
  "No restrictions": "No restrictions",
  "Halal": "Halal",
  "Kosher": "Kosher",
  "Vegetarian": "Vegetarian",
  "Vegan": "Vegan",
  "Gluten-free": "Gluten-free",
  "Dairy-free": "Dairy-free",
  "CrossFit": "CrossFit",
  "Traditional gym": "Traditional gym",
  "Swimming": "Swimming",
  "Yoga / Pilates": "Yoga / Pilates",
  "Cycling": "Cycling",
  "Martial arts": "Martial arts",
  "Running": "Running",
  "Property type": "Property type",
  "Must-haves (optional)": "Must-haves (optional)",
  "Max commute to campus in minutes (optional)": "Max commute to campus in minutes (optional)",
  "Max commute to training in minutes (optional)": "Max commute to training in minutes (optional)",
  "Minimum bedrooms (optional)": "Minimum bedrooms (optional)",
  "Monthly budget USD (optional)": "Monthly budget USD (optional)",
  "Total people moving (including yourself)": "Total people moving (including yourself)",
  "Partner's name (optional)": "Partner's name (optional)",
  "Children's ages, comma separated (optional)": "Children's ages, comma separated (optional)",
  "Family weekend activities (optional)": "Family weekend activities (optional)",
  "Pets?": "Pets?",
  "Yes, I have a pet": "Yes, I have a pet",
  "No pets": "No pets",
  "Tell us about your pet": "Tell us about your pet",
  "How often do family or friends visit from back home?": "How often do family or friends visit from back home?",
  "Preferred hotel budget for guests": "Preferred hotel budget for guests",
  "Dietary needs": "Dietary needs",
  "Diet": "Diet",
  "Fitness": "Fitness",
  "Fitness preferences": "Fitness preferences",
  "Hobbies": "Hobbies",
  "Hobbies & interests": "Hobbies & interests",
  "Nightlife interest (optional)": "Nightlife interest (optional)",
  "Religious or cultural needs (optional)": "Religious or cultural needs (optional)",
  "Do you need schools for your children?": "Do you need schools for your children?",
  "Yes, I need schools": "Yes, I need schools",
  "No, not needed": "No, not needed",
  "Do you need a car?": "Do you need a car?",
  "Yes": "Yes",
  "No": "No",
  "Healthcare preference": "Healthcare preference",
  "Private preferred": "Private preferred",
  "Standard / public": "Standard / public",
  "Your email address — we'll send your guide here": "Your email address — we'll send your guide here",
  "What language should your guide be written in?": "What language should your guide be written in?",
  "Anything else we should know? (optional)": "Anything else we should know? (optional)",
  "Continue →": "Continue →",
  "Get my guide →": "Get my guide →",
  "← Back": "← Back",
  "Press Enter ↵": "Press Enter ↵",
  "Powered by Settlyou": "Powered by Settlyou",
  "Enter your PIN": "Enter your PIN",
  "Your club sent you a 4-digit PIN with this link.": "Your club sent you a 4-digit PIN with this link.",
  "Checking...": "Checking...",
  "You're all set!": "You're all set!",
  "Your personalized relocation guide is being built.": "Your personalized relocation guide is being built.",
  "We'll send it to your email once it's ready.": "We'll send it to your email once it's ready.",
  "Your club will share it with you once it's ready.": "Your club will share it with you once it's ready.",
  "I agree that my information will be used to generate my relocation guide and shared with": "I agree that my information will be used to generate my relocation guide and shared with",
  "Privacy policy": "Privacy policy",
};

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
  const isCollege = club.type === "college";
  const DRAFT_KEY = `settl_draft_${club.slug}`;

  const [pinUnlocked, setPinUnlocked] = useState(!club.hasPin);
  const [pinInput, setPinInput] = useState("");
  const [pinError, setPinError] = useState(null);
  const [pinChecking, setPinChecking] = useState(false);

  const [qIndex, setQIndex] = useState(0);
  const [animKey, setAnimKey] = useState(0);
  const [formStarted, setFormStarted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);
  const [consented, setConsented] = useState(false);

  const [formLang, setFormLang] = useState("English");
  const [translations, setTranslations] = useState(null);
  const [translating, setTranslating] = useState(false);

  // Returns translated string or original English
  const t = (str) => translations?.[str] ?? str;

  async function changeLanguage(lang) {
    setFormLang(lang);
    set("report_language", lang);
    if (lang === "English") { setTranslations(null); return; }
    setTranslating(true);
    try {
      const res = await fetch("/api/translate-form", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ language: lang, strings: FORM_STRINGS }),
      });
      const data = await res.json();
      setTranslations(data);
    } catch { /* fail silently, stay in English */ }
    finally { setTranslating(false); }
  }

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
    report_language: "English",
    club_joining: club.type === "pro" ? club.name : "",
    training_ground_address: "",
    contract_duration: "",
    university: isCollege ? club.name : "",
    major: "",
    has_scholarship: false,
    is_part_of_team: false,
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
    destination_city: "",
    destination_country: "",
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

  // Shared language question — first step in both flows
  const languageQuestion = {
    id: "language",
    question: "What language do you prefer?",
    hint: translating ? t("Translating...") : t("We'll switch the whole form to your language right away."),
    valid: !translating,
    content: (
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap gap-2">
          {GUIDE_LANGUAGES.map((l) => (
            <Chip key={l} label={l} selected={formLang === l} onClick={() => changeLanguage(l)} />
          ))}
        </div>
        {translating && (
          <div className="flex items-center gap-2 mt-2">
            <div className="w-4 h-4 border-2 border-current/30 border-t-current rounded-full animate-spin shrink-0" style={{ borderTopColor: "currentColor" }} />
            <span className="text-sm opacity-60">{t("Translating...")}</span>
          </div>
        )}
      </div>
    ),
  };

  // ── COLLEGE QUESTIONS ──
  const collegeQuestions = [
    languageQuestion,
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
          <div>
            <Label>{t("Age (optional)")}</Label>
            <input className={iClass} type="number" min={15} max={30}
              value={form.athlete_age} onChange={(e) => set("athlete_age", e.target.value)}
              placeholder="19"
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
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>{t("Current city (optional)")}</Label>
              <input className={iClass} value={form.current_city}
                onChange={(e) => set("current_city", e.target.value)} placeholder="Bogotá" />
            </div>
            <div>
              <Label>{t("Current country (optional)")}</Label>
              <select className={sClass} value={form.current_country}
                onChange={(e) => set("current_country", e.target.value)}>
                <option value="">Select...</option>
                {COUNTRIES.map((c) => <option key={c} className="bg-zinc-900">{c}</option>)}
              </select>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "sport",
      question: t("What sport do you play?"),
      valid: true,
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
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>{t("Campus city")}</Label>
              <input className={iClass} value={form.destination_city}
                onChange={(e) => set("destination_city", e.target.value)} placeholder="Miami" />
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
      valid: true,
      content: (
        <div className="flex flex-col gap-6">
          <div>
            <Label>{t("Major / Field of study (optional)")}</Label>
            <input className={iClass} value={form.major}
              onChange={(e) => set("major", e.target.value)} placeholder="Business Administration" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>{t("Semester start (optional)")}</Label>
              <input className={iClass} type="date" value={form.semester_start}
                onChange={(e) => set("semester_start", e.target.value)} />
            </div>
            <div>
              <Label>{t("Monthly budget in USD (optional)")}</Label>
              <input className={iClass} type="number" value={form.budget_usd}
                onChange={(e) => set("budget_usd", e.target.value)} placeholder="1500" />
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
            { field: "is_part_of_team", label: t("I'm part of a team") },
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
      question: t("How do you eat and move?"),
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
          <div>
            <Label>{t("Fitness preferences")}</Label>
            <div className="flex flex-wrap gap-2">
              {FITNESS.map((f) => (
                <Chip key={f} label={t(f)} selected={form.fitness.includes(f)} onClick={() => toggle("fitness", f)} />
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
    languageQuestion,
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
          <div>
            <Label>{t("Age (optional)")}</Label>
            <input className={iClass} type="number" min={16} max={50}
              value={form.athlete_age} onChange={(e) => set("athlete_age", e.target.value)}
              placeholder="24"
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
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Current city (optional)</Label>
              <input className={iClass} value={form.current_city}
                onChange={(e) => set("current_city", e.target.value)} placeholder="Lisbon" />
            </div>
            <div>
              <Label>Current country (optional)</Label>
              <select className={sClass} value={form.current_country}
                onChange={(e) => set("current_country", e.target.value)}>
                <option value="">Select...</option>
                {COUNTRIES.map((c) => <option key={c} className="bg-zinc-900">{c}</option>)}
              </select>
            </div>
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
      valid: !!form.destination_city && !!form.destination_country,
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
              <Label>{t("Move date (optional)")}</Label>
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
      valid: true,
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
              <Label>{t("Monthly budget USD (optional)")}</Label>
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
              <div>
                <Label>{t("Family weekend activities (optional)")}</Label>
                <div className="flex flex-wrap gap-2">
                  {FAMILY_ACTIVITIES.map((a) => (
                    <Chip key={a} label={a} selected={form.family_activities.includes(a)}
                      onClick={() => toggle("family_activities", a)} />
                  ))}
                </div>
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
          <div>
            <Label>{t("How often do family or friends visit from back home?")}</Label>
            <div className="flex flex-wrap gap-2">
              {["Rarely", "A few times a year", "Monthly", "Very often"].map((f) => (
                <Chip key={f} label={f} selected={form.guest_visit_frequency === f}
                  onClick={() => set("guest_visit_frequency", f)} />
              ))}
            </div>
          </div>
          {form.guest_visit_frequency && form.guest_visit_frequency !== "Rarely" && (
            <div>
              <Label>{t("Preferred hotel budget for guests")}</Label>
              <div className="flex flex-wrap gap-2">
                {["Budget ($60–100/night)", "Mid-range ($100–200/night)", "Upscale ($200+/night)"].map((b) => (
                  <Chip key={b} label={b} selected={form.guest_hotel_budget === b}
                    onClick={() => set("guest_hotel_budget", b)} />
                ))}
              </div>
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
            <Label>{t("Fitness")}</Label>
            <div className="flex flex-wrap gap-2">
              {FITNESS.map((f) => (
                <Chip key={f} label={t(f)} selected={form.fitness.includes(f)} onClick={() => toggle("fitness", f)} />
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
            <Label>{t("Nightlife interest (optional)")}</Label>
            <div className="flex flex-wrap gap-2">
              {["Not interested", "Occasional nights out", "Active nightlife"].map((n) => (
                <Chip key={n} label={n} selected={form.nightlife_interest === n}
                  onClick={() => set("nightlife_interest", n)} />
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
        budget_usd: form.budget_usd ? parseInt(form.budget_usd) : null,
        children_ages: form.children_ages
          ? form.children_ages.split(",").map((a) => parseInt(a.trim())).filter(Boolean)
          : [],
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
          {club.logo_url && (
            <img src={club.logo_url} alt={club.name} className="w-14 h-14 object-contain mx-auto mb-6 opacity-90" />
          )}
          <h2 className="text-2xl font-bold text-white mb-2">{t("Enter your PIN")}</h2>
          <p className="text-white/40 text-sm mb-8">{t("Your club sent you a 4-digit PIN with this link.")}</p>
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
            {pinChecking ? "Checking..." : "Continue →"}
          </button>
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
            {t("Your personalized relocation guide is being built.")}{form.athlete_email ? ` ${t("We'll send it to your email once it's ready.")}` : ` ${t("Your club will share it with you once it's ready.")}`}
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
      <div className="h-0.5 bg-white/5 fixed top-0 left-0 right-0 z-10">
        <div className="club-progress h-full transition-all duration-500 ease-out" style={{ width: `${progress}%` }} />
      </div>

      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 pt-5">
        <div className="flex items-center gap-2">
          {club.logo_url
            ? <img src={club.logo_url} alt={club.name} className="w-6 h-6 object-contain opacity-80" />
            : <div className="w-6 h-6 rounded flex items-center justify-center text-xs font-bold" style={{ backgroundColor: `${primary}40`, color: primary }}>{club.name[0]}</div>
          }
          <span className="text-sm text-white/40 font-medium">{club.name}</span>
        </div>
        <span className="text-xs text-white/25">{qIndex + 1} / {questions.length}</span>
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
              <Label>{t("Your email address — we'll send your guide here")}</Label>
              <input
                className={iClass}
                type="email"
                value={form.athlete_email}
                onChange={(e) => set("athlete_email", e.target.value)}
                placeholder="carlos@email.com"
              />
            </div>
            <div>
              <Label>{t("What language should your guide be written in?")}</Label>
              <select className={sClass} value={form.report_language}
                onChange={(e) => set("report_language", e.target.value)}>
                {GUIDE_LANGUAGES.map((l) => <option key={l} className="bg-zinc-900">{l}</option>)}
              </select>
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
          {t("← Back")}
        </button>
        <div className="flex items-center gap-4">
          <span className="text-white/20 text-xs hidden sm:block">{t("Press Enter ↵")}</span>
          <button
            type="button"
            onClick={goNext}
            disabled={!current?.valid || submitting}
            className="club-btn text-white px-8 py-3 rounded-xl text-sm font-semibold transition-all"
          >
            {submitting ? "Submitting..." : current.isLast ? t("Get my guide →") : t("Continue →")}
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
