import Image from "next/image";

export default function Hero() {
  return (
    <section className="hero" id="home">
      <Image
        src="/hero-bg.jpg"
        alt="Mahjong tiles at a Las Vegas Mahjong event"
        fill
        priority
        sizes="100vw"
        style={{ objectFit: "cover", zIndex: 0 }}
      />
      <div className="hero-overlay" />

      <div className="hero-content">
        <p className="hero-eyebrow">Las Vegas &middot; Community &middot; Play</p>
        <h1 className="hero-title">
          <span className="line1">Las Vegas</span>
          <span className="line2">Mahjong</span>
        </h1>
        <p className="hero-sub">
          Our studio inside Lucky Hare on West Sahara is home base for the Las
          Vegas mahjong community. Join us for lessons, open play, leagues, and
          special events, with a warm welcome for every skill level. No
          experience needed. Beginners welcome!
        </p>
        <div className="hero-btns">
          <a href="/schedule" className="btn-primary">
            See the Calendar
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
