"use client";

import { useState, useSyncExternalStore } from "react";
import { trackEvent } from "@/lib/analytics";

// An unrecognised or absent ?source= falls back to GENERAL_SOURCE: forwarding raw query
// text would put attacker-controlled content into an inbox a human reads. `label` is what
// lands in the email, so it reads as a phrase rather than a slug. `inquiry` pre-selects
// the matching Inquiry Type, which is what lets that field be required without adding
// friction for anyone arriving from a tagged CTA.
const SOURCES: Record<string, { label: string; inquiry: string }> = {
  corporate: { label: "Corporate Events page", inquiry: "Corporate or Team Building" },
  "team-building": { label: "Corporate Team Building page", inquiry: "Corporate or Team Building" },
  conference: { label: "Conference Activities page", inquiry: "Conference or Convention" },
  convention: { label: "Convention Activities page", inquiry: "Conference or Convention" },
  parties: { label: "Private Parties page", inquiry: "Private Party or Celebration" },
  "private-lessons": { label: "Private Lessons page", inquiry: "Private Lesson" },
};

const GENERAL_SOURCE = "General (nav, footer or direct)";

// type="tel" applies no native validation, so "required" alone would accept a single
// character. Counting digits keeps every real format valid: 7025551212, 702-555-1212,
// (702) 555-1212 and +1 702 555 1212 all pass, while a stray character or a truncated
// number does not. The upper bound is E.164's fifteen digits so an international number
// still fits. An empty value is left alone so the browser's own "required" message shows
// instead of this one.
function validatePhone(el: HTMLInputElement) {
  const digits = el.value.replace(/\D/g, "");
  const ok = digits.length >= 10 && digits.length <= 15;
  el.setCustomValidity(el.value.trim() === "" || ok ? "" : "Please enter a phone number we can reach you on, including the area code.");
}

// A half typed date leaves the control in badInput, which fails constraint validation and
// blocks the whole submit before onSubmit can fire, so an optional field silently holds the
// lead hostage. A year below the current one is the other reachable case: typing 111426
// resolves to 0026-11-14, which is valid to the browser and useless in an inbox. Both are
// cleared rather than corrected, because the visitor can always retype a date they meant.
function discardUnusableDate(el: HTMLInputElement) {
  if (el.validity.badInput || (el.value && Number(el.value.slice(0, 4)) < new Date().getFullYear())) {
    el.value = "";
  }
}

const INQUIRY_TYPES = [
  "Private Lesson",
  "Group Lesson or Class",
  "Private Party or Celebration",
  "Corporate or Team Building",
  "Conference or Convention",
  "Charity or Fundraiser",
  "Something Else",
];

// The query string cannot change while the page is open, so there is nothing to subscribe
// to. useSyncExternalStore is used because it is the one hook that reads browser-only state
// without a hydration mismatch and without setting state from an effect.
const subscribe = () => () => {};
const readSlug = () => new URLSearchParams(window.location.search).get("source") ?? "";
const noSlug = () => "";

interface ContactFormProps {
  /** Fixed attribution for embedded uses. Omit on /contact, which reads ?source= instead. */
  source?: string;
  successTitle?: string;
  successBody?: string;
}

export default function ContactForm({ source: fixedSource, successTitle, successBody }: ContactFormProps = {}) {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [chosenInquiry, setChosenInquiry] = useState<string | null>(null);

  const match = SOURCES[useSyncExternalStore(subscribe, readSlug, noSlug)];
  const source = fixedSource ?? (match ? match.label : GENERAL_SOURCE);
  // The source only supplies a starting point; once the visitor picks, their choice wins.
  const inquiry = chosenInquiry ?? (fixedSource ? "" : match ? match.inquiry : "");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    setStatus("sending");

    try {
      const res = await fetch("https://formspree.io/f/mwvrnjrb", {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
      });
      if (res.ok && !(await hasErrors(res))) {
        setStatus("sent");
        trackEvent("contact_submit");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  if (status === "sent") {
    return (
      <div className="form-success">
        <h4>{successTitle ?? "Message Sent!"}</h4>
        <p>{successBody ?? "Thanks for reaching out. I\u2019ll be in touch soon!"}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <input type="hidden" name="source" value={source} />

      <div className="form-group">
        <label htmlFor="contact-name">Your Name *</label>
        <input type="text" id="contact-name" name="name" required autoComplete="name" placeholder="Jane Smith" />
      </div>
      <div className="form-group">
        <label htmlFor="contact-email">Email Address *</label>
        <input type="email" id="contact-email" name="email" required autoComplete="email" placeholder="jane@email.com" />
      </div>
      <div className="form-group">
        <label htmlFor="contact-phone">Phone Number *</label>
        <input
          type="tel"
          id="contact-phone"
          name="phone"
          required
          autoComplete="tel"
          inputMode="tel"
          placeholder="(702) 555-0123"
          onInput={(e) => validatePhone(e.currentTarget)}
          onBlur={(e) => validatePhone(e.currentTarget)}
        />
      </div>
      <div className="form-group">
        <label htmlFor="contact-inquiry">What Can We Help With? *</label>
        <select
          id="contact-inquiry"
          name="inquiry_type"
          required
          value={inquiry}
          onChange={(e) => setChosenInquiry(e.target.value)}
        >
          <option value="" disabled>
            Select one...
          </option>
          {INQUIRY_TYPES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="contact-group-size">Group Size</label>
          <select id="contact-group-size" name="group_size" defaultValue="">
            <option value="">Not sure yet</option>
            <option>Just me</option>
            <option>2-3 people</option>
            <option>4-8 people</option>
            <option>9-20 people</option>
            <option>21-50 people</option>
            <option>50+ people</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="contact-date">Preferred Date</label>
          {/* Scoped to this control: a scheme on <html> would repaint UA form controls
              and scrollbars across the whole site. */}
          <input
            type="date"
            id="contact-date"
            name="preferred_date"
            style={{ colorScheme: "dark" }}
            onBlur={(e) => discardUnusableDate(e.currentTarget)}
            onInvalid={(e) => discardUnusableDate(e.currentTarget)}
          />
        </div>
      </div>
      <div className="form-group" style={{ marginBottom: "1.5rem" }}>
        <label htmlFor="contact-message">Tell Us More</label>
        <textarea
          id="contact-message"
          name="message"
          rows={5}
          placeholder="What are you planning? Anything you tell us here helps us answer properly the first time."
        />
      </div>
      <button
        type="submit"
        className="btn-primary"
        disabled={status === "sending"}
        style={{ width: "100%", textAlign: "center", padding: "1rem" }}
      >
        {status === "sending" ? "Sending..." : "Send Message"}
      </button>
      {status === "error" && (
        <p role="status" aria-live="polite" style={{ marginTop: "1rem", color: "#ff8a8a", fontSize: "0.9rem", lineHeight: 1.6 }}>
          Something went wrong. Please email{" "}
          <a href="mailto:hello@lasvegasmahj.com" style={{ color: "var(--green)", fontWeight: 600 }}>
            hello@lasvegasmahj.com
          </a>{" "}
          and we will pick it up from there.
        </p>
      )}
    </form>
  );
}

// Formspree can answer 200 with an {"errors":[...]} body for a submission it drops, which
// would otherwise show "Message Sent!" for a lead that never arrived. A non-JSON 2xx is a
// normal success shape, so a parse failure counts as success.
async function hasErrors(res: Response) {
  try {
    const body = await res.json();
    return Array.isArray(body?.errors) && body.errors.length > 0;
  } catch {
    return false;
  }
}
