export default function Hero() {
  return (
    <section className="hero">
      <div className="hero-content">
        <p className="hero-eyebrow">Las Vegas &middot; Community &middot; Play</p>
        <h1 className="hero-title">
          <span className="line-pink">Las Vegas</span>
          <span className="line-green">Mahjong</span>
        </h1>
        <p className="hero-subtitle">
          From Summerlin to Henderson, we&rsquo;re building the most welcoming
          mahjong community in the valley. Whether you&rsquo;re a seasoned player
          or picking up tiles for the first time, there&rsquo;s a seat at our
          table.
        </p>
        <div className="hero-buttons">
          <a href="#events" className="btn-primary">
            See Upcoming Events
          </a>
          <a href="#classes" className="btn-outline">
            Learn to Play
          </a>
        </div>
      </div>
      <div className="scroll-hint" aria-hidden="true">
        &#8595;
      </div>
    </section>
  );
}
