import type { Metadata } from "next";
import GalleryGrid from "./GalleryGrid";
import { getMediaItems } from "@/lib/publicData";

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://yogmandu.com" },
    { "@type": "ListItem", position: 2, name: "Gallery", item: "https://yogmandu.com/gallery" },
  ],
};

export const metadata: Metadata = {
  title: "Yogmandu Gallery | Yoga & Sound Healing Nepal",
  description:
    "Photos from Yogmandu Kathmandu — yoga classes, Tibetan singing bowl sessions, teacher training graduates, and the beauty of Nepal. See what awaits you.",
  keywords: [
    "yoga gallery Kathmandu", "yoga school Nepal photos", "sound healing Nepal images",
    "yoga teacher training Nepal photos", "Kathmandu yoga studio", "Yogmandu gallery",
  ],
  alternates: { canonical: "https://yogmandu.com/gallery" },
  openGraph: {
    title: "Gallery | Yoga & Sound Healing in Kathmandu — Yogmandu",
    description: "Photos from yoga classes, Tibetan singing bowl sessions, and teacher training at Yogmandu Kathmandu.",
    url: "https://yogmandu.com/gallery",
  },
};

export default async function GalleryPage() {
  const media = await getMediaItems();
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <GalleryGrid media={media} />
    </>
  );
}
