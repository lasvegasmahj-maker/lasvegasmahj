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
              href="https://www.tiktok.com/@lasvegasmahjong"
              target="_blank"
              rel="noopener noreferrer"
              className="social-link"
              aria-label="Visit our TikTok"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.32 6.32 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.74a4.85 4.85 0 0 1-1.01-.05z" />
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
            <li><a href="/mahjong-open-play-las-vegas">Open Play Events</a></li>
            <li><a href="/mahjong-parties-las-vegas">Private Parties</a></li>
            <li><a href="/mahjong-corporate-las-vegas">Corporate Events</a></li>
            <li><a href="/events/cafe-lola-open-play-may-2026">Cafe Lola May 31</a></li>
          </ul>
        </div>

        <div className="footer-col">
          <h5>Lessons</h5>
          <ul>
            <li><a href="/mahjong-lessons-las-vegas">Las Vegas</a></li>
            <li><a href="/mahjong-lessons-summerlin">Summerlin</a></li>
            <li><a href="/mahjong-lessons-henderson">Henderson</a></li>
            <li><a href="/learn-mahjong">How to Learn Mahjong</a></li>
            <li><a href="/mahjong-sets-guide">Best Mahjong Sets</a></li>
          </ul>
        </div>

        <div className="footer-col">
          <h5>More</h5>
          <ul>
            <li><a href="/about">About Shauna</a></li>
            <li><a href="/blog/bachelorette-party-ideas-las-vegas">Bachelorette Ideas</a></li>
            <li><a href="/blog/things-to-do-las-vegas-besides-gambling">Things To Do in LV</a></li>
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

      <div className="footer-seo" style={{ padding: "1.5rem 2rem 0", maxWidth: "900px", margin: "0 auto" }}>
        <p style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.2)", lineHeight: 1.7, textAlign: "center" }}>
          Las Vegas Mahjong offers mahjong lessons, open play events, leagues,
          tournaments, and private events across Las Vegas, Summerlin, Henderson,
          North Las Vegas, and the entire Las Vegas Valley. Certified Oh My Mahjong
          instructor. Whether you&rsquo;re looking for beginner mahjong classes,
          corporate team building, bachelorette party activities, or just a fun
          girls&rsquo; night out in Las Vegas, we&rsquo;ve got a seat at the
          table for you. American Mahjong (NMJL) taught in a patient, fun, and
          beginner-friendly environment.
        </p>
      </div>

      <div className="footer-bottom">
        <span>&copy; 2026 Las Vegas Mahjong. All rights reserved.</span>
        <span>@lasvegasmahjong</span>
      </div>
    </footer>
  );
}
