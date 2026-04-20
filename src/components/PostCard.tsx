import { Link } from "@tanstack/react-router";
import { type Post, getCategory } from "@/data/posts";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function PostCard({ post, variant = "default" }: { post: Post; variant?: "default" | "feature" | "compact" }) {
  const cat = getCategory(post.category);

  if (variant === "feature") {
    return (
      <article className="group relative overflow-hidden rounded-lg border border-border/60 bg-card p-8 transition-all hover:border-gold/60 hover:shadow-elegant md:p-12">
        <div className="absolute inset-0 bg-gradient-to-br from-gold/5 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
        <div className="relative">
          <div className="mb-5 flex items-center gap-3 text-[11px] uppercase tracking-widest">
            <span className="rounded-sm bg-gold px-2 py-1 font-bold text-primary-foreground">{post.heroEyebrow}</span>
            {cat && <Link to="/category/$slug" params={{ slug: cat.slug }} className="text-gold hover:underline">{cat.name}</Link>}
          </div>
          <Link to="/post/$slug" params={{ slug: post.slug }}>
            <h2 className="font-display text-3xl leading-tight text-foreground transition-colors group-hover:text-gold md:text-5xl">
              {post.title}
            </h2>
          </Link>
          <p className="mt-5 max-w-2xl text-base text-muted-foreground md:text-lg">{post.excerpt}</p>
          <div className="mt-6 flex items-center gap-4 text-xs text-muted-foreground">
            <span>By {post.author}</span>
            <span className="h-1 w-1 rounded-full bg-muted-foreground/40" />
            <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
            <span className="h-1 w-1 rounded-full bg-muted-foreground/40" />
            <span>{post.readingMinutes} min read</span>
          </div>
        </div>
      </article>
    );
  }

  if (variant === "compact") {
    return (
      <article className="group flex items-baseline gap-4 border-b border-border/60 py-4 last:border-0">
        <span className="font-display text-2xl text-gold/70">›</span>
        <div className="flex-1">
          <Link to="/post/$slug" params={{ slug: post.slug }}>
            <h3 className="font-display text-lg leading-snug text-foreground transition-colors group-hover:text-gold">
              {post.title}
            </h3>
          </Link>
          <div className="mt-1 flex items-center gap-2 text-[11px] uppercase tracking-wider text-muted-foreground">
            {cat && <span className="text-gold">{cat.name}</span>}
            <span>·</span>
            <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="group flex h-full flex-col border-t border-border/60 pt-6">
      <div className="mb-3 flex items-center gap-2 text-[11px] uppercase tracking-widest">
        {cat && <Link to="/category/$slug" params={{ slug: cat.slug }} className="text-gold hover:underline">{cat.name}</Link>}
      </div>
      <Link to="/post/$slug" params={{ slug: post.slug }}>
        <h3 className="font-display text-2xl leading-tight text-foreground transition-colors group-hover:text-gold">
          {post.title}
        </h3>
      </Link>
      <p className="mt-3 line-clamp-3 text-sm text-muted-foreground">{post.excerpt}</p>
      <div className="mt-auto flex items-center gap-3 pt-4 text-xs text-muted-foreground">
        <span>{post.author}</span>
        <span className="h-1 w-1 rounded-full bg-muted-foreground/40" />
        <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
        <span className="h-1 w-1 rounded-full bg-muted-foreground/40" />
        <span>{post.readingMinutes} min</span>
      </div>
    </article>
  );
}
