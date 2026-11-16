"use client";

import { useState, useSyncExternalStore } from "react";
import { trackEvent } from "@/lib/analytics";

type Field = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

// An unrecognised or absent ?source= falls back to GENERAL_SOURCE: forwarding raw query
// text would put attacker-controlled content into an inbox a human reads. `label` is what
// lands in the email, so it reads as a phrase rather than a slug. `inquiry` pre-selects
// the matching Inquiry Type, which is what lets that field be required without adding
// friction for anyone arriving from a tagged CTA.
//
// `inquiry` is optional because a page can be worth attributing without implying what the
// visitor wants. The studio page invites classes, open play and private bookings alike, so
// it names itself in the inbox and leaves the Inquiry Type for the visitor to choose. The
// visitors page is the same case: a traveling group might want a lesson, a party or a
// company event.
const SOURCES: Record<string, { label: string; inquiry?: string }> = {
  corporate: { label: "Corporate Events page", inquiry: "Corporate or Team Building" },
  "team-building": { label: "Corporate Team Building page", inquiry: "Corporate or Team Building" },
  conference: { label: "Conference Activities page", inquiry: "Conference or Convention" },
  convention: { label: "Convention Activities page", inquiry: "Conference or Convention" },
  parties: { label: "Private Parties page", inquiry: "Private Party or Celebration" },
  "private-lessons": { label: "Private Lessons page", inquiry: "Private Lesson" },
  studio: { label: "Studio Page" },
  schedule: { label: "Schedule page" },
  visitors: { label: "Play Mahjong for Visitors page" },
  "meeting-planners": { label: "Meeting Planner Activities page", inquiry: "Corporate or Team Building" },
  "corporate-activities": { label: "Corporate Event Activities page", inquiry: "Corporate or Team Building" },
  incentive: { label: "Incentive Group Activities page", inquiry: "Corporate or Team Building" },
  "trade-show": { label: "Trade Show Booth Activities page", inquiry: "Conference or Convention" },
  summerlin: { label: "Summerlin Lessons page", inquiry: "Private Lesson" },
  henderson: { label: "Henderson Lessons page", inquiry: "Private Lesson" },
  lessons: { label: "Lessons page", inquiry: "Private Lesson" },
};

const GENERAL_SOURCE = "General (nav, footer or direct)";

const FORMSPREE = "https://formspree.io/f/mwvrnjrb";

// The same rule as validatePhone below, as a pattern the browser applies by itself: ten to
// fifteen digits with anything between them. The field carries it only until the script has
// loaded (see scriptReady), because on that early path "required" alone would accept spaces
// and a pattern is the one check that works without script. It counts digits and never
// matches a format, so every way of writing a number that validatePhone accepts still passes.
const PHONE_PATTERN = "(?:\\D*\\d){10,15}\\D*";

