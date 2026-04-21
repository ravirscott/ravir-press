import { createFileRoute, Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import {
  LayoutDashboard, FilePlus, Sparkles, FileText, FileEdit,
  BarChart3, Users, Settings, LogOut, Newspaper,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin — Ravir Press" }, { name: "robots", content: "noindex, nofollow" }] }),
  component: AdminLayout,
});

const NAV = [
  { to: "/admin", label: "Overview", icon: LayoutDashboard, end: true },
  { to: "/admin/posts/new", label: "Create Post", icon: FilePlus },
  { to: "/admin/ai", label: "AI Generate", icon: Sparkles },
  { to: "/admin/posts", label: "All Posts", icon: FileText },
  { to: "/admin/drafts", label: "Drafts", icon: FileEdit },
  { to: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/admin/users", label: "Users", icon: Users },
  { to: "/admin/settings", label: "Settings", icon: Settings },
] as const;

function AdminLayout() {
  const { user, isEditor, isAdmin, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const path = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    if (loading) return;
    if (!user) navigate({ to: "/login" });
    else if (!isEditor && !isAdmin) navigate({ to: "/" });
  }, [user, isEditor, isAdmin, loading, navigate]);

  if (loading || !user) {
    return <div className="flex min-h-screen items-center justify-center text-muted-foreground">Loading…</div>;
  }
  if (!isEditor && !isAdmin) {
    return <div className="flex min-h-screen items-center justify-center text-muted-foreground">Not authorized.</div>;
  }

  return (
    <div className="flex min-h-screen w-full bg-background">
      <aside className="hidden w-64 shrink-0 border-r border-border/60 bg-card/40 md:flex md:flex-col">
        <Link to="/admin" className="border-b border-border/60 px-5 py-5">
          <div className="flex items-center gap-2">
            <Newspaper className="h-5 w-5 text-gold" />
            <span className="font-display text-xl text-foreground">
              Ravir<span className="text-gold"> Press</span>
            </span>
          </div>
          <p className="mt-1 text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Newsroom</p>
        </Link>
        <nav className="flex-1 space-y-0.5 px-3 py-4">
          {NAV.map((item) => {
            const Icon = item.icon;
            const active = item.end ? path === item.to : path === item.to || path.startsWith(item.to + "/");
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                  active ? "bg-gold/10 text-gold" : "text-muted-foreground hover:bg-muted/40 hover:text-foreground",
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-border/60 px-3 py-3">
          <div className="mb-2 px-2 text-xs">
            <div className="truncate text-foreground">{user.email}</div>
            <div className="text-[10px] uppercase tracking-widest text-gold">{isAdmin ? "Admin" : "Editor"}</div>
          </div>
          <button
            onClick={async () => { await signOut(); navigate({ to: "/" }); }}
            className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-muted/40 hover:text-foreground"
          >
            <LogOut className="h-4 w-4" /> Sign out
          </button>
          <Link to="/" className="mt-1 block rounded-md px-3 py-2 text-xs text-muted-foreground hover:text-gold">← View site</Link>
        </div>
      </aside>

      <div className="flex w-full flex-1 flex-col">
        <header className="border-b border-border/60 bg-background/85 px-5 py-3 backdrop-blur md:hidden">
          <nav className="flex gap-2 overflow-x-auto">
            {NAV.map((item) => (
              <Link key={item.to} to={item.to} className="shrink-0 rounded-md px-3 py-1.5 text-xs text-muted-foreground hover:text-gold">
                {item.label}
              </Link>
            ))}
          </nav>
        </header>
        <main className="flex-1 px-5 py-8 lg:px-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
