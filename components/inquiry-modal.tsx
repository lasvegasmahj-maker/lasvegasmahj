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
      await fetch("https://formspree.io/f/mwvrnjrb", {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
      });
      setSubmitted(true);
    } catch {
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
            <p>We&rsquo;ll be in touch soon to get you started.</p>
          </div>
        ) : (
          <>
            <h2>Book a Lesson</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="inquiry-first">First Name</label>
                <input
                  type="text"
                  id="inquiry-first"
                  name="firstName"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="inquiry-last">Last Name</label>
                <input
                  type="text"
                  id="inquiry-last"
                  name="lastName"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="inquiry-email">Email</label>
                <input
                  type="email"
                  id="inquiry-email"
                  name="email"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="inquiry-interest">Interest</label>
                <select id="inquiry-interest" name="interest" required>
                  <option value="">Select one...</option>
                  <option value="mahj101">MAHJ 101 - Absolute Beginners</option>
                  <option value="mahj102">MAHJ 102 - Beyond the Basics</option>
                  <option value="corporate">Teams &amp; Tiles - Corporate / Group</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="inquiry-group">Group Size</label>
                <select id="inquiry-group" name="groupSize" required>
                  <option value="">Select one...</option>
                  <option value="1-4">1 - 4 players</option>
                  <option value="5-8">5 - 8 players</option>
                  <option value="9-16">9 - 16 players</option>
                  <option value="17+">17+ players</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="inquiry-dates">Preferred Dates</label>
                <textarea
                  id="inquiry-dates"
                  name="dates"
                  rows={2}
                  placeholder="Any dates or times that work for your group?"
                />
              </div>
              <div className="form-group">
                <label htmlFor="inquiry-notes">Anything Else?</label>
                <textarea
                  id="inquiry-notes"
                  name="notes"
                  rows={3}
                  placeholder="Tell us more about what you're looking for..."
                />
              </div>
              <button type="submit" className="btn-primary">
                Submit Inquiry
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
