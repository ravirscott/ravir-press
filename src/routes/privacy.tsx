import { createFileRoute } from "@tanstack/react-router";
import { SITE } from "@/data/posts";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: `Privacy Policy — ${SITE.name}` },
      { name: "description", content: `${SITE.name} privacy policy: what we collect, how we use it, and your rights.` },
      { name: "robots", content: "index, follow" },
    ],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-10 lg:py-14">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Privacy" }]} />
      <h1 className="mt-8 font-display text-5xl text-foreground md:text-6xl">Privacy Policy</h1>
      <p className="mt-2 text-sm text-muted-foreground">Last updated: {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</p>

      <div className="prose-article mt-8">
        <p>This policy explains what information Ravir Press collects when you visit our site, how we use it and the choices you have.</p>

        <h2>Information we collect</h2>
        <ul>
          <li>Server logs (IP address, user agent, pages requested) used to operate and secure the site.</li>
          <li>Anonymous analytics that help us understand which stories readers find useful.</li>
          <li>Information you voluntarily provide — for example, when you email the newsroom.</li>
        </ul>

        <h2>Cookies and advertising</h2>
        <p>We may use cookies for analytics and to display advertising. Third-party advertising partners, including Google, may use cookies to serve ads based on your prior visits to this and other websites. You can opt out of personalized advertising via Google&apos;s Ads Settings.</p>

        <h2>How we use information</h2>
        <ul>
          <li>To deliver, secure and improve the site.</li>
          <li>To understand reader interests in aggregate.</li>
          <li>To respond to inquiries you send to us.</li>
        </ul>

        <h2>Your rights</h2>
        <p>Depending on where you live, you may have rights to access, correct or delete personal information we hold about you. Email <a href="mailto:privacy@ravirpress.com">privacy@ravirpress.com</a> to make a request.</p>

        <h2>Children</h2>
        <p>Ravir Press is intended for general audiences and does not knowingly collect information from children under 13.</p>

        <h2>Changes</h2>
        <p>We may update this policy periodically. Material changes will be noted here with a revised date.</p>
      </div>
    </div>
  );
}
