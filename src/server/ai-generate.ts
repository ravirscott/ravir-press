import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";

const Input = z.object({
  topic: z.string().min(3).max(500),
  length: z.enum(["short", "medium", "long"]).default("medium"),
});

const CATEGORIES = [
  "breaking-news", "analysis-insights", "trends-predictions",
  "guides-explainers", "opinions-editorials", "industry-updates",
] as const;

const SCHEMA = {
  type: "object",
  properties: {
    title: { type: "string" },
    slug: { type: "string", description: "lowercase, hyphenated, max 80 chars" },
    excerpt: { type: "string" },
    meta_description: { type: "string", description: "max 160 chars" },
    category_slug: { type: "string", enum: [...CATEGORIES] },
    tags: { type: "array", items: { type: "string" }, minItems: 3, maxItems: 6 },
    hero_eyebrow: { type: "string" },
    reading_minutes: { type: "integer", minimum: 2, maximum: 15 },
    body: {
      type: "array",
      items: {
        type: "object",
        properties: {
          type: { type: "string", enum: ["p", "h2", "h3", "ul", "quote"] },
          text: { type: "string" },
          items: { type: "array", items: { type: "string" } },
          cite: { type: "string" },
        },
        required: ["type"],
      },
    },
    faqs: {
      type: "array", minItems: 2, maxItems: 4,
      items: { type: "object", properties: { q: { type: "string" }, a: { type: "string" } }, required: ["q", "a"] },
    },
  },
  required: ["title", "slug", "excerpt", "meta_description", "category_slug", "tags", "hero_eyebrow", "reading_minutes", "body", "faqs"],
} as const;

export const generatePost = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => Input.parse(d))
  .handler(async ({ data }) => {
    const LOVABLE_API_KEY = process.env.LOVABLE_API_KEY;
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const target = data.length === "short" ? "500-700 words" : data.length === "long" ? "1400-1800 words" : "900-1200 words";

    const system = `You are a senior editor at Ravir Press, a premium technology and AI publication. Voice: authoritative, precise, with sharp leads and concrete detail. You write in the style of The Information / Stratechery — well-reported analysis, not marketing fluff. Always include specific examples and named sources where plausible (clearly framed as reporting). Output structured JSON matching the provided schema. Use h2 for major sections, h3 for sub-points, ul for bulleted lists (3-5 items), and at most one blockquote.`;

    const user = `Topic: ${data.topic}\n\nWrite a ${target} editorial-style article. Pick the most appropriate category_slug. Generate an SEO-optimized title (≤70 chars), meta description (≤160 chars), 3-6 tags, a slug (lowercase hyphenated), 2-4 FAQs, an estimated reading_minutes, and a 1-3 word hero_eyebrow label (e.g. "Exclusive", "Analysis", "Trend Report"). Body must be 6-12 blocks total.`;

    const resp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: system },
          { role: "user", content: user },
        ],
        tools: [{ type: "function", function: { name: "emit_post", description: "Emit the article", parameters: SCHEMA } }],
        tool_choice: { type: "function", function: { name: "emit_post" } },
      }),
    });

    if (!resp.ok) {
      const txt = await resp.text();
      if (resp.status === 429) throw new Error("Rate limit hit. Please try again in a moment.");
      if (resp.status === 402) throw new Error("AI credits exhausted. Add funds in Settings → Workspace → Usage.");
      throw new Error(`AI request failed [${resp.status}]: ${txt.slice(0, 200)}`);
    }
    const json = await resp.json();
    const call = json.choices?.[0]?.message?.tool_calls?.[0];
    if (!call?.function?.arguments) throw new Error("AI did not return structured output");
    const parsed = JSON.parse(call.function.arguments);
    // Sanitize slug
    parsed.slug = String(parsed.slug).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 80);
    return parsed;
  });
