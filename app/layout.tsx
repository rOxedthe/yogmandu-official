import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://yogmandu.com"),
  title: {
    default: "Yogmandu | Yoga Teacher Training & Sound Healing Nepal",
    template: "%s | Yogmandu Nepal",
  },
  description:
    "Yogmandu offers Yoga Alliance certified 200hr & 300hr teacher training and authentic Tibetan singing bowl sound healing in Kathmandu, Nepal. Founded 2015. 3,000+ teachers trained from 50+ countries.",
  keywords: [
    "yoga teacher training Nepal",
    "200hr yoga teacher training Kathmandu",
    "300hr yoga teacher training Nepal",
    "sound healing Kathmandu",
    "Tibetan singing bowl therapy Nepal",
    "yoga alliance certified Nepal",
    "yoga school Kathmandu",
    "sound healing certification Nepal",
    "yoga retreat Nepal",
    "Yogmandu",
    "yoga classes Kathmandu",
    "Himalayan yoga school",
    "ERYT 500 Nepal",
    "RYS 200 Nepal",
  ],
  authors: [{ name: "Dr. Chintamani Gautam", url: "https://yogmandu.com/about" }],
  creator: "Yogmandu",
  publisher: "Yogmandu",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://yogmandu.com",
    siteName: "Yogmandu",
    title: "Yogmandu | Yoga Teacher Training & Sound Healing Nepal",
    description:
      "Yoga Alliance certified teacher training & authentic Tibetan Sound Healing in Kathmandu, Nepal. 3,000+ teachers from 50+ countries since 2015.",
    images: [{ url: "/logo.png", width: 470, height: 330, alt: "Yogmandu — Yoga & Sound Healing Nepal" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Yogmandu | Yoga Teacher Training & Sound Healing Nepal",
    description:
      "Yoga Alliance certified teacher training & authentic Tibetan Sound Healing in Kathmandu, Nepal.",
    images: ["/logo.png"],
    creator: "@yogmandu",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  alternates: { canonical: "https://yogmandu.com" },
  verification: { google: "google721fc082e09cdcb6" },
};

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "Yogmandu",
  description:
    "Yoga Alliance certified yoga teacher training and Sound Healing therapy center in Kathmandu, Nepal.",
  url: "https://yogmandu.com",
  logo: "https://yogmandu.com/logo.png",
  image: "https://yogmandu.com/logo.png",
  telephone: "+977-9862909469",
  email: "info@yogmandu.com",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Miteri Marg, Mid-Baneshwor-31",
    addressLocality: "Kathmandu",
    addressRegion: "Bagmati Province",
    addressCountry: "NP",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 27.7172,
    longitude: 85.324,
  },
  openingHours: "Mo-Su 06:00-20:00",
  priceRange: "$$",
  sameAs: [
    "https://www.facebook.com/yogmandu",
    "https://www.instagram.com/yogmandu",
    "https://www.youtube.com/@yogmandu",
  ],
  founder: {
    "@type": "Person",
    name: "Dr. Chintamani Gautam",
    jobTitle: "President & Lead Yoga Teacher",
    description: "PhD in Yogic Science, E-RYT 500 certified. Trained 3,000+ yoga teachers from 50+ countries.",
  },
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Yogmandu",
  url: "https://yogmandu.com",
  description: "Nepal's premier Yoga Alliance RYS 200 & 300 certified teacher training school and Tibetan sound healing centre.",
  potentialAction: {
    "@type": "SearchAction",
    target: { "@type": "EntryPoint", urlTemplate: "https://yogmandu.com/blog?q={search_term_string}" },
    "query-input": "required name=search_term_string",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }} />
      </head>
      <body className="min-h-full flex flex-col">
        {children}
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-JJL91Q27S5" strategy="afterInteractive" />
        <Script id="gtag-init" strategy="afterInteractive">{`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-JJL91Q27S5');
        `}</Script>
      </body>
    </html>
  );
}
