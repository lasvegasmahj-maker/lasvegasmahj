"use client";

interface FooterProps {
  onContactOpen?: () => void;
}

export default function Footer({ onContactOpen }: FooterProps) {
  return (
    <footer className="tile-bg">
      <div className="footer-inner">
        <div className="footer-brand">
          <span className="logo">Las Vegas Mahjong</span>
          <p>
            Bringing people together, one tile at a time. Based in Las Vegas, NV.
            Follow us for daily mahjong content, event updates, and community
            vibes.
          </p>
          <div className="social-links">
            <a
              href="https://instagram.com/lasvegasmahjong"
              className="social-link"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Visit our Instagram"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
            </a>
            <a
              href="https://www.facebook.com/profile.php?id=61581027728474"
              target="_blank"
              rel="noopener noreferrer"
              className="social-link"
              aria-label="Visit our Facebook"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
              </svg>
            </a>
          </div>
        </div>

        <div className="footer-col">
          <h5>Events</h5>
          <ul>
            <li>
              <a href="#events">Open Play</a>
            </li>
            <li>
              <a href="#events">Tournaments</a>
            </li>
            <li>
              <a href="#events">Special Events</a>
            </li>
            <li>
              <a href="#events">Corporate</a>
            </li>
            <li>
              <a href="#events">Charity</a>
            </li>
          </ul>
        </div>

        <div className="footer-col">
          <h5>Learn</h5>
          <ul>
            <li>
              <a href="#classes">MAHJ101 &mdash; Beginners</a>
            </li>
            <li>
              <a href="#classes">MAHJ102 &mdash; Beyond the Basics</a>
            </li>
            <li>
              <a href="#classes">Teams &amp; Tiles</a>
            </li>
            <li>
              <a href="#classes">Book a Lesson</a>
            </li>
          </ul>
        </div>

        <div className="footer-col">
          <h5>More</h5>
          <ul>
            <li>
              <a href="#about">About Me</a>
            </li>
            <li>
              <a href="#shop">Affiliate Links</a>
            </li>
            <li>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  onContactOpen?.();
                }}
              >
                Contact
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <span>&copy; 2026 Las Vegas Mahjong. All rights reserved.</span>
        <span>@lasvegasmahjong</span>
      </div>
    </footer>
  );
}
