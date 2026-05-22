import type { MetadataRoute } from "next";
import { getPublishedBlogs } from "@/lib/publicData";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = "https://yogmandu.com";
  const now  = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: base,                                    lastModified: now, changeFrequency: "weekly",  priority: 1.0 },
    { url: `${base}/yoga-teacher-training`,         lastModified: now, changeFrequency: "monthly", priority: 0.95 },
    { url: `${base}/sound-healing-therapy`,         lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/class-schedule`,                lastModified: now, changeFrequency: "weekly",  priority: 0.85 },
    { url: `${base}/about`,                         lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/contact`,                       lastModified: now, changeFrequency: "yearly",  priority: 0.75 },
    { url: `${base}/gallery`,                       lastModified: now, changeFrequency: "monthly", priority: 0.65 },
    { url: `${base}/blog`,                          lastModified: now, changeFrequency: "weekly",  priority: 0.7 },
  ];

  // Dynamically add published blog posts
  const blogs = await getPublishedBlogs().catch(() => null);
  const blogRoutes: MetadataRoute.Sitemap = (blogs ?? []).map((post) => ({
    url:             `${base}/blog/${post.slug}`,
    lastModified:    post.publishDate ? new Date(post.publishDate) : now,
    changeFrequency: "monthly" as const,
    priority:        0.6,
  }));

  // Fallback static blog slugs if Supabase not configured
  const fallbackBlogSlugs = [
    "what-yoga-alliance-certification-actually-means",
    "tibetan-singing-bowls-science-of-sound",
    "kathmandu-yoga-travel-guide",
    "pranayama-beyond-breathwork",
    "why-small-yoga-teacher-training-groups",
    "sound-healing-trauma",
  ];
  const fallbackRoutes: MetadataRoute.Sitemap = blogRoutes.length === 0
    ? fallbackBlogSlugs.map((slug) => ({
        url: `${base}/blog/${slug}`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.6,
      }))
    : [];

  return [...staticRoutes, ...blogRoutes, ...fallbackRoutes];
}
