import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { CATEGORIES, POSTS, SITE, getRecentPosts, type Post } from "@/data/posts";
import { PostCard } from "@/components/PostCard";
import { fetchAllPostsMerged } from "@/lib/posts-db";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: `${SITE.name} — ${SITE.tagline}` },
      { name: "description", content: SITE.description },
      { property: "og:title", content: `${SITE.name} — ${SITE.tagline}` },
      { property: "og:description", content: SITE.description },
      { property: "og:url", content: SITE.url },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: SITE.name,
          url: SITE.url,
          description: SITE.description,
        }),
      },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const [allPosts, setAllPosts] = useState<Post[]>(() => getRecentPosts(50));
  useEffect(() => { fetchAllPostsMerged().then(setAllPosts).catch(() => {}); }, []);
  const recent = allPosts.slice(0, 8);
  const lead = recent[0];
  const secondary = recent.slice(1, 4);
  const rest = recent.slice(4);
  const byCat = (slug: string) => allPosts.filter((p) => p.category === slug).slice(0, 3);

  return (
    <div className="mx-auto max-w-7xl px-5 py-10 lg:py-14">
      {/* Masthead */}
      <section className="mb-12 border-b border-border/60 pb-10 text-center">
        <p className="text-[11px] uppercase tracking-[0.4em] text-gold">Volume I · Issue {new Date().getDate()}</p>
        <h1 className="mt-3 font-display text-5xl leading-none text-foreground md:text-7xl">
          The intelligence of <em className="text-gold">technology</em>.
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-base text-muted-foreground md:text-lg">
          Premium reporting on AI, cybersecurity and the digital economy — written by humans, sharpened by deadline.
        </p>
      </section>

      {/* Lead + secondary */}
      <section className="grid gap-10 lg:grid-cols-3">
        <div className="lg:col-span-2">
          {lead && <PostCard post={lead} variant="feature" />}
        </div>
        <aside className="space-y-2">
          <p className="mb-4 text-[11px] uppercase tracking-widest text-gold">Also leading</p>
          {secondary.map((p) => (
            <PostCard key={p.slug} post={p} variant="compact" />
          ))}
        </aside>
      </section>

      {/* Categories strip */}
      <section className="mt-16 border-y border-border/60 py-6">
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
          {CATEGORIES.map((c) => (
            <Link
              key={c.slug}
              to="/category/$slug"
              params={{ slug: c.slug }}
              className="font-display text-lg italic text-muted-foreground transition-colors hover:text-gold"
            >
              {c.name}
            </Link>
          ))}
        </div>
      </section>

      {/* Latest grid */}
      <section className="mt-16">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-widest text-gold">The Daily</p>
            <h2 className="mt-1 font-display text-4xl text-foreground">Latest dispatches</h2>
          </div>
          <p className="hidden text-xs text-muted-foreground sm:block">{POSTS.length} stories filed</p>
        </div>
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
          {rest.map((p) => (
            <PostCard key={p.slug} post={p} />
          ))}
        </div>
      </section>

      {/* Per-category */}
      <section className="mt-20 grid gap-12 md:grid-cols-2">
        {CATEGORIES.slice(0, 4).map((c) => {
          const posts = byCat(c.slug);
          if (posts.length === 0) return null;
          return (
            <div key={c.slug}>
              <div className="mb-4 flex items-baseline justify-between border-b border-gold/40 pb-2">
                <h3 className="font-display text-2xl text-foreground">{c.name}</h3>
                <Link to="/category/$slug" params={{ slug: c.slug }} className="text-[11px] uppercase tracking-widest text-gold hover:underline">
                  View all
                </Link>
              </div>
              {posts.map((p: Post) => (
                <PostCard key={p.slug} post={p} variant="compact" />
              ))}
            </div>
          );
        })}
      </section>
    </div>
  );
}
