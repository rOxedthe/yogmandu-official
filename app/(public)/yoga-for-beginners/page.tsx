import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: { absolute: "Yoga for Beginners in Kathmandu, Nepal | Yogmandu" },
  description:
    "New to yoga? Start with beginner-friendly classes at Yogmandu in Kathmandu — gentle Hatha, breathwork and meditation. No experience or flexibility needed.",
  keywords: [
    "yoga for beginners",
    "yoga for beginners Kathmandu",
    "beginner yoga Nepal",
    "yoga classes for beginners",
    "gentle yoga Kathmandu",
    "first yoga class",
    "how to start yoga",
    "Hatha yoga beginners Nepal",
    "yoga for stiff bodies",
  ],
  alternates: { canonical: "https://yogmandu.com/yoga-for-beginners" },
  openGraph: {
    title: "Yoga for Beginners in Kathmandu | Start Your Practice — Yogmandu",
    description:
      "Beginner-friendly yoga in Kathmandu, Nepal. Gentle Hatha, pranayama and meditation. No experience or flexibility required — all levels welcome.",
    url: "https://yogmandu.com/yoga-for-beginners",
    images: ["/opengraph-image.png"],
  },
  twitter: {
    title: "Yoga for Beginners in Kathmandu | Yogmandu Nepal",
    description: "Gentle, beginner-friendly yoga in Kathmandu. No experience or flexibility needed.",
  },
};

// Single source of truth: the visible FAQ section below and the FAQPage
// structured data are both generated from this array, so they can never drift
// apart (Google requires FAQ markup to match content visible on the page).
const faqs = [
  {
    q: "Can I start yoga as a complete beginner?",
    a: "Yes. Our beginner-friendly classes are designed for people who have never practised before. Teachers explain every posture, offer easier variations, and move at a gentle pace so you always feel supported.",
  },
  {
    q: "Do I need to be flexible to do yoga?",
    a: "No. Flexibility is a result of practising yoga, not a requirement to begin. Most people start stiff. Each posture can be adapted with blocks, straps or simpler shapes so it works for your body today.",
  },
  {
    q: "Which class should I take as a beginner?",
    a: "Start with a gentle Hatha, beginner Vinyasa, or a restorative / Yin class. Pranayama (breathwork) and meditation sessions are also perfect entry points. The level is marked on every class in our weekly schedule.",
  },
  {
    q: "What should I wear and bring to my first class?",
    a: "Wear comfortable clothes you can move and stretch in. Bring water and, if you have one, a yoga mat — though mats are available at the studio. Practise on an empty-ish stomach (leave 2 hours after a large meal).",
  },
  {
    q: "How often should a beginner practise yoga?",
    a: "Two to three classes a week is a great starting rhythm and enough to feel real change within a month. Even one consistent class a week builds a strong foundation. Listen to your body and rest when you need to.",
  },
  {
    q: "Is yoga safe if I have an injury or health condition?",
    a: "In most cases yes, with the right modifications. Please tell your teacher before class about any injury, medical condition or pregnancy so they can adapt the practice for you. If in doubt, check with your doctor first.",
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

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://yogmandu.com" },
    { "@type": "ListItem", position: 2, name: "Yoga for Beginners", item: "https://yogmandu.com/yoga-for-beginners" },
  ],
};

const myths = [
  {
    color: "#6B2D8B",
    myth: "“I'm not flexible enough.”",
    truth: "Yoga builds flexibility — you don't need it to start. We begin where your body is today.",
  },
  {
    color: "#F7941D",
    myth: "“I'm too old / unfit.”",
    truth: "Yoga meets every body. Postures are adapted with props and simpler variations for any age or fitness level.",
  },
  {
    color: "#8DC63F",
    myth: "“Everyone will be better than me.”",
    truth: "Our beginner classes are full of first-timers. There's no competition — only your own breath and pace.",
  },
];

