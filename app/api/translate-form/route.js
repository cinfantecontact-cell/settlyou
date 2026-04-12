import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";

const anthropic = new Anthropic();

export async function POST(req) {
  const { language, strings } = await req.json();

  if (!language || language === "English") return NextResponse.json({});

  const prompt = `Translate the following form strings from English to ${language}.
Return ONLY a valid JSON object with the exact same keys but with translated values.
Rules:
- Keep formatting characters exactly as-is: →, ←, (optional), /
- Translate naturally and conversationally — this is a relocation questionnaire for athletes
- Do NOT translate proper nouns like sport names, CrossFit, IB, etc.
- Keep answers short and clear

Strings:
${JSON.stringify(strings, null, 2)}`;

  const msg = await anthropic.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 4096,
    messages: [{ role: "user", content: prompt }],
  });

  try {
    const text = msg.content[0].text;
    const match = text.match(/\{[\s\S]*\}/);
    const translations = match ? JSON.parse(match[0]) : {};
    return NextResponse.json(translations);
  } catch {
    return NextResponse.json({});
  }
}