// type="tel" applies no native validation, so "required" alone would accept a single
// character. Counting digits keeps every real format valid: 7025551212, 702-555-1212,
// (702) 555-1212 and +1 702 555 1212 all pass, while a stray character or a truncated
// number does not. The upper bound is E.164's fifteen digits so an international number
// still fits.
//
// Only a TRULY empty value defers to the browser's own "required" message. Trimming first
// would hand a value of spaces back to `required`, which is already satisfied by it, so
// nothing would catch it and a blank phone number would submit.
function validatePhone(el: HTMLInputElement) {
  const digits = el.value.replace(/\D/g, "");
  const ok = digits.length >= 10 && digits.length <= 15;
  el.setCustomValidity(el.value === "" || ok ? "" : "Please enter a phone number we can reach you on, including the area code.");
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
const inBrowser = () => true;
const asServed = () => false;

interface ContactFormProps {
  /** Fixed attribution for embedded uses. Omit on /contact, which reads ?source= instead. */
  source?: string;
  successTitle?: string;
  successBody?: string;
}

export default function ContactForm({ source: fixedSource, successTitle, successBody }: ContactFormProps = {}) {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [chosenInquiry, setChosenInquiry] = useState<string | null>(null);
  // The browser's own message for each field that failed, kept on the page and tied to the
  // field, because the native bubble disappears after a few seconds.
  const [errors, setErrors] = useState<Record<string, string>>({});

  const recordInvalid = (e: React.FormEvent<Field>) => {
    const { name, validationMessage } = e.currentTarget;
    setErrors((prev) => (prev[name] === validationMessage ? prev : { ...prev, [name]: validationMessage }));
  };

  const recheck = (el: Field) => {
    if (!(el.name in errors)) return;
    setErrors((prev) => {
      const next = { ...prev };
      if (el.validity.valid) delete next[el.name];
      else next[el.name] = el.validationMessage;
      return next;
    });
  };

  const errorProps = (name: string, id: string) =>
    errors[name] ? { "aria-invalid": true, "aria-describedby": `${id}-error` } : {};

  const errorText = (name: string, id: string) =>
    errors[name] ? (
      <p id={`${id}-error`} className="form-error">
        {errors[name]}
      </p>
    ) : null;

  // False in the page as served, true once this component is running in the browser. From
  // then on validatePhone owns the phone rule and its message, so the pattern comes off and
  // the loaded form checks a number exactly as it did before the early path existed.
  const scriptReady = useSyncExternalStore(subscribe, inBrowser, asServed);
  const slug = useSyncExternalStore(subscribe, readSlug, noSlug);
  // An own-property check, because ?source=constructor would otherwise find Object's built-in
  // and leave the lead with no attribution at all instead of the general fallback.
  const match = Object.prototype.hasOwnProperty.call(SOURCES, slug) ? SOURCES[slug] : undefined;
  const source = fixedSource ?? (match ? match.label : GENERAL_SOURCE);
  // The source only supplies a starting point; once the visitor picks, their choice wins.
  const inquiry = chosenInquiry ?? (fixedSource ? "" : match?.inquiry ?? "");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;

    // Re-check here as well as on input and blur: a value the browser restores on back
    // navigation, or fills by autofill, can arrive without firing either event, leaving the
    // custom validity stale and letting an unusable number through.
    const phone = form.elements.namedItem("phone");
    if (phone instanceof HTMLInputElement) {
      validatePhone(phone);
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
    }

    const data = new FormData(form);
    // Analytics gets these two values and nothing else. Both come from lists this site
    // defines (the attribution label and the Inquiry Type options), and `data`, which holds
    // what the visitor typed, is never passed to trackEvent.
    const lead = { source_label: source, inquiry_type: INQUIRY_TYPES.includes(inquiry) ? inquiry : undefined };
    setStatus("sending");
    trackEvent("contact_form_attempt", lead);

    try {
      const res = await fetch(FORMSPREE, {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
      });
      if (res.ok && !(await hasErrors(res))) {
        setStatus("sent");
        trackEvent("contact_submit");
        trackEvent("contact_form_success", lead);
      } else {
        setStatus("error");
        trackEvent("contact_form_error", lead);
      }
    } catch {
      setStatus("error");
      trackEvent("contact_form_error", lead);
    }
  };

  if (status === "sent") {
    return (
      <div className="form-success">
        <h4 ref={revealStatus} tabIndex={-1}>
          {successTitle ?? "Message Sent!"}
        </h4>
        <p>{successBody ?? "Thanks for reaching out. I\u2019ll be in touch soon!"}</p>
      </div>
    );
  }

  // method and action matter only when the script has not loaded yet. A plain form submits by
  // GET, which would reload the page with the visitor's name, email, phone and message in
  // the address, where browser history, server logs and any analytics tag would keep them.
  // A POST with no action goes to this page itself, which the host answers with an error, so
  // the message is lost. The action sends that early submit straight to Formspree. Once the
  // script has loaded, handleSubmit takes over and the visitor stays on this page.
  return (
    <form method="post" action={FORMSPREE} onSubmit={handleSubmit}>
      <input type="hidden" name="source" value={source} />

      {/* The asterisk is for sighted visitors; `required` already tells a screen reader. */}
      <div className="form-group">
        <label htmlFor="contact-name">Your Name <span aria-hidden="true">*</span></label>
        <input
          type="text"
          id="contact-name"
          name="name"
          required
          autoComplete="name"
          placeholder="Jane Smith"
          onInvalid={recordInvalid}
          onInput={(e) => recheck(e.currentTarget)}
          {...errorProps("name", "contact-name")}
        />
        {errorText("name", "contact-name")}
      </div>
      <div className="form-group">
        <label htmlFor="contact-email">Email Address <span aria-hidden="true">*</span></label>
        <input
          type="email"
          id="contact-email"
          name="email"
          required
          autoComplete="email"
          placeholder="jane@email.com"
          onInvalid={recordInvalid}
          onInput={(e) => recheck(e.currentTarget)}
          {...errorProps("email", "contact-email")}
        />
        {errorText("email", "contact-email")}
      </div>
      <div className="form-group">
        <label htmlFor="contact-phone">Phone Number <span aria-hidden="true">*</span></label>
        <input
          type="tel"
          id="contact-phone"
          name="phone"
          required
          pattern={scriptReady ? undefined : PHONE_PATTERN}
          autoComplete="tel"
          inputMode="tel"
          placeholder="(702) 555-0123"
          onInvalid={recordInvalid}
          onInput={(e) => {
            validatePhone(e.currentTarget);
            recheck(e.currentTarget);
          }}
          onBlur={(e) => validatePhone(e.currentTarget)}
          {...errorProps("phone", "contact-phone")}
        />
        {errorText("phone", "contact-phone")}
      </div>
      <div className="form-group">
        <label htmlFor="contact-inquiry">What Can We Help With? <span aria-hidden="true">*</span></label>
        <select
          id="contact-inquiry"
          name="inquiry_type"
          required
          value={inquiry}
          onChange={(e) => {
            setChosenInquiry(e.target.value);
            recheck(e.currentTarget);
          }}
          onInvalid={recordInvalid}
          {...errorProps("inquiry_type", "contact-inquiry")}
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
        {errorText("inquiry_type", "contact-inquiry")}
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
        <p ref={revealStatus} tabIndex={-1} style={{ outline: "none", marginTop: "1rem", color: "#ff8a8a", fontSize: "0.9rem", lineHeight: 1.6 }}>
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

// After a send, the success message replaces a form several screens tall and the error sits
// under a button that was disabled while sending, so either can land out of sight with focus
// back at the top of the page. Focus reads the message out once; the scroll brings it into
// view. Module level, so React runs it when the message mounts rather than on every render.
function revealStatus(el: HTMLElement | null) {
  el?.focus({ preventScroll: true });
  el?.scrollIntoView({ block: "center" });
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