const firstClass = [
  { step: "01", title: "Arrive early", body: "Come 10 minutes before class. Let your teacher know it's your first time and mention any injuries.", color: "#6B2D8B" },
  { step: "02", title: "Begin with breath", body: "Class opens with simple breathing (pranayama) to settle the mind and connect to the present moment.", color: "#F7941D" },
  { step: "03", title: "Move gently", body: "Warm-ups flow into foundational postures. You'll be offered easier options at every step.", color: "#8DC63F" },
  { step: "04", title: "Rest in stillness", body: "Every class closes with relaxation (savasana) — often the most loved part for beginners.", color: "#6B2D8B" },
];

const beginnerClasses = [
  { name: "Gentle Hatha", desc: "Slow, foundational postures held with steady breath. The classic starting point for new practitioners.", color: "#6B2D8B" },
  { name: "Beginner Vinyasa", desc: "Gentle flowing sequences that link breath and movement at an accessible, unhurried pace.", color: "#F7941D" },
  { name: "Yin & Restorative", desc: "Long, supported holds that release deep tension. Calming, passive and wonderfully beginner-friendly.", color: "#8DC63F" },
  { name: "Pranayama & Meditation", desc: "Breathwork and guided meditation — no physical experience needed, just a willingness to sit and breathe.", color: "#6B2D8B" },
];

