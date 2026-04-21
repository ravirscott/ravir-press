// Helpers for converting between DB rows and app post shape, and merging
// DB-backed posts with the static seed in src/data/posts.ts (used as fallback
// so the public site keeps working until everything is migrated).
import { supabase } from "@/integrations/supabase/client";
import { POSTS as STATIC_POSTS, type Post, type PostBlock } from "@/data/posts";

export type DbPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  meta_description: string | null;
  category_slug: string | null;
  tags: string[];
  author: string | null;
  status: "draft" | "published" | "scheduled";
  published_at: string | null;
  scheduled_for: string | null;
  reading_minutes: number | null;
  hero_eyebrow: string | null;
  hero_image_url: string | null;
  body: PostBlock[];
  faqs: { q: string; a: string }[];
  is_ai_generated: boolean;
  views: number;
  created_at: string;
  updated_at: string;
};

export function dbToPost(p: DbPost): Post {
  return {
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt ?? "",
    metaDescription: p.meta_description ?? "",
    category: p.category_slug ?? "breaking-news",
    tags: p.tags ?? [],
    author: p.author ?? "Ravir Press Editorial",
    publishedAt: p.published_at ?? p.created_at,
    readingMinutes: p.reading_minutes ?? 5,
    heroEyebrow: p.hero_eyebrow ?? "Dispatch",
    body: Array.isArray(p.body) ? p.body : [],
    faqs: Array.isArray(p.faqs) ? p.faqs : [],
  };
}

export async function fetchPublishedPosts(): Promise<Post[]> {
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("status", "published")
    .order("published_at", { ascending: false });
  if (error || !data) return [];
  return (data as unknown as DbPost[]).map(dbToPost);
}

export async function fetchPostBySlug(slug: string): Promise<Post | null> {
  const { data } = await supabase.from("posts").select("*").eq("slug", slug).eq("status", "published").maybeSingle();
  if (data) return dbToPost(data as unknown as DbPost);
  return STATIC_POSTS.find((p) => p.slug === slug) ?? null;
}

// Merge: DB published posts first, then static fallback (deduped by slug).
export async function fetchAllPostsMerged(): Promise<Post[]> {
  const db = await fetchPublishedPosts();
  const seen = new Set(db.map((p) => p.slug));
  const merged = [...db, ...STATIC_POSTS.filter((p) => !seen.has(p.slug))];
  merged.sort((a, b) => +new Date(b.publishedAt) - +new Date(a.publishedAt));
  return merged;
}
