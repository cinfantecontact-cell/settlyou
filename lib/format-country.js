const ABBREVIATIONS = {
  "United States": "USA",
  "United Kingdom": "UK",
  "United Arab Emirates": "UAE",
};

export function formatCountry(country) {
  if (!country) return "";
  return ABBREVIATIONS[country] ?? country;
}
