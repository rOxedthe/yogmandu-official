import type { MetadataRoute } from "next";
import { statSync } from "fs";
import { join } from "path";
import { getPublishedBlogs } from "@/lib/publicData";

// Cache mtime lookups at module load so we don't stat repeatedly per request.
function mtime(relPath: string): Date {
  try {
    return statSync(join(process.cwd(), relPath)).mtime;
  } catch {
    return BUILD_DATE;
  }
}

// Captured once at module-load (== build time for static generation).
const BUILD_DATE = new Date();

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = "https://yogmandu.com";

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: base,                                    lastModified: mtime("app/(public)/page.tsx"),                       changeFrequency: "weekly",  priority: 1.0 },
    { url: `${base}/yoga-teacher-training`,         lastModified: mtime("app/(public)/yoga-teacher-training/page.tsx"), changeFrequency: "monthly", priority: 0.95 },
    { url: `${base}/sound-healing-therapy`,         lastModified: mtime("app/(public)/sound-healing-therapy/page.tsx"), changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/class-schedule`,                lastModified: mtime("app/(public)/class-schedule/page.tsx"),        changeFrequency: "weekly",  priority: 0.85 },
    { url: `${base}/about`,                         lastModified: mtime("app/(public)/about/page.tsx"),                 changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/contact`,                       lastModified: mtime("app/(public)/contact/page.tsx"),               changeFrequency: "yearly",  priority: 0.75 },
    { url: `${base}/gallery`,                       lastModified: mtime("app/(public)/gallery/page.tsx"),               changeFrequency: "monthly", priority: 0.65 },
    { url: `${base}/blog`,                          lastModified: mtime("app/(public)/blog/page.tsx"),                  changeFrequency: "weekly",  priority: 0.7 },
    { url: `${base}/privacy`,                       lastModified: mtime("app/(public)/privacy/page.tsx"),               changeFrequency: "yearly",  priority: 0.3 },
    { url: `${base}/terms`,                         lastModified: mtime("app/(public)/terms/page.tsx"),                 changeFrequency: "yearly",  priority: 0.3 },
  ];

  // Dynamically add published blog posts
  const blogs = await getPublishedBlogs().catch(() => null);
  const blogRoutes: MetadataRoute.Sitemap = (blogs ?? []).map((post) => ({
    url:             `${base}/blog/${post.slug}`,
    lastModified:    post.publishDate ? new Date(post.publishDate) : BUILD_DATE,
    changeFrequency: "monthly" as const,
    priority:        0.6,
  }));

  // Fallback static blog slugs if Supabase isn't configured (still uses real mtime)
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
        url: `${base}/blog/${slug}`,
        lastModified: mtime("app/(public)/blog/[slug]/page.tsx"),
        changeFrequency: "monthly" as const,
        priority: 0.6,
      }))
    : [];

  return [...staticRoutes, ...blogRoutes, ...fallbackRoutes];
}
