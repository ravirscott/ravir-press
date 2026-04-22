import { Link } from "@tanstack/react-router";
import { CATEGORIES, SITE } from "@/data/posts";
import { JoinAsEditorDialog } from "@/components/JoinAsEditorDialog";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border/60 bg-card/40">
      <div className="mx-auto max-w-7xl px-5 py-14">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <p className="font-display text-2xl text-foreground">
              Ravir<span className="text-gold"> Press</span>
            </p>
            <p className="mt-3 max-w-md text-sm text-muted-foreground">{SITE.description}</p>
          </div>

          <div>
            <p className="mb-3 text-[11px] uppercase tracking-widest text-gold">Sections</p>
            <ul className="space-y-2 text-sm">
              {CATEGORIES.map((c) => (
                <li key={c.slug}>
                  <Link to="/category/$slug" params={{ slug: c.slug }} className="text-muted-foreground hover:text-foreground">
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="mb-3 text-[11px] uppercase tracking-widest text-gold">The Press</p>
            <ul className="space-y-2 text-sm">
              <li><Link to="/about" className="text-muted-foreground hover:text-foreground">About</Link></li>
              <li><Link to="/contact" className="text-muted-foreground hover:text-foreground">Contact</Link></li>
              <li><Link to="/privacy" className="text-muted-foreground hover:text-foreground">Privacy Policy</Link></li>
              <li><a href="/sitemap.xml" className="text-muted-foreground hover:text-foreground">Sitemap</a></li>
              <li>
                <JoinAsEditorDialog
                  trigger={
                    <button className="text-gold hover:text-gold/80 transition-colors">
                      Join as Editor →
                    </button>
                  }
                />
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-3 border-t border-border/60 pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} Ravir Press. All rights reserved.</p>
          <p className="font-display italic">"Intelligence on Technology &amp; AI."</p>
        </div>
      </div>
    </footer>
  );
}
