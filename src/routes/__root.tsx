import { Outlet, Link, createRootRoute, HeadContent, Scripts, useRouterState } from "@tanstack/react-router";
import appCss from "../styles.css?url";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { SITE } from "@/data/posts";
import { AuthProvider } from "@/lib/auth-context";
import { Toaster } from "@/components/ui/sonner";

function NotFoundComponent() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-8xl text-gold">404</h1>
        <h2 className="mt-4 font-display text-2xl text-foreground">Story not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you&apos;re looking for has been retracted, moved, or never existed.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-gold px-5 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            Back to the front page
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: `${SITE.name} — ${SITE.tagline}` },
      { name: "description", content: SITE.description },
      { name: "author", content: SITE.author },
      { name: "robots", content: "index, follow" },
      { property: "og:site_name", content: SITE.name },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:site", content: SITE.twitter },
      { name: "theme-color", content: "#0d0d0d" },
      { title: "Ravir Press" },
      { property: "og:title", content: "Ravir Press" },
      { name: "twitter:title", content: "Ravir Press" },
      { name: "description", content: "Ravir Press delivers premium reporting on technology, artificial intelligence, cybersecurity and the digital economy — breaking news, deep analysis, and forward" },
      { property: "og:description", content: "Ravir Press delivers premium reporting on technology, artificial intelligence, cybersecurity and the digital economy — breaking news, deep analysis, and forward" },
      { name: "twitter:description", content: "Ravir Press delivers premium reporting on technology, artificial intelligence, cybersecurity and the digital economy — breaking news, deep analysis, and forward" },
      { property: "og:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/attachments/og-images/53638d74-3c91-444a-b8f0-76837f019d18" },
      { name: "twitter:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/attachments/og-images/53638d74-3c91-444a-b8f0-76837f019d18" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Karla:wght@400;500;600;700&display=swap",
      },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "NewsMediaOrganization",
          name: SITE.name,
          url: SITE.url,
          description: SITE.description,
          slogan: SITE.tagline,
        }),
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="google-site-verification" content="Ywn4LG_crmjJ9Nt2abXEJNOvVoL-c28BBzuBziT6gio" />
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const isAdmin = path.startsWith("/admin") || path === "/login" || path === "/forgot-password" || path === "/reset-password";
  return (
    <AuthProvider>
      <div className="flex min-h-screen flex-col bg-background">
        {!isAdmin && <SiteHeader />}
        <main className="flex-1">
          <Outlet />
        </main>
        {!isAdmin && <SiteFooter />}
        <Toaster />
      </div>
    </AuthProvider>
  );
}
