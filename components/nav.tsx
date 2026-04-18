"use client";

import { useState, useEffect } from "react";

interface NavProps {
  onContactOpen: () => void;
}

export default function Nav({ onContactOpen }: NavProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 60);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLinkClick = () => {
    setMenuOpen(false);
  };

  return (
    <nav className={scrolled ? "scrolled" : ""}>
      <a href="#" className="nav-logo">
        Las Vegas Mahjong
      </a>

      <button
        className={`nav-toggle${menuOpen ? " open" : ""}`}
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle navigation"
      >
        <span />
        <span />
        <span />
      </button>

      <ul className={`nav-links${menuOpen ? " open" : ""}`}>
        <li>
          <a href="#about" onClick={handleLinkClick}>
            About
          </a>
        </li>
        <li>
          <a href="#events" onClick={handleLinkClick}>
            Events
          </a>
        </li>
        <li>
          <a href="#classes" onClick={handleLinkClick}>
            Classes
          </a>
        </li>
        <li>
          <a href="#community" onClick={handleLinkClick}>
            Testimonials
          </a>
        </li>
        <li>
          <a href="#shop" onClick={handleLinkClick}>
            Shop
          </a>
        </li>
        <li>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              handleLinkClick();
              onContactOpen();
            }}
          >
            Contact
          </a>
        </li>
      </ul>
      <a href="#events" className="nav-cta" onClick={handleLinkClick}>
        Join an Event
      </a>
    </nav>
  );
}
