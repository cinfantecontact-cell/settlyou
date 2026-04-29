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

function LegacyDocumentView({ content }) {
  const { meta, sections } = content;

  const headerBg = meta.club_primary_color || "#2f7d2f";

  return (
    <div>
      {/* Hero */}
      <div className="rounded-xl mb-5 text-white overflow-hidden" style={{ backgroundColor: headerBg }}>
        <div className="px-8 pt-8 pb-6">
          <div className="flex items-start justify-between gap-6">
            <div className="flex-1">
              <div className="text-xs uppercase tracking-[0.2em] opacity-60 mb-3 font-medium">Settlyou · Relocation Guide</div>
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
            <p className="text-xs text-muted mt-4 font-medium">— The Settlyou Team</p>
          </div>
        </div>
      )}

      {/* From your coach */}
      {meta.coach_notes && (
        <div className="bg-white rounded-xl border border-border shadow-sm mb-5 overflow-hidden">
          <div className="flex items-center gap-3 px-6 py-4 border-b border-border">
            <div className="w-1 h-5 rounded-full bg-brand-500 shrink-0" />
            <h2 className="text-sm font-bold text-foreground uppercase tracking-widest">
              From your coach{meta.coach_name ? ` — Coach ${meta.coach_name}` : ""}
            </h2>
          </div>
          <div className="p-6 flex flex-col gap-2">
            {meta.coach_notes.split("\n").filter(l => l.trim()).map((line, i) => (
              <div key={i} className="flex items-start gap-2 text-sm text-foreground">
                <span className="text-brand-500 shrink-0 mt-0.5">·</span>
                <span>{line.trim()}</span>
              </div>
            ))}
            {meta.coach_links?.map((link, i) => (
              <a key={i} href={link.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-brand-600 hover:underline">
                <span className="text-brand-400 shrink-0">→</span>
                <span>{link.label}</span>
              </a>
            ))}
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
          {sections.housing.tips?.length > 0 && (
            <div className="flex flex-col gap-1.5 mb-5">
              {sections.housing.tips.map((tip, i) => (
                <div key={i} className="flex items-start gap-2 text-sm text-muted">
                  <span className="text-brand-500 shrink-0 mt-0.5">·</span>
                  <span>{tip}</span>
                </div>
              ))}
            </div>
          )}
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
          {sections.integration.language_tip && (
            <Callout variant="yellow">{sections.integration.language_tip}</Callout>
          )}
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

      {/* Eligibility (college athlete only) */}
      {sections.eligibility && (
        <Section title={sections.eligibility.title}>
          <p className="text-sm text-muted mb-4">{sections.eligibility.intro}</p>
          {sections.eligibility.warning && (
            <Callout variant="yellow">{sections.eligibility.warning}</Callout>
          )}
          <div className="flex flex-col gap-4">
            {(sections.eligibility.items || sections.eligibility.key_requirements)?.map((item, i) => (
              <div key={i} className="border border-border rounded-xl p-5">
                {item.category && (
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className="text-xs font-bold text-brand-600 uppercase tracking-wide bg-brand-50 border border-brand-100 px-2.5 py-0.5 rounded-full">{item.category}</span>
                  </div>
                )}
                <h3 className="font-bold text-foreground mb-2">
                  <ExternalLink url={item.url}>{item.title}</ExternalLink>
                </h3>
                <p className="text-sm text-muted leading-relaxed mb-3">{item.description}</p>
                {item.steps?.length > 0 && (
                  <div className="flex flex-col gap-1.5 mt-2">
                    {item.steps.map((step, j) => (
                      <div key={j} className="flex items-start gap-2.5 text-sm text-muted">
                        <span className="w-5 h-5 rounded-full bg-brand-100 text-brand-700 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">{j + 1}</span>
                        <span>{step}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
          {sections.eligibility.international_notes && (
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
              <p className="text-sm text-yellow-800">{sections.eligibility.international_notes}</p>
            </div>
          )}
          {sections.eligibility.resources?.length > 0 && (
            <div className="mt-4 flex flex-col gap-2">
              {sections.eligibility.resources.map((r, i) => (
                <div key={i} className="text-sm text-muted">
                  <ExternalLink url={r.url}><span className="font-semibold text-foreground">{r.name}</span></ExternalLink>
                  {r.description && <span> — {r.description}</span>}
                </div>
              ))}
            </div>
          )}
        </Section>
      )}

      {/* Banking (general student) */}
      {sections.banking && (
        <Section title={sections.banking.title}>
          <p className="text-sm text-muted mb-4">{sections.banking.intro}</p>
          {sections.banking.tips?.length > 0 && (
            <div className="flex flex-col gap-1.5 mb-5">
              {sections.banking.tips.map((tip, i) => (
                <div key={i} className="flex items-start gap-2 text-sm text-muted">
                  <span className="text-brand-500 shrink-0 mt-0.5">·</span>
                  <span>{tip}</span>
                </div>
              ))}
            </div>
          )}
          <div className="flex flex-col gap-4">
            {sections.banking.items?.map((item, i) => (
              <div key={i} className="border border-border rounded-xl p-5">
                <div className="flex items-start justify-between gap-3 mb-2 flex-wrap">
                  <div>
                    <h3 className="font-bold text-foreground">
                      <ExternalLink url={item.url}>{item.name}</ExternalLink>
                    </h3>
                    <p className="text-xs text-muted mt-0.5">{item.type} · {item.location}</p>
                  </div>
                  {item.price_range && (
                    <span className="text-xs font-semibold text-brand-600 shrink-0">{item.price_range}</span>
                  )}
                </div>
                <p className="text-sm text-muted leading-relaxed mb-3">{item.description}</p>
                {item.what_to_bring?.length > 0 && (
                  <div>
                    <p className="text-xs font-bold text-foreground uppercase tracking-widest mb-2">What to bring</p>
                    <div className="flex flex-wrap gap-1.5">
                      {item.what_to_bring.map((doc, j) => (
                        <span key={j} className="text-xs bg-brand-50 border border-brand-100 text-brand-700 px-2.5 py-0.5 rounded-full">{doc}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Social Life (general student) */}
      {sections.social_life && (
        <Section title={sections.social_life.title}>
          <p className="text-sm text-muted mb-4">{sections.social_life.intro}</p>
          {sections.social_life.language_tip && (
            <Callout variant="yellow">{sections.social_life.language_tip}</Callout>
          )}
          {sections.social_life.expat_community && (
            <Callout variant="gray">{sections.social_life.expat_community}</Callout>
          )}
          <div className="flex flex-col gap-3">
            {sections.social_life.items?.map((item, i) => (
              <div key={i} className="border border-border rounded-xl p-4">
                <h3 className="font-bold text-foreground mb-0.5">
                  <ExternalLink url={item.url}>{item.name}</ExternalLink>
                </h3>
                <p className="text-xs text-muted mb-2">{item.type}</p>
                <p className="text-sm text-muted leading-relaxed">{item.description}</p>
                {item.tip && (
                  <p className="text-xs text-brand-600 font-medium mt-2 border-l-2 border-brand-200 pl-3">{item.tip}</p>
                )}
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* International student resources */}
      {sections.international && (
        <Section title={sections.international.title}>
          <p className="text-sm text-muted mb-5">{sections.international.intro}</p>
          <div className="flex flex-col gap-4">
            {sections.international.items?.map((item, i) => (
              <div key={i} className="border border-border rounded-xl p-5">
                <h3 className="font-bold text-foreground mb-0.5">
                  <ExternalLink url={item.url}>{item.name}</ExternalLink>
                </h3>
                <p className="text-xs text-muted mb-1">{item.type}{item.location ? ` · ${item.location}` : ""}</p>
                <p className="text-sm text-muted leading-relaxed mb-2">{item.description}</p>
                {item.contact && (
                  <p className="text-xs text-brand-600 font-medium">{item.contact}</p>
                )}
                {item.tip && (
                  <p className="text-xs text-muted font-medium mt-2 border-l-2 border-brand-200 pl-3 italic">{item.tip}</p>
                )}
              </div>
            ))}
          </div>
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

// ─── V2 Renderer (schema_version 2 — short 3-section guide) ───

function V2SectionHeader({ number, title, accent }) {
  return (
    <div className="flex items-center gap-4 mb-6">
      <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 text-white text-sm font-bold"
        style={{ backgroundColor: accent }}>
        {number}
      </div>
      <h2 className="text-xl font-bold text-foreground">{title}</h2>
      <div className="flex-1 h-px bg-border" />
    </div>
  );
}

function V2Block({ children, id }) {
  return <div id={id} className="bg-white rounded-2xl border border-border shadow-sm mb-8 px-7 pt-7 pb-8">{children}</div>;
}

function V2SubLabel({ children }) {
  return <p className="text-xs font-bold text-foreground uppercase tracking-wider mb-3">{children}</p>;
}

function V2Divider() {
  return <div className="h-px bg-border my-7" />;
}

function V2Steps({ steps, accent }) {
  if (!steps?.length) return null;
  return (
    <div className="flex flex-col gap-0">
      {steps.map((s, i) => (
        <div key={i} className="flex gap-4">
          {/* Timeline spine */}
          <div className="flex flex-col items-center">
            <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
              style={{ backgroundColor: accent }}>
              {s.step ?? i + 1}
            </div>
            {i < steps.length - 1 && (
              <div className="w-px flex-1 my-1" style={{ backgroundColor: accent, opacity: 0.2 }} />
            )}
          </div>
          {/* Content */}
          <div className={`flex-1 min-w-0 ${i < steps.length - 1 ? "pb-5" : ""}`}>
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                {s.title && <p className="font-semibold text-foreground text-sm mb-1">{s.title}</p>}
                <p className="text-sm text-muted leading-relaxed">{s.description}</p>
              </div>
              {s.url && (
                <a href={s.url} target="_blank" rel="noopener noreferrer"
                  className="shrink-0 text-xs font-semibold px-2.5 py-1 rounded-lg border border-brand-200 text-brand-600 hover:bg-brand-50 transition-colors whitespace-nowrap">
                  Open
                </a>
              )}
            </div>
            {s.deadline && (
              <span className="inline-flex items-center gap-1 mt-2 text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full">
                Due: {s.deadline}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

function V2CheckList({ items }) {
  if (!items?.length) return null;
  return (
    <div className="flex flex-col gap-2">
      {items.map((item, i) => (
        <div key={i} className="flex items-start gap-2.5 text-sm text-muted">
          <div className="w-4 h-4 rounded border-2 border-brand-300 bg-brand-50 shrink-0 mt-0.5" />
          <span className="leading-relaxed">{item}</span>
        </div>
      ))}
    </div>
  );
}

function V2LinkCard({ title, description, meta, url }) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-xl border border-border p-4 bg-surface">
      <div className="flex-1 min-w-0">
        {title && <p className="font-semibold text-foreground text-sm mb-0.5">{title}</p>}
        <p className="text-sm text-muted leading-relaxed">{description}</p>
        {meta && <p className="text-xs text-muted mt-1 font-medium">{meta}</p>}
      </div>
      {url && (
        <a href={url} target="_blank" rel="noopener noreferrer"
          className="shrink-0 text-xs font-semibold px-3 py-1.5 rounded-lg border border-brand-200 text-brand-600 hover:bg-brand-50 transition-colors whitespace-nowrap">
          Open
        </a>
      )}
    </div>
  );
}

function V2AudienceBadge({ type }) {
  if (type === "athlete") return (
    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0"
      style={{ background: "#16a34a15", color: "#16a34a", border: "1px solid #16a34a40" }}>
      Student-Athletes
    </span>
  );
  if (type === "international") return (
    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0"
      style={{ background: "#2563eb15", color: "#2563eb", border: "1px solid #2563eb40" }}>
      International Students
    </span>
  );
  return null;
}

function DocumentViewV2({ content }) {
  const { meta, sections } = content;
  const accent = meta.club_primary_color || "#2f7d2f";

  return (
    <div className="font-sans">

      {/* ── Hero ── */}
      <div id="demo-guide-hero" className="rounded-2xl mb-6 overflow-hidden text-white" style={{ backgroundColor: accent }}>
        <div className="px-8 pt-7 pb-6">
          <div className="flex items-start justify-between gap-6">
            <div className="flex-1 min-w-0">
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] mb-4" style={{ opacity: 0.45 }}>
                Settlyou · Relocation Guide
              </p>
              <h1 className="text-[2.6rem] font-extrabold leading-none mb-4 tracking-tight">{meta.athlete_name}</h1>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-semibold px-3 py-1 rounded-full" style={{ background: "rgba(255,255,255,0.15)" }}>
                  {meta.destination}
                </span>
                {meta.club && (
                  <span className="text-xs font-semibold px-3 py-1 rounded-full" style={{ background: "rgba(255,255,255,0.15)" }}>
                    {meta.club}
                  </span>
                )}
              </div>
            </div>
            <ClubLogo url={meta.club_logo_url} name={meta.club} />
          </div>
        </div>
        {meta.generated_summary && (
          <div className="px-8 py-5" style={{ background: "rgba(0,0,0,0.22)" }}>
            <p className="text-sm leading-relaxed" style={{ opacity: 0.88 }}>{meta.generated_summary}</p>
          </div>
        )}
      </div>

      {/* ── Welcome ── */}
      {meta.welcome_letter && (
        <div className="bg-white rounded-2xl border border-border shadow-sm mb-6 px-8 py-7">
          <div className="flex items-start gap-5">
            <div className="text-4xl opacity-20 font-serif leading-none select-none mt-1">"</div>
            <div className="flex-1">
              <p className="text-base text-foreground leading-relaxed">{meta.welcome_letter}</p>
              <p className="text-xs text-muted mt-5 font-semibold tracking-wide uppercase">— The Settlyou Team</p>
            </div>
          </div>
        </div>
      )}

      {/* ── Coach Notes ── */}
      {meta.coach_notes && (
        <div className="rounded-2xl mb-6 overflow-hidden" style={{ border: `2px solid ${accent}33`, backgroundColor: `${accent}08` }}>
          <div className="flex items-center gap-3 px-7 py-4 border-b" style={{ borderColor: `${accent}22`, backgroundColor: `${accent}12` }}>
            <ClubLogo url={meta.club_logo_url} name={meta.club} />
            <div>
              <p className="text-xs font-bold uppercase tracking-widest" style={{ color: accent }}>
                {meta.coach_sport ? `Message from your ${meta.coach_sport} coach` : "Message from your coach"}
              </p>
              <p className="text-sm font-semibold text-foreground mt-0.5">
                {meta.coach_name ? `Coach ${meta.coach_name}` : meta.club}
              </p>
            </div>
          </div>
          <div className="px-7 py-6">
            {meta.coach_notes.split("\n").filter(l => l.trim()).map((line, i) => (
              <p key={i} className="text-sm text-foreground leading-relaxed mb-3 last:mb-0">{line.trim()}</p>
            ))}
            {meta.coach_links?.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-5">
                {meta.coach_links.map((link, i) => (
                  <a key={i} href={link.url} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-lg transition-opacity hover:opacity-80"
                    style={{ backgroundColor: accent, color: "white" }}>
                    {link.label} ↗
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── University Notes ── */}
      {content.university_notes && (
        <div id="demo-guide-notes" className="rounded-2xl mb-6 overflow-hidden" style={{ border: `2px solid ${accent}33`, backgroundColor: `${accent}08` }}>
          <div className="flex items-center gap-3 px-7 py-4 border-b" style={{ borderColor: `${accent}22`, backgroundColor: `${accent}12` }}>
            <ClubLogo url={meta.club_logo_url} name={meta.club} />
            <div>
              <p className="text-xs font-bold uppercase tracking-widest" style={{ color: accent }}>
                {meta.coach_sport ? `Message from your ${meta.coach_sport} coach` : "Message from your coach"}
              </p>
              <p className="text-sm font-semibold text-foreground mt-0.5">
                {meta.coach_name ? `Coach ${meta.coach_name}` : meta.club}
              </p>
            </div>
          </div>
          <div className="px-7 py-6">
            {content.university_notes.split("\n").filter(Boolean).map((para, i) => (
              <p key={i} className="text-sm text-foreground leading-relaxed mb-3 last:mb-0">{para}</p>
            ))}
            {content.university_links?.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-5">
                {content.university_links.map((link, i) => (
                  <a key={i} href={link.url} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-lg transition-opacity hover:opacity-80"
                    style={{ backgroundColor: accent, color: "white" }}>
                    {link.label} ↗
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Required Documents ── */}
      {content.university_documents?.length > 0 && (
        <div id="demo-guide-documents" className="rounded-2xl mb-6 overflow-hidden" style={{ border: `2px solid ${accent}33`, backgroundColor: `${accent}08` }}>
          <div className="flex items-center gap-3 px-7 py-4 border-b" style={{ borderColor: `${accent}22`, backgroundColor: `${accent}12` }}>
            <ClubLogo url={meta.club_logo_url} name={meta.club} />
            <div>
              <p className="text-xs font-bold uppercase tracking-widest" style={{ color: accent }}>Required Documents</p>
              <p className="text-sm font-semibold text-foreground mt-0.5">Download and complete before arrival</p>
            </div>
          </div>
          <div className="px-7 py-6 flex flex-col gap-3">
            {content.university_documents.map((doc) => (
              <div key={doc.id} className="flex items-center justify-between gap-4 rounded-xl border border-border bg-white px-5 py-4">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground">{doc.name}</p>
                  {doc.description && <p className="text-xs text-muted mt-0.5">{doc.description}</p>}
                </div>
                <a
                  href={doc.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 inline-flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-lg transition-opacity hover:opacity-80"
                  style={{ backgroundColor: accent, color: "white" }}
                >
                  Download PDF ↗
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Section 1: Your New City ── */}
      {sections.city_essentials && (
        <V2Block id="demo-guide-city">
          <V2SectionHeader number="1" title={sections.city_essentials.title || "Your New City"} accent={accent} />

          {sections.city_essentials.restaurants?.length > 0 && (
            <div className="mb-6">
              <V2SubLabel>Where to Eat</V2SubLabel>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 print-single-col">
                {sections.city_essentials.restaurants.map((r, i) => (
                  <div key={i} className="rounded-xl border border-border p-4 bg-surface">
                    <p className="font-bold text-foreground text-sm">{r.name}</p>
                    <p className="text-xs text-muted mt-0.5 mb-2">{r.cuisine} · {r.location}</p>
                    <p className="text-xs text-muted leading-relaxed">{r.why}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {sections.city_essentials.places_to_visit?.length > 0 && (
            <div className="mb-6">
              <V2Divider />
              <V2SubLabel>Places to Explore</V2SubLabel>
              <div className="flex flex-col gap-3">
                {sections.city_essentials.places_to_visit.map((p, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full mt-2 shrink-0" style={{ backgroundColor: accent }} />
                    <div>
                      <span className="font-semibold text-foreground text-sm">{p.name}</span>
                      {p.type && <span className="text-xs text-muted ml-2 capitalize bg-surface border border-border px-2 py-0.5 rounded-full">{p.type}</span>}
                      <p className="text-sm text-muted leading-relaxed mt-1">{p.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {sections.city_essentials.transportation && (
            <div>
              <V2Divider />
              <V2SubLabel>Getting Around</V2SubLabel>
              {sections.city_essentials.transportation.intro && (
                <p className="text-sm text-muted mb-3">{sections.city_essentials.transportation.intro}</p>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 print-single-col">
                {sections.city_essentials.transportation.options?.map((opt, i) => (
                  <div key={i} className="flex items-start gap-2.5 bg-surface rounded-xl border border-border px-4 py-3 text-sm text-muted">
                    <span className="font-bold shrink-0" style={{ color: accent }}>{i + 1}.</span>
                    <span className="leading-relaxed">{opt}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {sections.city_essentials.housing?.length > 0 && (
            <div>
              <V2Divider />
              <V2SubLabel>Quick Housing Options</V2SubLabel>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 print-single-col">
                {sections.city_essentials.housing.map((h, i) => (
                  <div key={i} className="rounded-xl border border-border p-4 bg-surface">
                    <p className="font-bold text-foreground text-sm mb-0.5">{h.option}</p>
                    {h.price_range && <p className="text-xs font-semibold text-brand-600 mb-1">{h.price_range}</p>}
                    <p className="text-xs text-muted mb-1.5">{h.area}</p>
                    <p className="text-xs text-muted leading-relaxed">{h.why}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {sections.city_essentials.healthcare?.length > 0 && (
            <div>
              <V2Divider />
              <V2SubLabel>Health & Wellness</V2SubLabel>
              <div className="flex flex-col gap-3">
                {sections.city_essentials.healthcare.map((h, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full mt-2 shrink-0" style={{ backgroundColor: accent }} />
                    <div>
                      <span className="font-semibold text-foreground text-sm">{h.name}</span>
                      <span className="text-xs text-muted ml-2">{h.type}{h.location ? ` · ${h.location}` : ""}</span>
                      {h.note && <p className="text-xs text-muted mt-0.5 leading-relaxed">{h.note}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {sections.city_essentials.social?.length > 0 && (
            <div>
              <V2Divider />
              <V2SubLabel>Social Life</V2SubLabel>
              <div className="flex flex-col gap-3">
                {sections.city_essentials.social.map((s, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full mt-2 shrink-0" style={{ backgroundColor: accent }} />
                    <div>
                      <span className="font-semibold text-foreground text-sm">{s.name}</span>
                      {s.type && <span className="text-xs text-muted bg-surface border border-border px-2 py-0.5 rounded-full ml-2 capitalize">{s.type}</span>}
                      <p className="text-sm text-muted leading-relaxed mt-1">{s.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </V2Block>
      )}

      {/* ── Section 2: Your University ── */}
      {sections.your_university && (
        <V2Block>
          <V2SectionHeader number="2" title={sections.your_university.title || "Your University"} accent={accent} />

          {sections.your_university.campus_spots?.length > 0 && (
            <div className="mb-6">
              <V2SubLabel>Key Campus Spots</V2SubLabel>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 print-single-col">
                {sections.your_university.campus_spots.map((s, i) => (
                  <div key={i} className="rounded-xl border border-border p-4">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <p className="font-bold text-foreground text-sm leading-snug">{s.name}</p>
                      {s.type && (
                        <span className="text-xs font-medium shrink-0 px-2 py-0.5 rounded-full capitalize"
                          style={{ backgroundColor: `${accent}15`, color: accent }}>
                          {s.type}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted leading-relaxed">{s.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {sections.your_university.athletic_facilities?.length > 0 && (
            <div className="mb-6">
              <V2Divider />
              <div className="flex items-center gap-2 mb-3">
                <span className="text-[11px] font-bold text-muted uppercase tracking-[0.12em]">Athletic Facilities</span>
              </div>
              <div className="flex flex-col gap-3">
                {sections.your_university.athletic_facilities.map((f, i) => (
                  <div key={i} className="rounded-xl p-4" style={{ backgroundColor: `${accent}10`, borderLeft: `3px solid ${accent}` }}>
                    <p className="font-semibold text-foreground text-sm mb-1">{f.name}</p>
                    <p className="text-sm leading-relaxed" style={{ color: `${accent}cc` }}>{f.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {sections.your_university.food_nearby?.length > 0 && (
            <div className="mb-6">
              <V2Divider />
              <V2SubLabel>Food On & Near Campus</V2SubLabel>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 print-single-col">
                {sections.your_university.food_nearby.map((f, i) => (
                  <div key={i} className="flex items-start gap-2 bg-surface rounded-xl border border-border px-4 py-3">
                    <div className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ backgroundColor: accent }} />
                    <div className="text-sm">
                      <span className="font-semibold text-foreground">{f.name}</span>
                      {f.location && <span className="text-muted"> · {f.location}</span>}
                      {f.note && <p className="text-muted text-xs mt-0.5">{f.note}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {sections.your_university.student_life?.length > 0 && (
            <div>
              <V2Divider />
              <V2SubLabel>Student Life</V2SubLabel>
              <div className="flex flex-col gap-3">
                {sections.your_university.student_life.map((s, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full mt-2 shrink-0" style={{ backgroundColor: accent }} />
                    <div>
                      <div className="flex items-center gap-2 flex-wrap mb-0.5">
                        <span className="font-semibold text-foreground text-sm">{s.name}</span>
                        {s.type && (
                          <span className="text-xs text-muted bg-surface border border-border px-2 py-0.5 rounded-full capitalize">{s.type}</span>
                        )}
                      </div>
                      <p className="text-sm text-muted leading-relaxed">{s.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </V2Block>
      )}

      {/* ── Section 3: Upload Your Documents ── */}
      <V2Block>
        <V2SectionHeader number="3" title="Upload Your Documents" accent={accent} />

        {/* Upload instructions */}
        <div className="rounded-xl border border-border bg-surface px-5 py-4">
          <p className="font-semibold text-foreground text-sm mb-1">How to upload your documents</p>
          <p className="text-sm text-muted leading-relaxed mb-3">
            Your institution uses Settlyou to collect your documents securely. Click your personal upload link below to see exactly what your coach is requesting and submit each file. You can come back anytime — your progress is saved automatically.
          </p>
          <p className="text-sm text-muted leading-relaxed mb-4">
            <span className="font-semibold text-foreground">Save your link somewhere safe</span> — bookmark it or copy it to your notes. You will also receive it via WhatsApp and SMS so you can access it from your phone at any time.
          </p>
          {content.upload_url ? (
            <a
              href={content.upload_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-semibold px-5 py-2.5 rounded-lg transition-opacity hover:opacity-80"
              style={{ backgroundColor: accent, color: "white" }}
            >
              View &amp; upload my documents ↗
            </a>
          ) : (
            <p className="text-xs text-muted italic">Your upload link will be included when this guide is delivered.</p>
          )}
        </div>
      </V2Block>
    </div>
  );
}

export default function DocumentView({ content }) {
  if (!content) return null;
  if (content.schema_version === 2) return <DocumentViewV2 content={content} />;
  return <LegacyDocumentView content={content} />;
}