export default function YogaForBeginnersPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      {/* Hero */}
      <section className="relative pt-36 pb-24 px-6 overflow-hidden" style={{ background: "#FFFFFF" }}>
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 60% 70% at 25% 30%, rgba(141,198,63,0.07) 0%, transparent 60%)" }} />
        <div className="max-w-3xl mx-auto text-center relative">
          <p className="text-xs tracking-[0.3em] uppercase mb-6 font-medium" style={{ color: "#8DC63F" }}>
            Start Here · No Experience Needed
          </p>
          <h1 className="text-5xl md:text-7xl font-light leading-[1.05] mb-8"
            style={{ fontFamily: "Cormorant Garamond, serif", color: "#2A1208" }}>
            Yoga for <em style={{ color: "#6B2D8B" }}>beginners</em> in Kathmandu
          </h1>
          <p className="text-lg leading-relaxed mb-10 max-w-xl mx-auto" style={{ color: "#4A2E1A", fontWeight: 400 }}>
            You don't need to be flexible, fit, or experienced. You just need to begin. At Yogmandu,
            our beginner-friendly classes welcome you exactly as you are — gentle, patient, and
            taught by Yoga Alliance certified teachers in the heart of Nepal.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/class-schedule"
              className="cta-lift px-8 py-3.5 rounded-full font-medium text-sm text-white"
              style={{ background: "#A65808", boxShadow: "0 6px 20px rgba(247,148,29,0.4)" }}>
              View Class Schedule
            </Link>
            <a href="https://wa.me/9779810263277" target="_blank" rel="noopener noreferrer"
              className="cta-lift px-8 py-3.5 rounded-full font-medium text-sm"
              style={{ border: "1.5px solid #6B2D8B", color: "#6B2D8B" }}>
              Ask on WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* Myth-busting */}
      <section className="py-24 px-6" style={{ background: "#F9F5FF" }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs tracking-[0.3em] uppercase mb-4 font-medium" style={{ color: "#6B2D8B" }}>Let It Go</p>
            <h2 className="text-4xl md:text-5xl font-light" style={{ fontFamily: "Cormorant Garamond, serif", color: "#2A1208" }}>
              The only requirement is to show up
            </h2>
            <div className="section-divider mt-6" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {myths.map((m) => (
              <div key={m.myth} className="lift-3d rounded-2xl p-8"
                style={{ background: "#FFFFFF", borderTop: `3px solid ${m.color}`, border: `1.5px solid ${m.color}20`, borderTopWidth: 3 }}>
                <p className="text-lg font-light mb-3" style={{ fontFamily: "Cormorant Garamond, serif", color: m.color }}>
                  {m.myth}
                </p>
                <p className="text-sm leading-relaxed" style={{ color: "#4A2E1A" }}>{m.truth}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* First class steps */}
      <section className="py-24 px-6" style={{ background: "#FFFFFF" }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs tracking-[0.3em] uppercase mb-4 font-medium" style={{ color: "#F7941D" }}>What to Expect</p>
            <h2 className="text-4xl md:text-5xl font-light" style={{ fontFamily: "Cormorant Garamond, serif", color: "#2A1208" }}>
              Your first class
            </h2>
            <div className="section-divider mt-6" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {firstClass.map((s) => (
              <div key={s.step} className="rounded-2xl p-7"
                style={{ background: `${s.color}06`, border: `1.5px solid ${s.color}22` }}>
                <div className="mb-3" style={{
                  fontFamily: "Cormorant Garamond, serif", fontSize: "2.5rem", fontWeight: 300,
                  lineHeight: 1, color: s.color, opacity: 0.85,
                }}>{s.step}</div>
                <h3 className="text-xl font-light mb-2" style={{ fontFamily: "Cormorant Garamond, serif", color: "#2A1208" }}>
                  {s.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "#4A2E1A" }}>{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Beginner-friendly classes */}
      <section className="py-24 px-6" style={{ background: "#F9F5FF" }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs tracking-[0.3em] uppercase mb-4 font-medium" style={{ color: "#8DC63F" }}>Where to Begin</p>
            <h2 className="text-4xl md:text-5xl font-light" style={{ fontFamily: "Cormorant Garamond, serif", color: "#2A1208" }}>
              Beginner-friendly classes
            </h2>
            <div className="section-divider mt-6" />
            <p className="mt-6 text-base font-light max-w-xl mx-auto" style={{ color: "#4A2E1A" }}>
              Any of these are a perfect first step. The level of every session is marked on our{" "}
              <Link href="/class-schedule" style={{ color: "#6B2D8B", textDecoration: "underline" }}>weekly schedule</Link>.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {beginnerClasses.map((c) => (
              <div key={c.name} className="lift-3d rounded-2xl p-8"
                style={{ background: "#FFFFFF", borderLeft: `3px solid ${c.color}`, border: `1.5px solid ${c.color}1f`, borderLeftWidth: 3 }}>
                <h3 className="text-2xl font-light mb-2" style={{ fontFamily: "Cormorant Garamond, serif", color: "#2A1208" }}>
                  {c.name}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "#4A2E1A" }}>{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 px-6" style={{ background: "#FFFFFF" }}>
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs tracking-[0.3em] uppercase mb-4 font-medium" style={{ color: "#6B2D8B" }}>Questions</p>
            <h2 className="text-4xl md:text-5xl font-light" style={{ fontFamily: "Cormorant Garamond, serif", color: "#2A1208" }}>
              Beginner questions, answered
            </h2>
            <div className="section-divider mt-6" />
          </div>
          <div className="space-y-3">
            {faqs.map((f) => (
              <details key={f.q} className="faq-item rounded-2xl"
                style={{ background: "#F9F5FF", border: "1px solid rgba(107,45,139,0.12)" }}>
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
      <section className="py-20 px-6" style={{ background: "#F9F5FF" }}>
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-light mb-4" style={{ fontFamily: "Cormorant Garamond, serif", color: "#2A1208" }}>
            Take the first breath
          </h2>
          <p className="text-lg mb-10" style={{ color: "#4A2E1A", fontWeight: 400 }}>
            Drop in to a beginner class this week, or message us and we'll help you pick the right one to start.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/class-schedule"
              className="cta-lift px-10 py-4 rounded-full text-white font-medium"
              style={{ background: "#6B2D8B" }}>See the Schedule</Link>
            <Link href="/yoga-teacher-training"
              className="cta-lift px-10 py-4 rounded-full font-medium"
              style={{ border: "1.5px solid #F7941D", color: "#F7941D" }}>Ready to go deeper? Teacher Training →</Link>
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
