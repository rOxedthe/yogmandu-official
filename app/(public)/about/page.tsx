import type { Metadata } from "next";
import AboutContent from "./AboutContent";
import { getInstructors } from "@/lib/publicData";

// Brand palette + initials are derived here since the admin record doesn't store them.
const TEAM_PALETTE = ["#6B2D8B", "#F7941D", "#8DC63F"];
const HONORIFICS = new Set(["dr", "dr.", "yogi", "mr", "mr.", "ms", "ms.", "mrs", "mrs.", "sri", "prof", "prof."]);
function initialsOf(name: string): string {
  const words = name.trim().split(/\s+/);
  const meaningful = words.filter((w) => !HONORIFICS.has(w.toLowerCase()));
  const pick = (meaningful.length ? meaningful : words).slice(0, 2);
  return pick.map((w) => w[0]?.toUpperCase() ?? "").join("") || "·";
}

// Revalidate so admin edits to instructors appear without a redeploy (matches blog/schedule).
export const revalidate = 60;

export const metadata: Metadata = {
  title: { absolute: "About Yogmandu — Yoga School in Kathmandu, Nepal" },
  description:
    "Founded 2018 and led by Dr. Chintamani Gautam (PhD Yogic Science, E-RYT 500), Yogmandu is a Yoga Alliance registered yoga school in Kathmandu, Nepal.",
  keywords: [
    "Yogmandu about", "Dr Chintamani Gautam", "yoga school Nepal history",
    "Yoga Alliance Nepal", "ERYT 500 Nepal", "yoga teacher Kathmandu",
    "Nepal yoga school founded 2018",
  ],
  alternates: { canonical: "https://yogmandu.com/about" },
  openGraph: {
    title: "About Yogmandu | Nepal's First Yoga Alliance Registered School",
    description: "Founded 2018 by Dr. Chintamani Gautam. ERYT 500, PhD Yogic Science. 3,000+ teachers from 50+ countries. Kathmandu, Nepal.",
    url: "https://yogmandu.com/about",
    images: ["/opengraph-image.png"],
  },
  twitter: {
    title: "About Yogmandu | Nepal's First Yoga Alliance Registered School",
    description: "Founded 2018 by Dr. Chintamani Gautam. ERYT 500, PhD Yogic Science. 3,000+ teachers from 50+ countries.",
  },
};

const founderSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Dr. Chintamani Gautam",
  jobTitle: "President & Lead Yoga Teacher",
  description: "Born in Lumbini, Nepal. PhD from Gurukul Kangri University, Haridwar (2011). Master's in Yoga (2005). Aacharya in Sanskrit from Sampurnananda University, Varanasi (2004). E-RYT 500. 22+ years, 40,000+ teaching hours. Nepal Vidyabhushan 'KA' award 2012.",
  url: "https://yogmandu.com/about",
  birthPlace: { "@type": "Place", name: "Lumbini, Nepal" },
  worksFor: { "@type": "Organization", name: "Yogmandu", url: "https://yogmandu.com" },
  knowsAbout: ["Hatha Yoga", "Ashtanga Yoga", "Kriya Yoga", "Jnana Yoga", "Bhakti Yoga", "Raja Yoga", "Mantra Yoga", "Kundalini Yoga", "Yoga Philosophy", "Pranayama", "Sanskrit"],
  hasCredential: [
    { "@type": "EducationalOccupationalCredential", name: "PhD — Comparative Yoga Wisdom", credentialCategory: "Doctorate", educationalLevel: "PhD", recognizedBy: { "@type": "Organization", name: "Gurukul Kangri University, Haridwar" } },
    { "@type": "EducationalOccupationalCredential", name: "Master's in Yoga", recognizedBy: { "@type": "Organization", name: "Gurukul Kangri University" } },
    { "@type": "EducationalOccupationalCredential", name: "Aacharya in Sanskrit", recognizedBy: { "@type": "Organization", name: "Sampurnananda Sanskrit University, Varanasi" } },
    { "@type": "EducationalOccupationalCredential", name: "E-RYT 500", credentialCategory: "Yoga Alliance" },
  ],
  award: "Nepal Vidyabhushan 'KA' — President Dr. Ramvaran Yadav, 2012",
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Yogmandu",
  url: "https://yogmandu.com",
  logo: "https://yogmandu.com/logo.png",
  foundingDate: "2018",
  description: "Nepal's first Yoga Alliance registered school, offering 200hr, 300hr & 500hr teacher training and Tibetan sound healing in Kathmandu.",
  numberOfEmployees: { "@type": "QuantitativeValue", value: 10 },
  founder: { "@type": "Person", name: "Dr. Chintamani Gautam" },
  address: {
    "@type": "PostalAddress",
    streetAddress: "Miteri Marg, Mid-Baneshwor-31",
    addressLocality: "Kathmandu",
    addressCountry: "NP",
  },
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://yogmandu.com" },
    { "@type": "ListItem", position: 2, name: "About", item: "https://yogmandu.com/about" },
  ],
};

export default async function AboutPage() {
  // Admin-managed instructors (Supabase). Falls back to AboutContent's built-in
  // team when Supabase is unconfigured/empty/unreachable (getInstructors → null).
  const instructors = await getInstructors().catch(() => null);
  const team = (instructors ?? [])
    .filter((i) => (i.status ?? "Active") === "Active")
    .map((i, idx) => ({
      name:           i.name,
      role:           i.role ?? "",
      bio:            i.bio ?? "",
      certifications: i.certifications ?? "",
      credentials:    Array.isArray(i.specialties) ? i.specialties : [],
      photo:          i.photo ?? "",
      color:          TEAM_PALETTE[idx % TEAM_PALETTE.length],
      initials:       initialsOf(i.name),
    }));

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(founderSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <AboutContent team={team} />
    </>
  );
}
