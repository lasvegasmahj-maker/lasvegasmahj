import Image from "next/image";

export default function Hero() {
  return (
    <section className="hero" id="home">
      <Image
        src="/hero-bg.jpg"
        alt=""
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
          Las Vegas is bigger than the Strip, and so is our mahjong community.
          From Summerlin to Henderson, we&rsquo;re bringing players together across
          the whole Valley for mahjong lessons, open play events, leagues,
          tournaments, and more. No experience needed. Beginners welcome!
        </p>
        <div className="hero-btns">
          <a href="#classes" className="btn-primary">
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
