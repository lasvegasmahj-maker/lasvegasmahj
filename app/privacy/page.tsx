import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { ogBase, OG_HERO } from "@/lib/og";
import { buildBreadcrumbSchema } from "@/lib/schema";
import SubpageNav from "@/components/subpage-nav";
import Footer from "@/components/footer";

export const metadata: Metadata = {
  title: "Privacy",
  description:
    "How the Las Vegas Mahjong website handles your information, from the contact form and the newsletter to Ask a Rule and Bookwhen bookings.",
  alternates: { canonical: "https://www.lasvegasmahj.com/privacy" },
  openGraph: {
    ...ogBase,
    title: "Privacy | Las Vegas Mahjong",
    description: "What the Las Vegas Mahjong website does with the information you share, in plain language.",
    url: "https://www.lasvegasmahj.com/privacy",
    images: [OG_HERO],
  },
};

const breadcrumbSchema = buildBreadcrumbSchema([{ name: "Privacy", url: "https://www.lasvegasmahj.com/privacy" }]);

// components/analytics.tsx loads the GA4 tag only when this variable is set at build time, so
// the page describes Google Analytics in exactly the builds that load it and never before.
const ANALYTICS_ON = Boolean(process.env.NEXT_PUBLIC_GA4_ID);
// Setting the ID changes what this page says, and the page promises to move its date when that
// happens. The first date is the day the build carrying the ID goes live.
const LAST_UPDATED = ANALYTICS_ON ? "November 18, 2026" : "November 13, 2026";

const card = { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)", borderRadius: 14, padding: "1.6rem 1.8rem 0.8rem" } as const;
const heading = { fontFamily: "var(--font-nav)", fontWeight: 700, fontSize: "1.05rem", color: "white", marginBottom: "0.7rem", lineHeight: 1.4 } as const;
const text = { color: "rgba(255,255,255,0.68)", lineHeight: 1.75, fontSize: "0.95rem", margin: "0 0 0.9rem" } as const;
const list = { ...text, paddingLeft: "1.25rem", listStyle: "disc" } as const;
const link = { color: "var(--green)", fontWeight: 600 } as const;

function Topic({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div style={card}>
      <h2 style={heading}>{title}</h2>
      {children}
    </div>
  );
}

