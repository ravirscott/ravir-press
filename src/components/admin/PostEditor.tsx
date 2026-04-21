import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth-context";

export type EditablePost = {
  id?: string;
  slug: string;
  title: string;
  excerpt: string | null;
  meta_description: string | null;
  category_slug: string | null;
  tags: string[];
  author: string | null;
  status: "draft" | "published" | "scheduled";
  scheduled_for: string | null;
  reading_minutes: number | null;
  hero_eyebrow: string | null;
  hero_image_url: string | null;
  body: { type: string; text?: string; items?: string[] }[];
  faqs: { q: string; a: string }[];
  is_ai_generated?: boolean;
};

const DEFAULT: EditablePost = {
  slug: "", title: "", excerpt: "", meta_description: "", category_slug: "breaking-news",
  tags: [], author: "Ravir Press Editorial", status: "draft", scheduled_for: null,
  reading_minutes: 5, hero_eyebrow: "Dispatch", hero_image_url: null,
  body: [], faqs: [],
};

export function PostEditor({ initial, onSaved }: { initial?: EditablePost; onSaved: (slug: string) => void }) {
  const { user } = useAuth();
  const [p, setP] = useState<EditablePost>(initial ?? DEFAULT);
  const [bodyText, setBodyText] = useState(() =>
    (initial?.body ?? []).map((b) => {
      if (b.type === "h2") return `## ${b.text}`;
      if (b.type === "h3") return `### ${b.text}`;
      if (b.type === "ul") return (b.items ?? []).map((i) => `- ${i}`).join("\n");
      if (b.type === "quote") return `> ${b.text}`;
      return b.text ?? "";
    }).join("\n\n"),
  );
  const [tagsText, setTagsText] = useState((initial?.tags ?? []).join(", "));
  const [cats, setCats] = useState<{ slug: string; name: string }[]>([]);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    supabase.from("categories").select("slug,name").order("name").then(({ data }) => setCats(data ?? []));
  }, []);

  const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 80);

  const parseBody = (text: string) => {
    const blocks: EditablePost["body"] = [];
    const paragraphs = text.split(/\n\n+/);
    for (const para of paragraphs) {
      const trimmed = para.trim();
      if (!trimmed) continue;
      if (trimmed.startsWith("## ")) blocks.push({ type: "h2", text: trimmed.slice(3) });
      else if (trimmed.startsWith("### ")) blocks.push({ type: "h3", text: trimmed.slice(4) });
      else if (trimmed.startsWith("> ")) blocks.push({ type: "quote", text: trimmed.slice(2) });
      else if (trimmed.split("\n").every((l) => l.startsWith("- "))) {
        blocks.push({ type: "ul", items: trimmed.split("\n").map((l) => l.slice(2)) });
      } else blocks.push({ type: "p", text: trimmed });
    }
    return blocks;
  };

  const save = async (status: "draft" | "published" | "scheduled") => {
    setBusy(true);
    try {
      const slug = p.slug || slugify(p.title);
      if (!slug || !p.title) { toast.error("Title is required"); return; }
      const tags = tagsText.split(",").map((t) => t.trim()).filter(Boolean);
      const body = parseBody(bodyText);
      const payload = {
        ...p, slug, tags, body, status,
        published_at: status === "published" ? new Date().toISOString() : (p as { published_at?: string }).published_at ?? null,
        author_id: user?.id ?? null,
      };
      delete (payload as { id?: string }).id;
      if (initial?.id) {
        const { error } = await supabase.from("posts").update(payload).eq("id", initial.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("posts").insert(payload);
        if (error) throw error;
      }
      await supabase.from("activity_logs").insert({
        user_id: user?.id, action: initial?.id ? "post.updated" : "post.created",
        entity_type: "post", entity_id: slug, metadata: { status },
      });
      toast.success(status === "published" ? "Published" : "Saved");
      onSaved(slug);
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Save failed");
    } finally { setBusy(false); }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <header>
        <p className="text-[11px] uppercase tracking-[0.3em] text-gold">{initial ? "Edit" : "New"} post</p>
        <h1 className="mt-1 font-display text-3xl text-foreground">{p.title || "Untitled"}</h1>
      </header>

      <div className="space-y-4 rounded-lg border border-border/60 bg-card/40 p-5">
        <Field label="Title">
          <Input value={p.title} onChange={(e) => setP({ ...p, title: e.target.value, slug: p.slug || slugify(e.target.value) })} placeholder="Headline" className="text-lg" />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Slug"><Input value={p.slug} onChange={(e) => setP({ ...p, slug: slugify(e.target.value) })} /></Field>
          <Field label="Hero eyebrow"><Input value={p.hero_eyebrow ?? ""} onChange={(e) => setP({ ...p, hero_eyebrow: e.target.value })} placeholder="Exclusive" /></Field>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Category">
            <select value={p.category_slug ?? ""} onChange={(e) => setP({ ...p, category_slug: e.target.value })}
              className="w-full rounded-md border border-border/60 bg-background px-3 py-2 text-sm">
              {cats.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
            </select>
          </Field>
          <Field label="Tags (comma separated)">
            <Input value={tagsText} onChange={(e) => setTagsText(e.target.value)} placeholder="AI, OpenAI" />
          </Field>
        </div>
        <Field label="Excerpt">
          <Textarea value={p.excerpt ?? ""} onChange={(e) => setP({ ...p, excerpt: e.target.value })} rows={2} />
        </Field>
        <Field label="Body (Markdown: ## h2, ### h3, > quote, - list, blank line = paragraph)">
          <Textarea value={bodyText} onChange={(e) => setBodyText(e.target.value)} rows={16} className="font-mono text-xs" />
        </Field>
        <Field label="Hero image URL">
          <Input value={p.hero_image_url ?? ""} onChange={(e) => setP({ ...p, hero_image_url: e.target.value })} placeholder="https://…" />
        </Field>

        <details className="rounded-md border border-border/40 p-3">
          <summary className="cursor-pointer text-sm text-foreground">SEO</summary>
          <div className="mt-3 space-y-3">
            <Field label="Meta description">
              <Textarea value={p.meta_description ?? ""} onChange={(e) => setP({ ...p, meta_description: e.target.value })} rows={2} />
            </Field>
            <Field label="Author"><Input value={p.author ?? ""} onChange={(e) => setP({ ...p, author: e.target.value })} /></Field>
            <Field label="Reading minutes">
              <Input type="number" value={p.reading_minutes ?? 5} onChange={(e) => setP({ ...p, reading_minutes: Number(e.target.value) })} />
            </Field>
          </div>
        </details>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button disabled={busy} onClick={() => save("draft")} variant="outline">Save draft</Button>
        <Button disabled={busy} onClick={() => save("published")} className="bg-gold text-primary-foreground hover:opacity-90">
          Publish
        </Button>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <Label className="mb-1.5 block text-xs uppercase tracking-widest text-muted-foreground">{label}</Label>
      {children}
    </div>
  );
}
