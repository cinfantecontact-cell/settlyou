"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const PRO_STEPS = ["Athlete", "Family", "Destination", "Housing", "Lifestyle", "Schools & Cars", "Service"];
const COLLEGE_STEPS = ["Athlete", "Campus", "Housing", "Lifestyle", "Service"];

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

const HOUSING_TYPES = ["Apartment", "House", "Villa", "Penthouse", "No preference"];
const HOBBIES = ["Golf", "Tennis", "Swimming", "Gaming", "Music", "Fishing", "Cooking", "Travel", "Art", "Reading"];
const FAMILY_ACTIVITIES = ["Outdoors & Nature", "Museums & Culture", "Theme Parks", "Sports Events", "Beach & Water", "Concerts & Shows", "City Exploration", "Playgrounds & Parks"];
const FITNESS = ["CrossFit", "Traditional gym", "Swimming", "Yoga / Pilates", "Cycling", "Martial arts", "Running", "No preference"];
const DIET = ["No restrictions", "Halal", "Kosher", "Vegetarian", "Vegan", "Gluten-free", "Dairy-free"];
const MUST_HAVES = ["Pool", "Garden / Terrace", "Parking", "In-building gym", "Security / Gated", "Pet-friendly", "Furnished", "Elevator", "Storage"];
const COLLEGE_MUST_HAVES = ["In-unit laundry", "Furnished", "High-speed WiFi", "Parking", "Pet-friendly", "Near campus shuttle", "Gym access", "Study room"];
const NEIGHBORHOOD = ["City center", "Suburbs", "Gated community", "Near training ground", "Beachfront", "No preference"];
const SCHOOL_TYPE = ["International", "Bilingual", "Local / Public", "Religious", "No preference"];
const CURRICULUM = ["IB (International Baccalaureate)", "American", "British", "French", "Local curriculum", "No preference"];
const CAR_TYPE = ["Economy", "SUV", "Luxury sedan", "Luxury SUV", "Van / Family", "No preference"];
const CLIMATE_PREF = ["Used to tropical / hot", "Used to cold / snow", "Used to temperate / mild", "No strong preference"];
const COOKING_HABITS = ["Cook daily", "Meal prep weekly", "Mix of cooking and eating out", "Eat out mostly"];
const RELOCATION_EXP = ["First time abroad", "Relocated once before", "Experienced — multiple relocations"];
const TRAINING_SCHEDULE = ["Morning (before noon)", "Afternoon", "Evening", "Varies / mixed"];

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

const inputClass = "border border-border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition bg-white w-full";
const selectClass = `${inputClass}`;

function StepIndicator({ current, steps }) {
  return (
    <div className="flex items-center gap-1 mb-8 flex-wrap">
      {steps.map((step, i) => (
        <div key={step} className="flex items-center gap-1">
          <div className={`flex items-center justify-center w-7 h-7 rounded-full text-xs font-semibold transition-colors shrink-0 ${
            i < current ? "bg-brand-600 text-white" :
            i === current ? "bg-brand-600 text-white" :
            "bg-gray-100 text-muted"
          }`}>
            {i < current ? (
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            ) : i + 1}
          </div>
          <span className={`text-xs ${i === current ? "font-medium text-foreground" : "text-muted"} hidden sm:inline`}>
            {step}
          </span>
          {i < steps.length - 1 && <div className="w-4 h-px bg-border mx-0.5" />}
        </div>
      ))}
    </div>
  );
}

