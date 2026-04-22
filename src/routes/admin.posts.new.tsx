import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Component, type ReactNode } from "react";
import { PostEditor } from "@/components/admin/PostEditor";

export const Route = createFileRoute("/admin/posts/new")({
  component: NewPost,
  errorComponent: ({ error }) => (
    <div className="rounded-lg border border-destructive/60 bg-destructive/10 p-6 text-sm">
      <p className="font-semibold text-destructive">Editor failed to load</p>
      <pre className="mt-2 whitespace-pre-wrap text-xs text-muted-foreground">{error.message}</pre>
    </div>
  ),
});

class Boundary extends Component<{ children: ReactNode }, { err: Error | null }> {
  state = { err: null as Error | null };
  static getDerivedStateFromError(err: Error) { return { err }; }
  componentDidCatch(err: Error) { console.error("[PostEditor crash]", err); }
  render() {
    if (this.state.err) {
      return (
        <div className="rounded-lg border border-destructive/60 bg-destructive/10 p-6 text-sm">
          <p className="font-semibold text-destructive">Editor crashed</p>
          <pre className="mt-2 whitespace-pre-wrap text-xs text-muted-foreground">{this.state.err.message}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}

function NewPost() {
  const navigate = useNavigate();
  return (
    <Boundary>
      <PostEditor onSaved={(slug) => navigate({ to: "/admin/posts/$slug", params: { slug } })} />
    </Boundary>
  );
}
