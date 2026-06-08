import type { Metadata } from "next";
import Link from "next/link";
import SubpageNav from "@/components/subpage-nav";
import Footer from "@/components/footer";

export const metadata: Metadata = {
  title: { absolute: "Mahjong Blog | Las Vegas Mahjong" },
  description:
    "Mahjong tips, Las Vegas activity guides, bachelorette party ideas, and group event inspiration from Las Vegas Mahjong, a certified Oh My Mahjong instructor.",
  alternates: {
    canonical: "https://www.lasvegasmahj.com/blog",
  },
  openGraph: {
    title: "Mahjong Blog | Las Vegas Mahjong",
    description:
      "Mahjong tips, Las Vegas activity guides, bachelorette party ideas, and group event inspiration from Las Vegas Mahjong, a certified Oh My Mahjong instructor.",
    url: "https://www.lasvegasmahj.com/blog",
    type: "website",
    siteName: "Las Vegas Mahjong",
    locale: "en_US",
    images: ["https://www.lasvegasmahj.com/hero-bg.jpg"],
  },
};

const posts = [
  {
    href: "/blog/things-to-do-las-vegas-besides-gambling",
    title: "Things to Do in Las Vegas Besides Gambling",
    description:
      "20+ activities in Las Vegas that have nothing to do with slot machines. From mahjong parties to hiking and live music.",
    tag: "Las Vegas Guide",
    tagColor: "accent-green",
  },
  {
    href: "/blog/bachelorette-party-ideas-las-vegas",
    title: "Bachelorette Party Ideas Las Vegas 2026",
    description:
      "The best bachelorette activities in Las Vegas, from private mahjong parties to pool days and private dinners.",
    tag: "Bachelorette",
    tagColor: "accent-pink",
  },
];

export default function BlogPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: "https://www.lasvegasmahj.com" }, { "@type": "ListItem", position: 2, name: "Blog", item: "https://www.lasvegasmahj.com/blog" }] }).replace(/</g, "\\u003c") }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "CollectionPage", name: "Mahjong Blog", url: "https://www.lasvegasmahj.com/blog", hasPart: posts.map(p => ({ "@type": "Article", headline: p.title, url: `https://www.lasvegasmahj.com${p.href}` })), mainEntity: { "@type": "ItemList", itemListElement: posts.map((p, i) => ({ "@type": "ListItem", position: i + 1, url: `https://www.lasvegasmahj.com${p.href}` })) } }).replace(/</g, "\\u003c") }} />
      <SubpageNav />

      <main>
        <section
          style={{
            background: "var(--navy-dark)",
            padding: "5rem 1.5rem 3rem",
            textAlign: "center",
          }}
        >
          <div className="container">
            <p className="section-label">Resources</p>
            <h1 className="section-title">
              Las Vegas Mahjong{" "}
              <span className="accent-pink">Blog</span>
            </h1>
            <p
              style={{
                fontFamily: "var(--font-nav)",
                color: "#ccc",
                maxWidth: "520px",
                margin: "1rem auto 0",
                fontSize: "1rem",
                lineHeight: "1.6",
              }}
            >
              Tips, guides, and ideas for mahjong lovers in Las Vegas.
            </p>
          </div>
        </section>

        <section
          style={{
            background: "var(--navy)",
            padding: "3rem 1.5rem 5rem",
          }}
        >
          <div
            className="container"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "2rem",
              maxWidth: "860px",
              margin: "0 auto",
            }}
          >
            {posts.map((post) => (
              <article
                key={post.href}
                style={{
                  background: "var(--navy-dark)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "12px",
                  padding: "2rem",
                  display: "flex",
                  flexDirection: "column",
                  gap: "1rem",
                }}
              >
                <span
                  className={post.tagColor}
                  style={{
                    fontFamily: "var(--font-nav)",
                    fontSize: "0.75rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    fontWeight: 600,
                  }}
                >
                  {post.tag}
                </span>

                <h2
                  style={{
                    fontFamily: "var(--font-heading)",
                    fontSize: "1.5rem",
                    color: "#fff",
                    lineHeight: "1.2",
                    margin: 0,
                  }}
                >
                  {post.title}
                </h2>

                <p
                  style={{
                    fontFamily: "inherit",
                    color: "#bbb",
                    fontSize: "0.95rem",
                    lineHeight: "1.6",
                    margin: 0,
                    flexGrow: 1,
                  }}
                >
                  {post.description}
                </p>

                <Link
                  href={post.href}
                  className="accent-green"
                  style={{
                    fontFamily: "var(--font-nav)",
                    fontWeight: 600,
                    fontSize: "0.95rem",
                    textDecoration: "none",
                  }}
                >
                  Read more &rarr;
                </Link>
              </article>
            ))}
          </div>
        </section>

        <section
          style={{
            background: "var(--navy-dark)",
            padding: "4rem 1.5rem",
            textAlign: "center",
          }}
        >
          <div className="container">
            <p
              style={{
                fontFamily: "var(--font-nav)",
                color: "#ccc",
                marginBottom: "1.5rem",
                fontSize: "1rem",
              }}
            >
              Ready to play? Join a class or book a private party in Las Vegas.
            </p>
            <div
              style={{
                display: "flex",
                gap: "1rem",
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              <Link href="/mahjong-parties-las-vegas" className="btn-primary">
                Plan a Party
              </Link>
              <Link href="/#classes" className="btn-outline">
                View Classes
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
