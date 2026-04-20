import { createFileRoute } from "@tanstack/react-router";
import { SITE } from "@/data/posts";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: `Contact — ${SITE.name}` },
      { name: "description", content: `Contact the ${SITE.name} newsroom — tips, corrections, partnerships and press inquiries.` },
      { property: "og:title", content: `Contact — ${SITE.name}` },
      { property: "og:description", content: `Reach the ${SITE.name} editorial team.` },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-10 lg:py-14">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Contact" }]} />
      <h1 className="mt-8 font-display text-5xl text-foreground md:text-6xl">Contact</h1>
      <p className="mt-4 font-display text-xl italic text-muted-foreground">We read every message. Confidentiality respected.</p>

      <div className="mt-12 grid gap-6 md:grid-cols-2">
        {[
          { label: "Editorial & Tips", email: "editor@ravirpress.com", note: "News tips, corrections, and story pitches." },
          { label: "Press & Partnerships", email: "press@ravirpress.com", note: "Media inquiries and editorial partnerships." },
          { label: "Advertising", email: "ads@ravirpress.com", note: "Sponsorships and brand collaborations." },
          { label: "Careers", email: "careers@ravirpress.com", note: "Open roles and journalist applications." },
        ].map((c) => (
          <div key={c.label} className="rounded-lg border border-border/60 bg-card p-6">
            <p className="text-[11px] uppercase tracking-widest text-gold">{c.label}</p>
            <a href={`mailto:${c.email}`} className="mt-2 block font-display text-xl text-foreground hover:text-gold">{c.email}</a>
            <p className="mt-2 text-sm text-muted-foreground">{c.note}</p>
          </div>
        ))}
      </div>

      <div className="prose-article mt-12">
        <h2>Secure tips</h2>
        <p>For sensitive material, please write from a personal (non-corporate) address. We are evaluating Signal and SecureDrop for confidential submissions and will publish details soon.</p>
      </div>
    </div>
  );
}
