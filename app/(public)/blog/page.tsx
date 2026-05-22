import type { Metadata } from "next";
import Link from "next/link";
import { getPublishedBlogs } from "@/lib/publicData";
import type { DBBlog } from "@/lib/publicData";

const blogSchema = {
  "@context": "https://schema.org",
  "@type": "Blog",
  name: "Yogmandu Blog",
  url: "https://yogmandu.com/blog",
  description: "Articles on yoga philosophy, pranayama, Tibetan sound healing, teacher training, and life in Kathmandu.",
  publisher: {
    "@type": "Organization",
    name: "Yogmandu",
    url: "https://yogmandu.com",
    logo: { "@type": "ImageObject", url: "https://yogmandu.com/logo.png" },
  },
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://yogmandu.com" },
    { "@type": "ListItem", position: 2, name: "Blog", item: "https://yogmandu.com/blog" },
  ],
};

export const metadata: Metadata = {
  title: "Yoga Blog Nepal | Yogmandu Insights",
  description:
    "Articles on yoga philosophy, pranayama, Tibetan sound healing, teacher training, and life in Kathmandu. Written by Dr. Chintamani Gautam and the Yogmandu teaching team.",
  keywords: [
    "yoga blog Nepal", "yoga philosophy articles", "pranayama guide",
    "sound healing blog", "yoga teacher training tips", "Kathmandu yoga lifestyle",
  ],
  alternates: { canonical: "https://yogmandu.com/blog" },
  openGraph: {
    title: "Yoga Blog — Philosophy, Breathwork & Sound Healing | Yogmandu Nepal",
    description: "Yoga philosophy, pranayama, Tibetan sound healing insights from the Yogmandu teaching team in Kathmandu.",
    url: "https://yogmandu.com/blog",
  },
};

const CATEGORY_COLORS: Record<string, string> = {
  "Teacher Training": "#6B2D8B",
  "Sound Healing":    "#F7941D",
  "Nepal":            "#8DC63F",
  "Practice":         "#6B2D8B",
  "Breathwork":       "#6B2D8B",
  "Community":        "#8DC63F",
  "Restorative":      "#8DC63F",
  "Yoga Philosophy":  "#F7941D",
};

const FALLBACK_POSTS = [
  { slug: "what-yoga-alliance-certification-actually-means", category: "Teacher Training", title: "What Yoga Alliance Certification Actually Means — And What It Doesn't", excerpt: "The RYS 200 stamp is everywhere. But what does it guarantee, what does it leave open, and how should a student actually evaluate a teacher training program?", readTime: "6 min", date: "April 2025", color: "#6B2D8B" },
  { slug: "tibetan-singing-bowls-science-of-sound", category: "Sound Healing", title: "The Science Behind Tibetan Singing Bowls: What Research Actually Says", excerpt: "Sound healing is ancient. But modern neuroscience is beginning to understand why it works.", readTime: "8 min", date: "March 2025", color: "#F7941D" },
  { slug: "kathmandu-yoga-travel-guide", category: "Nepal", title: "Kathmandu for the Yoga Traveller: A Practical and Soulful Guide", excerpt: "Where to stay, what to visit, which temples to walk through at dawn.", readTime: "10 min", date: "February 2025", color: "#8DC63F" },
  { slug: "pranayama-beyond-breathwork", category: "Practice", title: "Pranayama Is Not Breathwork: Understanding the Difference", excerpt: "Pranayama is something older, more precise, and more demanding than modern breathwork.", readTime: "7 min", date: "January 2025", color: "#6B2D8B" },
  { slug: "why-small-yoga-teacher-training-groups", category: "Teacher Training", title: "Why We Keep Our Training Groups Small", excerpt: "We limit every cohort to 12 students. Here's the pedagogical reasoning.", readTime: "5 min", date: "December 2024", color: "#F7941D" },
  { slug: "sound-healing-trauma", category: "Sound Healing", title: "Sound Healing and Trauma: What to Know Before Your First Session", excerpt: "Sound baths can move deep material. What you should tell your practitioner before you begin.", readTime: "9 min", date: "November 2024", color: "#8DC63F" },
];

