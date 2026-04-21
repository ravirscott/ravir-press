import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { PostEditor } from "@/components/admin/PostEditor";

export const Route = createFileRoute("/admin/posts/new")({ component: NewPost });

function NewPost() {
  const navigate = useNavigate();
  return <PostEditor onSaved={(slug) => navigate({ to: "/admin/posts/$slug", params: { slug } })} />;
}
