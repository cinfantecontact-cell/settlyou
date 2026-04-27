import Anthropic from "@anthropic-ai/sdk";
import { createAdminClient } from "@/lib/supabase/admin";
import { SYSTEM_PROMPT, PRODUCT_TOPICS, INDUSTRY_TOPICS, INSTITUTION_TOPICS, FEATURED_INSTITUTIONS } from "./constants";
import { convertMarkdownBold } from "./format";

export async function generateLinkedInPost() {
  const admin = createAdminClient();
  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  // Alternate post type based on last post
  const { data: lastPost } = await admin
    .from("linkedin_posts")
    .select("post_type")
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  const rotation = ["product_update", "industry_insight", "institution_spotlight"];
  const lastIndex = rotation.indexOf(lastPost?.post_type);
  const postType = rotation[(lastIndex + 1) % rotation.length];

  // Pick a topic, avoiding recent ones
  const { data: recentPosts } = await admin
    .from("linkedin_posts")
    .select("content")
    .order("created_at", { ascending: false })
    .limit(10);

  const recentContent = (recentPosts || []).map((p) => p.content).join("\n");
  const topics =
    postType === "product_update"
      ? PRODUCT_TOPICS
      : postType === "industry_insight"
      ? INDUSTRY_TOPICS
      : INSTITUTION_TOPICS;
  const topic = topics[Math.floor(Math.random() * topics.length)];

  const institutionLine =
    postType === "institution_spotlight"
      ? `\nMention one or two of these institutions by name so we can tag them on LinkedIn:\n${FEATURED_INSTITUTIONS.join(", ")}\n`
      : "";

  const msg = await anthropic.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 600,
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: "user",
        content: `Write a LinkedIn post about this topic: "${topic}"

Post type: ${postType === "product_update" ? "Product / company perspective" : postType === "industry_insight" ? "Industry insight / thought leadership" : "Institution spotlight / college mention"}

Here are recent posts — avoid repeating similar angles or phrases:
${recentContent || "(no recent posts)"}
${institutionLine}
Write only the post content. No meta-commentary.`,
      },
    ],
  });

  const content = convertMarkdownBold(msg.content[0].text);

  const { data: post, error } = await admin
    .from("linkedin_posts")
    .insert({ content, post_type: postType, status: "draft" })
    .select()
    .single();

  if (error) throw new Error(`Failed to save post: ${error.message}`);

  return post;
}

export async function generateIntroPost() {
  const admin = createAdminClient();
  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const msg = await anthropic.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 600,
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: "user",
        content: `Write a LinkedIn intro post introducing Settlyou to the world for the first time.

Context:
- Settlyou is a B2B SaaS platform that generates AI-powered relocation guides for students moving to a new city or country
- Universities, colleges, and student programs buy Settlyou to give their incoming students a personalised guide covering housing, healthcare, transportation, banking, local life, and cultural tips
- Students fill out a short intake form and receive a custom PDF guide in minutes
- The goal is to reduce the stress and confusion of relocating, so students settle in faster and focus on their studies
- Over 6 million students relocate internationally every year — most get little to no structured support

Post requirements:
- Introduce who we are and what we solve in a compelling, human way
- Use real stats to establish the problem
- End with a question that invites engagement from university administrators or student services professionals
- Use **bold** markdown around key phrases you want to stand out

Write only the post content. No meta-commentary.`,
      },
    ],
  });

  const content = convertMarkdownBold(msg.content[0].text);

  const { data: post, error } = await admin
    .from("linkedin_posts")
    .insert({ content, post_type: "product_update", status: "draft" })
    .select()
    .single();

  if (error) throw new Error(`Failed to save intro post: ${error.message}`);

  return post;
}
