"use client";

import { useState } from "react";

function ClubLogo({ url, name }) {
  const [failed, setFailed] = useState(false);
  const initials = name
    ? name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()
    : "CL";

  if (!url || failed) {
    return (
      <div className="w-16 h-16 rounded-xl bg-white bg-opacity-20 border border-white border-opacity-30 flex items-center justify-center shrink-0">
        <span className="text-white font-bold text-lg">{initials}</span>
      </div>
    );
  }

  return (
    <img
      src={url}
      alt={name}
      className="w-16 h-16 object-contain bg-white rounded-xl p-2 shrink-0"
      onError={() => setFailed(true)}
    />
  );
}

function Section({ title, children }) {
  return (
    <div className="bg-white rounded-xl border border-border shadow-sm mb-5 overflow-hidden">
      <div className="flex items-center gap-3 px-6 py-4 border-b border-border">
        <div className="w-1 h-5 rounded-full bg-brand-500 shrink-0" />
        <h2 className="text-sm font-bold text-foreground uppercase tracking-widest">{title}</h2>
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}

function ScoreBadge({ score }) {
  const bg = score >= 85 ? "bg-brand-500" : score >= 70 ? "bg-yellow-400" : "bg-red-400";
  return (
    <div className={`${bg} text-white text-sm font-bold w-10 h-10 rounded-full flex items-center justify-center shrink-0`}>
      {score}
    </div>
  );
}

function Tags({ items }) {
  if (!items?.length) return null;
  return (
    <div className="flex flex-wrap gap-1.5 mt-3">
      {items.map((item, i) => (
        <span key={i} className="text-xs bg-brand-50 border border-brand-100 text-brand-700 px-2.5 py-0.5 rounded-full">{item}</span>
      ))}
    </div>
  );
}

function Callout({ children, variant = "brand" }) {
  const styles = {
    brand: "border-l-4 border-brand-400 bg-brand-50 text-brand-900",
    yellow: "border-l-4 border-yellow-400 bg-yellow-50 text-yellow-900",
    blue: "border-l-4 border-blue-400 bg-blue-50 text-blue-900",
    gray: "border-l-4 border-gray-300 bg-surface text-foreground",
  };
  return (
    <div className={`${styles[variant]} rounded-r-lg px-4 py-3 text-sm leading-relaxed mb-4`}>
      {children}
    </div>
  );
}

function ExternalLink({ url, children }) {
  if (!url) return <span>{children}</span>;
  return (
    <a href={url} target="_blank" rel="noopener noreferrer" className="text-brand-600 hover:underline">
      {children}
    </a>
  );
}

export default function DocumentView({ content }) {
  if (!content) return null;
  const { meta, sections } = content;

  const headerBg = meta.club_primary_color || "#2f7d2f";

  return (
    <div>
      {/* Hero */}
      <div className="rounded-xl mb-5 text-white overflow-hidden" style={{ backgroundColor: headerBg }}>
        <div className="px-8 pt-8 pb-6">
          <div className="flex items-start justify-between gap-6">
            <div className="flex-1">
              <div className="text-xs uppercase tracking-[0.2em] opacity-60 mb-3 font-medium">Settl · Relocation Guide</div>
              <h1 className="text-4xl font-bold mb-2 leading-tight">{meta.athlete_name}</h1>
              <p className="opacity-75 text-sm font-medium">{meta.destination}{meta.club ? ` · ${meta.club}` : ""}</p>
            </div>
            <ClubLogo url={meta.club_logo_url} name={meta.club} />
          </div>
        </div>
        {meta.generated_summary && (
          <div className="px-8 py-5 border-t" style={{ borderColor: "rgba(255,255,255,0.15)", backgroundColor: "rgba(0,0,0,0.15)" }}>
            <p className="text-sm opacity-90 leading-relaxed">{meta.generated_summary}</p>
          </div>
        )}
      </div>

      {/* Welcome letter */}
      {meta.welcome_letter && (
        <div className="bg-white rounded-xl border border-border shadow-sm mb-5 overflow-hidden">
          <div className="flex items-center gap-3 px-6 py-4 border-b border-border">
            <div className="w-1 h-5 rounded-full bg-brand-500 shrink-0" />
            <h2 className="text-sm font-bold text-foreground uppercase tracking-widest">Welcome</h2>
          </div>
          <div className="p-6">
            <p className="text-sm text-foreground leading-relaxed italic">{meta.welcome_letter}</p>
            <p className="text-xs text-muted mt-4 font-medium">— The Settl Team</p>
          </div>
        </div>
      )}

      {/* Neighborhoods */}
      {sections.neighborhoods && (
        <Section title={sections.neighborhoods.title}>
          <p className="text-sm text-muted mb-5">{sections.neighborhoods.intro}</p>
          <div className="flex flex-col gap-4">
            {sections.neighborhoods.items?.map((n, i) => (
              <div key={i} className="border border-border rounded-xl p-5">
                <div className="flex items-start gap-4 mb-3">
                  <ScoreBadge score={n.fit_score} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline justify-between gap-2 flex-wrap">
                      <h3 className="font-bold text-foreground text-base">{n.name}</h3>
                      <span className="text-xs text-muted shrink-0">{n.avg_rent_range}</span>
                    </div>
                    <p className="text-xs text-brand-600 mt-0.5 font-medium">{n.fit_reason}</p>
                  </div>
                </div>
                <p className="text-sm text-muted leading-relaxed">{n.description}</p>
                {n.pros?.length > 0 && <Tags items={n.pros} />}
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Housing */}
      {sections.housing && (
        <Section title={sections.housing.title}>
          <p className="text-sm text-muted mb-4">{sections.housing.intro}</p>
          {sections.housing.search_platforms?.length > 0 && (
            <div className="flex gap-2 flex-wrap mb-5">
              {sections.housing.search_platforms.map((p, i) => (
                <ExternalLink key={i} url={p.url}>
                  <span className="text-xs bg-brand-50 text-brand-700 border border-brand-200 px-3 py-1.5 rounded-full font-medium inline-block">{p.name}</span>
                </ExternalLink>
              ))}
            </div>
          )}
          <div className="flex flex-col gap-3">
            {sections.housing.items?.map((h, i) => (
              <div key={i} className="border-l-4 border-brand-200 bg-surface rounded-r-xl px-4 py-4">
                <div className="flex justify-between items-start mb-1 flex-wrap gap-2">
                  <h3 className="font-semibold text-foreground text-sm">{h.type} · {h.area}</h3>
                  <span className="text-xs font-semibold text-brand-600">{h.price_range}</span>
                </div>
                <p className="text-sm text-muted leading-relaxed">{h.description}</p>
                <Tags items={h.highlights} />
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Schools */}
      {sections.schools && (
        <Section title={sections.schools.title}>
          <p className="text-sm text-muted mb-5">{sections.schools.intro}</p>
          <div className="flex flex-col gap-3">
            {sections.schools.items?.map((s, i) => (
              <div key={i} className="border border-border rounded-xl p-4">
                <div className="flex justify-between items-start flex-wrap gap-2 mb-1">
                  <h3 className="font-bold text-foreground">
                    <ExternalLink url={s.url}>{s.name}</ExternalLink>
                  </h3>
                  <span className="text-xs font-semibold text-brand-600">{s.fee_range}</span>
                </div>
                <p className="text-xs text-muted mb-2">{s.type} · {s.curriculum} · Ages {s.age_range}</p>
                <p className="text-sm text-muted leading-relaxed">{s.description}</p>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Campus Life (college only) */}
      {sections.campus_life && (
        <Section title={sections.campus_life.title}>
          <p className="text-sm text-muted mb-5">{sections.campus_life.intro}</p>
          <div className="flex flex-col gap-3">
            {sections.campus_life.items?.map((item, i) => (
              <div key={i} className="border border-border rounded-xl p-4">
                <h3 className="font-bold text-foreground mb-0.5">
                  <ExternalLink url={item.url}>{item.name}</ExternalLink>
                </h3>
                <p className="text-xs text-muted mb-2">{item.type} · {item.location}</p>
                <p className="text-sm text-muted leading-relaxed mb-2">{item.description}</p>
                {item.highlights?.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {item.highlights.map((h, j) => (
                      <span key={j} className="text-xs bg-brand-50 text-brand-700 border border-brand-100 px-2 py-0.5 rounded-full">{h}</span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Performance & Recovery */}
      {sections.performance_recovery && (
        <Section title={sections.performance_recovery.title}>
          <p className="text-sm text-muted mb-5">{sections.performance_recovery.intro}</p>
          {sections.performance_recovery.mental_performance && (
            <Callout variant="brand">{sections.performance_recovery.mental_performance}</Callout>
          )}
          {sections.performance_recovery.recovery_centers?.length > 0 && (
            <div className="mb-5">
              <p className="text-xs font-bold text-foreground uppercase tracking-widest mb-3">Recovery</p>
              <div className="flex flex-col gap-3">
                {sections.performance_recovery.recovery_centers.map((r, i) => (
                  <div key={i} className="border border-border rounded-xl p-4">
                    <h3 className="font-bold text-foreground mb-0.5">
                      <ExternalLink url={r.url}>{r.name}</ExternalLink>
                    </h3>
                    <p className="text-xs text-muted mb-2">{r.type} · {r.location} {r.price_range && `· ${r.price_range}`}</p>
                    <p className="text-sm text-muted leading-relaxed">{r.description}</p>
                    {r.athlete_note && <p className="text-xs text-brand-600 font-medium mt-2">{r.athlete_note}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}
          {sections.performance_recovery.sports_nutrition?.length > 0 && (
            <div>
              <p className="text-xs font-bold text-foreground uppercase tracking-widest mb-3">Sports Nutrition</p>
              <div className="flex flex-col gap-3">
                {sections.performance_recovery.sports_nutrition.map((n, i) => (
                  <div key={i} className="border border-border rounded-xl p-4">
                    <h3 className="font-bold text-foreground mb-0.5">
                      <ExternalLink url={n.url}>{n.name}</ExternalLink>
                    </h3>
                    <p className="text-xs text-muted mb-2">{n.type} · {n.location} {n.price_range && `· ${n.price_range}`}</p>
                    <p className="text-sm text-muted leading-relaxed">{n.description}</p>
                    {n.athlete_note && <p className="text-xs text-brand-600 font-medium mt-2">{n.athlete_note}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </Section>
      )}

      {/* Transportation */}
      {sections.transportation && (
        <Section title={sections.transportation.title}>
          <p className="text-sm text-muted mb-4">{sections.transportation.intro}</p>
          {sections.transportation.license_info && (
            <Callout variant="yellow">{sections.transportation.license_info}</Callout>
          )}
          <div className="flex flex-col gap-3">
            {sections.transportation.items?.map((t, i) => (
              <div key={i} className="border-l-4 border-brand-200 bg-surface rounded-r-xl px-4 py-4">
                <h3 className="font-bold text-foreground text-sm mb-1">{t.option}</h3>
                <p className="text-sm text-muted leading-relaxed">{t.description}</p>
                {t.price_range && <p className="text-xs font-semibold text-brand-600 mt-1.5">{t.price_range}</p>}
                <Tags items={t.tips} />
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Fitness */}
      {sections.fitness && (
        <Section title={sections.fitness.title}>
          <p className="text-sm text-muted mb-5">{sections.fitness.intro}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 print-single-col">
            {sections.fitness.items?.map((f, i) => (
              <div key={i} className="border border-border rounded-xl p-4">
                <div className="flex justify-between items-start flex-wrap gap-2 mb-1">
                  <h3 className="font-bold text-foreground text-sm">
                    <ExternalLink url={f.url}>{f.name}</ExternalLink>
                  </h3>
                  <span className="text-xs font-semibold text-brand-600">{f.price_range}</span>
                </div>
                <p className="text-xs text-muted mb-2">{f.type} · {f.location}</p>
                <p className="text-sm text-muted leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Healthcare */}
      {sections.healthcare && (
        <Section title={sections.healthcare.title}>
          <p className="text-sm text-muted mb-4">{sections.healthcare.intro}</p>
          {sections.healthcare.insurance_note && (
            <Callout variant="blue">{sections.healthcare.insurance_note}</Callout>
          )}
          <div className="flex flex-col gap-3">
            {sections.healthcare.items?.map((h, i) => (
              <div key={i} className="border border-border rounded-xl p-4">
                <h3 className="font-bold text-foreground mb-0.5">
                  <ExternalLink url={h.url}>{h.name}</ExternalLink>
                </h3>
                <p className="text-xs text-muted mb-2">{h.type} · {h.location}</p>
                <p className="text-sm text-muted leading-relaxed">{h.description}</p>
                <Tags items={h.specialties} />
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Dining */}
      {sections.dining && (
        <Section title={sections.dining.title}>
          <p className="text-sm text-muted mb-4">{sections.dining.intro}</p>
          {sections.dining.performance_tip && (
            <Callout variant="blue">{sections.dining.performance_tip}</Callout>
          )}
          {sections.dining.diet_note && (
            <Callout variant="brand">{sections.dining.diet_note}</Callout>
          )}
          <div className="mb-5">
            <p className="text-xs font-bold text-foreground uppercase tracking-widest mb-3">Supermarkets</p>
            <div className="flex flex-wrap gap-2">
              {sections.dining.supermarkets?.map((s, i) => (
                <div key={i} className="border border-border rounded-lg px-3 py-2 text-sm bg-surface">
                  <ExternalLink url={s.url}>
                    <span className="font-semibold text-foreground">{s.name}</span>
                  </ExternalLink>
                  <span className="text-muted ml-1.5 text-xs">· {s.location}</span>
                </div>
              ))}
            </div>
          </div>
          <p className="text-xs font-bold text-foreground uppercase tracking-widest mb-3">Restaurants</p>
          <div className="flex flex-col gap-2">
            {sections.dining.restaurants?.map((r, i) => (
              <div key={i} className="flex items-start justify-between border border-border rounded-xl p-4 gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2 flex-wrap">
                    <ExternalLink url={r.url}>
                      <span className="font-bold text-foreground text-sm">{r.name}</span>
                    </ExternalLink>
                    <span className="text-xs text-muted">{r.cuisine} · {r.location}</span>
                  </div>
                  <p className="text-xs text-muted mt-1 leading-relaxed">{r.why_recommended}</p>
                  {r.athlete_note && <p className="text-xs text-brand-600 font-medium mt-1">{r.athlete_note}</p>}
                </div>
                <span className="text-xs font-semibold text-muted shrink-0">{r.price_range}</span>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Safety (college only) */}
      {sections.safety && (
        <Section title={sections.safety.title}>
          <p className="text-sm text-muted mb-5">{sections.safety.intro}</p>
          <div className="flex flex-col gap-3">
            {sections.safety.items?.map((item, i) => (
              <div key={i} className="border border-border rounded-xl p-4">
                <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                  <span className="text-xs font-bold text-brand-600 uppercase tracking-wide">{item.category}</span>
                </div>
                <h3 className="font-bold text-foreground mb-1">
                  <ExternalLink url={item.url}>{item.title}</ExternalLink>
                </h3>
                <p className="text-sm text-muted leading-relaxed mb-2">{item.description}</p>
                {item.tips?.length > 0 && (
                  <ul className="flex flex-col gap-1">
                    {item.tips.map((tip, j) => (
                      <li key={j} className="text-xs text-muted flex items-start gap-2">
                        <span className="text-brand-500 mt-0.5 shrink-0">·</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Religious/Cultural */}
      {sections.religious_cultural && (
        <Section title={sections.religious_cultural.title}>
          <p className="text-sm text-muted mb-5">{sections.religious_cultural.intro}</p>
          <div className="flex flex-col gap-3">
            {sections.religious_cultural.items?.map((r, i) => (
              <div key={i} className="border border-border rounded-xl p-4">
                <h3 className="font-bold text-foreground mb-0.5">
                  <ExternalLink url={r.url}>{r.name}</ExternalLink>
                </h3>
                <p className="text-xs text-muted mb-2">{r.type} · {r.location}</p>
                <p className="text-sm text-muted leading-relaxed">{r.description}</p>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Nightlife */}
      {sections.nightlife_entertainment && (
        <Section title={sections.nightlife_entertainment.title}>
          <p className="text-sm text-muted mb-5">{sections.nightlife_entertainment.intro}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 print-single-col">
            {sections.nightlife_entertainment.items?.map((n, i) => (
              <div key={i} className="border border-border rounded-xl p-4">
                <h3 className="font-bold text-foreground mb-0.5">
                  <ExternalLink url={n.url}>{n.name}</ExternalLink>
                </h3>
                <p className="text-xs text-muted mb-2">{n.type} · {n.location}</p>
                <p className="text-sm text-muted leading-relaxed">{n.vibe}</p>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Integration */}
      {sections.integration && (
        <Section title={sections.integration.title}>
          <p className="text-sm text-muted mb-4">{sections.integration.intro}</p>
          {sections.integration.expat_community && (
            <Callout variant="gray">{sections.integration.expat_community}</Callout>
          )}
          <div className="flex flex-col gap-3">
            {sections.integration.items?.map((item, i) => (
              <div key={i} className="border border-border rounded-xl p-4">
                <h3 className="font-bold text-foreground mb-0.5">
                  <ExternalLink url={item.url}>{item.name}</ExternalLink>
                </h3>
                <p className="text-xs text-muted mb-2">{item.type}</p>
                <p className="text-sm text-muted leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Family Life */}
      {sections.family_life && (
        <Section title={sections.family_life.title}>
          <p className="text-sm text-muted mb-5">{sections.family_life.intro}</p>
          <div className="flex flex-col gap-3">
            {sections.family_life.items?.map((item, i) => (
              <div key={i} className="border border-border rounded-xl p-4">
                <div className="flex justify-between items-start flex-wrap gap-2 mb-1">
                  <h3 className="font-bold text-foreground">
                    <ExternalLink url={item.url}>{item.name}</ExternalLink>
                  </h3>
                  <span className="text-xs font-semibold text-brand-600">{item.price_range}</span>
                </div>
                <p className="text-xs text-muted mb-2">{item.type} · {item.location}</p>
                {item.best_for && <p className="text-xs text-brand-600 mb-1 font-medium">Best for: {item.best_for}</p>}
                <p className="text-sm text-muted leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Guest Accommodation */}
      {sections.guest_accommodation && (
        <Section title={sections.guest_accommodation.title}>
          <p className="text-sm text-muted mb-3">{sections.guest_accommodation.intro}</p>
          {sections.guest_accommodation.neighborhoods_tip && (
            <Callout variant="gray">{sections.guest_accommodation.neighborhoods_tip}</Callout>
          )}
          <div className="flex flex-col gap-3">
            {sections.guest_accommodation.hotels?.map((h, i) => (
              <div key={i} className="border border-border rounded-xl p-4">
                <div className="flex justify-between items-start flex-wrap gap-2 mb-1">
                  <h3 className="font-bold text-foreground">
                    <ExternalLink url={h.url}>{h.name}</ExternalLink>
                    {h.stars > 0 && <span className="text-xs text-yellow-500 ml-2">{"★".repeat(h.stars)}</span>}
                  </h3>
                  <span className="text-xs font-semibold text-brand-600">{h.price_range}</span>
                </div>
                <p className="text-xs text-muted mb-2">{h.location}</p>
                <p className="text-sm text-muted leading-relaxed">{h.description}</p>
                {h.why_recommended && <p className="text-xs text-brand-600 mt-1 font-medium">{h.why_recommended}</p>}
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Day Trips */}
      {sections.day_trips && (
        <Section title={sections.day_trips.title}>
          <p className="text-sm text-muted mb-5">{sections.day_trips.intro}</p>
          <div className="flex flex-col gap-3">
            {sections.day_trips.items?.map((trip, i) => (
              <div key={i} className="border-l-4 border-brand-200 bg-surface rounded-r-xl px-4 py-4">
                <div className="flex justify-between items-start flex-wrap gap-2 mb-1">
                  <h3 className="font-bold text-foreground">{trip.name}</h3>
                  <span className="text-xs text-muted">{trip.travel_time} · {trip.distance_km}</span>
                </div>
                {trip.best_for && <p className="text-xs text-brand-600 font-medium mb-1">Best for: {trip.best_for}</p>}
                <p className="text-sm text-muted leading-relaxed">{trip.description}</p>
                <Tags items={trip.highlights} />
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Local Life */}
      {sections.local_life && (
        <Section title={sections.local_life.title}>
          <p className="text-sm text-muted mb-4">{sections.local_life.intro}</p>
          {sections.local_life.apps?.length > 0 && (
            <div className="mb-5">
              <p className="text-xs font-bold text-foreground uppercase tracking-widest mb-3">Essential Apps</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 print-single-col">
                {sections.local_life.apps.map((app, i) => (
                  <div key={i} className="border border-border rounded-xl p-3 flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-brand-50 border border-brand-100 flex items-center justify-center shrink-0">
                      <span className="text-xs font-bold text-brand-600">{app.name[0]}</span>
                    </div>
                    <div>
                      <p className="font-semibold text-foreground text-sm">{app.name}</p>
                      <p className="text-xs text-muted">{app.purpose}</p>
                      {app.note && <p className="text-xs text-brand-600 mt-0.5">{app.note}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {sections.local_life.tips?.length > 0 && (
            <div>
              <p className="text-xs font-bold text-foreground uppercase tracking-widest mb-3">Local Tips</p>
              <div className="flex flex-col gap-2">
                {sections.local_life.tips.map((t, i) => (
                  <div key={i} className="flex items-start gap-3 py-2 border-b border-border last:border-0">
                    <span className="text-xs bg-brand-50 text-brand-700 border border-brand-100 px-2 py-0.5 rounded-full font-medium shrink-0 mt-0.5">{t.category}</span>
                    <p className="text-sm text-muted">{t.tip}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Section>
      )}

      {/* Emergency Contacts */}
      {sections.emergency_contacts && (
        <Section title={sections.emergency_contacts.title}>
          <p className="text-sm text-muted mb-4">{sections.emergency_contacts.intro}</p>
          <div className="flex flex-col gap-2">
            {sections.emergency_contacts.items?.map((c, i) => (
              <div key={i} className="flex items-start justify-between gap-4 py-3 border-b border-border last:border-0">
                <div className="flex items-start gap-3">
                  <span className="text-xs bg-red-50 text-red-600 border border-red-100 px-2 py-0.5 rounded-full font-medium shrink-0 mt-0.5">{c.category}</span>
                  <div>
                    <p className="font-semibold text-foreground text-sm">{c.name}</p>
                    {c.note && <p className="text-xs text-muted mt-0.5">{c.note}</p>}
                  </div>
                </div>
                <span className="font-bold text-foreground text-sm shrink-0">{c.number}</span>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Practical */}
      {sections.practical && (
        <Section title={sections.practical.title}>
          <p className="text-sm text-muted mb-5">{sections.practical.intro}</p>
          <div className="flex flex-col gap-3">
            {sections.practical.items?.map((item, i) => (
              <div key={i} className="border border-border rounded-xl p-4">
                <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                  <span className="text-xs bg-brand-50 text-brand-700 border border-brand-100 px-2.5 py-0.5 rounded-full font-medium">{item.category}</span>
                  <h3 className="font-bold text-foreground text-sm">
                    <ExternalLink url={item.url}>{item.title}</ExternalLink>
                  </h3>
                </div>
                <p className="text-sm text-muted leading-relaxed">{item.description}</p>
                <Tags items={item.tips} />
              </div>
            ))}
          </div>
        </Section>
      )}
    </div>
  );
}
