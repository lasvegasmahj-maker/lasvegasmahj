/**
 * No photograph here on purpose. The only interior shots in public/ were committed on
 * 2026-06-12 as "real open-play community photos" (#40), two months before the studio
 * appears anywhere in this repo, and their EXIF is stripped. Nothing in the repository
 * shows either one was taken inside the studio, so neither may stand as a picture of it.
 * A verified photo of Lucky Wishbone, Lucky Sevens or the entrance goes here when the
 * owner supplies one.
 */
export default function StudioBanner() {
  return (
    <section className="studio-banner" id="studio">
      <div className="container">
        <div className="studio-banner-inner">
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
            <div className="studio-room-card studio-room-card-teach">
              <h3>Lucky Wishbone</h3>
              <p>
                The teaching room. Classes, leagues, and special events.
              </p>
            </div>
            <div className="studio-room-card studio-room-card-play">
              <h3>Lucky Sevens</h3>
              <p>
                The playing room. Open play, social play, and every level at the
                same tables.
              </p>
            </div>
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
      </div>
    </section>
  );
}
