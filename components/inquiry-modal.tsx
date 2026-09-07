"use client";

import ContactForm from "@/components/contact-form";

interface InquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function InquiryModal({ isOpen, onClose }: InquiryModalProps) {
  // Unmounting on close is what resets the form, so reopening always starts clean.
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close">
          &times;
        </button>

        <p className="modal-label">Let&rsquo;s Play</p>
        <h3>
          Book a <span style={{ color: "var(--green)" }}>Lesson</span>
        </h3>
        <p className="modal-desc">
          Fill out the form below and I&rsquo;ll be in touch within 24 hours!
        </p>

        {/* The same component /contact renders, so both entry points ask the same questions,
            validate the same way and produce one shape of email. The source is fixed here
            because there is no query string to read on the homepage. */}
        <ContactForm
          source="Homepage Plan Your Event"
          successTitle={"You\u2019re on my radar!"}
          successBody={"Thanks for reaching out. I\u2019ll be in touch within 24 hours. Get ready to play!"}
        />
      </div>
    </div>
  );
}
