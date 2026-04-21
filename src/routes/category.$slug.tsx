import { createFileRoute, notFound } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { CATEGORIES, SITE, getCategory, getPostsByCategory, type Post } from "@/data/posts";
import { PostCard } from "@/components/PostCard";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { fetchAllPostsMerged } from "@/lib/posts-db";

export const Route = createFileRoute("/category/$slug")({
  loader: ({ params }) => {
    const category = getCategory(params.slug);
    if (!category) throw notFound();
    const posts = getPostsByCategory(params.slug);
    return { category, posts };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [{ title: `Category — ${SITE.name}` }] };
    const { category } = loaderData;
    const title = `${category.name} — ${SITE.name}`;
    return {
      meta: [
        { title },
        { name: "description", content: category.description },
        { property: "og:title", content: title },
        { property: "og:description", content: category.description },
        { property: "og:type", content: "website" },
        { property: "og:url", content: `${SITE.url}/category/${category.slug}` },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: category.description },
      ],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: SITE.url },
              { "@type": "ListItem", position: 2, name: category.name, item: `${SITE.url}/category/${category.slug}` },
            ],
          }),
        },
      ],
    };
  },
  notFoundComponent: () => (
    <div className="mx-auto max-w-3xl px-5 py-24 text-center">
      <h1 className="font-display text-4xl text-foreground">Section not found</h1>
      <p className="mt-3 text-muted-foreground">That section doesn&apos;t exist in our archives.</p>
    </div>
  ),
  component: CategoryPage,
});

function CategoryPage() {
  const { category, posts: initialPosts } = Route.useLoaderData();
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  useEffect(() => {
    fetchAllPostsMerged().then((all) => setPosts(all.filter((p) => p.category === category.slug))).catch(() => {});
  }, [category.slug]);

  return (
    <div className="mx-auto max-w-7xl px-5 py-10 lg:py-14">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: category.name }]} />

      <header className="mt-8 border-b border-border/60 pb-10">
        <p className="text-[11px] uppercase tracking-[0.4em] text-gold">{category.tagline}</p>
        <h1 className="mt-3 font-display text-5xl text-foreground md:text-6xl">{category.name}</h1>
        <p className="mt-4 max-w-2xl text-base text-muted-foreground md:text-lg">{category.description}</p>
      </header>

      {posts.length === 0 ? (
        <p className="mt-16 text-center text-muted-foreground">No stories filed in this section yet.</p>
      ) : (
        <div className="mt-12 grid gap-10 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((p: Post) => (
            <PostCard key={p.slug} post={p} />
          ))}
        </div>
      )}

      <section className="mt-20 border-t border-border/60 pt-10">
        <p className="mb-4 text-[11px] uppercase tracking-widest text-gold">Other sections</p>
        <div className="flex flex-wrap gap-x-6 gap-y-2">
          {CATEGORIES.filter((c) => c.slug !== category.slug).map((c) => (
            <a key={c.slug} href={`/category/${c.slug}`} className="font-display text-lg italic text-muted-foreground hover:text-gold">
              {c.name}
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}
