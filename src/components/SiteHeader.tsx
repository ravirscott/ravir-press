import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X, Shield } from "lucide-react";
import { CATEGORIES, SITE } from "@/data/posts";
import { useAuth } from "@/lib/auth-context";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const { isEditor } = useAuth();

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/85 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-5">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="group flex items-baseline gap-2" onClick={() => setOpen(false)}>
            <span className="font-display text-2xl tracking-tight text-foreground">
              Ravir<span className="text-gold"> Press</span>
            </span>
            <span className="hidden text-[10px] uppercase tracking-[0.25em] text-muted-foreground sm:inline">
              Est. 2026
            </span>
          </Link>

          <nav className="hidden items-center gap-7 lg:flex">
            {CATEGORIES.map((c) => (
              <Link
                key={c.slug}
                to="/category/$slug"
                params={{ slug: c.slug }}
                className="text-[13px] uppercase tracking-wider text-muted-foreground transition-colors hover:text-gold"
                activeProps={{ className: "text-gold" }}
              >
                {c.name}
              </Link>
            ))}
          </nav>

          <button
            onClick={() => setOpen((v) => !v)}
            className="rounded-md p-2 text-foreground lg:hidden"
            aria-label="Toggle menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {open && (
          <div className="border-t border-border/60 py-4 lg:hidden">
            <nav className="flex flex-col gap-1">
              {CATEGORIES.map((c) => (
                <Link
                  key={c.slug}
                  to="/category/$slug"
                  params={{ slug: c.slug }}
                  onClick={() => setOpen(false)}
                  className="rounded-md px-3 py-2 text-sm uppercase tracking-wider text-muted-foreground hover:bg-muted hover:text-gold"
                >
                  {c.name}
                </Link>
              ))}
              <div className="mt-2 border-t border-border/60 pt-2">
                <Link to="/about" onClick={() => setOpen(false)} className="block px-3 py-2 text-sm text-muted-foreground hover:text-gold">About</Link>
                <Link to="/contact" onClick={() => setOpen(false)} className="block px-3 py-2 text-sm text-muted-foreground hover:text-gold">Contact</Link>
              </div>
            </nav>
          </div>
        )}
      </div>
      <div className="border-t border-border/40 bg-card/40">
        <div className="mx-auto flex max-w-7xl items-center gap-3 overflow-hidden px-5 py-1.5">
          <span className="shrink-0 rounded-sm bg-gold px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-primary-foreground">
            Live
          </span>
          <p className="truncate text-xs text-muted-foreground">
            {SITE.tagline} — {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>
      </div>
    </header>
  );
}
