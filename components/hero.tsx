export default function Hero() {
  return (
    <section className="hero" id="home">
      <div className="hero-bg" />

      <div className="hero-content">
        <p className="hero-eyebrow">Las Vegas &middot; Community &middot; Play</p>
        <h1 className="hero-title">
          <span className="line1">Las Vegas</span>
          <span className="line2">Mahjong</span>
        </h1>
        <p className="hero-sub">
          Las Vegas is bigger than the Strip &mdash; and so is our mahjong community.
          From Summerlin to Henderson, we&rsquo;re bringing players together across
          the whole Valley for mahjong lessons, open play events, leagues,
          tournaments, and more. No experience needed &mdash; beginners welcome!
        </p>
        <div className="hero-btns">
          <a href="#events" className="btn-primary">
            See Upcoming Events
          </a>
          <a href="#classes" className="btn-outline">
            Learn to Play
          </a>
        </div>
      </div>

      <div className="scroll-hint">
        <div className="scroll-hint-line" />
        <span>Scroll</span>
      </div>
    </section>
  );
}
