export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-grid">
        <div className="footer-brand">
          <span className="nav-logo">Las Vegas Mahjong</span>
          <p>
            Bringing people together, one tile at a time. Based in Las Vegas,
            NV. Certified Oh My Mahjong instructor offering lessons, events, and
            community play across the valley.
          </p>
          <div className="footer-social">
            <a
              href="https://www.instagram.com/lasvegasmahjong"
              target="_blank"
              rel="noopener noreferrer"
            >
              Instagram
            </a>
            <a
              href="https://www.facebook.com/lasvegasmahjong"
              target="_blank"
              rel="noopener noreferrer"
            >
              Facebook
            </a>
          </div>
        </div>

        <div className="footer-column">
          <h4>Events</h4>
          <ul>
            <li>
              <a href="#events">Upcoming Events</a>
            </li>
            <li>
              <a href="#events">Open Play</a>
            </li>
          </ul>
        </div>

        <div className="footer-column">
          <h4>Learn</h4>
          <ul>
            <li>
              <a href="#classes">Beginner Lessons</a>
            </li>
            <li>
              <a href="#classes">Advanced Classes</a>
            </li>
            <li>
              <a href="#classes">Corporate Events</a>
            </li>
          </ul>
        </div>

        <div className="footer-column">
          <h4>More</h4>
          <ul>
            <li>
              <a href="#shop">Shop</a>
            </li>
            <li>
              <a href="#testimonials">Testimonials</a>
            </li>
            <li>
              <a href="#about">About</a>
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
