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
  metadataBase: new URL("https://www.lasvegasmahj.com"),
  title: {
    default:
      "Las Vegas Mahjong | Lessons, Events & Open Play",
    template: "%s | Las Vegas Mahjong",
  },
  description:
    "Certified mahjong lessons, open play, and private parties across Las Vegas, Summerlin, and Henderson. Taught by a certified Oh My Mahjong instructor.",
  keywords: [
    "mahjong Las Vegas",
    "mahjong lessons Las Vegas",
    "learn mahjong Las Vegas",
    "mahjong classes Las Vegas",
    "mahjong teacher Las Vegas",
    "mahjong instructor Las Vegas",
    "mahjong Summerlin",
    "mahjong Henderson",
    "mahjong Green Valley",
    "mahjong open play Las Vegas",
    "mahjong events Las Vegas",
    "mahjong tournament Las Vegas",
    "mahjong league Las Vegas",
    "mahjong party Las Vegas",
    "mahjong corporate event Las Vegas",
    "mahjong team building Las Vegas",
    "mahjong bachelorette party Las Vegas",
    "American mahjong lessons",
    "Oh My Mahjong instructor Las Vegas",
    "beginner mahjong Las Vegas",
    "Las Vegas Mahjong",
    "mahjong near me Las Vegas",
    "things to do Las Vegas",
    "ladies night Las Vegas",
    "mahjong girls night Las Vegas",
    "NMJL mahjong Las Vegas",
    "mahjong community Las Vegas",
  ],
  alternates: {
    canonical: "https://www.lasvegasmahj.com",
  },
  openGraph: {
    title:
      "Las Vegas Mahjong | Lessons, Events & Open Play Across the Valley",
    description:
      "Join Las Vegas's most vibrant mahjong community. Beginner-friendly lessons, open play events, private parties, corporate team building, leagues & tournaments from Summerlin to Henderson. Certified Oh My Mahjong instructor. No experience needed!",
    type: "website",
    locale: "en_US",
    url: "https://www.lasvegasmahj.com",
    siteName: "Las Vegas Mahjong",
    images: [
      {
        url: "https://www.lasvegasmahj.com/hero-bg.jpg",
        width: 1599,
        height: 2000,
        alt: "Mahjong tiles at a Las Vegas Mahjong event",
        type: "image/jpeg",
      },
      {
        url: "https://www.lasvegasmahj.com/shauna.jpg",
        width: 1774,
        height: 2000,
        alt: "Shauna, certified mahjong instructor and founder of Las Vegas Mahjong",
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  category: "entertainment",
  verification: {
    google: "-NE1c8pIzgalnYk06tWpFLNGdN0tiezaECY2vyCo9BE",
  },
};

/* ── STRUCTURED DATA ── */

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": "https://www.lasvegasmahj.com/#business",
  name: "Las Vegas Mahjong",
  alternateName: "LV Mahjong",
  description:
    "Las Vegas's premier mahjong instruction and community. Certified Oh My Mahjong instructor offering beginner lessons, open play events, private parties, corporate team building, leagues, and tournaments across the Las Vegas Valley.",
  url: "https://www.lasvegasmahj.com",
  email: "lasvegasmahj@gmail.com",
  image: [
    "https://www.lasvegasmahj.com/hero-bg.jpg",
    "https://www.lasvegasmahj.com/shauna.jpg",
  ],
  priceRange: "$75+",
  currenciesAccepted: "USD",
  paymentAccepted: "Cash, Credit Card, Venmo",
  foundingDate: "2024",
  knowsAbout: [
    "American Mahjong",
    "NMJL",
    "mahjong instruction",
    "corporate team building",
    "team building activities",
    "corporate event entertainment",
    "corporate events",
    "group events",
    "private events",
  ],
  address: {
    "@type": "PostalAddress",
    addressLocality: "Las Vegas",
    addressRegion: "NV",
    addressCountry: "US",
  },
  areaServed: [
    { "@type": "City", name: "Las Vegas" },
    { "@type": "City", name: "Henderson" },
    { "@type": "City", name: "Summerlin" },
    { "@type": "Place", name: "Green Valley" },
    { "@type": "Place", name: "Anthem" },
    { "@type": "Place", name: "Las Vegas Valley" },
  ],
  founder: {
    "@type": "Person",
    name: "Shauna",
    jobTitle: "Certified Mahjong Instructor",
    description:
      "Certified Oh My Mahjong instructor with 18 years of mahjong experience, teaching across the Las Vegas Valley.",
  },
  sameAs: [
    "https://www.instagram.com/lasvegasmahjong",
    "https://www.facebook.com/profile.php?id=61581027728474",
    "https://www.tiktok.com/@lasvegasmahjong",
  ],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Mahjong Services",
    itemListElement: [
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "MAHJ101 - Beginner Mahjong Lessons",
          description:
            "Complete beginner mahjong lessons starting from scratch. Learn tile sorting, card reading, and play your first hand.",
        },
        price: "75.00",
        priceCurrency: "USD",
        priceSpecification: {
          "@type": "UnitPriceSpecification",
          price: "75.00",
          priceCurrency: "USD",
          unitText: "person",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "MAHJ102 - Beyond the Basics",
          description:
            "Intermediate mahjong lessons building on MAHJ101. More hands, more practice, more confidence at the table.",
        },
        price: "75.00",
        priceCurrency: "USD",
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Private Mahjong Lessons",
          description:
            "One-on-one or small group private mahjong instruction at your preferred location. Contact for pricing.",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Corporate & Private Event Mahjong",
          description:
            "Custom mahjong experiences for bachelorette parties, corporate team building, birthdays, charity events, and more.",
        },
      },
    ],
  },
};

