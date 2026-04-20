import { createFileRoute } from "@tanstack/react-router";
import { CATEGORIES, POSTS, SITE } from "@/data/posts";

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: () => {
        const staticUrls = ["", "/about", "/contact", "/privacy"];
        const urls = [
          ...staticUrls.map((u) => `${SITE.url}${u}`),
          ...CATEGORIES.map((c) => `${SITE.url}/category/${c.slug}`),
          ...POSTS.map((p) => `${SITE.url}/post/${p.slug}`),
        ];

        const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) =>
      `  <url><loc>${u}</loc><changefreq>daily</changefreq><priority>0.8</priority></url>`
  )
  .join("\n")}
</urlset>`;

        return new Response(body, {
          headers: { "Content-Type": "application/xml; charset=utf-8" },
        });
      },
    },
  },
});
