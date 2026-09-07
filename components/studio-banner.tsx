import Image from "next/image";
import { WISHBONE_ROOM } from "@/lib/studio-photos";

export default function StudioBanner() {
  return (
    <section className="studio-banner" id="studio">
      <div className="container">
        <div className="studio-banner-grid">
          <div className="studio-banner-text">
            <span className="studio-open-badge">Now Open</span>
            <p className="section-label">
              Inside Lucky Hare &middot; West Sahara
            </p>
            <h2 className="section-title">
              A Mahjong <span className="accent-green">Studio</span> of Our Own
            </h2>
            <p className="studio-banner-lede">
              We opened a studio inside Lucky Hare at 8687 W. Sahara Ave., Suite
              200. It has two rooms, and both of them are for you.
            </p>

            <div className="studio-room-cards">
              {/* The whole card is the link, so there is nothing nested inside it to click. */}
              <a
                className="studio-room-card studio-room-card-teach"
                href="/mahjong-lessons-las-vegas"
              >
                <h3>Lucky Wishbone</h3>
                <p>The teaching room. Classes, leagues, and special events.</p>
                <span className="studio-room-cue">
                  Explore Lessons<span aria-hidden="true"> &rarr;</span>
                </span>
              </a>
              <a
                className="studio-room-card studio-room-card-play"
                href="/mahjong-open-play-las-vegas"
              >
                <h3>Lucky Sevens</h3>
                <p>
                  The playing room. Open play, social play, and every level at
                  the same tables.
                </p>
                <span className="studio-room-cue">
                  Book Open Play<span aria-hidden="true"> &rarr;</span>
                </span>
              </a>
            </div>

            <div className="studio-banner-btns">
              <a href="/studio" className="btn-primary">
                See the Studio
              </a>
              <a href="/schedule" className="btn-outline">
                See the Calendar
              </a>
            </div>
          </div>

          <div className="studio-banner-photo">
            <Image
              src={WISHBONE_ROOM.src}
              alt={WISHBONE_ROOM.alt}
              width={WISHBONE_ROOM.width}
              height={WISHBONE_ROOM.height}
              sizes="(max-width: 900px) 100vw, 46vw"
              style={{ width: "100%", height: "auto", display: "block" }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
