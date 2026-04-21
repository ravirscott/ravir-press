import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/drafts")({ component: Drafts });

function Drafts() {
  const [rows, setRows] = useState<{ id: string; slug: string; title: string; updated_at: string }[]>([]);
  useEffect(() => {
    supabase.from("posts").select("id,slug,title,updated_at").eq("status", "draft").order("updated_at", { ascending: false })
      .then(({ data }) => setRows(data ?? []));
  }, []);
  return (
    <div className="space-y-6">
      <h1 className="font-display text-4xl text-foreground">Drafts</h1>
      <div className="rounded-lg border border-border/60">
        {rows.length === 0 ? (
          <p className="p-6 text-sm text-muted-foreground">No drafts.</p>
        ) : rows.map((r) => (
          <Link key={r.id} to="/admin/posts/$slug" params={{ slug: r.slug }} className="flex justify-between border-b border-border/40 px-4 py-3 last:border-0 hover:bg-muted/20">
            <span className="text-foreground">{r.title}</span>
            <span className="text-xs text-muted-foreground">{new Date(r.updated_at).toLocaleDateString()}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
