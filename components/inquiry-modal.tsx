"use client";

import { useState } from "react";

interface InquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function InquiryModal({ isOpen, onClose }: InquiryModalProps) {
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
          "Oops! Something went wrong. Please try again or DM us on Instagram."
        );
      }
    } catch {
      alert(
        "Oops! Something went wrong. Please try again or DM us on Instagram."
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
            <h4>You&rsquo;re on my radar!</h4>
            <p>
              Thanks for reaching out &mdash; I&rsquo;ll be in touch within 24
              hours. Get ready to play!
            </p>
          </div>
        ) : (
          <>
            <p className="modal-label">Let&rsquo;s Play</p>
            <h3>
              Book a <span style={{ color: "var(--green)" }}>Lesson</span>
            </h3>
            <p className="modal-desc">
              Fill out the form below and I&rsquo;ll be in touch within 24
              hours!
            </p>
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="inquiry-first">First Name *</label>
                  <input
                    type="text"
                    id="inquiry-first"
                    name="first_name"
                    required
                    placeholder="Jane"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="inquiry-last">Last Name *</label>
                  <input
                    type="text"
                    id="inquiry-last"
                    name="last_name"
                    required
                    placeholder="Smith"
                  />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="inquiry-email">Email Address *</label>
                <input
                  type="email"
                  id="inquiry-email"
                  name="email"
                  required
                  placeholder="jane@email.com"
                />
              </div>
              <div className="form-group">
                <label htmlFor="inquiry-interest">I&rsquo;m Interested In *</label>
                <select id="inquiry-interest" name="interest" required defaultValue="">
                  <option value="" disabled>
                    Select an option...
                  </option>
                  <option value="mahj101">
                    MAHJ101 &mdash; Absolute Beginners
                  </option>
                  <option value="mahj102">
                    MAHJ102 &mdash; Beyond the Basics
                  </option>
                  <option value="group">
                    Teams &amp; Tiles &mdash; Large Group / Corporate
                  </option>
                  <option value="private">Private 1-on-1 Lesson</option>
                  <option value="other">Something Else</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="inquiry-group">Number of People *</label>
                <select
                  id="inquiry-group"
                  name="group_size"
                  required
                  defaultValue=""
                >
                  <option value="" disabled>
                    Select group size...
                  </option>
                  <option>Just me</option>
                  <option>2 people</option>
                  <option>3&ndash;4 people</option>
                  <option>5&ndash;8 people</option>
                  <option>9&ndash;15 people</option>
                  <option>16+ people</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="inquiry-dates">
                  Dates That Work For You
                </label>
                <textarea
                  id="inquiry-dates"
                  name="dates"
                  rows={3}
                  placeholder="e.g. Weekday evenings, Saturday mornings, any weekend in April..."
                />
              </div>
              <div className="form-group" style={{ marginBottom: "1.5rem" }}>
                <label htmlFor="inquiry-notes">Anything Else?</label>
                <textarea
                  id="inquiry-notes"
                  name="message"
                  rows={2}
                  placeholder="Any questions, special requests, or details..."
                />
              </div>
              <button
                type="submit"
                className="btn-primary"
                style={{ width: "100%", textAlign: "center", padding: "1rem" }}
              >
                Send My Inquiry
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
