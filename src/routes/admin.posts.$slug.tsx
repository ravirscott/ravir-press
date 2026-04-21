import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PostEditor, type EditablePost } from "@/components/admin/PostEditor";

export const Route = createFileRoute("/admin/posts/$slug")({ component: EditPost });

function EditPost() {
  const { slug } = Route.useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState<EditablePost | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    supabase.from("posts").select("*").eq("slug", slug).maybeSingle().then(({ data }) => {
      if (!data) setNotFound(true);
      else setPost(data as unknown as EditablePost);
    });
  }, [slug]);

  if (notFound) return <p className="text-muted-foreground">Post not found.</p>;
  if (!post) return <p className="text-muted-foreground">Loading…</p>;
  return <PostEditor initial={post} onSaved={(s) => navigate({ to: "/admin/posts/$slug", params: { slug: s } })} />;
}
