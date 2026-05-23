import Link from "next/link";
import SubpageNav from "@/components/subpage-nav";
import Footer from "@/components/footer";

export default function NotFound() {
  return (
    <>
      <SubpageNav />

      <main>
        <section
          style={{
            background: "var(--navy-dark)",
            minHeight: "70vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "5rem 1.5rem",
            textAlign: "center",
          }}
        >
          <div className="container">
            <p className="section-label">404</p>

            <h1 className="section-title">
              Page <span className="accent-pink">Not Found</span>
            </h1>

            <p
              style={{
                fontFamily: "var(--font-nav)",
                color: "#ccc",
                fontSize: "1rem",
                lineHeight: "1.6",
                maxWidth: "440px",
                margin: "1rem auto 2.5rem",
              }}
            >
              This page doesn&apos;t exist, but your next mahjong lesson does.
            </p>

            <div
              style={{
                display: "flex",
                gap: "1rem",
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              <Link href="/" className="btn-primary">
                Go Home
              </Link>
              <Link href="/mahjong-lessons-las-vegas" className="btn-outline">
                Book a Lesson
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
