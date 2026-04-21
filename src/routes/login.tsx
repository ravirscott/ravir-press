import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Sign in — Ravir Press" }, { name: "robots", content: "noindex" }] }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErr(null); setBusy(true);
    try {
      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate({ to: "/admin" });
      } else {
        const { error } = await supabase.auth.signUp({
          email, password,
          options: {
            emailRedirectTo: `${window.location.origin}/admin`,
            data: { display_name: displayName || email.split("@")[0] },
          },
        });
        if (error) throw error;
        // If email confirmation is OFF (default in Lovable Cloud), session exists
        const { data: { session } } = await supabase.auth.getSession();
        if (session) navigate({ to: "/admin" });
        else setErr("Check your email to confirm your account.");
      }
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : "Something went wrong");
    } finally { setBusy(false); }
  };

  return (
    <div className="mx-auto flex min-h-[80vh] max-w-md flex-col justify-center px-5 py-16">
      <div className="text-center">
        <p className="text-[11px] uppercase tracking-[0.4em] text-gold">Ravir Press</p>
        <h1 className="mt-3 font-display text-4xl text-foreground">{mode === "signin" ? "Editor sign-in" : "Create account"}</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {mode === "signin" ? "Sign in to the newsroom dashboard." : "Request editor access. New accounts start as readers until promoted."}
        </p>
      </div>

      <form onSubmit={onSubmit} className="mt-8 space-y-4 rounded-lg border border-border/60 bg-card p-6">
        {mode === "signup" && (
          <div>
            <Label htmlFor="dn">Display name</Label>
            <Input id="dn" value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder="Jane Editor" />
          </div>
        )}
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="pw">Password</Label>
          <Input id="pw" type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        {err && <p className="text-sm text-destructive">{err}</p>}
        <Button type="submit" disabled={busy} className="w-full bg-gold text-primary-foreground hover:bg-gold/90">
          {busy ? "…" : mode === "signin" ? "Sign in" : "Create account"}
        </Button>
        <div className="flex justify-between text-xs text-muted-foreground">
          <button type="button" onClick={() => setMode(mode === "signin" ? "signup" : "signin")} className="hover:text-gold">
            {mode === "signin" ? "Need an account?" : "Have an account? Sign in"}
          </button>
          <Link to="/forgot-password" className="hover:text-gold">Forgot password?</Link>
        </div>
      </form>
    </div>
  );
}
