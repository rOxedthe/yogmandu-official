import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: { absolute: "Yoga Retreat in Nepal — Kathmandu & Himalayas | Yogmandu" },
  description:
    "Join a yoga retreat in Nepal with Yogmandu — daily yoga & meditation, Tibetan sound healing, mountain air and Himalayan tradition in Kathmandu. Tailored dates.",
  keywords: [
    "yoga retreat Nepal",
    "yoga retreat Kathmandu",
    "Himalayan yoga retreat",
    "meditation retreat Nepal",
    "wellness retreat Nepal",
    "yoga holiday Nepal",
    "sound healing retreat Nepal",
    "yoga retreat Himalayas",
    "spiritual retreat Kathmandu",
  ],
  alternates: { canonical: "https://yogmandu.com/yoga-retreat-nepal" },
  openGraph: {
    title: "Yoga Retreat in Nepal | Kathmandu & the Himalayas — Yogmandu",
    description:
      "A yoga retreat in the home of the lineage — daily practice, Tibetan sound healing, meditation and Himalayan culture. Tailored retreats in Nepal with Yogmandu.",
    url: "https://yogmandu.com/yoga-retreat-nepal",
    images: ["/opengraph-image.png"],
  },
  twitter: {
    title: "Yoga Retreat in Nepal | Yogmandu Kathmandu",
    description: "Daily yoga, meditation & Tibetan sound healing amid the Himalayas. Tailored retreats in Nepal.",
  },
};

// Single source of truth: the visible FAQ section below and the FAQPage
// structured data are both generated from this array, so they can never drift
// apart (Google requires FAQ markup to match content visible on the page).
const faqs = [
  {
    q: "Where is the yoga retreat held in Nepal?",
    a: "Our retreats are based at the Yogmandu studio in Mid-Baneshwor, Kathmandu — the cultural and spiritual heart of Nepal — with optional excursions to temples, stupas and the surrounding Himalayan foothills.",
  },
  {
    q: "How long is a yoga retreat at Yogmandu?",
    a: "Retreats are flexible. We arrange short 3–5 day immersions as well as week-long and extended retreats, and can tailor the length and focus to your group. Message us with your preferred dates and we'll build a programme around them.",
  },
  {
    q: "What's included in a Yogmandu yoga retreat?",
    a: "Daily guided yoga and meditation, Tibetan singing-bowl sound healing, breathwork (pranayama), and cultural experiences. Accommodation, meals and excursions can be included depending on the package — we'll confirm the full details when you enquire.",
  },
  {
    q: "Do I need yoga experience to join a retreat?",
    a: "No. Our retreats welcome all levels, from complete beginners to seasoned practitioners. Sessions are taught with variations so everyone can practise comfortably at their own pace.",
  },
  {
    q: "When are the retreat dates and how much does it cost?",
    a: "Because every retreat is tailored to the group's length, accommodation and focus, dates and pricing vary. Contact us on WhatsApp (+977-9810263277) or email info@yogmandu.com for current dates and a personalised quote.",
  },
  {
    q: "Can you arrange a private or group retreat?",
    a: "Yes. We regularly host private retreats for individuals, friends, studios and corporate groups. Tell us your group size and what you'd like to focus on — yoga, sound healing, meditation or a mix — and we'll design it for you.",
  },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

const retreatServiceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Yoga Retreat in Nepal",
  description:
    "Tailored yoga retreats in Kathmandu, Nepal — daily yoga and meditation, Tibetan sound healing, breathwork and Himalayan cultural experiences.",
  provider: {
    "@type": "Organization",
    name: "Yogmandu",
    url: "https://yogmandu.com",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Miteri Marg, Mid-Baneshwor-31",
      addressLocality: "Kathmandu",
      addressCountry: "NP",
    },
  },
  areaServed: { "@type": "Country", name: "Nepal" },
  serviceType: "Yoga Retreat",
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://yogmandu.com" },
    { "@type": "ListItem", position: 2, name: "Yoga Retreat Nepal", item: "https://yogmandu.com/yoga-retreat-nepal" },
  ],
};

const included = [
  { icon: "🧘", title: "Daily Yoga & Meditation", desc: "Morning and evening guided sessions in the classical Hatha tradition, suitable for every level.", color: "#6B2D8B" },
  { icon: "🎵", title: "Tibetan Sound Healing", desc: "Authentic singing-bowl sound baths to release tension and deepen rest — a signature of our retreats.", color: "#F7941D" },
  { icon: "🌬️", title: "Pranayama & Breathwork", desc: "Traditional breathing practices to calm the nervous system and steady the mind.", color: "#8DC63F" },
  { icon: "🏔️", title: "Himalayan Setting", desc: "Mountain air, ancient temples and the living lineage of yoga — Nepal as the practice itself.", color: "#6B2D8B" },
  { icon: "🏛️", title: "Cultural Excursions", desc: "Optional visits to Kathmandu's stupas, temples and sacred sites between practice sessions.", color: "#F7941D" },
  { icon: "🌿", title: "Small, Personal Groups", desc: "Intimate cohorts and experienced teachers mean real attention and a genuine sense of community.", color: "#8DC63F" },
];

