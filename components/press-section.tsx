import PressCards from "@/components/press-cards";
import { STUDIO_MEDIA } from "@/lib/studio-media";

/**
 * The homepage press band. Coverage, not endorsement: it says FOX5 visited, and nothing
 * about what FOX5 thinks of the business.
 */
export default function PressSection() {
  if (STUDIO_MEDIA.length === 0) return null;

  return (
    <section className="press" id="press">
      <div className="container">
        <p className="section-label">In the Local Press</p>
        <h2 className="section-title">
          As Seen on <span className="accent-green">FOX5 Las Vegas</span>
        </h2>
        <p className="press-lede">
          FOX5 visited Las Vegas Mahjong for our Grand Opening to see the new
          studio and learn what American Mahjong is all about.
        </p>
        <PressCards />
      </div>
    </section>
  );
}
