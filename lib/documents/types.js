export const BASE_DOCUMENT_TYPES = [
  { key: "passport", label: "Passport Copy", required: true },
  { key: "visa", label: "Medical Form", required: true },
  { key: "transcript", label: "Official Transcript", required: true },
  { key: "transcript_translation", label: "Transcript Translation (if not in English)", required: false },
  { key: "english_test", label: "English Proficiency Test (TOEFL / IELTS / Duolingo)", required: false },
  { key: "eligibility_form", label: "NAIA / NCAA Eligibility Form", required: false },
  { key: "insurance", label: "Health Insurance Card", required: false },
  { key: "photo", label: "Headshot Photo", required: false },
];

export const BASE_DOC_SHORT_LABELS = {
  passport: "Passport",
  visa: "Medical Form",
  transcript: "Transcript",
  transcript_translation: "Transcript (Trans.)",
  english_test: "English Test",
  eligibility_form: "Eligibility",
  insurance: "Insurance",
  photo: "Photo",
};

/**
 * Build the document type list for a specific sport.
 * If sportConfig is provided (from sport_document_config table), filters base types
 * and appends sport-specific custom docs. Falls back to all base types if no config.
 */
export function getSportDocTypes(sportConfig) {
  if (!sportConfig) return BASE_DOCUMENT_TYPES;
  const disabled = new Set(sportConfig.disabled_base_docs || []);
  const base = BASE_DOCUMENT_TYPES.filter(d => !disabled.has(d.key));
  const custom = (sportConfig.custom_docs || []).map(d => ({
    key: `sport_custom_${d.id}`,
    label: d.label,
    required: d.required ?? false,
  }));
  return [...base, ...custom];
}
