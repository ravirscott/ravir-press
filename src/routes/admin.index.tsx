import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { FileText, Sparkles, FilePlus, Eye } from "lucide-react";

export const Route = createFileRoute("/admin/")({
  component: Overview,
});

function Overview() {
  const [stats, setStats] = useState({ total: 0, published: 0, drafts: 0, ai: 0, views: 0 });
  const [recent, setRecent] = useState<{ slug: string; title: string; status: string; updated_at: string }[]>([]);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("posts").select("slug,title,status,updated_at,is_ai_generated,views").order("updated_at", { ascending: false });
      const rows = data ?? [];
      setStats({
        total: rows.length,
        published: rows.filter((r) => r.status === "published").length,
        drafts: rows.filter((r) => r.status === "draft").length,
        ai: rows.filter((r) => r.is_ai_generated).length,
        views: rows.reduce((a, r) => a + (r.views ?? 0), 0),
      });
      setRecent(rows.slice(0, 6).map((r) => ({ slug: r.slug, title: r.title, status: r.status, updated_at: r.updated_at })));
    })();
  }, []);

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[11px] uppercase tracking-[0.3em] text-gold">Newsroom</p>
          <h1 className="mt-1 font-display text-4xl text-foreground">Dashboard</h1>
        </div>
        <div className="flex gap-2">
          <Link to="/admin/posts/new" className="inline-flex items-center gap-2 rounded-md border border-border/60 px-3 py-2 text-sm text-foreground hover:border-gold hover:text-gold">
            <FilePlus className="h-4 w-4" /> New post
          </Link>
          <Link to="/admin/ai" className="inline-flex items-center gap-2 rounded-md bg-gold px-3 py-2 text-sm text-primary-foreground hover:opacity-90">
            <Sparkles className="h-4 w-4" /> AI generate
          </Link>
        </div>
      </header>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        <Stat label="Total posts" value={stats.total} />
        <Stat label="Published" value={stats.published} />
        <Stat label="Drafts" value={stats.drafts} />
        <Stat label="AI generated" value={stats.ai} />
        <Stat label="Total views" value={stats.views} icon={<Eye className="h-4 w-4 text-gold" />} />
      </div>

      <section>
        <h2 className="mb-3 font-display text-xl text-foreground">Recent activity</h2>
        <div className="rounded-lg border border-border/60 bg-card/40">
          {recent.length === 0 ? (
            <div className="p-6 text-sm text-muted-foreground">
              No posts yet. <Link to="/admin/posts/new" className="text-gold hover:underline">Create your first post</Link> or{" "}
              <Link to="/admin/ai" className="text-gold hover:underline">generate one with AI</Link>.
            </div>
          ) : recent.map((r) => (
            <Link key={r.slug} to="/admin/posts/$slug" params={{ slug: r.slug }} className="flex items-center justify-between border-b border-border/40 px-4 py-3 last:border-0 hover:bg-muted/20">
              <div className="min-w-0">
                <p className="truncate text-sm text-foreground">{r.title}</p>
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground">{r.status} · {new Date(r.updated_at).toLocaleDateString()}</p>
              </div>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

function Stat({ label, value, icon }: { label: string; value: number; icon?: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-border/60 bg-card/40 p-4">
      <div className="flex items-center justify-between text-[10px] uppercase tracking-widest text-muted-foreground">
        {label}{icon}
      </div>
      <p className="mt-2 font-display text-3xl text-foreground">{value}</p>
    </div>
  );
}
