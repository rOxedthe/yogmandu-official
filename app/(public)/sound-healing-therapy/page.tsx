import type { Metadata } from "next";
import SingingBowl from "@/components/SingingBowlClient";

export const metadata: Metadata = {
  title: { absolute: "Sound Healing & Tibetan Singing Bowls | Yogmandu Nepal" },
  description:
    "Tibetan singing bowl sound healing therapy in Kathmandu with Yogmandu — relaxing sessions plus sound healing teacher training. Book a session today.",
  keywords: [
    "sound healing Kathmandu",
    "Tibetan singing bowl therapy Nepal",
    "sound healing session Nepal",
    "singing bowl Kathmandu",
    "sound healing certification Nepal",
    "chakra healing Kathmandu",
    "sound bath Nepal",
    "Himalayan bowl therapy",
    "yoga sound healing Nepal",
  ],
  alternates: { canonical: "https://yogmandu.com/sound-healing-therapy" },
  openGraph: {
    title: "Sound Healing Therapy Nepal — Tibetan Singing Bowls | Yogmandu",
    description: "Authentic Tibetan singing bowl sessions in Kathmandu. Individual USD 20 · Group USD 10/person · Level I & II certification. Book on WhatsApp.",
    url: "https://yogmandu.com/sound-healing-therapy",
    images: ["/opengraph-image.png"],
  },
  twitter: {
    title: "Sound Healing Therapy Nepal — Tibetan Singing Bowls | Yogmandu",
    description: "Authentic Tibetan singing bowl sessions in Kathmandu. Individual USD 20 · Group USD 10/person · Level I & II certification.",
  },
};

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Sound Healing Therapy",
  description: "Authentic Tibetan singing bowl sound healing sessions in Kathmandu, Nepal. Individual, group, and certification courses available.",
  provider: { "@type": "Organization", name: "Yogmandu", url: "https://yogmandu.com" },
  areaServed: { "@type": "City", name: "Kathmandu" },
  serviceType: "Sound Healing Therapy",
  offers: [
    { "@type": "Offer", name: "Individual Session", priceCurrency: "USD", price: "20", description: "90-minute personal Tibetan singing bowl session." },
    { "@type": "Offer", name: "Group Sound Bath", priceCurrency: "USD", price: "10", description: "90-minute group session, minimum 5 participants." },
    { "@type": "Offer", name: "3-Session Package", priceCurrency: "USD", price: "55", description: "Three individual sessions at a discounted rate." },
  ],
};

// Single source of truth: the visible FAQ section below and the FAQPage
// structured data are both generated from this array, so they can never drift
// apart (Google requires FAQ markup to match content visible on the page).
const faqs = [
  {
    q: "What is a Tibetan singing bowl sound healing session?",
    a: "A sound healing session uses hand-hammered Tibetan singing bowls placed on and around the body. The resonating frequencies promote deep relaxation, stress relief, and energetic balance. Sessions typically last 90 minutes.",
  },
  {
    q: "How much does a sound healing session cost at Yogmandu?",
    a: "Individual sessions are USD 20 (NPR 2,000). Group sessions are USD 10 per person with a minimum of 5 participants. A 3-session package is available for USD 55.",
  },
  {
    q: "Do I need experience for a sound healing session?",
    a: "No experience is needed. Sessions are suitable for complete beginners, yoga practitioners, and anyone seeking stress relief or energetic balance. Simply arrive, lie down, and allow the sound to do the work.",
  },
  {
    q: "Can I become a certified sound healing practitioner at Yogmandu?",
    a: "Yes. Yogmandu offers Level I (Foundational, 20 hours) and Level II (Advanced) sound healing certification courses with internationally recognised certificates.",
  },
  {
    q: "How do I book a sound healing session in Kathmandu?",
    a: "All sessions require pre-booking. Contact us via WhatsApp at +977-9810263277 or email info@yogmandu.com. We are located at Miteri Marg, Mid-Baneshwor-31, Kathmandu.",
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
    { "@type": "ListItem", position: 2, name: "Sound Healing Therapy", item: "https://yogmandu.com/sound-healing-therapy" },
  ],
};

const sessions = [
  {
    title: "Individual Session",
    duration: "90 min",
    price: "USD 20",
    priceSub: "NPR 2,000 · Pre-booking required",
    package: "3-session package: USD 55 / NPR 5,500",
    desc: "A deeply personal one-on-one Tibetan singing bowl session customised to your individual energy and wellness needs. Scheduled at your convenience.",
    color: "#F7941D",
  },
  {
    title: "Group Sound Healing",
    duration: "90 min",
    price: "USD 10 / person",
    priceSub: "NPR 1,000 per person · Min. 5 participants",
    package: "Pre-booking mandatory",
    desc: "A collective sound bath experience. Deeply relaxing — many participants report profound states of stillness, chakra balancing and stress relief.",
    color: "#6B2D8B",
  },
];

