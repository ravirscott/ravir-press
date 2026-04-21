import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/forgot-password")({
  head: () => ({ meta: [{ title: "Forgot password — Ravir Press" }, { name: "robots", content: "noindex" }] }),
  component: ForgotPage,
});

function ForgotPage() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setMsg(null); setErr(null); setBusy(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setBusy(false);
    if (error) setErr(error.message);
    else setMsg("If that email exists, a reset link was sent.");
  };

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-5 py-16">
      <h1 className="text-center font-display text-3xl text-foreground">Reset your password</h1>
      <form onSubmit={submit} className="mt-6 space-y-4 rounded-lg border border-border/60 bg-card p-6">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        {msg && <p className="text-sm text-gold">{msg}</p>}
        {err && <p className="text-sm text-destructive">{err}</p>}
        <Button disabled={busy} className="w-full bg-gold text-primary-foreground hover:bg-gold/90">Send reset link</Button>
        <div className="text-center text-xs text-muted-foreground">
          <Link to="/login" className="hover:text-gold">Back to sign in</Link>
        </div>
      </form>
    </div>
  );
}
