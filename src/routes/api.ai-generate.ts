import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

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

export const Route = createFileRoute("/api/ai-generate")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const auth = request.headers.get("authorization");
          if (!auth?.startsWith("Bearer ")) {
            return Response.json({ error: "Unauthorized" }, { status: 401 });
          }
          const token = auth.slice(7);

          const SUPABASE_URL = process.env.SUPABASE_URL!;
          const SUPABASE_PUBLISHABLE_KEY = process.env.SUPABASE_PUBLISHABLE_KEY!;
          const LOVABLE_API_KEY = process.env.LOVABLE_API_KEY;
          if (!LOVABLE_API_KEY) {
            return Response.json({ error: "AI not configured (missing LOVABLE_API_KEY)" }, { status: 500 });
          }

          // Verify user via supabase
          const sb = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
            global: { headers: { Authorization: `Bearer ${token}` } },
            auth: { persistSession: false, autoRefreshToken: false },
          });
          const { data: userData, error: userErr } = await sb.auth.getUser(token);
          if (userErr || !userData?.user) {
            return Response.json({ error: "Invalid session" }, { status: 401 });
          }

          const body = await request.json();
          const topic = String(body?.topic ?? "").trim();
          const length = body?.length === "short" ? "short" : body?.length === "long" ? "long" : "medium";
          if (topic.length < 3) {
            return Response.json({ error: "Topic too short" }, { status: 400 });
          }

          const target = length === "short" ? "500-700 words" : length === "long" ? "1400-1800 words" : "900-1200 words";
          const system = `You are a senior editor at Ravir Press, a premium technology and AI publication. Voice: authoritative, precise, with sharp leads and concrete detail. You write in the style of The Information / Stratechery — well-reported analysis, not marketing fluff. Always include specific examples and named sources where plausible (clearly framed as reporting). Output structured JSON matching the provided schema. Use h2 for major sections, h3 for sub-points, ul for bulleted lists (3-5 items), and at most one blockquote.`;
          const userPrompt = `Topic: ${topic}\n\nWrite a ${target} editorial-style article. Pick the most appropriate category_slug. Generate an SEO-optimized title (≤70 chars), meta description (≤160 chars), 3-6 tags, a slug (lowercase hyphenated), 2-4 FAQs, an estimated reading_minutes, and a 1-3 word hero_eyebrow label (e.g. "Exclusive", "Analysis", "Trend Report"). Body must be 6-12 blocks total.`;

          const resp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
            method: "POST",
            headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
            body: JSON.stringify({
              model: "google/gemini-2.5-flash",
              messages: [
                { role: "system", content: system },
                { role: "user", content: userPrompt },
              ],
              tools: [{ type: "function", function: { name: "emit_post", description: "Emit the article", parameters: SCHEMA } }],
              tool_choice: { type: "function", function: { name: "emit_post" } },
            }),
          });

          if (!resp.ok) {
            const txt = await resp.text();
            console.error("AI gateway error:", resp.status, txt);
            if (resp.status === 429) return Response.json({ error: "Rate limit hit. Try again in a moment." }, { status: 429 });
            if (resp.status === 402) return Response.json({ error: "AI credits exhausted. Add funds in Settings → Workspace → Usage." }, { status: 402 });
            return Response.json({ error: `AI request failed (${resp.status})` }, { status: 500 });
          }
          const json = await resp.json();
          const call = json.choices?.[0]?.message?.tool_calls?.[0];
          if (!call?.function?.arguments) {
            return Response.json({ error: "AI did not return structured output" }, { status: 500 });
          }
          const parsed = JSON.parse(call.function.arguments);
          parsed.slug = String(parsed.slug || parsed.title || "post")
            .toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 80);
          // Ensure slug uniqueness
          const { data: existing } = await sb.from("posts").select("slug").eq("slug", parsed.slug).maybeSingle();
          if (existing) parsed.slug = `${parsed.slug}-${Date.now().toString(36).slice(-5)}`;

          return Response.json(parsed);
        } catch (e) {
          console.error("api/ai-generate error:", e);
          return Response.json({ error: e instanceof Error ? e.message : "Unknown error" }, { status: 500 });
        }
      },
    },
  },
});
