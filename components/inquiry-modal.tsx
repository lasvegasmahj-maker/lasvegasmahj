"use client";

import { useEffect, useEffectEvent, useRef } from "react";
import ContactForm from "@/components/contact-form";

interface InquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled])';

export default function InquiryModal({ isOpen, onClose }: InquiryModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  // Selecting text in a field and letting go past the dialog's edge also clicks the overlay.
  // Closing then would unmount the form and throw away what the visitor typed, so the press
  // has to start on the overlay too.
  const pressedOverlay = useRef(false);
  const close = useEffectEvent(onClose);

  useEffect(() => {
    if (!isOpen) return;
    const opener = document.activeElement;
    dialogRef.current?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      const dialog = dialogRef.current;
      if (!dialog) return;
      if (e.key === "Escape") {
        close();
        return;
      }
      if (e.key !== "Tab") return;
      const items = dialog.querySelectorAll<HTMLElement>(FOCUSABLE);
      const first = items[0];
      const last = items[items.length - 1];
      // Focus can also sit on something that is not in the list, such as the dialog itself or a
      // message shown after sending, so the ends are judged by position, not identity.
      const active = document.activeElement;
      if (!active || !dialog.contains(active)) {
        e.preventDefault();
        first.focus();
      } else if (e.shiftKey && (active === first || first.compareDocumentPosition(active) & Node.DOCUMENT_POSITION_PRECEDING)) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && (active === last || last.compareDocumentPosition(active) & Node.DOCUMENT_POSITION_FOLLOWING)) {
        e.preventDefault();
        first.focus();
      }
    };
    // Safari's Tab order can step from the last field straight to the page behind the overlay,
    // which the Tab handler above never sees, so focus that leaves any other way is pulled back.
    const onFocusIn = (e: FocusEvent) => {
      const dialog = dialogRef.current;
      if (dialog && e.target instanceof Node && !dialog.contains(e.target)) dialog.focus();
    };
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("focusin", onFocusIn);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      // Removed before focus goes back to the opener, or it would pull focus straight back in.
      document.removeEventListener("focusin", onFocusIn);
      if (opener instanceof HTMLElement) opener.focus();
    };
  }, [isOpen]);

  // Unmounting on close is what resets the form, so reopening always starts clean.
  if (!isOpen) return null;

  return (
    <div
      className="modal-overlay"
      onPointerDown={(e) => {
        pressedOverlay.current = e.target === e.currentTarget;
      }}
      onClick={(e) => {
        if (pressedOverlay.current && e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        className="modal-content"
        role="dialog"
        aria-modal="true"
        aria-labelledby="inquiry-modal-title"
        tabIndex={-1}
        style={{ outline: "none" }}
      >
        <button className="modal-close" onClick={onClose} aria-label="Close">
          &times;
        </button>

        <p className="modal-label">Let&rsquo;s Play</p>
        <h3 id="inquiry-modal-title">
          Plan Your Mahjong <span style={{ color: "var(--green)" }}>Experience</span>
        </h3>
        <p className="modal-desc">
          Fill out the form below and I&rsquo;ll be in touch soon! Prefer email?
          Write to{" "}
          <a href="mailto:hello@lasvegasmahj.com" style={{ color: "var(--green)", fontWeight: 600 }}>
            hello@lasvegasmahj.com
          </a>
          .
        </p>

        {/* The same component /contact renders, so both entry points ask the same questions,
            validate the same way and produce one shape of email. The source is fixed here
            because there is no query string to read on the homepage. */}
        <ContactForm
          source="Homepage Plan Your Event"
          successTitle={"You\u2019re on our radar!"}
          successBody={"Thanks for reaching out. We\u2019ll be in touch soon. Get ready to play!"}
        />
      </div>
    </div>
  );
}