// Formspree and Anthropic are named but not linked. Only components/contact-form.tsx may carry
// Formspree's address (tests/contact-consistency.logic.spec.ts), and Anthropic's privacy policy
// says it does not apply to content processed for customers of its business offerings, which
// covers the questions this site sends through Anthropic's API.
export default function Privacy() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema).replace(/</g, "\\u003c") }} />
      <SubpageNav />

      <main id="main-content" style={{ paddingTop: "80px" }}>
        <section style={{ background: "var(--navy-dark)", padding: "5rem 2rem 4rem", textAlign: "center", borderBottom: "1px solid rgba(233,30,140,0.2)" }}>
          <div className="container" style={{ maxWidth: "760px" }}>
            <p className="section-label">Your Information</p>
            <h1 className="section-title" style={{ fontSize: "clamp(2.5rem, 8vw, 5rem)", marginBottom: "1.5rem" }}>
              <span className="accent-pink">Privacy</span>
            </h1>
            <p style={{ fontSize: "1.15rem", color: "rgba(255,255,255,0.7)", lineHeight: 1.75, marginBottom: "1rem" }}>
              What this website does with information about you, in plain language.
            </p>
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.9rem", margin: 0 }}>Last updated {LAST_UPDATED}</p>
          </div>
        </section>

        <section style={{ background: "var(--navy)", padding: "5rem 2rem" }}>
          <div className="container" style={{ maxWidth: "740px", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <Topic title="Who we are">
              <p style={text}>
                Las Vegas Mahjong runs this website, lasvegasmahj.com. This page explains what the site collects, where it goes and why.
              </p>
              <p style={text}>
                Questions about your privacy, or about something you sent us? Email{" "}
                <a href="mailto:hello@lasvegasmahj.com" style={link}>hello@lasvegasmahj.com</a>.
              </p>
            </Topic>

            <Topic title="When you contact us">
              <p style={text}>
                Our contact form asks for your name, email address, phone number and what you would like help with. You can also add your group size, a preferred date and a message. The form also notes which page of our site sent you to it.
              </p>
              <p style={text}>
                When you press Send Message, your browser sends the form to Formspree, the form service we use, and Formspree emails it to us. We use what you send to reply to you. We do not sell it.
              </p>
            </Topic>

            <Topic title="Our newsletter">
              <p style={text}>
                When you sign up for our newsletter, this site passes your email address to Mailchimp, the email service that keeps our mailing list and sends the newsletter. We use the list to send event announcements and open play reminders. Every newsletter email includes an unsubscribe link.
              </p>
              <p style={text}>
                Intuit, the company behind Mailchimp, explains how Mailchimp handles information in its{" "}
                <a href="https://www.intuit.com/privacy/statement/" target="_blank" rel="noopener noreferrer" style={link}>Global Privacy Statement</a>.
              </p>
            </Topic>

            <Topic title="Ask a Rule">
              <p style={text}>
                When you ask a question on <Link href="/ask" style={link}>Ask a Rule</Link>:
              </p>
              <ul style={list}>
                <li>Your browser sends the question to our server, along with the last few questions and answers from the same conversation, so a follow-up makes sense.</li>
                {/* "Switched on" is isModelEnabled in lib/ask/llm.ts: an ANTHROPIC_API_KEY is set and ASK_MODEL_DISABLED is not 1. */}
                <li>Our server looks for the answer among the rules answers we have written. When our AI helper is switched on, some questions also go to Anthropic, the company that makes the Claude AI model, to help pick the right written answer. Anthropic receives the words of your question and the last few turns of the conversation, and nothing else about you.</li>
                <li>Our server uses your IP address to limit how many questions anyone can ask in a minute and in a day, and keeps that count in its memory.</li>
                {/* 120 is the cut in summarizeGap (lib/ask/engine.ts), which app/api/ask/route.ts logs. */}
                <li>Our server writes a short record of each answer to our hosting logs: what kind of answer it was, which rule it matched, whether the AI helper took part, which question in the conversation it was and how long it took. The record leaves out your question, except when we cannot verify an answer. Then the record includes the first 120 characters of your question, with any email addresses and numbers removed, so we can see which rules to add.</li>
                <li>Your browser keeps the conversation in the tab where you asked, so it survives a page refresh. Closing the tab clears it, and so does Start a new question.</li>
              </ul>
              <p style={text}>Please leave personal details, such as names or contact information, out of your questions.</p>
            </Topic>

            <Topic title="Bookings and payments">
              <p style={text}>
                We take bookings for classes and events through Bookwhen. The Book buttons on our <Link href="/schedule" style={link}>schedule</Link> take you to bookwhen.com, and any online payment happens there. This website never takes payments and never sees your card details. Bookwhen handles your booking details for us, and{" "}
                <a href="https://bookwhen.com/privacy" target="_blank" rel="noopener noreferrer" style={link}>Bookwhen&rsquo;s privacy policy</a>{" "}
                explains how it treats visitors to its website.
              </p>
              <p style={text}>
                Our server reads the schedule from Bookwhen&rsquo;s public calendar, so looking at the schedule here does not connect your browser to Bookwhen. An event at a partner venue may be booked through that venue&rsquo;s own website instead.
              </p>
            </Topic>

            <Topic title="Analytics">
              {ANALYTICS_ON ? (
              <>
              <p style={text}>
                We use Google Analytics 4, a Google service, to understand which pages people visit and which links they click. When you load a page, your browser sends Google the address and title of that page, the address of the page you came from and your IP address. It also sends details about your browser and device, such as the browser, the operating system and their versions, the device model, the screen size and the language setting. Google may use the IP address to identify your general location. When you leave a page, your browser tells Google how long you spent on it. Google Analytics also sets cookies in your browser (their names start with _ga) to tell visitors and their visits apart.
              </p>
              <p style={text}>Our site also tells Google Analytics when you:</p>
              <ul style={list}>
                <li>click a link to our class schedule</li>
                <li>click a link to our contact page</li>
                <li>click a link to our booking pages on Bookwhen. This counts the click, not a booking: the booking itself happens on Bookwhen, where this site cannot see it.</li>
                <li>send the contact form, with whether it went through, the type of help you picked from our list and which page sent you to the form</li>
                <li>sign up for the newsletter</li>
                <li>use Ask a Rule: that you asked a question (typed or picked from the suggestions), which question in the conversation it was, what kind of answer it got, its rules topic and whether the AI helper took part, plus taps on suggested questions, links and Start a new question</li>
              </ul>
              <p style={text}>
                Link clicks also record the page you clicked on. Our site never sends Google Analytics your name, email address, phone number, or anything you type into the contact form, the newsletter signup or Ask a Rule.
              </p>
              <p style={text}>
                Google explains{" "}
                <a href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noopener noreferrer" style={link}>how it uses information from sites that use its services</a>. If you do not want Google Analytics used in your browser, install Google&rsquo;s{" "}
                <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" style={link}>opt-out browser add-on</a>.
              </p>
              </>
              ) : (
                <p style={text}>
                  This website does not use an analytics service right now. If that changes, this section will say which service it uses and what it records.
                </p>
              )}
            </Topic>

            <Topic title="Cookies and browser storage">
              <p style={text}>
                {ANALYTICS_ON
                  ? "This website does not set any cookies of its own. Google Analytics sets the cookies described above."
                  : "This website does not set any cookies."}{" "}
                Ask a Rule keeps your conversation in your browser&rsquo;s session storage, which your browser clears when you close the tab.
              </p>
            </Topic>

            <Topic title="Other websites">
              <p style={text}>
                Our pages link to other websites, such as the shops in our <Link href="/mahjong-sets-guide" style={link}>mahjong sets guide</Link>, Amazon, and our Instagram, TikTok and Facebook pages. Some shop links are affiliate links, which let the shop know you came from us. Once you leave this website, the other site&rsquo;s own privacy policy applies.
              </p>
            </Topic>

            <Topic title="Hosting">
              <p style={text}>
                Vercel hosts this website. Vercel collects information about traffic to the websites it hosts, such as visitors&rsquo; IP addresses, and keeps server logs, which also hold the short Ask a Rule records described above.{" "}
                <a href="https://vercel.com/legal/privacy-notice" target="_blank" rel="noopener noreferrer" style={link}>Vercel&rsquo;s privacy notice</a> explains more.
              </p>
            </Topic>

            <Topic title="Children">
              <p style={text}>This website does not target children under 13.</p>
            </Topic>

            <Topic title="Changes to this page">
              <p style={text}>When this website changes how it handles information, we update this page and the date at the top.</p>
            </Topic>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
