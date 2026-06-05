import type { Metadata } from "next";
import Link from "next/link";
import PricingSection from "./PricingSection";
import IntakeMonths from "./IntakeMonths";

export const metadata: Metadata = {
  title: { absolute: "Yoga Teacher Training in Nepal — RYS 200 | Yogmandu" },
  description:
    "Yoga Alliance RYS 200 teacher training in Kathmandu, Nepal. Residential & non-residential 2026 batches — Hatha, Ashtanga, anatomy, philosophy & practice.",
  keywords: [
    "200hr yoga teacher training Nepal",
    "yoga teacher training Kathmandu",
    "yoga alliance RYS 200 Nepal",
    "yoga teacher certification Nepal",
    "yoga school Nepal 2026",
    "affordable yoga teacher training Asia",
    "Hatha yoga teacher training Nepal",
    "Ashtanga teacher training Kathmandu",
    "yoga training residential Nepal",
  ],
  alternates: { canonical: "https://yogmandu.com/yoga-teacher-training" },
  openGraph: {
    title: "200hr Yoga Teacher Training Nepal | Yogmandu",
    description: "Yoga Alliance RYS 200 certified. Residential USD 1,400 · Non-residential USD 600. 2026 batches: June, July, August. Kathmandu, Nepal.",
    url: "https://yogmandu.com/yoga-teacher-training",
    images: ["/opengraph-image.png"],
  },
  twitter: {
    title: "200hr Yoga Teacher Training Nepal | Yogmandu",
    description: "Yoga Alliance RYS 200 certified. Residential USD 1,400 · Non-residential USD 600. 2026 batches in Kathmandu.",
  },
};

const courseSchema = {
  "@context": "https://schema.org",
  "@type": "Course",
  name: "200-Hour Yoga Teacher Training in Nepal",
  description:
    "Yoga Alliance certified 200hr yoga teacher training in Kathmandu, Nepal. Hatha, Ashtanga, anatomy, philosophy, pranayama, and teaching methodology.",
  provider: { "@type": "Organization", name: "Yogmandu", sameAs: "https://yogmandu.com" },
  courseMode: "onsite",
  duration: "P28D",
  location: {
    "@type": "Place",
    name: "Yogmandu",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Miteri Marg, Mid-Baneshwor-31",
      addressLocality: "Kathmandu",
      addressCountry: "NP",
    },
  },
  offers: [
    { "@type": "Offer", priceCurrency: "USD", price: "600",  name: "Non-Residential" },
    { "@type": "Offer", priceCurrency: "USD", price: "1400", name: "Residential (Full Board)" },
  ],
};

// Single source of truth: the visible FAQ section below and the FAQPage
// structured data are both generated from this array, so they can never drift
// apart (Google requires FAQ markup to match content visible on the page).
const faqs = [
  {
    q: "Is the 200-hour yoga teacher training Yoga Alliance certified?",
    a: "Yes. Yogmandu is a Yoga Alliance Registered Yoga School (RYS 200). Graduates receive a certificate eligible for Yoga Alliance RYT 200 registration worldwide.",
  },
  {
    q: "What is the difference between residential and non-residential training?",
    a: "The residential course (USD 1,400) includes 28 days of tuition plus accommodation and all meals at the Yogmandu studio in Kathmandu. The non-residential course (USD 600) covers tuition only — you arrange your own accommodation in Kathmandu.",
  },
  {
    q: "How long is the 200-hour yoga teacher training course?",
    a: "The course runs for 28 days. Daily sessions begin at 6:30 AM and cover asana, pranayama, anatomy, yoga philosophy, Sanskrit, and teaching methodology. Evenings include self-study until 9:30 PM.",
  },
  {
    q: "When are the 2026 yoga teacher training start dates?",
    a: "2026 batches run in June, July, and August. Each cohort is limited to 12 students. Contact us on WhatsApp (+977-9810263277) to reserve your place.",
  },
  {
    q: "What level of yoga experience do I need to join?",
    a: "The program is open to beginners and intermediate practitioners. No prior teaching experience is required — only a sincere commitment to daily practice and learning.",
  },
  {
    q: "Who teaches the 200-hour yoga teacher training at Yogmandu?",
    a: "The program is led by Dr. Chintamani Gautam (PhD Yogic Science, E-RYT 500) and supported by senior faculty including Yogi Arjun Rakhal and Dr. Dipika. Dr. Gautam has trained 3,000+ teachers from 50+ countries.",
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
    { "@type": "ListItem", position: 2, name: "Yoga Teacher Training", item: "https://yogmandu.com/yoga-teacher-training" },
  ],
};

