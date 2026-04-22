import { useState } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const schema = z.object({
  name: z.string().trim().min(1, "Name required").max(120),
  email: z.string().trim().email("Invalid email").max(255),
  message: z.string().trim().max(2000).optional(),
});

export function JoinAsEditorDialog({ trigger }: { trigger: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    setLoading(true);
    const { error } = await supabase.from("editor_requests").insert({
      name: parsed.data.name,
      email: parsed.data.email,
      message: parsed.data.message || null,
    });
    setLoading(false);
    if (error) {
      console.error("[editor-request]", error);
      toast.error("Could not submit request. Please try again.");
      return;
    }
    toast.success("Request submitted. We'll be in touch.");
    setForm({ name: "", email: "", message: "" });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">
            Join as <span className="text-gold">Editor</span>
          </DialogTitle>
          <DialogDescription>
            Pitch yourself in a few lines. We review every request.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="je-name">Name</Label>
            <Input
              id="je-name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              maxLength={120}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="je-email">Email</Label>
            <Input
              id="je-email"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              maxLength={255}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="je-message">Why you? (optional)</Label>
            <Textarea
              id="je-message"
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              rows={4}
              maxLength={2000}
              placeholder="Beats you cover, links to past work…"
            />
          </div>
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting…</> : "Submit request"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
