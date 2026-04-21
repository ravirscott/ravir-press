import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/settings")({ component: SettingsPage });

function SettingsPage() {
  const { user } = useAuth();
  const [pw, setPw] = useState("");
  const [busy, setBusy] = useState(false);

  const changePw = async () => {
    if (pw.length < 8) return toast.error("Min 8 characters");
    setBusy(true);
    const { error } = await supabase.auth.updateUser({ password: pw });
    setBusy(false);
    if (error) toast.error(error.message);
    else { toast.success("Password updated"); setPw(""); }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="font-display text-4xl text-foreground">Settings</h1>

      <section className="rounded-lg border border-border/60 bg-card/40 p-5">
        <h2 className="mb-3 font-display text-xl text-foreground">Account</h2>
        <p className="text-sm text-muted-foreground">Signed in as <span className="text-foreground">{user?.email}</span></p>
        <div className="mt-4 space-y-3">
          <div>
            <Label>New password</Label>
            <Input type="password" value={pw} onChange={(e) => setPw(e.target.value)} />
          </div>
          <Button onClick={changePw} disabled={busy} className="bg-gold text-primary-foreground">Change password</Button>
        </div>
      </section>

      <section className="rounded-lg border border-border/60 bg-card/40 p-5">
        <h2 className="mb-3 font-display text-xl text-foreground">Site</h2>
        <p className="text-sm text-muted-foreground">Title, logo, theme and AI toggles will appear here in a future iteration. The AI generator is currently enabled.</p>
      </section>
    </div>
  );
}
