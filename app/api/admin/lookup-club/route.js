import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const anthropic = new Anthropic();

export async function POST(req) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { name, type } = await req.json();
  if (!name || name.trim().length < 3) return NextResponse.json({});

  const isCollege = type === "college";
  const addressLabel = isCollege ? "main campus address" : "training ground address";
  const cityLabel = isCollege ? "city where the campus is located" : "city where the club is based";

  const prompt = `You are a sports and university knowledge assistant. Given the ${isCollege ? "university/college" : "sports club"} name "${name}", return a JSON object with:
- "address": the ${addressLabel} (street address if known, otherwise the facility name and neighborhood)
- "city": the ${cityLabel}
- "country": the country

If you're not confident about specific details, return your best reasonable guess based on the name. Always return valid JSON.
Only return the JSON object, nothing else.`;

  const msg = await anthropic.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 256,
    messages: [{ role: "user", content: prompt }],
  });

  try {
    const text = msg.content[0].text;
    const match = text.match(/\{[\s\S]*\}/);
    const data = match ? JSON.parse(match[0]) : {};
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({});
  }
}
