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
  title: "Las Vegas Mahjong | Learn & Play Mahjong in Las Vegas",
  description:
    "Join Las Vegas Mahjong for lessons, open play events, and a welcoming community. From Summerlin to Henderson, we bring people together one tile at a time.",
  keywords: [
    "mahjong",
    "las vegas",
    "mahjong lessons",
    "mahjong classes",
    "learn mahjong",
    "mahjong events",
    "las vegas mahjong",
  ],
  openGraph: {
    title: "Las Vegas Mahjong | Learn & Play Mahjong in Las Vegas",
    description:
      "Join Las Vegas Mahjong for lessons, open play events, and a welcoming community.",
    type: "website",
    locale: "en_US",
    siteName: "Las Vegas Mahjong",
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