const certLevels = [
  {
    level:   "Level I",
    badge:   "Foundational",
    color:   "#8DC63F",
    icon:    "🌱",
    duration: "20 hours",
    summary: "The foundation for working with Tibetan singing bowls — history, tradition, and practical technique.",
    learn: [
      "Origin & lineage of Himalayan bowls",
      "Types of bowls, mallets & how to read a bowl",
      "Proper placement on and around the body",
      "Basic session structure & timing",
      "Self-practice for the practitioner",
    ],
  },
  {
    level:   "Level II",
    badge:   "Advanced",
    color:   "#6B2D8B",
    icon:    "✨",
    duration: "Extended program",
    summary: "Deepen into professional facilitation — chakra mapping, advanced techniques, and client work.",
    learn: [
      "Chakra system & precise bowl-to-chakra mapping",
      "Designing custom sessions for client needs",
      "Working with anxiety, PTSD & trauma-informed boundaries",
      "Combining sound with breathwork & meditation",
      "Building a sound-healing practice (ethics & business)",
    ],
  },
];

export default function SoundHealingPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      {/* Hero */}
      <section
        className="relative pt-36 pb-24 px-6 overflow-hidden"
        style={{ background: "#FFFFFF" }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 70% 60% at 30% 60%, rgba(247,148,29,0.05) 0%, transparent 60%)",
          }}
        />
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-xs tracking-[0.3em] uppercase mb-6" style={{ color: "#F7941D" }}>
              Ancient Himalayan Practice
            </p>
            <h1
              className="text-5xl md:text-6xl font-light leading-[1.05] mb-8"
              style={{ fontFamily: "Cormorant Garamond, serif", color: "#2A1208" }}
            >
              Let sound dissolve
              <br />
              <em style={{ color: "#F7941D" }}>what words cannot reach</em>
            </h1>
            <p className="text-lg font-light leading-relaxed mb-10" style={{ color: "#555", maxWidth: "440px" }}>
              Tibetan singing bowl therapy, practiced in the Himalayas for centuries. Each session
              works through vibration to release tension, calm the nervous system, and restore
              inner equilibrium.
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href="/book?service=sound"
                className="cta-lift px-8 py-3.5 rounded-full font-medium text-sm text-white"
                style={{ background: "#A65808" }}
              >
                Book a Session
              </a>
              <a
                href="https://wa.me/9779810263277"
                target="_blank"
                rel="noopener noreferrer"
                className="cta-lift px-8 py-3.5 rounded-full font-medium text-sm"
                style={{ border: "1.5px solid #6B2D8B", color: "#6B2D8B" }}
              >
                Ask on WhatsApp
              </a>
            </div>
          </div>

          {/* Bowl */}
          <div className="flex flex-col items-center">
            <div className="relative w-full max-w-xs h-72 animate-pulse-glow rounded-full">
              <SingingBowl />
            </div>
            <p
              className="mt-4 text-xs tracking-[0.25em] uppercase font-light"
              style={{ color: "#F7941D", opacity: 0.5 }}
            >
              Touch the bowl to hear it
            </p>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 px-6" style={{ background: "#F9F5FF" }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs tracking-[0.3em] uppercase mb-4" style={{ color: "#6B2D8B" }}>
              The Science
            </p>
            <h2
              className="text-4xl md:text-5xl font-light"
              style={{ fontFamily: "Cormorant Garamond, serif", color: "#2A1208" }}
            >
              How sound heals
            </h2>
            <div className="section-divider mt-6" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Resonance",
                body: "The bowls produce frequencies that match and gently shift the brain's own oscillation — from beta (active) toward theta (deep rest).",
                color: "#F7941D",
              },
              {
                step: "02",
                title: "Vibration",
                body: "Sound waves travel through the water in your body, releasing tension held in tissue at a cellular level, where talk therapy cannot reach.",
                color: "#6B2D8B",
              },
              {
                step: "03",
                title: "Integration",
                body: "The silence after sound is equally important. In that stillness, the nervous system resets, and the body begins to remember its natural state of ease.",
                color: "#8DC63F",
              },
            ].map((item) => (
              <div key={item.step} className="step-3d text-center">
                {/* Corner glow */}
                <div style={{
                  position: "absolute", top: -30, right: -30, width: 110, height: 110, borderRadius: "50%",
                  background: `radial-gradient(circle, ${item.color}22 0%, transparent 70%)`,
                  pointerEvents: "none",
                }} />
                <div style={{
                  position: "absolute", bottom: -40, left: -40, width: 130, height: 130, borderRadius: "50%",
                  background: `radial-gradient(circle, ${item.color}12 0%, transparent 70%)`,
                  pointerEvents: "none",
                }} />

                <div className="step-num mb-4"
                  style={{
                    fontFamily: "Cormorant Garamond, serif",
                    fontSize: "3rem", fontWeight: 300, lineHeight: 1,
                    background: `linear-gradient(135deg, ${item.color}, ${item.color}88)`,
                    WebkitBackgroundClip: "text",
                    backgroundClip: "text",
                    color: "transparent",
                    opacity: 0.85,
                    position: "relative",
                  }}>
                  {item.step}
                </div>
                {/* Gradient bar */}
                <div style={{
                  width: 40, height: 2, margin: "0 auto 16px",
                  background: `linear-gradient(90deg, transparent, ${item.color}, transparent)`,
                }} />
                <h3
                  className="text-2xl font-light mb-3 relative"
                  style={{ fontFamily: "Cormorant Garamond, serif", color: "#2A1208" }}
                >
                  {item.title}
                </h3>
                <p className="text-sm font-light leading-relaxed relative" style={{ color: "#4A2E1A" }}>
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-24 px-6 relative overflow-hidden" style={{ background: "#FFFFFF" }}>
        <div className="absolute inset-0 pointer-events-none" style={{
          background: "radial-gradient(ellipse 60% 50% at 50% 30%, rgba(107,45,139,0.05) 0%, transparent 65%)",
        }} />
        <div className="max-w-6xl mx-auto relative">
          <div className="text-center mb-16">
            <p className="text-xs tracking-[0.3em] uppercase mb-4" style={{ color: "#8DC63F" }}>
              Why People Come
            </p>
            <h2 className="text-4xl md:text-5xl font-light"
              style={{ fontFamily: "Cormorant Garamond, serif", color: "#2A1208" }}>
              The body remembers
            </h2>
            <div className="section-divider mt-6" />
            <p className="mt-6 text-sm font-light max-w-xl mx-auto" style={{ color: "#666" }}>
              Sound healing supports the body and mind in many quiet ways. These are the most common shifts our students notice.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {[
              { label: "Stress & Anxiety Relief",  color: "#6B2D8B" },
              { label: "Emotional Release",        color: "#F7941D" },
              { label: "Improved Attention Span",  color: "#8DC63F" },
              { label: "Physical Healing",         color: "#6B2D8B" },
              { label: "Boost Brainwaves",         color: "#F7941D" },
              { label: "Pain Management",          color: "#8DC63F" },
              { label: "Less Chronic Pain",        color: "#6B2D8B" },
              { label: "Boost Confidence",         color: "#F7941D" },
              { label: "Immune System Support",    color: "#8DC63F" },
              { label: "Chakra Balancing",         color: "#6B2D8B" },
              { label: "Expand Consciousness",     color: "#F7941D" },
              { label: "Migraine & Headache Relief", color: "#8DC63F" },
              { label: "Weight Management",        color: "#6B2D8B" },
              { label: "Reduced Muscle Tension",   color: "#F7941D" },
              { label: "Increased Energy",         color: "#8DC63F" },
              { label: "Better Sleep",             color: "#6B2D8B" },
              { label: "Enhanced Mood",            color: "#F7941D" },
              { label: "Dementia Support",         color: "#8DC63F" },
              { label: "Deep Relaxation",          color: "#6B2D8B" },
              { label: "PTSD Support",             color: "#F7941D" },
            ].map((b, i) => (
              <div key={b.label}
                className="benefit-card relative rounded-xl px-4 py-4 text-center transition-all"
                style={{
                  background: "rgba(255,255,255,0.7)",
                  border: `1.5px solid ${b.color}22`,
                  animation: `floatUp 6s ease-in-out ${(i % 5) * 0.4}s infinite alternate`,
                }}>
                <div style={{
                  width: 32, height: 32, margin: "0 auto 10px", borderRadius: "50%",
                  background: `radial-gradient(circle, ${b.color}33 0%, transparent 70%)`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <div style={{
                    width: 8, height: 8, borderRadius: "50%", background: b.color, opacity: 0.7,
                  }} />
                </div>
                <p className="text-xs font-medium leading-snug" style={{ color: "#2A1208" }}>
                  {b.label}
                </p>
              </div>
            ))}
          </div>

          <style>{`
            @keyframes floatUp {
              from { transform: translateY(0); }
              to   { transform: translateY(-6px); }
            }
            .benefit-card:hover {
              transform: translateY(-3px) scale(1.03) !important;
              box-shadow: 0 12px 28px rgba(42,18,8,0.10);
            }
          `}</style>
        </div>
      </section>

      {/* Sessions */}
      <section id="sessions" className="py-24 px-6 scroll-mt-24" style={{ background: "#FFFFFF" }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm tracking-[0.3em] uppercase mb-4" style={{ color: "#F7941D" }}>
              Choose Your Path
            </p>
            <h2
              className="text-4xl md:text-5xl font-light"
              style={{ fontFamily: "Cormorant Garamond, serif", color: "#2A1208" }}
            >
              Sessions &amp; Programs
            </h2>
            <div className="section-divider mt-6" />
            <p className="mt-6 text-base font-light max-w-xl mx-auto" style={{ color: "#4A2E1A" }}>
              One-on-one and group sessions. To become a certified practitioner, see the{" "}
              <a href="#certification" style={{ color: "#6B2D8B", textDecoration: "underline" }}>certification courses</a> below.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {sessions.map((s) => (
              <div
                key={s.title}
                className="lift-3d rounded-3xl p-8 flex flex-col"
                style={{ background: "#FFFFFF", borderTop: `3px solid ${s.color}`, border: `1.5px solid ${s.color}20`, borderTopWidth: 3 }}
              >
                <div className="mb-5">
                  <h3 className="text-2xl font-light mb-1"
                    style={{ fontFamily: "Cormorant Garamond, serif", color: "#2A1208" }}>
                    {s.title}
                  </h3>
                  <span className="text-xs font-medium tracking-wide" style={{ color: "#7A5840" }}>
                    {s.duration}
                  </span>
                </div>
                {/* Price */}
                <div className="mb-5">
                  <span className="text-2xl font-light" style={{ fontFamily: "Cormorant Garamond, serif", color: s.color }}>
                    {s.price}
                  </span>
                  <p className="text-xs mt-1" style={{ color: "#7A5840" }}>{s.priceSub}</p>
                  <p className="text-xs mt-1 font-medium" style={{ color: s.color }}>{s.package}</p>
                </div>
                <p className="text-sm leading-relaxed flex-1 mb-8" style={{ color: "#4A2E1A", fontWeight: 400 }}>
                  {s.desc}
                </p>
                <a href="/book?service=sound"
                  className="cta-lift text-center px-6 py-3 rounded-full text-sm font-medium text-white"
                  style={{ background: s.color }}>
                  Book This Session
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Certification */}
      <section id="certification" className="py-24 px-6 scroll-mt-24 relative overflow-hidden"
        style={{ background: "linear-gradient(180deg, #F9F5FF 0%, #FFF7E8 100%)" }}>
        <div className="absolute inset-0 pointer-events-none">
          <div style={{ position: "absolute", top: "10%", left: "8%", width: 360, height: 360, borderRadius: "50%",
            background: "radial-gradient(circle, rgba(107,45,139,0.10) 0%, transparent 70%)", filter: "blur(40px)" }} />
          <div style={{ position: "absolute", bottom: "10%", right: "8%", width: 320, height: 320, borderRadius: "50%",
            background: "radial-gradient(circle, rgba(141,198,63,0.10) 0%, transparent 70%)", filter: "blur(40px)" }} />
        </div>

        <div className="max-w-5xl mx-auto relative">
          <div className="text-center mb-16">
            <p className="text-sm tracking-[0.3em] uppercase mb-4 font-medium" style={{ color: "#6B2D8B" }}>
              Become a Practitioner
            </p>
            <h2 className="text-4xl md:text-5xl font-light"
              style={{ fontFamily: "Cormorant Garamond, serif", color: "#2A1208" }}>
              Sound Healing <em style={{ color: "#6B2D8B" }}>Certification</em>
            </h2>
            <div className="section-divider mt-6" />
            <p className="mt-6 text-base font-light max-w-2xl mx-auto" style={{ color: "#4A2E1A" }}>
              Two levels — Foundational and Advanced. Internationally recognised certificates upon completion.
              Train with experienced and international certified Sound Healing Trainers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {certLevels.map((lvl) => (
              <div key={lvl.level}
                className="lift-3d rounded-3xl p-8 relative overflow-hidden"
                style={{
                  background: "#FFFFFF",
                  border: `1.5px solid ${lvl.color}33`,
                  borderTop: `3px solid ${lvl.color}`,
                  boxShadow: `0 6px 22px ${lvl.color}14`,
                }}>
                <div style={{
                  position: "absolute", top: -40, right: -40, width: 140, height: 140, borderRadius: "50%",
                  background: `radial-gradient(circle, ${lvl.color}26 0%, transparent 70%)`, pointerEvents: "none",
                }} />
                <div style={{
                  position: "absolute", bottom: -50, left: -50, width: 160, height: 160, borderRadius: "50%",
                  background: `radial-gradient(circle, ${lvl.color}14 0%, transparent 70%)`, pointerEvents: "none",
                }} />

                <div className="flex items-start justify-between mb-5 relative">
                  <div style={{
                    width: 60, height: 60, borderRadius: 16,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "1.75rem",
                    background: `linear-gradient(135deg, ${lvl.color}28, ${lvl.color}08)`,
                    border: `1.5px solid ${lvl.color}55`,
                    boxShadow: `0 6px 18px ${lvl.color}33, inset 0 1px 0 rgba(255,255,255,0.7)`,
                  }}>
                    <span style={{ filter: "drop-shadow(0 1.5px 1px rgba(0,0,0,0.20))" }}>{lvl.icon}</span>
                  </div>
                  <span style={{
                    fontSize: "0.85rem", letterSpacing: "0.22em", textTransform: "uppercase", fontWeight: 600,
                    color: "#fff", background: lvl.color,
                    padding: "5px 12px", borderRadius: 99,
                    boxShadow: `0 6px 16px ${lvl.color}55`,
                  }}>{lvl.badge}</span>
                </div>

                <h3 className="text-3xl font-light mb-2 relative"
                  style={{ fontFamily: "Cormorant Garamond, serif", color: "#2A1208" }}>
                  {lvl.level}
                </h3>
                <p className="text-sm font-medium mb-4 relative" style={{ color: lvl.color, letterSpacing: "0.06em" }}>
                  {lvl.duration}
                </p>
                <p className="text-base font-light leading-relaxed mb-6 relative" style={{ color: "#3D2515" }}>
                  {lvl.summary}
                </p>

                <p className="text-xs tracking-[0.18em] uppercase font-semibold mb-3 relative" style={{ color: lvl.color }}>
                  What you'll learn
                </p>
                <ul className="space-y-2.5 mb-7 relative">
                  {lvl.learn.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm" style={{ color: "#3D2515" }}>
                      <span style={{
                        marginTop: 4,
                        width: 18, height: 18, borderRadius: "50%", flexShrink: 0,
                        display: "inline-flex", alignItems: "center", justifyContent: "center",
                        background: `linear-gradient(135deg, ${lvl.color}28, ${lvl.color}10)`,
                        border: `1px solid ${lvl.color}55`,
                        fontSize: 11, color: lvl.color, fontWeight: 700,
                        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.5)",
                      }}>✓</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                <a href="/book?service=sound"
                  className="cta-lift svc-cta block text-center px-6 py-3 rounded-full text-sm font-medium text-white relative"
                  style={{
                    background: `linear-gradient(135deg, ${lvl.color}, ${lvl.color}d0)`,
                    boxShadow: `0 10px 26px ${lvl.color}55`,
                  }}>
                  Apply for {lvl.level} →
                </a>
              </div>
            ))}
          </div>

          <p className="text-center mt-12 text-sm font-light" style={{ color: "#6B5240" }}>
            Course schedules are flexible — message us on{" "}
            <a href="https://wa.me/9779810263277" style={{ color: "#6B2D8B", textDecoration: "underline" }}>WhatsApp</a>{" "}
            with your preferred dates and Level.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 px-6" style={{ background: "#FFFFFF" }}>
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs tracking-[0.3em] uppercase mb-4 font-medium" style={{ color: "#F7941D" }}>Questions</p>
            <h2 className="text-4xl md:text-5xl font-light" style={{ fontFamily: "Cormorant Garamond, serif", color: "#2A1208" }}>
              Frequently asked
            </h2>
            <div className="section-divider mt-6" />
          </div>
          <div className="space-y-3">
            {faqs.map((f) => (
              <details key={f.q} className="faq-item rounded-2xl"
                style={{ background: "#F9F5FF", border: "1px solid rgba(247,148,29,0.18)" }}>
                <summary className="flex items-center justify-between gap-4 cursor-pointer list-none px-6 py-5">
                  <span className="text-base font-medium" style={{ color: "#2A1208" }}>{f.q}</span>
                  <span className="faq-mark flex-shrink-0 text-xl font-light leading-none" style={{ color: "#F7941D" }}>+</span>
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
    </>
  );
}
