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
      await fetch("https://formspree.io/f/mwvrnjrb", {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
      });
      setSubmitted(true);
    } catch {
      // Allow form to submit normally as fallback
      form.submit();
    }
  };

  const handleClose = () => {
    setSubmitted(false);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={handleClose} aria-label="Close">
          &times;
        </button>

        {submitted ? (
          <div className="form-success">
            <h3>Message Sent!</h3>
            <p>We&rsquo;ll get back to you soon.</p>
          </div>
        ) : (
          <>
            <h2>Say Hello!</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="contact-name">Name</label>
                <input
                  type="text"
                  id="contact-name"
                  name="name"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="contact-email">Email</label>
                <input
                  type="email"
                  id="contact-email"
                  name="email"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="contact-message">Question</label>
                <textarea
                  id="contact-message"
                  name="message"
                  rows={4}
                  required
                />
              </div>
              <button type="submit" className="btn-primary">
                Send Message
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
