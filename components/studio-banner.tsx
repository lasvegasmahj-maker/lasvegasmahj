import Image from "next/image";

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

            <ul className="studio-rooms">
              <li>
                <strong>Lucky Wishbone</strong> is where we teach: classes,
                leagues, and special events.
              </li>
              <li>
                <strong>Lucky Sevens</strong> is the playing room: open play,
                social play, and every level at the same tables.
              </li>
            </ul>

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
              src="/lvm-openplay-room.jpg"
              alt="Players at tables inside the Las Vegas Mahjong studio at Lucky Hare"
              width={1350}
              height={1800}
              sizes="(max-width: 768px) 100vw, (max-width: 1164px) 43vw, 445px"
              style={{ width: "100%", height: "auto", display: "block" }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
