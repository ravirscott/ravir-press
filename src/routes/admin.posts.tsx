import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Trash2, Search } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/posts")({
  component: AllPosts,
});

type Row = { id: string; slug: string; title: string; status: string; updated_at: string; category_slug: string | null; is_ai_generated: boolean };

function AllPosts() {
  const [rows, setRows] = useState<Row[]>([]);
  const [q, setQ] = useState("");
  const [sel, setSel] = useState<Set<string>>(new Set());
  const navigate = useNavigate();

  const load = async () => {
    const { data } = await supabase.from("posts").select("id,slug,title,status,updated_at,category_slug,is_ai_generated").order("updated_at", { ascending: false });
    setRows((data as Row[]) ?? []);
  };
  useEffect(() => { load(); }, []);

  const filtered = rows.filter((r) => !q || r.title.toLowerCase().includes(q.toLowerCase()) || r.slug.includes(q.toLowerCase()));

  const bulkDelete = async () => {
    if (sel.size === 0) return;
    if (!confirm(`Delete ${sel.size} post(s)?`)) return;
    const { error } = await supabase.from("posts").delete().in("id", Array.from(sel));
    if (error) toast.error(error.message);
    else { toast.success("Deleted"); setSel(new Set()); load(); }
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[11px] uppercase tracking-[0.3em] text-gold">Library</p>
          <h1 className="mt-1 font-display text-4xl text-foreground">All posts</h1>
        </div>
        <Link to="/admin/posts/new" className="rounded-md bg-gold px-3 py-2 text-sm text-primary-foreground hover:opacity-90">New post</Link>
      </header>

      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search posts…" className="w-full rounded-md border border-border/60 bg-card/40 py-2 pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-gold focus:outline-none" />
        </div>
        {sel.size > 0 && (
          <button onClick={bulkDelete} className="inline-flex items-center gap-2 rounded-md border border-destructive/60 px-3 py-2 text-sm text-destructive hover:bg-destructive/10">
            <Trash2 className="h-4 w-4" /> Delete {sel.size}
          </button>
        )}
      </div>

      <div className="overflow-hidden rounded-lg border border-border/60">
        {filtered.length === 0 ? (
          <div className="p-8 text-center text-sm text-muted-foreground">No posts. Create one to get started.</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-card/60 text-left text-[10px] uppercase tracking-widest text-muted-foreground">
              <tr>
                <th className="px-3 py-2 w-8"></th>
                <th className="px-3 py-2">Title</th>
                <th className="px-3 py-2">Status</th>
                <th className="px-3 py-2">Category</th>
                <th className="px-3 py-2">Updated</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr key={r.id} className="border-t border-border/40 hover:bg-muted/20">
                  <td className="px-3 py-2">
                    <input type="checkbox" checked={sel.has(r.id)} onChange={(e) => {
                      const n = new Set(sel);
                      if (e.target.checked) n.add(r.id); else n.delete(r.id);
                      setSel(n);
                    }} />
                  </td>
                  <td className="px-3 py-2">
                    <button onClick={() => navigate({ to: "/admin/posts/$slug", params: { slug: r.slug } })} className="text-left text-foreground hover:text-gold">
                      {r.title} {r.is_ai_generated && <span className="ml-2 text-[9px] uppercase tracking-widest text-gold">AI</span>}
                    </button>
                  </td>
                  <td className="px-3 py-2 text-muted-foreground">{r.status}</td>
                  <td className="px-3 py-2 text-muted-foreground">{r.category_slug}</td>
                  <td className="px-3 py-2 text-muted-foreground">{new Date(r.updated_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