const courseSchema = [
  {
    "@context": "https://schema.org",
    "@type": "Course",
    name: "MAHJ101 - Beginner Mahjong Lessons",
    description:
      "Complete beginner American Mahjong lessons in Las Vegas. Learn tile sorting, NMJL card reading, and play your first hand. No experience needed.",
    provider: {
      "@type": "Organization",
      "@id": "https://www.lasvegasmahj.com/#business",
      name: "Las Vegas Mahjong",
      url: "https://www.lasvegasmahj.com",
    },
    offers: {
      "@type": "Offer",
      price: "75.00",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      category: "In-Person",
    },
    courseMode: "onsite",
    hasCourseInstance: {
      "@type": "CourseInstance",
      courseMode: "onsite",
      location: { "@type": "Place", name: "Las Vegas, NV" },
    },
    locationCreated: {
      "@type": "Place",
      name: "Las Vegas, NV",
    },
    audience: {
      "@type": "Audience",
      audienceType: "Complete beginners, no experience needed",
    },
  },
  {
    "@context": "https://schema.org",
    "@type": "Course",
    name: "MAHJ102 - Beyond the Basics Mahjong",
    description:
      "Intermediate American Mahjong lessons in Las Vegas. Build on MAHJ101 with more hands, strategy, and table time.",
    provider: {
      "@type": "Organization",
      "@id": "https://www.lasvegasmahj.com/#business",
      name: "Las Vegas Mahjong",
      url: "https://www.lasvegasmahj.com",
    },
    offers: {
      "@type": "Offer",
      price: "75.00",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      category: "In-Person",
    },
    courseMode: "onsite",
    hasCourseInstance: {
      "@type": "CourseInstance",
      courseMode: "onsite",
      location: { "@type": "Place", name: "Las Vegas, NV" },
    },
  },
];

/* Hidden until the next live event:
const cafeLolaEventSchema = {
  "@context": "https://schema.org",
  "@type": "Event",
  name: "Cafe Lola Open Play Mahjong Party",
  description:
    "Join Las Vegas Mahjong for an open play mahjong party at Cafe Lola! All skill levels welcome -- come play, meet fellow mahjong lovers, and enjoy a fun evening in Las Vegas. Hosted by certified Oh My Mahjong instructor Shauna.",
  startDate: "2026-05-31T18:00:00-07:00",
  endDate: "2026-05-31T20:00:00-07:00",
  eventStatus: "https://schema.org/EventScheduled",
  eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
  location: {
    "@type": "Place",
    name: "Cafe Lola",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Las Vegas",
      addressRegion: "NV",
      addressCountry: "US",
    },
  },
  organizer: {
    "@type": "Organization",
    name: "Las Vegas Mahjong",
    url: "https://www.lasvegasmahj.com",
    email: "lasvegasmahj@gmail.com",
  },
  image: [
    "https://www.lasvegasmahj.com/hero-bg.jpg",
    "https://www.lasvegasmahj.com/shauna.jpg",
  ],
  url: "https://www.lasvegasmahj.com",
  offers: {
    "@type": "Offer",
    availability: "https://schema.org/InStock",
    url: "https://ilovecafelola.com",
    validFrom: "2026-05-01",
  },
};
*/

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": "https://www.lasvegasmahj.com/#website",
  name: "Las Vegas Mahjong",
  url: "https://www.lasvegasmahj.com",
  description:
    "Las Vegas's premier mahjong community offering lessons, events, and open play across the Valley.",
  publisher: {
    "@type": "Organization",
    "@id": "https://www.lasvegasmahj.com/#business",
    name: "Las Vegas Mahjong",
    url: "https://www.lasvegasmahj.com",
  },
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
        <meta name="geo.region" content="US-NV" />
        <meta name="geo.placename" content="Las Vegas" />
        <meta name="geo.position" content="36.1699;-115.1398" />
        <meta name="ICBM" content="36.1699, -115.1398" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(localBusinessSchema).replace(/</g, "\\u003c"),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(courseSchema).replace(/</g, "\\u003c"),
          }}
        />
        {/* Hidden until the next live event:
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(cafeLolaEventSchema).replace(/</g, "\\u003c"),
          }}
        />
        */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteSchema).replace(/</g, "\\u003c"),
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
