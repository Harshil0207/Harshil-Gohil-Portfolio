import type { Metadata } from "next";
import { Anton, Geist_Mono, Schibsted_Grotesk } from "next/font/google";
import { ViewTransition } from "react";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { Cursor } from "@/components/motion/cursor";
import { IntroLoader } from "@/components/motion/intro-loader";
import { PuppyMount } from "@/components/motion/puppy-mount";
import { ScrollReset } from "@/components/motion/scroll-reset";
import { Scrollbar } from "@/components/motion/scrollbar";
import { MotionProvider } from "@/components/motion/motion-provider";
import { company } from "@/content/company";
import { DEFAULT_PALETTE, DEFAULT_THEME, themeScript } from "@/lib/theme";
import "./globals.css";

const display = Anton({
  variable: "--font-display",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const ui = Schibsted_Grotesk({
  variable: "--font-ui",
  subsets: ["latin"],
  display: "swap",
});

const mono = Geist_Mono({
  variable: "--font-mono-face",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(company.url),
  title: {
    default: "Harshil Gohil — Full-stack developer",
    template: "%s — Harshil Gohil",
  },
  description:
    "Harshil Gohil is a full-stack developer in Surat, India, building complete products — data model and API through to the interface — with 3D web and AI.",
  keywords: [
    "Harshil Gohil",
    "full-stack developer",
    "MERN developer",
    "React developer",
    "Three.js",
    "Surat developer",
  ],
  openGraph: {
    type: "website",
    siteName: company.name,
    url: company.url,
    title: "Harshil Gohil — Full-stack developer",
    description:
      "Full-stack products, real-time systems, 3D web and AI — built end to end.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Harshil Gohil — Full-stack developer",
    description:
      "Full-stack products, real-time systems, 3D web and AI — built end to end.",
    creator: company.xLabel,
  },
};

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: company.name,
  jobTitle: company.tagline,
  url: company.url,
  sameAs: [company.github, company.x],
  address: {
    "@type": "PostalAddress",
    addressLocality: company.address.city,
    addressRegion: company.address.region,
    addressCountry: company.address.country,
  },
};

/*
 * Set before first paint, because the browser restores the previous scroll
 * offset on reload and on back/forward — and it does so around hydration, so a
 * React effect that scrolls to the top can be overruled a frame later. Turning
 * restoration off is the only way to make "every page opens at the top" hold on
 * a reload as well as on a navigation; ScrollReset then does the moving.
 */
const SCROLL_SCRIPT = `if("scrollRestoration"in history){history.scrollRestoration="manual"}var seen;try{seen=sessionStorage.getItem("hg-intro")}catch(e){}if(seen){document.documentElement.classList.add("intro-skip")}else if(!matchMedia("(prefers-reduced-motion: reduce)").matches){document.documentElement.classList.add("intro-lock")}`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-theme={DEFAULT_THEME}
      data-palette={DEFAULT_PALETTE}
      className={`${display.variable} ${ui.variable} ${mono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <script dangerouslySetInnerHTML={{ __html: SCROLL_SCRIPT }} />
        <noscript>
          <style>{".intro-loader{display:none}"}</style>
        </noscript>
      </head>
      <body className="min-h-dvh bg-field text-on-field">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(personSchema),
          }}
        />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-6 focus:top-6 focus:z-[60] focus:rounded-full focus:border focus:border-line-on-field focus:bg-ink focus:px-4 focus:py-3 focus:text-sm"
        >
          Skip to content
        </a>
        <MotionProvider>
          <IntroLoader />
          <ScrollReset />
          <PuppyMount />
          <Cursor />
          <Header />
          {/*
            The boundary the router animates across. React only snapshots what
            sits inside a `<ViewTransition>`, which is why the `title-${slug}`
            pairs already morphed while the page itself simply cut — nothing
            wrapped the page. Naming it lets the CSS address the pair directly.

            The nested title transitions still run: a descendant with its own
            name is lifted out of this snapshot and animated as its own group.
          */}
          <ViewTransition name="page">
            <main id="main">{children}</main>
          </ViewTransition>
          <Footer />
          <Scrollbar />
        </MotionProvider>
      </body>
    </html>
  );
}
