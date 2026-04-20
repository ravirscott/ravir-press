import { createFileRoute } from "@tanstack/react-router";
import { SITE } from "@/data/posts";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: `About — ${SITE.name}` },
      { name: "description", content: `${SITE.name} is an independent newsroom covering technology, artificial intelligence and the digital economy with rigour and editorial conviction.` },
      { property: "og:title", content: `About — ${SITE.name}` },
      { property: "og:description", content: `Inside ${SITE.name}: our mission, our values and the team behind the reporting.` },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-10 lg:py-14">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "About" }]} />
      <h1 className="mt-8 font-display text-5xl text-foreground md:text-6xl">About Ravir Press</h1>
      <p className="mt-4 font-display text-xl italic text-muted-foreground">An independent newsroom for the AI era.</p>

      <div className="prose-article mt-10">
        <p>Ravir Press is an independent newsroom covering technology, artificial intelligence, cybersecurity and the digital economy. We exist for readers who want to understand the forces reshaping the industry — not just the headlines they produce.</p>
        <h2>Our mission</h2>
        <p>To report the technology story with the seriousness it deserves: with sourcing, with context, and with a willingness to be early when the evidence supports it.</p>
        <h2>Our principles</h2>
        <ul>
          <li><strong>Independence.</strong> No story is shaped by an advertiser or sponsor.</li>
          <li><strong>Rigor.</strong> Multi-source reporting. We correct quickly and transparently.</li>
          <li><strong>Clarity.</strong> No jargon when plain English will do.</li>
          <li><strong>Forward-looking.</strong> We cover what is happening — and what is coming next.</li>
        </ul>
        <h2>How we work</h2>
        <p>Our reporters are journalists first. We use AI tools where they help — research, transcription, fact-checking — but every published word is written and edited by a human who is accountable for it.</p>
        <h2>Get in touch</h2>
        <p>Tips, corrections and pitches: <a href="mailto:editor@ravirpress.com">editor@ravirpress.com</a></p>
      </div>
    </div>
  );
}