function ToggleChip({ label, selected, onClick }) {
  return (
    <button type="button" onClick={onClick}
      className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
        selected ? "bg-brand-600 text-white border-brand-600" : "bg-white text-foreground border-border hover:border-brand-400"
      }`}>
      {label}
    </button>
  );
}

function Field({ label, hint, children, col }) {
  return (
    <div className={`flex flex-col gap-1.5 ${col || ""}`}>
      <label className="text-sm font-medium text-foreground">
        {label}{" "}
        {hint && <span className="text-muted font-normal">{hint}</span>}
      </label>
      {children}
    </div>
  );
}

function SectionTitle({ children }) {
  return <h2 className="font-semibold text-foreground text-base mb-1">{children}</h2>;
}

function Divider() {
  return <div className="border-t border-border my-2" />;
}

export default function NewRequestPage() {
  const router = useRouter();
  const [athleteType, setAthleteType] = useState(null); // "professional" | "college"
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const [form, setForm] = useState({
    athlete_type: "",
    // Athlete
    athlete_name: "",
    athlete_age: "",
    athlete_nationality: "",
    phone_code: "+1",
    phone_number: "",
    athlete_languages: [],
    sport: "",
    current_city: "",
    current_country: "",
    // Pro only
    club_joining: "",
    training_ground_address: "",
    contract_duration: "",
    // College only
    university: "",
    major: "",
    has_scholarship: false,
    on_campus_housing: false,
    semester_start: "",
    is_international: true,
    visa_type: "",
    is_part_of_team: true,
    // Family (pro)
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
    // Destination
    destination_city: "",
    destination_country: "",
    move_date: "",
    budget_usd: "",
    // Housing
    housing_type: "No preference",
    min_bedrooms: "",
    housing_must_haves: [],
    neighborhood_type: [],
    max_commute_minutes: "",
    // Lifestyle
    diet: [],
    fitness: [],
    hobbies: [],
    family_activities: [],
    social_preference: "",
    nightlife_interest: "",
    interested_in_language_classes: false,
    community_preference: "",
    religious_needs: "",
    // Schools (pro)
    needs_school: false,
    school_type: [],
    school_curriculum: [],
    // Cars
    needs_car: false,
    num_cars: "1",
    car_type: "No preference",
    car_buy_or_rent: "rent",
    license_country: "",
    // Healthcare
    needs_private_healthcare: false,
    medical_specialists: "",
    // New personalization fields
    previous_relocation: "",
    climate_preference: "",
    training_schedule: "",
    cooking_habits: "",
    biggest_concerns: "",
    // Service
    service_tier: "basic",
    report_language: "English",
    additional_notes: "",
  });

  function set(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function toggleArray(field, value) {
    setForm((f) => ({
      ...f,
      [field]: f[field].includes(value)
        ? f[field].filter((v) => v !== value)
        : [...f[field], value],
    }));
  }

  function selectType(type) {
    setAthleteType(type);
    set("athlete_type", type);
    setStep(0);
  }

  const steps = athleteType === "college" ? COLLEGE_STEPS : PRO_STEPS;
  const isLastStep = step === steps.length - 1;

  async function handleSubmit() {
    setSubmitting(true);
    setError(null);

    const res = await fetch("/api/requests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        budget_usd: form.budget_usd ? parseInt(form.budget_usd) : null,
        children_ages: form.children_ages
          ? form.children_ages.split(",").map((a) => parseInt(a.trim())).filter(Boolean)
          : [],
        athlete_phone: form.phone_number ? `${form.phone_code} ${form.phone_number}` : null,
      }),
    });

    if (res.ok) {
      router.push("/requests?submitted=1");
    } else {
      const data = await res.json();
      setError(data.error ?? "Something went wrong. Please try again.");
      setSubmitting(false);
    }
  }

  const canAdvance = () => {
    if (athleteType === "college") {
      if (step === 0) return form.athlete_name && form.athlete_nationality && form.athlete_languages.length && form.sport;
      if (step === 1) return form.university && form.destination_city && form.destination_country;
    } else {
      if (step === 0) return form.athlete_name && form.athlete_nationality && form.athlete_languages.length;
      if (step === 2) return form.destination_city && form.destination_country;
    }
    return true;
  };

  // ─── Type selector ───
  if (!athleteType) {
    return (
      <div className="p-8 max-w-2xl">
        <div className="mb-6">
          <a href="/dashboard" className="text-sm text-muted hover:text-foreground transition-colors">← Back</a>
          <h1 className="text-2xl font-bold text-foreground mt-4">New relocation request</h1>
          <p className="text-sm text-muted mt-1">Who is this guide for?</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button type="button" onClick={() => selectType("professional")}
            className="text-left p-6 rounded-xl border-2 border-border hover:border-brand-500 transition-colors bg-white group">
            <div className="text-3xl mb-3">⚽</div>
            <div className="font-bold text-foreground text-lg mb-1">Professional Athlete</div>
            <div className="text-sm text-muted">Signing with a club, relocating with family, full relocation package.</div>
          </button>
          <button type="button" onClick={() => selectType("college")}
            className="text-left p-6 rounded-xl border-2 border-border hover:border-brand-500 transition-colors bg-white group">
            <div className="text-3xl mb-3">🎓</div>
            <div className="font-bold text-foreground text-lg mb-1">College Student</div>
            <div className="text-sm text-muted">Arriving at a US university — athlete or general student, domestic or international.</div>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-2xl">
      <div className="mb-6">
        <button onClick={() => { setAthleteType(null); setStep(0); }}
          className="text-sm text-muted hover:text-foreground transition-colors">← Back</button>
        <h1 className="text-2xl font-bold text-foreground mt-4">New relocation request</h1>
        <p className="text-xs text-muted mt-1 uppercase tracking-widest font-medium">
          {athleteType === "college" ? "College Athlete" : "Professional Athlete"}
        </p>
      </div>

      <StepIndicator current={step} steps={steps} />

      <div className="bg-white rounded-xl border border-border p-6">

        {/* ══════════════════════════════════════════
            COLLEGE FORM
        ══════════════════════════════════════════ */}

        {athleteType === "college" && (
          <>
            {/* College Step 0: Student */}
            {step === 0 && (
              <div className="flex flex-col gap-5">
                <SectionTitle>Student information</SectionTitle>

                <Field label="Full name">
                  <input className={inputClass} value={form.athlete_name}
                    onChange={(e) => set("athlete_name", e.target.value)} placeholder="Carlos Mendoza" />
                </Field>

                <Field label="Phone number" hint="(optional)">
                  <div className="flex gap-2">
                    <select className={`${selectClass} w-36 shrink-0`} value={form.phone_code}
                      onChange={(e) => set("phone_code", e.target.value)}>
                      {DIAL_CODES.map((d) => <option key={d.code} value={d.code}>{d.label}</option>)}
                    </select>
                    <input className={`${inputClass} flex-1 min-w-0`} type="text" value={form.phone_number}
                      onChange={(e) => set("phone_number", e.target.value)} placeholder="555 123 4567" />
                  </div>
                </Field>

                <Field label="Nationality">
                  <select className={selectClass} value={form.athlete_nationality}
                    onChange={(e) => set("athlete_nationality", e.target.value)}>
                    <option value="">Select country...</option>
                    {COUNTRIES.map((c) => <option key={c}>{c}</option>)}
                  </select>
                </Field>

                <Field label="Sport">
                  <select className={selectClass} value={form.sport}
                    onChange={(e) => set("sport", e.target.value)}>
                    <option value="">Select sport...</option>
                    {SPORTS.map((s) => <option key={s}>{s}</option>)}
                  </select>
                </Field>

                <Field label="Languages spoken">
                  <div className="flex flex-wrap gap-2 mt-1">
                    {LANGUAGES.map((l) => (
                      <ToggleChip key={l} label={l}
                        selected={form.athlete_languages.includes(l)}
                        onClick={() => toggleArray("athlete_languages", l)} />
                    ))}
                  </div>
                </Field>

              </div>
            )}

            {/* College Step 1: Campus */}
            {step === 1 && (
              <div className="flex flex-col gap-5">
                <SectionTitle>University & Campus</SectionTitle>

                <Field label="University / College">
                  <input className={inputClass} value={form.university}
                    onChange={(e) => set("university", e.target.value)} placeholder="University of Miami" />
                </Field>

                <div className="grid grid-cols-3 gap-4">
                  <Field label="Campus city">
                    <input className={inputClass} value={form.destination_city}
                      onChange={(e) => set("destination_city", e.target.value)} placeholder="Miami" />
                  </Field>
                  <Field label="State" hint="(US only)">
                    <input className={inputClass} value={form.destination_state ?? ""}
                      onChange={(e) => set("destination_state", e.target.value)} placeholder="FL" />
                  </Field>
                  <Field label="Campus country">
                    <select className={selectClass} value={form.destination_country}
                      onChange={(e) => set("destination_country", e.target.value)}>
                      <option value="">Select country...</option>
                      {COUNTRIES.map((c) => <option key={c}>{c}</option>)}
                    </select>
                  </Field>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Field label="Semester start" hint="(optional)">
                    <input className={inputClass} type="date" value={form.semester_start}
                      onChange={(e) => set("semester_start", e.target.value)} />
                  </Field>
                  <Field label="Monthly budget" hint="(USD, optional)">
                    <input className={inputClass} type="number" value={form.budget_usd}
                      onChange={(e) => set("budget_usd", e.target.value)} placeholder="1500" />
                  </Field>
                </div>

                <div className="flex flex-col gap-3">
                  {form.is_part_of_team && (
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={form.has_scholarship}
                        onChange={(e) => set("has_scholarship", e.target.checked)} className="accent-brand-600 w-4 h-4" />
                      <span className="text-sm text-foreground">Athletic scholarship</span>
                    </label>
                  )}
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={form.on_campus_housing}
                      onChange={(e) => set("on_campus_housing", e.target.checked)} className="accent-brand-600 w-4 h-4" />
                    <span className="text-sm text-foreground">Living on campus (dorms)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={form.is_international}
                      onChange={(e) => { set("is_international", e.target.checked); if (!e.target.checked) set("visa_type", ""); }} className="accent-brand-600 w-4 h-4" />
                    <span className="text-sm text-foreground">International student (coming from outside the US)</span>
                  </label>
                </div>

                {form.is_international && (
                  <Field label="Visa type">
                    <select className={selectClass} value={form.visa_type}
                      onChange={(e) => set("visa_type", e.target.value)}>
                      <option value="">Select visa type...</option>
                      <option value="F-1">F-1 Student Visa</option>
                      <option value="J-1">J-1 Exchange Visitor Visa</option>
                      <option value="other">Other / Not sure</option>
                    </select>
                  </Field>
                )}
              </div>
            )}

            {/* College Step 2: Housing */}
            {step === 2 && (
              <div className="flex flex-col gap-5">
                <SectionTitle>Housing preferences</SectionTitle>

                <Field label="Property type">
                  <div className="flex flex-wrap gap-2 mt-1">
                    {["Studio", "1-bedroom apartment", "Shared apartment", "No preference"].map((h) => (
                      <ToggleChip key={h} label={h} selected={form.housing_type === h}
                        onClick={() => set("housing_type", h)} />
                    ))}
                  </div>
                </Field>

                <Field label="Must-haves">
                  <div className="flex flex-wrap gap-2 mt-1">
                    {COLLEGE_MUST_HAVES.map((h) => (
                      <ToggleChip key={h} label={h}
                        selected={form.housing_must_haves.includes(h)}
                        onClick={() => toggleArray("housing_must_haves", h)} />
                    ))}
                  </div>
                </Field>

                <Field label="Max commute to campus" hint="(minutes, optional)">
                  <input className={inputClass} type="number" value={form.max_commute_minutes}
                    onChange={(e) => set("max_commute_minutes", e.target.value)} placeholder="20" />
                </Field>

                <Divider />
                <SectionTitle>Pets</SectionTitle>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.has_pets}
                    onChange={(e) => set("has_pets", e.target.checked)} className="accent-brand-600 w-4 h-4" />
                  <span className="text-sm text-foreground">I have a pet</span>
                </label>

                {form.has_pets && (
                  <Field label="Pet details">
                    <input className={inputClass} value={form.pet_details}
                      onChange={(e) => set("pet_details", e.target.value)} placeholder="Small dog, chihuahua" />
                  </Field>
                )}
              </div>
            )}

            {/* College Step 3: Lifestyle */}
            {step === 3 && (
              <div className="flex flex-col gap-5">
                <SectionTitle>About the student</SectionTitle>

                <Field label="Training schedule">
                  <div className="flex flex-wrap gap-2 mt-1">
                    {TRAINING_SCHEDULE.map((t) => (
                      <ToggleChip key={t} label={t} selected={form.training_schedule === t}
                        onClick={() => set("training_schedule", t)} />
                    ))}
                  </div>
                </Field>

                <Field label="Cooking habits">
                  <div className="flex flex-wrap gap-2 mt-1">
                    {COOKING_HABITS.map((c) => (
                      <ToggleChip key={c} label={c} selected={form.cooking_habits === c}
                        onClick={() => set("cooking_habits", c)} />
                    ))}
                  </div>
                </Field>

                <Field label="Biggest concerns about the move" hint="(optional)">
                  <textarea className={`${inputClass} resize-none`} rows={2}
                    value={form.biggest_concerns}
                    onChange={(e) => set("biggest_concerns", e.target.value)}
                    placeholder="I'm worried about making friends, the language barrier, finding food I like..." />
                </Field>

                <Divider />
                <SectionTitle>Diet & Nutrition</SectionTitle>
                <Field label="Dietary requirements">
                  <div className="flex flex-wrap gap-2 mt-1">
                    {DIET.map((d) => (
                      <ToggleChip key={d} label={d} selected={form.diet.includes(d)}
                        onClick={() => toggleArray("diet", d)} />
                    ))}
                  </div>
                </Field>

                <Field label="Religious or cultural needs" hint="(optional)">
                  <input className={inputClass} value={form.religious_needs}
                    onChange={(e) => set("religious_needs", e.target.value)}
                    placeholder="Mosque nearby, halal food, etc." />
                </Field>

                <Divider />
                <SectionTitle>Hobbies & Interests</SectionTitle>

                <Field label="Hobbies & interests">
                  <div className="flex flex-wrap gap-2 mt-1">
                    {HOBBIES.map((h) => (
                      <ToggleChip key={h} label={h} selected={form.hobbies.includes(h)}
                        onClick={() => toggleArray("hobbies", h)} />
                    ))}
                  </div>
                </Field>
              </div>
            )}

            {/* College Step 4: Service */}
            {step === 4 && (
              <div className="flex flex-col gap-5">
                <SectionTitle>Anything else?</SectionTitle>

                <Field label="Additional notes" hint="(optional)">
                  <textarea className={`${inputClass} resize-none`} rows={4}
                    value={form.additional_notes}
                    onChange={(e) => set("additional_notes", e.target.value)}
                    placeholder="Anything else that would help us personalize this athlete's guide..." />
                </Field>

                {error && (
                  <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
                    {error}
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {/* ══════════════════════════════════════════
            PROFESSIONAL FORM
        ══════════════════════════════════════════ */}

        {athleteType === "professional" && (
          <>
            {/* Pro Step 0: Athlete */}
            {step === 0 && (
              <div className="flex flex-col gap-5">
                <SectionTitle>Athlete information</SectionTitle>

                <div className="grid grid-cols-2 gap-4">
                  <Field label="Full name">
                    <input className={inputClass} value={form.athlete_name}
                      onChange={(e) => set("athlete_name", e.target.value)} placeholder="Carlos Mendoza" />
                  </Field>
                  <Field label="Age" hint="(optional)">
                    <input className={inputClass} type="number" min={15} max={50}
                      value={form.athlete_age} onChange={(e) => set("athlete_age", e.target.value)} placeholder="24" />
                  </Field>
                </div>

                <Field label="Phone number" hint="(optional)">
                  <div className="flex gap-2">
                    <select className={`${selectClass} w-36 shrink-0`} value={form.phone_code}
                      onChange={(e) => set("phone_code", e.target.value)}>
                      {DIAL_CODES.map((d) => <option key={d.code} value={d.code}>{d.label}</option>)}
                    </select>
                    <input className={`${inputClass} flex-1 min-w-0`} type="text" value={form.phone_number}
                      onChange={(e) => set("phone_number", e.target.value)} placeholder="555 123 4567" />
                  </div>
                </Field>

                <Field label="Nationality">
                  <select className={selectClass} value={form.athlete_nationality}
                    onChange={(e) => set("athlete_nationality", e.target.value)}>
                    <option value="">Select country...</option>
                    {COUNTRIES.map((c) => <option key={c}>{c}</option>)}
                  </select>
                </Field>

                <Field label="Languages spoken">
                  <div className="flex flex-wrap gap-2 mt-1">
                    {LANGUAGES.map((l) => (
                      <ToggleChip key={l} label={l}
                        selected={form.athlete_languages.includes(l)}
                        onClick={() => toggleArray("athlete_languages", l)} />
                    ))}
                  </div>
                </Field>

                <Divider />
                <SectionTitle>Current location</SectionTitle>

                <div className="grid grid-cols-2 gap-4">
                  <Field label="Current city" hint="(optional)">
                    <input className={inputClass} value={form.current_city}
                      onChange={(e) => set("current_city", e.target.value)} placeholder="Barcelona" />
                  </Field>
                  <Field label="Current country" hint="(optional)">
                    <select className={selectClass} value={form.current_country}
                      onChange={(e) => set("current_country", e.target.value)}>
                      <option value="">Select...</option>
                      {COUNTRIES.map((c) => <option key={c}>{c}</option>)}
                    </select>
                  </Field>
                </div>

                <Divider />
                <SectionTitle>Club details</SectionTitle>

                <div className="grid grid-cols-2 gap-4">
                  <Field label="Club / Team joining">
                    <input className={inputClass} value={form.club_joining}
                      onChange={(e) => set("club_joining", e.target.value)} placeholder="LA Galaxy" />
                  </Field>
                  <Field label="Contract duration" hint="(optional)">
                    <select className={selectClass} value={form.contract_duration}
                      onChange={(e) => set("contract_duration", e.target.value)}>
                      <option value="">Select...</option>
                      <option>6 months (loan)</option>
                      <option>1 year</option>
                      <option>2 years</option>
                      <option>3 years</option>
                      <option>4+ years</option>
                    </select>
                  </Field>
                </div>

                <Field label="Training ground address" hint="(optional)">
                  <input className={inputClass} value={form.training_ground_address}
                    onChange={(e) => set("training_ground_address", e.target.value)}
                    placeholder="18400 S Avalon Blvd, Carson, CA" />
                </Field>
              </div>
            )}

            {/* Pro Step 1: Family */}
            {step === 1 && (
              <div className="flex flex-col gap-5">
                <SectionTitle>Family</SectionTitle>

                <div className="grid grid-cols-2 gap-4">
                  <Field label="Total family members moving" hint="(including athlete)">
                    <input className={inputClass} type="number" min={1} max={20}
                      value={form.family_size} onChange={(e) => set("family_size", parseInt(e.target.value) || 1)} />
                  </Field>
                  <Field label="Children ages" hint="(comma separated)">
                    <input className={inputClass} value={form.children_ages}
                      onChange={(e) => set("children_ages", e.target.value)} placeholder="4, 7, 10" />
                  </Field>
                </div>

                <Divider />
                <SectionTitle>Partner / Spouse</SectionTitle>

                <div className="grid grid-cols-2 gap-4">
                  <Field label="Partner name" hint="(optional)">
                    <input className={inputClass} value={form.partner_name}
                      onChange={(e) => set("partner_name", e.target.value)} placeholder="María" />
                  </Field>
                  <Field label="Partner profession" hint="(optional)">
                    <input className={inputClass} value={form.partner_profession}
                      onChange={(e) => set("partner_profession", e.target.value)} placeholder="Architect" />
                  </Field>
                </div>

                <Field label="Partner languages" hint="(optional)">
                  <div className="flex flex-wrap gap-2 mt-1">
                    {LANGUAGES.map((l) => (
                      <ToggleChip key={l} label={l}
                        selected={form.partner_languages.includes(l)}
                        onClick={() => toggleArray("partner_languages", l)} />
                    ))}
                  </div>
                </Field>

                <Divider />
                <SectionTitle>Visiting Family & Guests</SectionTitle>

                <div className="grid grid-cols-2 gap-4">
                  <Field label="How often will family visit?" hint="(optional)">
                    <select className={selectClass} value={form.guest_visit_frequency}
                      onChange={(e) => set("guest_visit_frequency", e.target.value)}>
                      <option value="">Not sure</option>
                      <option>Rarely</option>
                      <option>A few times a year</option>
                      <option>Monthly</option>
                      <option>Very often</option>
                    </select>
                  </Field>
                  <Field label="Guest hotel budget" hint="(per night, optional)">
                    <select className={selectClass} value={form.guest_hotel_budget}
                      onChange={(e) => set("guest_hotel_budget", e.target.value)}>
                      <option value="">No preference</option>
                      <option>Budget (under $100/night)</option>
                      <option>Mid-range ($100–$250/night)</option>
                      <option>Luxury ($250+/night)</option>
                    </select>
                  </Field>
                </div>

                <Divider />
                <SectionTitle>Pets & Health</SectionTitle>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.has_pets}
                    onChange={(e) => set("has_pets", e.target.checked)} className="accent-brand-600 w-4 h-4" />
                  <span className="text-sm text-foreground">Athlete has pets</span>
                </label>

                {form.has_pets && (
                  <Field label="Pet details">
                    <input className={inputClass} value={form.pet_details}
                      onChange={(e) => set("pet_details", e.target.value)} placeholder="2 dogs — Golden Retriever, large breed" />
                  </Field>
                )}

                <Field label="Special medical or accessibility needs" hint="(optional)">
                  <textarea className={`${inputClass} resize-none`} rows={2}
                    value={form.medical_needs}
                    onChange={(e) => set("medical_needs", e.target.value)}
                    placeholder="Any ongoing treatments, mobility needs, etc." />
                </Field>
              </div>
            )}

            {/* Pro Step 2: Destination */}
            {step === 2 && (
              <div className="flex flex-col gap-5">
                <SectionTitle>Destination</SectionTitle>

                <div className="grid grid-cols-2 gap-4">
                  <Field label="City">
                    <input className={inputClass} value={form.destination_city}
                      onChange={(e) => set("destination_city", e.target.value)} placeholder="Los Angeles" />
                  </Field>
                  <Field label="Country">
                    <select className={selectClass} value={form.destination_country}
                      onChange={(e) => set("destination_country", e.target.value)}>
                      <option value="">Select country...</option>
                      {COUNTRIES.map((c) => <option key={c}>{c}</option>)}
                    </select>
                  </Field>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Field label="Expected move date" hint="(optional)">
                    <input className={inputClass} type="date" value={form.move_date}
                      onChange={(e) => set("move_date", e.target.value)} />
                  </Field>
                  <Field label="Monthly housing budget" hint="(USD, optional)">
                    <input className={inputClass} type="number" value={form.budget_usd}
                      onChange={(e) => set("budget_usd", e.target.value)} placeholder="8000" />
                  </Field>
                </div>
              </div>
            )}

            {/* Pro Step 3: Housing */}
            {step === 3 && (
              <div className="flex flex-col gap-5">
                <SectionTitle>Housing preferences</SectionTitle>

                <Field label="Property type">
                  <div className="flex flex-wrap gap-2 mt-1">
                    {HOUSING_TYPES.map((h) => (
                      <ToggleChip key={h} label={h} selected={form.housing_type === h}
                        onClick={() => set("housing_type", h)} />
                    ))}
                  </div>
                </Field>

                <div className="grid grid-cols-2 gap-4">
                  <Field label="Minimum bedrooms" hint="(optional)">
                    <select className={selectClass} value={form.min_bedrooms}
                      onChange={(e) => set("min_bedrooms", e.target.value)}>
                      <option value="">Any</option>
                      {[1,2,3,4,5,6].map((n) => <option key={n} value={n}>{n}+</option>)}
                    </select>
                  </Field>
                  <Field label="Max commute to training" hint="(minutes, optional)">
                    <input className={inputClass} type="number" value={form.max_commute_minutes}
                      onChange={(e) => set("max_commute_minutes", e.target.value)} placeholder="30" />
                  </Field>
                </div>

                <Field label="Must-haves">
                  <div className="flex flex-wrap gap-2 mt-1">
                    {MUST_HAVES.map((h) => (
                      <ToggleChip key={h} label={h}
                        selected={form.housing_must_haves.includes(h)}
                        onClick={() => toggleArray("housing_must_haves", h)} />
                    ))}
                  </div>
                </Field>

                <Field label="Preferred neighborhood type">
                  <div className="flex flex-wrap gap-2 mt-1">
                    {NEIGHBORHOOD.map((n) => (
                      <ToggleChip key={n} label={n}
                        selected={form.neighborhood_type.includes(n)}
                        onClick={() => toggleArray("neighborhood_type", n)} />
                    ))}
                  </div>
                </Field>
              </div>
            )}

            {/* Pro Step 4: Lifestyle */}
            {step === 4 && (
              <div className="flex flex-col gap-5">
                <SectionTitle>About the athlete</SectionTitle>

                <Field label="Relocation experience">
                  <div className="flex flex-wrap gap-2 mt-1">
                    {RELOCATION_EXP.map((r) => (
                      <ToggleChip key={r} label={r} selected={form.previous_relocation === r}
                        onClick={() => set("previous_relocation", r)} />
                    ))}
                  </div>
                </Field>

                <Field label="Climate they're used to">
                  <div className="flex flex-wrap gap-2 mt-1">
                    {CLIMATE_PREF.map((c) => (
                      <ToggleChip key={c} label={c} selected={form.climate_preference === c}
                        onClick={() => set("climate_preference", c)} />
                    ))}
                  </div>
                </Field>

                <Field label="Training schedule">
                  <div className="flex flex-wrap gap-2 mt-1">
                    {TRAINING_SCHEDULE.map((t) => (
                      <ToggleChip key={t} label={t} selected={form.training_schedule === t}
                        onClick={() => set("training_schedule", t)} />
                    ))}
                  </div>
                </Field>

                <Field label="Cooking habits">
                  <div className="flex flex-wrap gap-2 mt-1">
                    {COOKING_HABITS.map((c) => (
                      <ToggleChip key={c} label={c} selected={form.cooking_habits === c}
                        onClick={() => set("cooking_habits", c)} />
                    ))}
                  </div>
                </Field>

                <Field label="Biggest concerns about the move" hint="(optional)">
                  <textarea className={`${inputClass} resize-none`} rows={2}
                    value={form.biggest_concerns}
                    onChange={(e) => set("biggest_concerns", e.target.value)}
                    placeholder="Language barrier, finding the right neighborhood, partner's career..." />
                </Field>

                <Divider />
                <SectionTitle>Diet & Nutrition</SectionTitle>
                <Field label="Dietary requirements">
                  <div className="flex flex-wrap gap-2 mt-1">
                    {DIET.map((d) => (
                      <ToggleChip key={d} label={d} selected={form.diet.includes(d)}
                        onClick={() => toggleArray("diet", d)} />
                    ))}
                  </div>
                </Field>

                <Field label="Religious or cultural needs" hint="(optional)">
                  <input className={inputClass} value={form.religious_needs}
                    onChange={(e) => set("religious_needs", e.target.value)}
                    placeholder="Mosque nearby, kosher butcher, etc." />
                </Field>

                <Divider />
                <SectionTitle>Fitness & Hobbies</SectionTitle>

                <Field label="Fitness preferences">
                  <div className="flex flex-wrap gap-2 mt-1">
                    {FITNESS.map((f) => (
                      <ToggleChip key={f} label={f} selected={form.fitness.includes(f)}
                        onClick={() => toggleArray("fitness", f)} />
                    ))}
                  </div>
                </Field>

                <Field label="Hobbies & interests">
                  <div className="flex flex-wrap gap-2 mt-1">
                    {HOBBIES.map((h) => (
                      <ToggleChip key={h} label={h} selected={form.hobbies.includes(h)}
                        onClick={() => toggleArray("hobbies", h)} />
                    ))}
                  </div>
                </Field>

                <Field label="Family weekend activities" hint="(optional)">
                  <div className="flex flex-wrap gap-2 mt-1">
                    {FAMILY_ACTIVITIES.map((a) => (
                      <ToggleChip key={a} label={a}
                        selected={form.family_activities.includes(a)}
                        onClick={() => toggleArray("family_activities", a)} />
                    ))}
                  </div>
                </Field>

                <Divider />
                <SectionTitle>Social & Lifestyle</SectionTitle>

                <div className="grid grid-cols-2 gap-4">
                  <Field label="Neighborhood vibe">
                    <select className={selectClass} value={form.social_preference}
                      onChange={(e) => set("social_preference", e.target.value)}>
                      <option value="">No preference</option>
                      <option>Quiet and residential</option>
                      <option>Lively and urban</option>
                      <option>Family-friendly</option>
                      <option>Near expat community</option>
                    </select>
                  </Field>
                  <Field label="Nightlife interest">
                    <select className={selectClass} value={form.nightlife_interest}
                      onChange={(e) => set("nightlife_interest", e.target.value)}>
                      <option value="">No preference</option>
                      <option>Not important</option>
                      <option>Occasionally</option>
                      <option>Important</option>
                    </select>
                  </Field>
                </div>

                <Divider />
                <SectionTitle>Integration</SectionTitle>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.interested_in_language_classes}
                    onChange={(e) => set("interested_in_language_classes", e.target.checked)}
                    className="accent-brand-600 w-4 h-4" />
                  <span className="text-sm text-foreground">Interested in language classes</span>
                </label>

                <Field label="Community preference" hint="(optional)">
                  <select className={selectClass} value={form.community_preference}
                    onChange={(e) => set("community_preference", e.target.value)}>
                    <option value="">No preference</option>
                    <option>Expat / International community</option>
                    <option>Local integration</option>
                    <option>Mix of both</option>
                  </select>
                </Field>
              </div>
            )}

            {/* Pro Step 5: Schools & Cars */}
            {step === 5 && (
              <div className="flex flex-col gap-5">
                <SectionTitle>Schools</SectionTitle>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.needs_school}
                    onChange={(e) => set("needs_school", e.target.checked)} className="accent-brand-600 w-4 h-4" />
                  <span className="text-sm text-foreground">Needs school recommendations</span>
                </label>

                {form.needs_school && (
                  <>
                    <Field label="School type">
                      <div className="flex flex-wrap gap-2 mt-1">
                        {SCHOOL_TYPE.map((s) => (
                          <ToggleChip key={s} label={s} selected={form.school_type.includes(s)}
                            onClick={() => toggleArray("school_type", s)} />
                        ))}
                      </div>
                    </Field>
                    <Field label="Curriculum preference">
                      <div className="flex flex-wrap gap-2 mt-1">
                        {CURRICULUM.map((c) => (
                          <ToggleChip key={c} label={c} selected={form.school_curriculum.includes(c)}
                            onClick={() => toggleArray("school_curriculum", c)} />
                        ))}
                      </div>
                    </Field>
                  </>
                )}

                <Divider />
                <SectionTitle>Transportation</SectionTitle>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.needs_car}
                    onChange={(e) => set("needs_car", e.target.checked)} className="accent-brand-600 w-4 h-4" />
                  <span className="text-sm text-foreground">Needs car recommendations</span>
                </label>

                {form.needs_car && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <Field label="Number of cars">
                        <select className={selectClass} value={form.num_cars}
                          onChange={(e) => set("num_cars", e.target.value)}>
                          {["1","2","3"].map((n) => <option key={n} value={n}>{n}</option>)}
                        </select>
                      </Field>
                      <Field label="Buy or rent">
                        <select className={selectClass} value={form.car_buy_or_rent}
                          onChange={(e) => set("car_buy_or_rent", e.target.value)}>
                          <option value="rent">Rent / Lease</option>
                          <option value="buy">Buy</option>
                          <option value="either">Either</option>
                        </select>
                      </Field>
                    </div>
                    <Field label="Car type preference">
                      <div className="flex flex-wrap gap-2 mt-1">
                        {CAR_TYPE.map((c) => (
                          <ToggleChip key={c} label={c} selected={form.car_type === c}
                            onClick={() => set("car_type", c)} />
                        ))}
                      </div>
                    </Field>
                    <Field label="Driver's license country" hint="(optional)">
                      <select className={selectClass} value={form.license_country}
                        onChange={(e) => set("license_country", e.target.value)}>
                        <option value="">Select...</option>
                        {COUNTRIES.map((c) => <option key={c}>{c}</option>)}
                      </select>
                    </Field>
                  </>
                )}

                <Divider />
                <SectionTitle>Healthcare</SectionTitle>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.needs_private_healthcare}
                    onChange={(e) => set("needs_private_healthcare", e.target.checked)} className="accent-brand-600 w-4 h-4" />
                  <span className="text-sm text-foreground">Prefers private healthcare / clinic</span>
                </label>

                <Field label="Specialists or medical needs" hint="(optional)">
                  <input className={inputClass} value={form.medical_specialists}
                    onChange={(e) => set("medical_specialists", e.target.value)}
                    placeholder="Sports medicine, physiotherapy, dentist..." />
                </Field>
              </div>
            )}

            {/* Pro Step 6: Service */}
            {step === 6 && (
              <div className="flex flex-col gap-5">
                <SectionTitle>Service tier</SectionTitle>

                <div className="grid grid-cols-2 gap-3">
                  {[
                    { value: "basic", label: "Basic", desc: "AI-generated relocation report delivered within 24h" },
                    { value: "premium", label: "Premium", desc: "Full concierge — our team handles the entire process" },
                  ].map((t) => (
                    <button key={t.value} type="button" onClick={() => set("service_tier", t.value)}
                      className={`text-left p-4 rounded-lg border transition-colors ${
                        form.service_tier === t.value ? "border-brand-600 bg-brand-50" : "border-border hover:border-brand-300"
                      }`}>
                      <div className="font-semibold text-sm text-foreground">{t.label}</div>
                      <div className="text-xs text-muted mt-1">{t.desc}</div>
                    </button>
                  ))}
                </div>

                <Divider />
                <SectionTitle>Anything else?</SectionTitle>

                <Field label="Additional notes" hint="(optional)">
                  <textarea className={`${inputClass} resize-none`} rows={4}
                    value={form.additional_notes}
                    onChange={(e) => set("additional_notes", e.target.value)}
                    placeholder="Anything else we should know to make this athlete's relocation as smooth as possible..." />
                </Field>

                {error && (
                  <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
                    {error}
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {/* Navigation */}
        <div className="flex justify-between mt-8 pt-6 border-t border-border">
          <button type="button" onClick={() => setStep((s) => s - 1)}
            className={`text-sm text-muted hover:text-foreground transition-colors ${step === 0 ? "invisible" : ""}`}>
            ← Back
          </button>

          {!isLastStep ? (
            <button type="button" onClick={() => setStep((s) => s + 1)}
              disabled={!canAdvance()}
              className="bg-brand-600 text-white text-sm font-semibold px-5 py-2 rounded-md hover:bg-brand-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
              Continue →
            </button>
          ) : (
            <button type="button" onClick={handleSubmit} disabled={submitting}
              className="bg-brand-600 text-white text-sm font-semibold px-5 py-2 rounded-md hover:bg-brand-700 transition-colors disabled:opacity-60">
              {submitting ? "Submitting..." : "Submit request"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
