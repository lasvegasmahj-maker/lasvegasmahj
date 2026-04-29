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
  metadataBase: new URL("https://lasvegasmahj.com"),
  title: {
    default:
      "Las Vegas Mahjong | #1 Mahjong Lessons, Events & Open Play in Las Vegas, NV",
    template: "%s | Las Vegas Mahjong",
  },
  description:
    "Las Vegas Mahjong is the Valley's premier mahjong community. Certified Oh My Mahjong instructor offering beginner lessons (MAHJ101 & MAHJ102), open play events, private parties, corporate team building, leagues, and tournaments across Las Vegas, Summerlin, Henderson, and the entire Las Vegas Valley. No experience needed — beginners welcome!",
  keywords: [
    "mahjong Las Vegas",
    "mahjong lessons Las Vegas",
    "learn mahjong Las Vegas",
    "mahjong classes Las Vegas",
    "mahjong teacher Las Vegas",
    "mahjong instructor Las Vegas",
    "mahjong Summerlin",
    "mahjong Henderson",
    "mahjong North Las Vegas",
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
    canonical: "https://lasvegasmahj.com",
  },
  openGraph: {
    title:
      "Las Vegas Mahjong | Lessons, Events & Open Play Across the Valley",
    description:
      "Join Las Vegas's most vibrant mahjong community. Beginner-friendly lessons, open play events, private parties, corporate team building, leagues & tournaments from Summerlin to Henderson. Certified Oh My Mahjong instructor. No experience needed!",
    type: "website",
    locale: "en_US",
    url: "https://lasvegasmahj.com",
    siteName: "Las Vegas Mahjong",
    images: [
      {
        url: "https://lasvegasmahj.com/hero-bg.jpg",
        width: 1599,
        height: 2000,
        alt: "Mahjong tiles at a Las Vegas Mahjong event",
        type: "image/jpeg",
      },
      {
        url: "https://lasvegasmahj.com/shauna.jpg",
        width: 1774,
        height: 2000,
        alt: "Shauna, certified mahjong instructor and founder of Las Vegas Mahjong",
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Las Vegas Mahjong | Lessons, Events & Open Play",
    description:
      "Join Las Vegas's #1 mahjong community. Beginner lessons, open play, private parties & corporate events across the whole Valley. No experience needed!",
    images: ["https://lasvegasmahj.com/hero-bg.jpg"],
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
  "@id": "https://lasvegasmahj.com/#business",
  name: "Las Vegas Mahjong",
  alternateName: "LV Mahjong",
  description:
    "Las Vegas's premier mahjong instruction and community. Certified Oh My Mahjong instructor offering beginner lessons, open play events, private parties, corporate team building, leagues, and tournaments across the Las Vegas Valley.",
  url: "https://lasvegasmahj.com",
  telephone: "",
  email: "lasvegasmahj@gmail.com",
  image: [
    "https://lasvegasmahj.com/hero-bg.jpg",
    "https://lasvegasmahj.com/shauna.jpg",
  ],
  priceRange: "$45-$75",
  currenciesAccepted: "USD",
  paymentAccepted: "Cash, Credit Card, Venmo",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Las Vegas",
    addressRegion: "NV",
    postalCode: "89100",
    addressCountry: "US",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 36.1699,
    longitude: -115.1398,
  },
  areaServed: [
    { "@type": "City", name: "Las Vegas" },
    { "@type": "City", name: "Henderson" },
    { "@type": "City", name: "Summerlin" },
    { "@type": "City", name: "North Las Vegas" },
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
        price: "50.00",
        priceCurrency: "USD",
        priceSpecification: {
          "@type": "UnitPriceSpecification",
          price: "50.00",
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
        price: "50.00",
        priceCurrency: "USD",
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Private Mahjong Lessons",
          description:
            "One-on-one or small group private mahjong instruction at your preferred location.",
        },
        price: "75.00",
        priceCurrency: "USD",
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Corporate & Private Event Mahjong",
          description:
            "Custom mahjong experiences for bachelorette parties, corporate team building, birthdays, charity events, and more.",
        },
        priceSpecification: {
          "@type": "UnitPriceSpecification",
          price: "50.00",
          priceCurrency: "USD",
          unitText: "person",
          description: "Starting price",
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
      name: "Las Vegas Mahjong",
      url: "https://lasvegasmahj.com",
    },
    offers: {
      "@type": "Offer",
      price: "50.00",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      category: "In-Person",
    },
    courseMode: "In-Person",
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
      name: "Las Vegas Mahjong",
      url: "https://lasvegasmahj.com",
    },
    offers: {
      "@type": "Offer",
      price: "50.00",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      category: "In-Person",
    },
    courseMode: "In-Person",
  },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Do I need to know how to play mahjong before coming?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Not at all! Most of our students are complete beginners. MAHJ101 starts from scratch — we'll teach you everything from sorting the tiles to playing your first hand. No experience needed.",
      },
    },
    {
      "@type": "Question",
      name: "What version of mahjong do you teach in Las Vegas?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "We teach American Mahjong, played with the National Mah Jongg League (NMJL) card. This is the most popular version in the US and the one you'll find at most local games.",
      },
    },
    {
      "@type": "Question",
      name: "What do I need to bring to a mahjong lesson?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Just yourself! We provide the tiles, racks, and everything else you need. If you have your own NMJL card, feel free to bring it — otherwise we'll have extras.",
      },
    },
    {
      "@type": "Question",
      name: "Can I come to a mahjong event alone?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "You're welcome to come solo! Open play events are a great way to meet fellow players. For private lessons, we can pair you with other students if you don't have a full group.",
      },
    },
    {
      "@type": "Question",
      name: "How long does it take to learn mahjong?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Most people feel comfortable playing after just one 2-3 hour lesson. You won't be an expert overnight, but you'll know enough to sit down and play — and that's when the real fun starts.",
      },
    },
    {
      "@type": "Question",
      name: "Where do you hold mahjong classes and events in Las Vegas?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "We host at restaurants, community spaces, and private venues across the Las Vegas Valley — from Summerlin to Henderson. We also offer private lessons at your home or preferred location.",
      },
    },
    {
      "@type": "Question",
      name: "Can you host a private mahjong event or party?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Absolutely! We do bachelorette parties, birthday celebrations, corporate team building, charity events, and more. Events are fully customized for your group. Just reach out and we'll plan something amazing.",
      },
    },
    {
      "@type": "Question",
      name: "How much do mahjong lessons cost in Las Vegas?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Small group lessons (3-8 people) are $50 per person. Private lessons (1-2 people) are $75 per person. Large groups and corporate events start at $50 per person with custom pricing based on group size and needs.",
      },
    },
  ],
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": "https://lasvegasmahj.com/#website",
  name: "Las Vegas Mahjong",
  url: "https://lasvegasmahj.com",
  description:
    "Las Vegas's premier mahjong community offering lessons, events, and open play across the Valley.",
  publisher: {
    "@type": "Organization",
    name: "Las Vegas Mahjong",
    url: "https://lasvegasmahj.com",
    logo: {
      "@type": "ImageObject",
      url: "https://lasvegasmahj.com/hero-bg.jpg",
    },
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
        <link rel="canonical" href="https://lasvegasmahj.com" />
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(faqSchema).replace(/</g, "\\u003c"),
          }}
        />
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
