import type { Metadata } from "next";
import { Bebas_Neue, Montserrat, DM_Sans } from "next/font/google";
import "./globals.css";

const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bebas-neue",
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "600", "700", "900"],
  variable: "--font-montserrat",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-dm-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Las Vegas Mahjong | Lessons, Events & Open Play in Las Vegas",
  description:
    "Las Vegas Mahjong offers mahjong lessons, open play events, leagues, and tournaments across Las Vegas, Summerlin, and Henderson. Learn from an experienced teacher — beginners welcome!",
  keywords: [
    "mahjong Las Vegas",
    "mahjong lessons Las Vegas",
    "mahjong Summerlin",
    "mahjong Henderson",
    "learn mahjong Las Vegas",
    "mahjong open play Las Vegas",
    "mahjong events Las Vegas",
    "Las Vegas Mahjong",
  ],
  openGraph: {
    title: "Las Vegas Mahjong | Lessons, Events & Open Play",
    description:
      "Join Las Vegas's most vibrant mahjong community. Lessons, open play, leagues & tournaments across Summerlin, Henderson, and the whole Las Vegas Valley.",
    type: "website",
    locale: "en_US",
    siteName: "Las Vegas Mahjong",
    images: ["https://lasvegasmahj.com/shauna.jpg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Las Vegas Mahjong | Lessons, Events & Open Play",
    description:
      "Join Las Vegas's most vibrant mahjong community. Lessons, open play, leagues & tournaments across the whole Las Vegas Valley.",
    images: ["https://lasvegasmahj.com/shauna.jpg"],
  },
  other: {
    "canonical": "https://lasvegasmahj.com",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "Las Vegas Mahjong",
  description:
    "Mahjong instruction and community events in Las Vegas. Lessons, open play, and corporate events.",
  url: "https://lasvegasmahj.com",
  areaServed: {
    "@type": "City",
    name: "Las Vegas",
    "@id": "https://www.wikidata.org/wiki/Q23768",
  },
  address: {
    "@type": "PostalAddress",
    addressLocality: "Las Vegas",
    addressRegion: "NV",
    addressCountry: "US",
  },
  sameAs: [
    "https://www.instagram.com/lasvegasmahjong",
    "https://www.facebook.com/lasvegasmahjong",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${bebasNeue.variable} ${montserrat.variable} ${dmSans.variable}`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
