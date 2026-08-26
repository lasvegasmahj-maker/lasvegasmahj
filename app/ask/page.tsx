import type { Metadata } from "next";
import Link from "next/link";
import { ogBase } from "@/lib/og";
import SubpageNav from "@/components/subpage-nav";
import Footer from "@/components/footer";
import AskClient from "./ask-client";

export const metadata: Metadata = {
  title: "Ask a Mahjong Rule",
  description:
    "Ask an American Mahjong rules question and get a clear answer based on National Mah Jongg League rules: jokers, the Charleston, calling tiles, dead hands.",
  alternates: { canonical: "https://www.lasvegasmahj.com/ask" },
  openGraph: {
    ...ogBase,
    title: "Ask a Mahjong Rule | Las Vegas Mahjong",
    description:
      "Have an American Mahjong rules question? Ask Las Vegas Mahjong and get a clear, direct answer based on National Mah Jongg League rules.",
    url: "https://www.lasvegasmahj.com/ask",
    images: ["https://www.lasvegasmahj.com/hero-bg.jpg"],
  },
};

const webPageSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Ask a Mahjong Rule",
  description:
    "A conversational American Mahjong rules helper from Las Vegas Mahjong, based on National Mah Jongg League rules.",
  url: "https://www.lasvegasmahj.com/ask",
  isPartOf: { "@id": "https://www.lasvegasmahj.com/#website" },
  publisher: { "@id": "https://www.lasvegasmahj.com/#business" },
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://www.lasvegasmahj.com" },
    { "@type": "ListItem", position: 2, name: "Ask a Mahjong Rule", item: "https://www.lasvegasmahj.com/ask" },
  ],
};

export default function AskPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema).replace(/</g, "\\u003c") }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema).replace(/</g, "\\u003c") }} />
      <SubpageNav />

      <main style={{ paddingTop: "80px" }}>
        <section className="ask-hero">
          <div className="container">
            <p className="section-label">Ask a Mahjong Rule</p>
            <h1 className="section-title ask-title">
              Ask <span className="accent-pink">Las Vegas</span> Mahjong
            </h1>
            <p className="ask-lede">Have an American Mahjong rules question? Ask away.</p>
          </div>
        </section>

        <AskClient />

        <section className="ask-about">
          <div className="container">
            <h2>How this works</h2>
            <p>
              Answers are based on National Mah Jongg League rules, checked against the rules printed on the card and our certified instructor&rsquo;s written guide, in plain language. Ask about jokers, the Charleston, calling tiles, dead hands, scoring, or the card, then keep going with a follow-up like &ldquo;what about a kong?&rdquo; When something varies by house rule, we say so. When we cannot verify a rule, we tell you instead of guessing. Some answers carry a Pending instructor review label while she checks the wording.
            </p>
            <p>
              Prefer to read? Browse the full <Link href="/rules">American Mahjong rules guide</Link>. Want to learn at a real table? See our <Link href="/mahjong-lessons-las-vegas">mahjong lessons</Link> or join <Link href="/mahjong-open-play-las-vegas">open play</Link>.
            </p>
            <p className="ask-disclaimer">
              Las Vegas Mahjong is not affiliated with or endorsed by the National Mah Jongg League. The annual card is the League&rsquo;s copyrighted work and this tool never reproduces its hands. Your conversation lives only in this browser tab and is never saved to an account. When we cannot answer, we keep a short topic summary (no numbers or emails) so we can add the missing rule; if our AI helper is switched on, your question and the last few turns of this conversation are sent to our AI provider to phrase the answer.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
