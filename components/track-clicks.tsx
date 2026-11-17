"use client";

import { useEffect } from "react";
import { analyticsLoaded, linkClickEvent, trackEvent } from "@/lib/analytics";

// One listener for the whole site, so no page needs a click handler of its own. It is
// passive and only reads the link that was clicked: it never cancels, delays or replaces the
// navigation, which is why new-tab, modifier-key and keyboard clicks behave exactly as before.
// The capture phase is used so a handler further down that stops propagation cannot hide a click.
export default function TrackClicks() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!analyticsLoaded()) return;
      const link = e.target instanceof Element ? e.target.closest("a[href]") : null;
      if (!(link instanceof HTMLAnchorElement)) return;
      const hit = linkClickEvent(link, window.location);
      if (hit) trackEvent(hit.name, hit.params);
    };
    document.addEventListener("click", onClick, { capture: true, passive: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);

  return null;
}