const retreatDay = [
  { time: "6:30 AM",  activity: "Morning meditation & pranayama" },
  { time: "7:30 AM",  activity: "Asana practice (Hatha / gentle flow)" },
  { time: "9:00 AM",  activity: "Nourishing breakfast" },
  { time: "11:00 AM", activity: "Workshop, philosophy or cultural excursion" },
  { time: "1:00 PM",  activity: "Lunch & rest" },
  { time: "4:00 PM",  activity: "Restorative yoga or Tibetan sound healing" },
  { time: "6:30 PM",  activity: "Dinner" },
  { time: "8:00 PM",  activity: "Evening meditation & silence" },
];

export default function YogaRetreatNepalPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(retreatServiceSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      {/* Hero */}
      <section className="relative pt-36 pb-24 px-6 overflow-hidden" style={{ background: "#FFFFFF" }}>
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 60% 70% at 75% 25%, rgba(107,45,139,0.07) 0%, transparent 60%)" }} />
        <div className="max-w-3xl mx-auto text-center relative">
          <p className="text-xs tracking-[0.3em] uppercase mb-6 font-medium" style={{ color: "#8DC63F" }}>
            In the Home of the Lineage
          </p>
          <h1 className="text-5xl md:text-7xl font-light leading-[1.05] mb-8"
            style={{ fontFamily: "Cormorant Garamond, serif", color: "#2A1208" }}>
            A yoga retreat in <em style={{ color: "#6B2D8B" }}>Nepal</em>
          </h1>
          <p className="text-lg leading-relaxed mb-10 max-w-xl mx-auto" style={{ color: "#4A2E1A", fontWeight: 400 }}>
            Step away from the noise and into the Himalayas. Daily yoga and meditation, Tibetan sound
            healing, and the quiet power of Kathmandu — tailored retreats with Yogmandu, Nepal's
            Yoga Alliance certified school since 2018.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a href="https://wa.me/9779810263277" target="_blank" rel="noopener noreferrer"
              className="cta-lift px-8 py-3.5 rounded-full font-medium text-sm text-white"
              style={{ background: "#A65808", boxShadow: "0 6px 20px rgba(247,148,29,0.4)" }}>
              Enquire on WhatsApp
            </a>
            <Link href="/contact"
              className="cta-lift px-8 py-3.5 rounded-full font-medium text-sm"
              style={{ border: "1.5px solid #6B2D8B", color: "#6B2D8B" }}>
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      {/* Why Nepal */}
      <section className="py-24 px-6" style={{ background: "#F9F5FF" }}>
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-xs tracking-[0.3em] uppercase mb-4 font-medium" style={{ color: "#6B2D8B" }}>The Setting</p>
          <h2 className="text-4xl md:text-5xl font-light mb-6 leading-[1.1]"
            style={{ fontFamily: "Cormorant Garamond, serif", color: "#2A1208" }}>
            Nepal is not a backdrop — <em style={{ color: "#F7941D" }}>it is the practice</em>
          </h2>
          <div className="section-divider mt-2 mb-8" />
          <p className="text-base leading-relaxed max-w-2xl mx-auto" style={{ color: "#4A2E1A" }}>
            Birthplace of the Buddha and neighbour to the world's highest peaks, Nepal carries a
            stillness you can feel. On retreat, the mountain air, ancient temples and unbroken yoga
            lineage deepen every session — turning a holiday into a genuine reset for body and mind.
          </p>
        </div>
      </section>

      {/* What's included */}
      <section className="py-24 px-6" style={{ background: "#FFFFFF" }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs tracking-[0.3em] uppercase mb-4 font-medium" style={{ color: "#F7941D" }}>The Experience</p>
            <h2 className="text-4xl md:text-5xl font-light" style={{ fontFamily: "Cormorant Garamond, serif", color: "#2A1208" }}>
              What your retreat includes
            </h2>
            <div className="section-divider mt-6" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {included.map((item) => (
              <div key={item.title} className="lift-3d rounded-2xl p-8"
                style={{ background: `${item.color}06`, border: `1.5px solid ${item.color}22`, borderTop: `3px solid ${item.color}`, borderTopWidth: 3 }}>
                <span style={{ fontSize: "1.9rem", display: "block", marginBottom: 12 }}>{item.icon}</span>
                <h3 className="text-xl font-light mb-2" style={{ fontFamily: "Cormorant Garamond, serif", color: "#2A1208" }}>
                  {item.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "#4A2E1A" }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* A day on retreat */}
      <section className="py-24 px-6" style={{ background: "#F9F5FF" }}>
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs tracking-[0.3em] uppercase mb-4 font-medium" style={{ color: "#6B2D8B" }}>A Sample Rhythm</p>
            <h2 className="text-3xl md:text-4xl font-light" style={{ fontFamily: "Cormorant Garamond, serif", color: "#2A1208" }}>
              A day on retreat
            </h2>
            <p className="mt-4 text-sm" style={{ color: "#7A5840" }}>An example flow — every retreat is tailored to your group.</p>
          </div>
          <div style={{ border: "1px solid rgba(107,45,139,0.12)", borderRadius: "1.25rem", overflow: "hidden", background: "#FFFFFF" }}>
            {retreatDay.map((row, i) => (
              <div key={row.time} style={{
                display: "flex", alignItems: "center", gap: 16,
                padding: "0.85rem 1.5rem",
                borderBottom: i < retreatDay.length - 1 ? "1px solid rgba(107,45,139,0.07)" : "none",
                background: i % 2 === 0 ? "#FFFFFF" : "rgba(107,45,139,0.02)",
              }}>
                <span style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "0.95rem",
                  color: "#6B2D8B", minWidth: 90, flexShrink: 0 }}>{row.time}</span>
                <span style={{ fontSize: "0.88rem", color: "#4A2E1A" }}>{row.activity}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tailored note */}
      <section className="py-20 px-6" style={{ background: "#FFFFFF" }}>
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-xs tracking-[0.3em] uppercase mb-4 font-medium" style={{ color: "#8DC63F" }}>Made For You</p>
          <h2 className="text-3xl md:text-4xl font-light mb-5" style={{ fontFamily: "Cormorant Garamond, serif", color: "#2A1208" }}>
            Every retreat is tailored
          </h2>
          <p className="text-base leading-relaxed max-w-2xl mx-auto" style={{ color: "#4A2E1A" }}>
            Solo travellers, friends, yoga studios and corporate groups all retreat with us. We shape the
            length, focus and accommodation around you — whether that's a 3-day reset or a deep two-week
            immersion. Pair it with our{" "}
            <Link href="/yoga-teacher-training" style={{ color: "#6B2D8B", textDecoration: "underline" }}>teacher training</Link>{" "}
            or{" "}
            <Link href="/sound-healing-therapy" style={{ color: "#6B2D8B", textDecoration: "underline" }}>sound healing</Link>{" "}
            programmes for a richer journey.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 px-6" style={{ background: "#F9F5FF" }}>
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs tracking-[0.3em] uppercase mb-4 font-medium" style={{ color: "#6B2D8B" }}>Questions</p>
            <h2 className="text-4xl md:text-5xl font-light" style={{ fontFamily: "Cormorant Garamond, serif", color: "#2A1208" }}>
              Retreat questions, answered
            </h2>
            <div className="section-divider mt-6" />
          </div>
          <div className="space-y-3">
            {faqs.map((f) => (
              <details key={f.q} className="faq-item rounded-2xl"
                style={{ background: "#FFFFFF", border: "1px solid rgba(107,45,139,0.12)" }}>
                <summary className="flex items-center justify-between gap-4 cursor-pointer list-none px-6 py-5">
                  <span className="text-base font-medium" style={{ color: "#2A1208" }}>{f.q}</span>
                  <span className="faq-mark flex-shrink-0 text-xl font-light leading-none" style={{ color: "#6B2D8B" }}>+</span>
                </summary>
                <p className="px-6 pb-5 text-sm leading-relaxed" style={{ color: "#4A2E1A" }}>{f.a}</p>
              </details>
            ))}
          </div>
        </div>
        <style>{`
          .faq-item > summary::-webkit-details-marker { display: none; }
          .faq-item .faq-mark { transition: transform 0.2s ease; }
          .faq-item[open] .faq-mark { transform: rotate(45deg); }
        `}</style>
      </section>

      {/* CTA */}
      <section className="py-20 px-6" style={{ background: "#FFFFFF" }}>
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-light mb-4" style={{ fontFamily: "Cormorant Garamond, serif", color: "#2A1208" }}>
            Plan your retreat to Nepal
          </h2>
          <p className="text-lg mb-10" style={{ color: "#4A2E1A", fontWeight: 400 }}>
            Tell us your dates, group size and what you're seeking. We'll craft a retreat around you and send a personalised quote.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="https://wa.me/9779810263277" target="_blank" rel="noopener noreferrer"
              className="cta-lift px-10 py-4 rounded-full text-white font-medium"
              style={{ background: "#6B2D8B" }}>Enquire on WhatsApp</a>
            <Link href="/gallery"
              className="cta-lift px-10 py-4 rounded-full font-medium"
              style={{ border: "1.5px solid #F7941D", color: "#F7941D" }}>See the Gallery →</Link>
          </div>
          <div className="mt-8 flex justify-center gap-8 text-sm" style={{ color: "#7A5840" }}>
            <span>📞 +977-9810263277</span>
            <span>✉️ info@yogmandu.com</span>
          </div>
        </div>
      </section>
    </>
  );
}
