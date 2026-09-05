"use client";

import { useState } from "react";
import { trackEvent } from "@/lib/analytics";

export default function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

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
      if (res.ok) {
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
        <h4>Message Sent!</h4>
        <p>Thanks for reaching out. I&rsquo;ll be in touch soon!</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="contact-name">Your Name *</label>
        <input type="text" id="contact-name" name="name" required placeholder="Jane Smith" />
      </div>
      <div className="form-group">
        <label htmlFor="contact-email">Email Address *</label>
        <input type="email" id="contact-email" name="email" required placeholder="jane@email.com" />
      </div>
      <div className="form-group" style={{ marginBottom: "1.5rem" }}>
        <label htmlFor="contact-message">Your Question</label>
        <textarea id="contact-message" name="message" rows={5} placeholder="What would you like to know?" />
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
          <a href="mailto:lasvegasmahj@gmail.com" style={{ color: "var(--green)", fontWeight: 600 }}>
            lasvegasmahj@gmail.com
          </a>{" "}
          and we will pick it up from there.
        </p>
      )}
    </form>
  );
}
