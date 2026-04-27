const BOLD_UPPER = 0x1d400; // 𝐀
const BOLD_LOWER = 0x1d41a; // 𝐚
const BOLD_DIGIT = 0x1d7ce; // 𝟎

function charToBold(c) {
  const code = c.charCodeAt(0);
  if (code >= 65 && code <= 90) return String.fromCodePoint(BOLD_UPPER + code - 65);
  if (code >= 97 && code <= 122) return String.fromCodePoint(BOLD_LOWER + code - 97);
  if (code >= 48 && code <= 57) return String.fromCodePoint(BOLD_DIGIT + code - 48);
  return c;
}

// Converts **markdown bold** to Unicode bold characters for LinkedIn
export function convertMarkdownBold(text) {
  return text.replace(/\*\*(.+?)\*\*/g, (_, inner) =>
    inner.split("").map(charToBold).join("")
  );
}