const curriculum = [
  {
    title: "Techniques & Practice",
    color: "#6B2D8B",
    items: [
      "Prayer & mantra chanting",
      "Sukshma vyayama & asanas",
      "Pranayama, bandha & shatkarma",
      "Mudras, yoga nidra & meditation",
      "Alignment & safety guidelines",
    ],
  },
  {
    title: "Teaching Methodology",
    color: "#F7941D",
    items: [
      "Group dynamics & time management",
      "Demonstration principles",
      "Verbal cueing & observation",
      "Correction techniques",
      "Teacher qualities & ethics",
    ],
  },
  {
    title: "Anatomy & Physiology",
    color: "#8DC63F",
    items: [
      "Human body systems",
      "Bones, joints & muscles",
      "Spiritual anatomy: chakras & nadis",
      "Kundalini & pancha kosha",
      "Yoga therapy foundations",
    ],
  },
  {
    title: "Philosophy & Ethics",
    color: "#6B2D8B",
    items: [
      "History of yoga",
      "Patanjali Yoga Sutras",
      "Karma, bhakti & jnana yoga",
      "Mantra yoga & Sanskrit",
      "Ashtanga — the eight limbs",
    ],
  },
];

const dailySchedule = [
  { time: "6:30 – 7:45 AM",  activity: "Shatkarma, Mantra Chanting, Pranayama" },
  { time: "7:45 – 8:00 AM",  activity: "Tea Break" },
  { time: "8:00 – 9:30 AM",  activity: "Asana Practice" },
  { time: "9:30 – 10:30 AM", activity: "Breakfast" },
  { time: "10:30 – 1:00 PM", activity: "Lectures" },
  { time: "1:00 – 2:00 PM",  activity: "Lunch" },
  { time: "2:00 – 3:00 PM",  activity: "Self Study" },
  { time: "3:00 – 4:45 PM",  activity: "Workshop / Lab Session" },
  { time: "4:45 – 5:00 PM",  activity: "Tea Break" },
  { time: "5:00 – 6:30 PM",  activity: "Asana / Meditation Practice" },
  { time: "6:30 – 7:30 PM",  activity: "Dinner" },
  { time: "7:30 – 9:30 PM",  activity: "Self Study" },
];

