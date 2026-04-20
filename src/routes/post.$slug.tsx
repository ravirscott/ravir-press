import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { SITE, getCategory, getPost, getRelatedPosts } from "@/data/posts";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { PostCard } from "@/components/PostCard";

export const Route = createFileRoute("/post/$slug")({
  loader: ({ params }) => {
    const post = getPost(params.slug);
    if (!post) throw notFound();
    const category = getCategory(post.category)!;
    const related = getRelatedPosts(post);
    return { post, category, related };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [{ title: SITE.name }] };
    const { post, category } = loaderData;
    const url = `${SITE.url}/post/${post.slug}`;
    return {
      meta: [
        { title: `${post.title} — ${SITE.name}` },
        { name: "description", content: post.metaDescription },
        { name: "keywords", content: post.tags.join(", ") },
        { property: "og:title", content: post.title },
        { property: "og:description", content: post.metaDescription },
        { property: "og:type", content: "article" },
        { property: "og:url", content: url },
        { property: "article:published_time", content: post.publishedAt },
        { property: "article:author", content: post.author },
        { property: "article:section", content: category.name },
        ...post.tags.map((t) => ({ property: "article:tag", content: t })),
        { name: "twitter:title", content: post.title },
        { name: "twitter:description", content: post.metaDescription },
      ],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "NewsArticle",
            headline: post.title,
            description: post.metaDescription,
            datePublished: post.publishedAt,
            dateModified: post.publishedAt,
            author: { "@type": "Person", name: post.author },
            publisher: {
              "@type": "Organization",
              name: SITE.name,
              logo: { "@type": "ImageObject", url: `${SITE.url}/logo.png` },
            },
            mainEntityOfPage: { "@type": "WebPage", "@id": url },
            articleSection: category.name,
            keywords: post.tags.join(", "),
          }),
        },
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: SITE.url },
              { "@type": "ListItem", position: 2, name: category.name, item: `${SITE.url}/category/${category.slug}` },
              { "@type": "ListItem", position: 3, name: post.title, item: url },
            ],
          }),
        },
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: post.faqs.map((f) => ({
              "@type": "Question",
              name: f.q,
              acceptedAnswer: { "@type": "Answer", text: f.a },
            })),
          }),
        },
      ],
    };
  },
  notFoundComponent: () => (
    <div className="mx-auto max-w-3xl px-5 py-24 text-center">
      <h1 className="font-display text-4xl text-foreground">Story not found</h1>
      <Link to="/" className="mt-4 inline-block text-gold hover:underline">Return home</Link>
    </div>
  ),
  component: PostPage,
});

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    weekday: "long", month: "long", day: "numeric", year: "numeric",
  });
}

function PostPage() {
  const { post, category, related } = Route.useLoaderData();

  return (
    <article className="mx-auto max-w-7xl px-5 py-10 lg:py-14">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: category.name, href: `/category/${category.slug}` },
          { label: post.title.length > 40 ? post.title.slice(0, 40) + "…" : post.title },
        ]}
      />

      <header className="mx-auto mt-8 max-w-3xl text-center">
        <p className="text-[11px] uppercase tracking-[0.4em] text-gold">{post.heroEyebrow} · {category.name}</p>
        <h1 className="mt-4 font-display text-4xl leading-tight text-foreground md:text-6xl">{post.title}</h1>
        <p className="mt-5 font-display text-xl italic text-muted-foreground md:text-2xl">{post.excerpt}</p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-xs text-muted-foreground">
          <span className="text-foreground">By {post.author}</span>
          <span className="h-1 w-1 rounded-full bg-muted-foreground/40" />
          <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
          <span className="h-1 w-1 rounded-full bg-muted-foreground/40" />
          <span>{post.readingMinutes} min read</span>
        </div>
      </header>

      <div className="mx-auto my-12 h-px max-w-3xl bg-gradient-to-r from-transparent via-gold/60 to-transparent" />

      <div className="prose-article container-prose">
        {post.body.map((b, i) => {
          if (b.type === "h2") return <h2 key={i}>{b.text}</h2>;
          if (b.type === "h3") return <h3 key={i}>{b.text}</h3>;
          if (b.type === "ul") return <ul key={i}>{b.items.map((it, j) => <li key={j}>{it}</li>)}</ul>;
          if (b.type === "quote") return (
            <blockquote key={i}>
              "{b.text}"
              {b.cite && <footer className="mt-2 text-sm not-italic text-muted-foreground">— {b.cite}</footer>}
            </blockquote>
          );
          return <p key={i}>{b.text}</p>;
        })}
      </div>

      {/* Tags */}
      <div className="container-prose mt-10 flex flex-wrap gap-2">
        {post.tags.map((t) => (
          <span key={t} className="rounded-sm border border-border/60 px-2.5 py-1 text-[11px] uppercase tracking-widest text-muted-foreground">
            #{t}
          </span>
        ))}
      </div>

      {/* FAQs */}
      {post.faqs.length > 0 && (
        <section className="container-prose mt-16 border-t border-border/60 pt-10">
          <h2 className="font-display text-3xl text-foreground">Frequently asked questions</h2>
          <dl className="mt-6 space-y-6">
            {post.faqs.map((f) => (
              <div key={f.q}>
                <dt className="font-display text-lg text-gold">{f.q}</dt>
                <dd className="mt-1 text-muted-foreground">{f.a}</dd>
              </div>
            ))}
          </dl>
        </section>
      )}

      {/* Author byline */}
      <section className="container-prose mt-16 rounded-lg border border-border/60 bg-card p-6">
        <p className="text-[11px] uppercase tracking-widest text-gold">About the author</p>
        <p className="mt-2 font-display text-xl text-foreground">{post.author}</p>
        <p className="mt-2 text-sm text-muted-foreground">
          {post.author} writes for Ravir Press on technology, AI and the policy frontier. Tips welcome at editor@ravirpress.com.
        </p>
      </section>

      {/* Related */}
      {related.length > 0 && (
        <section className="mt-20">
          <div className="mb-8 border-b border-gold/40 pb-2">
            <h2 className="font-display text-3xl text-foreground">More from {category.name}</h2>
          </div>
          <div className="grid gap-10 md:grid-cols-3">
            {related.map((p) => (
              <PostCard key={p.slug} post={p} />
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
