import { Link } from "@tanstack/react-router";

export type Crumb = { label: string; href?: string };

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="text-xs uppercase tracking-widest text-muted-foreground">
      <ol className="flex flex-wrap items-center gap-2">
        {items.map((c, i) => (
          <li key={i} className="flex items-center gap-2">
            {c.href ? (
              <Link to={c.href} className="hover:text-gold">
                {c.label}
              </Link>
            ) : (
              <span className="text-foreground/80">{c.label}</span>
            )}
            {i < items.length - 1 && <span className="text-muted-foreground/50">/</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}
