import type { Metadata } from "next";
import { getMediaItems } from "@/lib/publicData";
import GalleryAllGrid from "./GalleryAllGrid";

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home",    item: "https://yogmandu.com" },
    { "@type": "ListItem", position: 2, name: "Gallery", item: "https://yogmandu.com/gallery" },
    { "@type": "ListItem", position: 3, name: "All Photos", item: "https://yogmandu.com/gallery/all" },
  ],
};

export const metadata: Metadata = {
  title: "All Photos | Yogmandu Gallery — Yoga & Sound Healing Nepal",
  description:
    "Every moment from Yogmandu Kathmandu — yoga classes, Tibetan singing bowl sessions, teacher training graduates, and the spirit of Nepal. Browse all 40 photos.",
  alternates: { canonical: "https://yogmandu.com/gallery/all" },
  openGraph: {
    title: "All Photos | Yogmandu Gallery",
    description:
      "Browse all photos from yoga classes, sound healing sessions, and teacher training at Yogmandu Kathmandu.",
    url: "https://yogmandu.com/gallery/all",
  },
};

export default async function GalleryAllPage() {
  const media = await getMediaItems();
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <GalleryAllGrid media={media} />
    </>
  );
}
