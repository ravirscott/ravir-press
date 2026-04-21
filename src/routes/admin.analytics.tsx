import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/analytics")({ component: Analytics });

function Analytics() {
  const [data, setData] = useState({ total: 0, published: 0, drafts: 0, ai: 0, manual: 0, views: 0, top: [] as { title: string; views: number; slug: string }[] });

  useEffect(() => {
    supabase.from("posts").select("slug,title,status,is_ai_generated,views").then(({ data: rows }) => {
      const r = rows ?? [];
      setData({
        total: r.length,
        published: r.filter((x) => x.status === "published").length,
        drafts: r.filter((x) => x.status === "draft").length,
        ai: r.filter((x) => x.is_ai_generated).length,
        manual: r.filter((x) => !x.is_ai_generated).length,
        views: r.reduce((a, x) => a + (x.views ?? 0), 0),
        top: [...r].sort((a, b) => (b.views ?? 0) - (a.views ?? 0)).slice(0, 5).map((x) => ({ title: x.title, views: x.views ?? 0, slug: x.slug })),
      });
    });
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="font-display text-4xl text-foreground">Analytics</h1>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {[
          ["Total", data.total], ["Published", data.published], ["Drafts", data.drafts],
          ["AI", data.ai], ["Manual", data.manual], ["Views", data.views],
        ].map(([l, v]) => (
          <div key={l as string} className="rounded-lg border border-border/60 bg-card/40 p-4">
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground">{l}</p>
            <p className="mt-2 font-display text-3xl text-foreground">{v}</p>
          </div>
        ))}
      </div>
      <section>
        <h2 className="mb-3 font-display text-xl text-foreground">Top posts by views</h2>
        <div className="rounded-lg border border-border/60">
          {data.top.length === 0 ? (
            <p className="p-6 text-sm text-muted-foreground">No view data yet.</p>
          ) : data.top.map((t) => (
            <div key={t.slug} className="flex justify-between border-b border-border/40 px-4 py-3 last:border-0">
              <span className="text-foreground">{t.title}</span>
              <span className="text-gold">{t.views}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
