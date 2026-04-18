"use client";

import { useState } from "react";

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ContactModal({ isOpen, onClose }: ContactModalProps) {
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    try {
      const res = await fetch("https://formspree.io/f/mwvrnjrb", {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
      });
      if (res.ok) {
        setSubmitted(true);
      } else {
        alert(
          "Oops! Something went wrong. Please email us at lasvegasmahj@gmail.com"
        );
      }
    } catch {
      alert(
        "Oops! Something went wrong. Please email us at lasvegasmahj@gmail.com"
      );
    }
  };

  const handleClose = () => {
    setSubmitted(false);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button
          className="modal-close"
          onClick={handleClose}
          aria-label="Close"
        >
          &times;
        </button>

        {submitted ? (
          <div className="form-success">
            <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>
              &#126980;
            </div>
            <h4>Message Sent!</h4>
            <p>Thanks for reaching out &mdash; I&rsquo;ll be in touch soon!</p>
          </div>
        ) : (
          <>
            <p className="modal-label">Get in Touch</p>
            <h3>
              Say <span style={{ color: "var(--green)" }}>Hello!</span>
            </h3>
            <p className="modal-desc">
              Have a question? I&rsquo;d love to hear from you &mdash;
              I&rsquo;ll get back to you within 24 hours!
            </p>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="contact-name">Your Name *</label>
                <input
                  type="text"
                  id="contact-name"
                  name="name"
                  required
                  placeholder="Jane Smith"
                />
              </div>
              <div className="form-group">
                <label htmlFor="contact-email">Email Address *</label>
                <input
                  type="email"
                  id="contact-email"
                  name="email"
                  required
                  placeholder="jane@email.com"
                />
              </div>
              <div className="form-group" style={{ marginBottom: "1.5rem" }}>
                <label htmlFor="contact-message">Your Question</label>
                <textarea
                  id="contact-message"
                  name="message"
                  rows={4}
                  placeholder="What would you like to know?"
                />
              </div>
              <button
                type="submit"
                className="btn-primary"
                style={{ width: "100%", textAlign: "center", padding: "1rem" }}
              >
                Send Message
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
