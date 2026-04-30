export const BASE_DOCUMENT_TYPES = [
  { key: "passport", label: "Passport Copy", required: true, description: "Bio-data page of your valid passport." },
  { key: "visa", label: "Medical Form", required: true, description: "Health and medical information form required by your university." },
  { key: "transcript", label: "Official Transcript", required: true, description: "Stamped or sealed academic records from your school." },
  { key: "transcript_translation", label: "Transcript Translation (if not in English)", required: true, description: "Certified English translation — only required if your transcripts are not in English." },
  { key: "english_test", label: "English Proficiency Test (TOEFL / IELTS / Duolingo)", required: true, description: "Official score report from TOEFL, IELTS, or Duolingo." },
  { key: "eligibility_form", label: "NAIA / NCAA Eligibility Form", required: true, description: "Eligibility clearance form from your sport's governing body." },
  { key: "insurance", label: "Health Insurance Card", required: true, description: "Front and back of your active health insurance card." },
  { key: "photo", label: "Headshot Photo", required: true, description: "Clear, recent photo with a plain background." },
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
    required: true,
  }));
  return [...base, ...custom];
}
