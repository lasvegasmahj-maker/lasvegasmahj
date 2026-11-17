"use client";

import { useState, useEffect, useRef } from "react";

const MAIN_ID = "main-content";

// Each page's <main> carries this id in its server HTML, so the link works before any script
// runs. Ask a Rule's page has no id on its <main>, so Nav names it once mounted. A click also
// focuses <main>, which a fragment jump alone does not do.
function skipToMain(e: React.MouseEvent<HTMLAnchorElement>) {
  const main = document.querySelector("main");
  if (!main) return;
  e.preventDefault();
  main.setAttribute("tabindex", "-1");
  main.addEventListener("blur", () => main.removeAttribute("tabindex"), { once: true });
  main.focus();
}

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 60);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const main = document.querySelector("main");
    if (main && !main.id) main.id = MAIN_ID;
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setMenuOpen(false);
      toggleRef.current?.focus();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [menuOpen]);

  const handleLinkClick = () => {
    setMenuOpen(false);
  };

  // The open menu covers the whole screen, so focus moving past it (Tab after the last link,
  // Shift+Tab before the button) would land on something the visitor cannot see. Close it
  // then. A null target (a tap on the menu's empty background, or leaving the window) keeps
  // it open, as before.
  const handleBlur = (e: React.FocusEvent<HTMLElement>) => {
    if (!menuOpen) return;
    const next = e.relatedTarget;
    if (!(next instanceof Node)) return;
    if (menuRef.current?.contains(next) || toggleRef.current?.contains(next)) return;
    setMenuOpen(false);
  };

  return (
    <>
      <a href={`#${MAIN_ID}`} className="skip-link" onClick={skipToMain}>
        Skip to main content
      </a>
      <nav className={scrolled ? "scrolled" : ""} onBlur={handleBlur}>
        <a href="/" className="nav-logo">
          Las Vegas Mahjong
        </a>

        <button
          ref={toggleRef}
          className={`nav-toggle${menuOpen ? " open" : ""}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation"
          aria-expanded={menuOpen}
          aria-controls="site-menu"
        >
          <span />
          <span />
          <span />
        </button>

        <ul id="site-menu" ref={menuRef} className={`nav-links${menuOpen ? " open" : ""}`}>
          <li>
            <a href="/studio" onClick={handleLinkClick}>
              Studio
            </a>
          </li>
          <li>
            <a href="/about" onClick={handleLinkClick}>
              About
            </a>
          </li>
          <li>
            <a href="/schedule" onClick={handleLinkClick}>
              Schedule
            </a>
          </li>
          <li>
            <a href="/mahjong-lessons-las-vegas" onClick={handleLinkClick}>
              Lessons
            </a>
          </li>
          <li>
            <a href="/ask" onClick={handleLinkClick}>
              Ask a Rule
            </a>
          </li>
          <li>
            <a href="/#shop" onClick={handleLinkClick}>
              Shop
            </a>
          </li>
          <li>
            <a href="/mahjong-parties-las-vegas" onClick={handleLinkClick}>
              Private Parties
            </a>
          </li>
          <li>
            <a href="/mahjong-corporate-las-vegas" onClick={handleLinkClick}>
              Corporate
            </a>
          </li>
          <li>
            <a href="/contact" onClick={handleLinkClick}>
              Contact
            </a>
          </li>
        </ul>
        <a href="/schedule" className="nav-cta" onClick={handleLinkClick}>
          Join an Event
        </a>
      </nav>
    </>
  );
}