function dbToPost(p: DBBlog) {
  const wordCount = (p.body ?? "").trim().split(/\s+/).filter(Boolean).length;
  const readTime = Math.max(1, Math.ceil(wordCount / 200));
  return {
    slug:     p.slug,
    category: p.category,
    title:    p.title,
    excerpt:  p.excerpt,
    readTime: `${readTime} min`,
    date:     p.publishDate ? new Date(p.publishDate).toLocaleDateString("en", { month: "long", year: "numeric" }) : "",
    color:    CATEGORY_COLORS[p.category] ?? "#6B2D8B",
  };
}

export default async function BlogPage() {
  const dbPosts = await getPublishedBlogs();
  const posts = dbPosts && dbPosts.length > 0 ? dbPosts.map(dbToPost) : FALLBACK_POSTS;
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      {/* Hero */}
      <section className="pt-36 pb-16 px-6" style={{ background: "#FAF6F0" }}>
        <div className="max-w-5xl mx-auto">
          <p className="text-xs tracking-[0.3em] uppercase mb-6" style={{ color: "#8DC63F" }}>Writing</p>
          <h1 className="text-5xl md:text-7xl font-light leading-[1.05] mb-6"
            style={{ fontFamily: "Cormorant Garamond, serif", color: "#2A1208" }}>
            Words from the <em style={{ color: "#F7941D" }}>practice</em>
          </h1>
          <p className="text-base font-light max-w-lg" style={{ color: "rgba(42,18,8,0.45)" }}>
            Essays on yoga philosophy, sound healing, teaching methodology, and life in Kathmandu — written by the teachers at Yogmandu.
          </p>
        </div>
      </section>

      {/* Featured post */}
      {posts.length > 0 && (
        <section className="px-6 pb-12" style={{ background: "#FAF6F0" }}>
          <div className="max-w-5xl mx-auto">
            <div className="card-light p-10 md:p-12 rounded-3xl"
              style={{ borderLeft: "3px solid #F7941D" }}>
              <span className="text-xs tracking-[0.25em] uppercase font-light" style={{ color: "#F7941D" }}>
                {posts[0].category} · {posts[0].date}
              </span>
              <h2 className="text-3xl md:text-4xl font-light mt-3 mb-5 max-w-2xl leading-[1.2]"
                style={{ fontFamily: "Cormorant Garamond, serif", color: "#2A1208" }}>
                {posts[0].title}
              </h2>
              <p className="text-sm font-light leading-relaxed mb-8 max-w-xl" style={{ color: "rgba(42,18,8,0.5)" }}>
                {posts[0].excerpt}
              </p>
              <div className="flex items-center gap-6">
                <Link href={`/blog/${posts[0].slug}`}
                  className="cta-lift px-6 py-2.5 rounded-full text-sm font-medium"
                  style={{ background: "#F7941D", color: "#FAF6F0" }}>
                  Read Article
                </Link>
                <span className="text-xs font-light" style={{ color: "rgba(42,18,8,0.3)" }}>{posts[0].readTime} read</span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Grid */}
      <section className="px-6 pb-28" style={{ background: "#FAF6F0" }}>
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.slice(1).map(post => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="card-light p-7 flex flex-col group">
              <span className="text-xs tracking-[0.2em] uppercase font-light mb-4" style={{ color: post.color }}>
                {post.category}
              </span>
              <h3 className="text-xl font-light leading-snug mb-4 flex-1 group-hover:text-white transition-colors"
                style={{ fontFamily: "Cormorant Garamond, serif", color: "rgba(42,18,8,0.85)" }}>
                {post.title}
              </h3>
              <p className="text-sm font-light leading-relaxed mb-6 line-clamp-3" style={{ color: "rgba(42,18,8,0.4)" }}>
                {post.excerpt}
              </p>
              <div className="flex items-center justify-between mt-auto">
                <span className="text-xs font-light" style={{ color: "rgba(42,18,8,0.3)" }}>{post.date}</span>
                <span className="text-xs font-light" style={{ color: "rgba(42,18,8,0.3)" }}>{post.readTime} read</span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
