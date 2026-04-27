"use client";

import { useState } from "react";

function Row({ label, value }) {
  if (!value && value !== 0 && value !== false) return null;
  const display = Array.isArray(value) ? (value.length ? value.join(", ") : null) : String(value);
  if (!display) return null;
  return (
    <div className="flex gap-4 py-2 border-b border-border last:border-0">
      <span className="text-xs text-muted w-44 shrink-0 pt-0.5">{label}</span>
      <span className="text-sm text-foreground">{display}</span>
    </div>
  );
}

function Group({ title, children }) {
  return (
    <div className="mb-6">
      <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">{title}</h3>
      <div className="bg-white rounded-xl border border-border px-5 py-1">
        {children}
      </div>
    </div>
  );
}

export default function FormAnswers({ request: r }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="mt-6">
      <button
        onClick={() => setOpen((v) => !v)}
        className="text-sm font-medium px-4 py-2 rounded-lg border border-border text-muted hover:text-foreground hover:border-foreground/30 transition-colors"
      >
        {open ? "Hide form answers" : "View form answers"}
      </button>

      {open && (
        <div className="mt-4">
          <Group title="Athlete">
            <Row label="Name" value={r.athlete_name} />
            <Row label="Age" value={r.athlete_age} />
            <Row label="Nationality" value={r.athlete_nationality} />
            <Row label="Languages" value={r.athlete_languages} />
            <Row label="Sport" value={r.sport} />
            <Row label="Currently in" value={r.current_city ? `${r.current_city}, ${r.current_country}` : null} />
            <Row label="Email" value={r.athlete_email} />
            <Row label="Report language" value={r.report_language} />
          </Group>

          <Group title="Institution & Destination">
            <Row label="Club joining" value={r.club_joining} />
            <Row label="Training ground" value={r.training_ground_address} />
            <Row label="Destination" value={r.destination_city ? `${r.destination_city}, ${r.destination_country}` : null} />
            <Row label="Move date" value={r.move_date} />
            <Row label="Contract duration" value={r.contract_duration} />
            {r.university && <Row label="University" value={r.university} />}
            {r.major && <Row label="Major" value={r.major} />}
            {r.semester_start && <Row label="Semester start" value={r.semester_start} />}
            <Row label="International" value={r.is_international ? "Yes" : "No"} />
            {r.has_scholarship !== undefined && <Row label="Scholarship" value={r.has_scholarship ? "Yes" : "No"} />}
            {r.on_campus_housing !== undefined && <Row label="On-campus housing" value={r.on_campus_housing ? "Yes" : "No"} />}
          </Group>

          <Group title="Family">
            <Row label="Family size" value={r.family_size} />
            <Row label="Partner" value={r.partner_name} />
            <Row label="Partner languages" value={r.partner_languages} />
            <Row label="Partner profession" value={r.partner_profession} />
            <Row label="Children ages" value={r.children_ages} />
            <Row label="Pets" value={r.has_pets ? r.pet_details || "Yes" : null} />
          </Group>

          <Group title="Housing">
            <Row label="Budget (USD/mo)" value={r.budget_usd ? `$${Number(r.budget_usd).toLocaleString()}` : null} />
            <Row label="Housing type" value={r.housing_type} />
            <Row label="Min bedrooms" value={r.min_bedrooms} />
            <Row label="Max commute (min)" value={r.max_commute_minutes} />
            <Row label="Must-haves" value={r.housing_must_haves} />
            <Row label="Neighborhood type" value={r.neighborhood_type} />
          </Group>

          <Group title="Lifestyle">
            <Row label="Diet" value={r.diet} />
            <Row label="Fitness" value={r.fitness} />
            <Row label="Hobbies" value={r.hobbies} />
            <Row label="Family activities" value={r.family_activities} />
            <Row label="Nightlife" value={r.nightlife_interest} />
            <Row label="Religious needs" value={r.religious_needs} />
          </Group>

          {(r.needs_school || r.needs_car || r.needs_private_healthcare) && (
            <Group title="Extras">
              {r.needs_school && (
                <>
                  <Row label="School needed" value="Yes" />
                  <Row label="School type" value={r.school_type} />
                  <Row label="Curriculum" value={r.school_curriculum} />
                </>
              )}
              {r.needs_car && (
                <>
                  <Row label="Cars needed" value={r.num_cars} />
                  <Row label="Car type" value={r.car_type} />
                  <Row label="Buy or rent" value={r.car_buy_or_rent} />
                  <Row label="License from" value={r.license_country} />
                </>
              )}
              {r.needs_private_healthcare && (
                <>
                  <Row label="Private healthcare" value="Yes" />
                  <Row label="Specialists" value={r.medical_specialists} />
                </>
              )}
              <Row label="Medical needs" value={r.medical_needs} />
            </Group>
          )}

          <Group title="Guests">
            <Row label="Visit frequency" value={r.guest_visit_frequency} />
            <Row label="Hotel budget" value={r.guest_hotel_budget} />
          </Group>

          {r.additional_notes && (
            <Group title="Additional Notes">
              <div className="py-2 text-sm text-foreground">{r.additional_notes}</div>
            </Group>
          )}
        </div>
      )}
    </div>
  );
}
