import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sparkles } from "lucide-react";
import { toast } from "sonner";
import { generatePost } from "@/server/ai-generate";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";

export const Route = createFileRoute("/admin/ai")({ component: AIGenerate });

function AIGenerate() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [topic, setTopic] = useState("");
  const [length, setLength] = useState<"short" | "medium" | "long">("medium");
  const [busy, setBusy] = useState(false);

  const run = async (publish: boolean) => {
    if (!topic.trim()) { toast.error("Enter a topic"); return; }
    setBusy(true);
    try {
      const res = await generatePost({ data: { topic, length } });
      const slug = res.slug;
      const { error } = await supabase.from("posts").insert({
        slug, title: res.title, excerpt: res.excerpt, meta_description: res.meta_description,
        category_slug: res.category_slug, tags: res.tags, author: "Ravir Press AI",
        author_id: user?.id ?? null, hero_eyebrow: res.hero_eyebrow,
        body: res.body, faqs: res.faqs, reading_minutes: res.reading_minutes,
        is_ai_generated: true, status: publish ? "published" : "draft",
        published_at: publish ? new Date().toISOString() : null,
      });
      if (error) throw error;
      await supabase.from("activity_logs").insert({
        user_id: user?.id, action: publish ? "post.ai_published" : "post.ai_drafted",
        entity_type: "post", entity_id: slug, metadata: { topic, length },
      });
      toast.success(publish ? "Published" : "Draft saved");
      navigate({ to: "/admin/posts/$slug", params: { slug } });
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Generation failed");
    } finally { setBusy(false); }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <header>
        <p className="text-[11px] uppercase tracking-[0.3em] text-gold">Newsroom AI</p>
        <h1 className="mt-1 font-display text-4xl text-foreground">AI post generator</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Describe a topic. The AI drafts a full editorial-style article with title, body, tags, SEO and FAQs in the Ravir Press voice.
        </p>
      </header>

      <div className="space-y-4 rounded-lg border border-border/60 bg-card/40 p-5">
        <div>
          <Label className="mb-1.5 block text-xs uppercase tracking-widest text-muted-foreground">Topic / angle</Label>
          <Input value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="e.g. Apple's secret AI chip and what it means for inference economics" />
        </div>
        <div>
          <Label className="mb-1.5 block text-xs uppercase tracking-widest text-muted-foreground">Length</Label>
          <div className="flex gap-2">
            {(["short", "medium", "long"] as const).map((l) => (
              <button key={l} onClick={() => setLength(l)}
                className={`rounded-md border px-3 py-1.5 text-sm capitalize ${length === l ? "border-gold text-gold" : "border-border/60 text-muted-foreground hover:text-foreground"}`}>
                {l}
              </button>
            ))}
          </div>
        </div>
        <div className="flex flex-wrap gap-2 pt-2">
          <Button disabled={busy} onClick={() => run(false)} variant="outline">
            <Sparkles className="mr-2 h-4 w-4" /> {busy ? "Drafting…" : "Generate as draft"}
          </Button>
          <Button disabled={busy} onClick={() => run(true)} className="bg-gold text-primary-foreground hover:opacity-90">
            <Sparkles className="mr-2 h-4 w-4" /> One-click publish
          </Button>
        </div>
      </div>
    </div>
  );
}
