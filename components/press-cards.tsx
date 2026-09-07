import Image from "next/image";
import { STUDIO_MEDIA } from "@/lib/studio-media";

/**
 * Linked cards, not embeds. FOX5 publishes no oEmbed endpoint and no embed iframe for these
 * segments, so each card opens the station's own page. The artwork is our own verified
 * studio photography: the station's social image is a signed Gray CDN URL and not ours to
 * reuse, and its logo is not reproduced here. Text attribution is enough.
 */
export default function PressCards({ size = "compact" }: { size?: "compact" | "full" }) {
  if (STUDIO_MEDIA.length === 0) return null;
  const full = size === "full";

  return (
    <div className={`press-cards${full ? " press-cards-full" : ""}`}>
      {STUDIO_MEDIA.map((item) => (
        <a
          key={item.url}
          className="press-card"
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
        >
          <div className="press-card-art">
            <Image
              src={item.image.src}
              alt=""
              width={item.image.width}
              height={item.image.height}
              sizes={full ? "(max-width: 860px) 100vw, 420px" : "(max-width: 860px) 100vw, 360px"}
            />
            <span className="press-card-play" aria-hidden="true" />
          </div>
          <div className="press-card-body">
            <span className="press-card-outlet">{item.outlet}</span>
            <h3 className="press-card-headline">{item.headline}</h3>
            <time dateTime={item.publishedIso} className="press-card-date">
              {item.publishedLabel}
            </time>
            <span className="press-card-cta">
              Watch on {item.outlet}
              <span aria-hidden="true"> &rarr;</span>
            </span>
          </div>
        </a>
      ))}
      <p className="press-credit">
        Photographs by Las Vegas Mahjong. Both segments play on FOX5&rsquo;s own
        site.
      </p>
    </div>
  );
}
