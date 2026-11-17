import { test, expect } from "@playwright/test";
import nextConfig from "../next.config";

// Performance sprint, 2026-11-13. The width list decides which file each screen downloads:
// Next's default list jumps from 1200 to 1920, so large phones and laptops fetched 1920px images.

const NEXT_DEFAULT_DEVICE_SIZES = [640, 750, 828, 1080, 1200, 1920, 2048, 3840];

test("the image widths add 1280 and 1440 and keep every default width", () => {
  const sizes = nextConfig.images?.deviceSizes ?? [];
  expect(sizes).toEqual([...sizes].sort((a, b) => a - b));
  for (const w of NEXT_DEFAULT_DEVICE_SIZES) expect(sizes).toContain(w);
  expect(sizes).toContain(1280);
  expect(sizes).toContain(1440);
});

test("AVIF stays the first choice and WebP the fallback", () => {
  expect(nextConfig.images?.formats).toEqual(["image/avif", "image/webp"]);
});