export default function YogaTeacherTrainingPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(courseSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      {/* Hero */}
      <section className="relative pt-36 pb-24 px-6 overflow-hidden" style={{ background: "#FFFFFF" }}>
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 60% 80% at 80% 20%, rgba(107,45,139,0.06) 0%, transparent 60%)" }} />

        {/* Centered logo */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 28 }}>
          <img src="/logo.png" alt="Yogmandu" width={160} height={64} fetchPriority="high" decoding="async" style={{ height: 64, width: "auto", objectFit: "contain" }} />
        </div>

        <div className="max-w-5xl mx-auto text-center">
          <p className="text-xs tracking-[0.3em] uppercase mb-6 font-medium" style={{ color: "#8DC63F" }}>
            Yoga Alliance RYS 200
          </p>
          <h1 className="text-5xl md:text-7xl font-light leading-[1.05] mb-8 max-w-3xl mx-auto"
            style={{ fontFamily: "Cormorant Garamond, serif", color: "#2A1208" }}>
            Become a certified yoga teacher in the{" "}
            <em style={{ color: "#6B2D8B" }}>heart of the Himalayas</em>
          </h1>
          <p className="text-lg leading-relaxed mb-10 max-w-xl mx-auto" style={{ color: "#4A2E1A", fontWeight: 400 }}>
            A 28-day immersive 200hr program in Kathmandu, Nepal. Yoga Alliance certified. Taught in the classical Hatha tradition by Dr. Chintamani Gautam and our senior faculty.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/book?service=ytt-200"
              className="cta-lift px-8 py-3.5 rounded-full font-medium text-sm text-white"
              style={{ background: "#6B2D8B", boxShadow: "0 6px 20px rgba(107,45,139,0.35)" }}>
              Reserve Your Spot
            </Link>
            <a href="https://wa.me/9779810263277" target="_blank" rel="noopener noreferrer"
              className="cta-lift px-8 py-3.5 rounded-full font-medium text-sm"
              style={{ border: "1.5px solid #6B2D8B", color: "#6B2D8B" }}>
              Ask on WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* Stats strip */}
      <div className="py-10 px-6" style={{ background: "#6B2D8B" }}>
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { value: "28 Days",  label: "Program Duration" },
            { value: "RYT 200",  label: "Yoga Alliance Certified" },
            { value: "English",  label: "Language of Instruction" },
            { value: "2018",     label: "Teaching Since" },
          ].map(s => (
            <div key={s.value} className="stat-3d"
              style={{
                padding: "1.25rem 0.5rem", borderRadius: "1rem",
                background: "rgba(255,255,255,0.07)",
                border: "1px solid rgba(255,255,255,0.14)",
                backdropFilter: "blur(6px)",
                cursor: "default",
              }}>
              <div className="stat-num text-3xl font-light text-white mb-1"
                style={{ fontFamily: "Cormorant Garamond, serif", color: "#F7941D" }}>{s.value}</div>
              <div className="text-xs tracking-widest uppercase" style={{ color: "rgba(255,255,255,0.75)", fontWeight: 500 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Pricing — 3D interactive section */}
      <PricingSection />

      {/* 2026 Dates */}
      <section className="py-16 px-6" style={{ background: "#F9F5FF" }}>
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-xs tracking-[0.3em] uppercase mb-4 font-medium" style={{ color: "#6B2D8B" }}>Plan Ahead</p>
          <h2 className="text-3xl font-light mb-3" style={{ fontFamily: "Cormorant Garamond, serif", color: "#2A1208" }}>
            Choose Your Intake Month
          </h2>
          <p className="text-sm mb-10" style={{ color: "#7A5840" }}>
            Tap a month to reserve your place — each cohort is limited to 12 students.
          </p>
          <IntakeMonths />
          <p className="text-sm mt-6" style={{ color: "#7A5840" }}>Secure your place with a USD 200 deposit · Full balance due on arrival</p>
        </div>
      </section>

      {/* Curriculum */}
      <section className="py-24 px-6" style={{ background: "#FFFFFF" }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs tracking-[0.3em] uppercase mb-4 font-medium" style={{ color: "#F7941D" }}>What You Will Learn</p>
            <h2 className="text-4xl md:text-5xl font-light" style={{ fontFamily: "Cormorant Garamond, serif", color: "#2A1208" }}>
              The curriculum
            </h2>
            <div className="section-divider mt-6" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {curriculum.map(block => (
              <div key={block.title} className="lift-3d rounded-2xl p-8 relative overflow-hidden"
                style={{
                  background: `linear-gradient(135deg, ${block.color}0C 0%, #F9F5FF 80%)`,
                  borderLeft: `3px solid ${block.color}`,
                  border: `1.5px solid ${block.color}22`,
                  borderLeftWidth: 3,
                  boxShadow: `0 6px 22px ${block.color}10`,
                }}>
                <div style={{
                  position: "absolute", top: -30, right: -30, width: 110, height: 110, borderRadius: "50%",
                  background: `radial-gradient(circle, ${block.color}22 0%, transparent 70%)`, pointerEvents: "none",
                }} />
                <div className="flex items-center gap-3 mb-4 relative">
                  <span style={{
                    width: 6, height: 6, borderRadius: "50%", background: block.color,
                    boxShadow: `0 0 10px ${block.color}`,
                  }} />
                  <p className="text-xs tracking-[0.25em] uppercase font-semibold" style={{ color: block.color }}>{block.title}</p>
                </div>
                <ul className="space-y-2 relative">
                  {block.items.map(item => (
                    <li key={item} className="text-sm flex items-start gap-2" style={{ color: "#3D2515" }}>
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0"
                        style={{ background: block.color, boxShadow: `0 0 6px ${block.color}80` }} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Daily Schedule */}
      <section className="py-20 px-6" style={{ background: "#F9F5FF" }}>
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs tracking-[0.3em] uppercase mb-4 font-medium" style={{ color: "#6B2D8B" }}>Residential Program</p>
            <h2 className="text-3xl font-light" style={{ fontFamily: "Cormorant Garamond, serif", color: "#2A1208" }}>A typical day</h2>
          </div>
          <div style={{ border: "1px solid rgba(107,45,139,0.12)", borderRadius: "1.25rem", overflow: "hidden", background: "#FFFFFF" }}>
            {dailySchedule.map((row, i) => (
              <div key={row.time} style={{
                display: "flex", alignItems: "center", gap: 16,
                padding: "0.85rem 1.5rem",
                borderBottom: i < dailySchedule.length - 1 ? "1px solid rgba(107,45,139,0.07)" : "none",
                background: i % 2 === 0 ? "#FFFFFF" : "rgba(107,45,139,0.02)",
              }}>
                <span style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "0.95rem",
                  color: "#6B2D8B", minWidth: 130, flexShrink: 0 }}>{row.time}</span>
                <span style={{ fontSize: "0.88rem", color: "#4A2E1A" }}>{row.activity}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Graduation & Cancellation */}
      <section className="py-20 px-6" style={{ background: "#FFFFFF" }}>
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <h3 className="text-2xl font-light mb-4" style={{ fontFamily: "Cormorant Garamond, serif", color: "#2A1208" }}>Graduation</h3>
            <p className="text-sm leading-relaxed mb-4" style={{ color: "#4A2E1A" }}>
              All graduates receive an internationally recognised Yoga Alliance RYT 200 certificate and can register as Registered Yoga Teachers.
            </p>
            <ul className="space-y-2 text-sm" style={{ color: "#4A2E1A" }}>
              {["Certificate presentation ceremony","108 Sun Salutations (optional)","Traditional Fire Ceremony (Hawan)"].map(i => (
                <li key={i} className="flex items-start gap-2">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: "#8DC63F" }} />{i}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-2xl font-light mb-4" style={{ fontFamily: "Cormorant Garamond, serif", color: "#2A1208" }}>Cancellation Policy</h3>
            <div style={{ border: "1px solid rgba(42,18,8,0.08)", borderRadius: "0.75rem", overflow: "hidden" }}>
              {[
                { when: "Week 1 cancellation", refund: "50% refund" },
                { when: "Week 2 cancellation", refund: "40% refund" },
                { when: "Week 3 cancellation", refund: "25% refund" },
                { when: "Week 4+ cancellation", refund: "No refund" },
              ].map((r, i) => (
                <div key={r.when} style={{
                  display: "flex", justifyContent: "space-between", padding: "0.75rem 1.25rem",
                  borderBottom: i < 3 ? "1px solid rgba(42,18,8,0.06)" : "none",
                  background: i % 2 === 0 ? "#FFFFFF" : "rgba(42,18,8,0.015)",
                }}>
                  <span style={{ fontSize: "0.85rem", color: "#4A2E1A" }}>{r.when}</span>
                  <span style={{ fontSize: "0.85rem", fontWeight: 500,
                    color: r.refund === "No refund" ? "#CC3333" : "#5A7A20" }}>{r.refund}</span>
                </div>
              ))}
            </div>
            <p className="text-xs mt-3" style={{ color: "#9A7860" }}>USD 200 deposit is non-refundable but transferable within the same year.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 px-6" style={{ background: "#FFFFFF" }}>
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs tracking-[0.3em] uppercase mb-4 font-medium" style={{ color: "#6B2D8B" }}>Questions</p>
            <h2 className="text-4xl md:text-5xl font-light" style={{ fontFamily: "Cormorant Garamond, serif", color: "#2A1208" }}>
              Frequently asked
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
          <h2 className="text-4xl font-light mb-4" style={{ fontFamily: "Cormorant Garamond, serif", color: "#2A1208" }}>Ready to begin?</h2>
          <p className="text-lg mb-10" style={{ color: "#4A2E1A", fontWeight: 400 }}>
            Cohorts fill quickly. Secure your place with a USD 200 deposit and our team will be in touch within 24 hours.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/book?service=ytt-200"
              className="cta-lift px-10 py-4 rounded-full text-white font-medium"
              style={{ background: "#6B2D8B" }}>Reserve Your Spot</Link>
            <Link href="/sound-healing-therapy"
              className="cta-lift px-10 py-4 rounded-full font-medium"
              style={{ border: "1.5px solid #F7941D", color: "#F7941D" }}>Also explore Sound Healing →</Link>
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
