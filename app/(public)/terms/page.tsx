import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Terms and conditions for using the Yogmandu website, booking classes, and registering for teacher training and sound healing programmes.",
  alternates: { canonical: "https://yogmandu.com/terms" },
  robots: { index: true, follow: true },
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home",  item: "https://yogmandu.com" },
    { "@type": "ListItem", position: 2, name: "Terms", item: "https://yogmandu.com/terms" },
  ],
};

const LAST_UPDATED = "May 2026";

export default function TermsPage() {
  return (
    <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
    <main className="pt-32 pb-24 px-6" style={{ background: "#FFFFFF" }}>
      <article className="max-w-3xl mx-auto">
        <p className="text-xs tracking-[0.3em] uppercase mb-6" style={{ color: "#8DC63F" }}>
          Legal
        </p>
        <h1
          className="text-5xl md:text-6xl font-light leading-[1.05] mb-4"
          style={{ fontFamily: "Cormorant Garamond, serif", color: "#2A1208" }}
        >
          Terms of <em style={{ color: "#F7941D" }}>Service</em>
        </h1>
        <p className="text-sm mb-12" style={{ color: "#7A5840" }}>Last updated: {LAST_UPDATED}</p>

        <div className="space-y-8" style={{ color: "#4A2E1A", lineHeight: 1.75 }}>
          <Section title="1. Agreement">
            By accessing yogmandu.com, creating an account or booking any of our programmes, you agree
            to these Terms of Service and to our{" "}
            <Link href="/privacy" style={linkStyle}>Privacy Policy</Link>. If you do not agree, please
            do not use the site or our services.
          </Section>

          <Section title="2. Who we are">
            Yogmandu is a yoga teacher-training and sound-healing centre based at Miteri Marg,
            Mid-Baneshwor-31, Kathmandu, Nepal, operating under the laws of Nepal.
          </Section>

          <Section title="3. Accounts">
            <ul style={listStyle}>
              <li>You must be at least 16 years old to create an account.</li>
              <li>You are responsible for keeping your password secure and for all activity under your account.</li>
              <li>You must provide accurate, current and complete information.</li>
              <li>You may delete your account at any time by emailing <a href="mailto:info@yogmandu.com" style={linkStyle}>info@yogmandu.com</a>.</li>
              <li>We may suspend or terminate accounts that violate these terms.</li>
            </ul>
          </Section>

          <Section title="4. Bookings, payments and refunds">
            <ul style={listStyle}>
              <li>Class, programme and session prices are listed on the relevant page or quoted on request.</li>
              <li>Payments are confirmed only when full payment has been received.</li>
              <li><strong>Teacher Training cancellations</strong>: refunds (less a non-refundable deposit) are available up to 30 days before the start date. No refunds within 30 days, but credit toward a future cohort may be issued at our discretion.</li>
              <li><strong>Single classes and sound-healing sessions</strong>: free cancellation up to 12 hours before; no refund within 12 hours.</li>
              <li>Force-majeure events (illness, natural disaster, government restrictions) are handled case-by-case.</li>
            </ul>
          </Section>

          <Section title="5. Health and safety">
            Yoga and sound healing involve physical and energetic practice. By participating you confirm:
            <ul style={listStyle}>
              <li>You are physically capable of participating, or have consulted a doctor.</li>
              <li>You will disclose any relevant medical conditions, injuries or pregnancy before practice.</li>
              <li>You participate voluntarily and at your own risk.</li>
              <li>Yogmandu, its teachers and staff are not liable for injury resulting from your participation, except where caused by our gross negligence.</li>
            </ul>
            We strongly recommend obtaining travel and medical insurance before attending residential
            programmes in Nepal.
          </Section>

          <Section title="6. Yoga Alliance certification">
            Our 200hr and 300hr programmes are Registered Yoga Schools (RYS) with Yoga Alliance.
            Successful completion entitles you to register as an RYT 200 / RYT 500 directly with Yoga
            Alliance. Yogmandu does not issue Yoga Alliance certificates — that is between you and
            Yoga Alliance after we confirm your completion.
          </Section>

          <Section title="7. Intellectual property">
            All content on yogmandu.com — text, photos, videos, course materials, logos — is owned by
            Yogmandu or our licensors and is protected by copyright. You may not copy, distribute,
            reproduce or create derivative works without our written permission, except for personal,
            non-commercial use.
          </Section>

          <Section title="8. User content">
            If you upload content (avatar, bio, reviews), you grant us a non-exclusive, worldwide,
            royalty-free licence to display that content on the site for the purpose of running the
            service. You retain ownership. You must not upload content that is unlawful, defamatory,
            obscene, infringing, or harmful.
          </Section>

          <Section title="9. Acceptable use">
            You agree not to:
            <ul style={listStyle}>
              <li>Use the site for any unlawful purpose.</li>
              <li>Attempt to gain unauthorised access, probe security or scrape data.</li>
              <li>Send spam, malware or automated traffic.</li>
              <li>Impersonate another person or misrepresent your affiliation.</li>
              <li>Interfere with other users' enjoyment of the service.</li>
            </ul>
          </Section>

          <Section title="10. Disclaimers">
            The site is provided "as is" without warranties of any kind. We do not guarantee that the
            site will be uninterrupted, error-free or secure. Yoga and sound-healing information on the
            site is for educational purposes only and is not medical advice.
          </Section>

          <Section title="11. Limitation of liability">
            To the maximum extent permitted by law, Yogmandu's total liability arising out of or in
            connection with these terms shall not exceed the amount you paid us for the relevant
            programme. We are not liable for indirect, incidental, consequential or punitive damages.
          </Section>

          <Section title="12. Governing law">
            These terms are governed by the laws of Nepal. Any disputes will be resolved by the courts
            of Kathmandu, Nepal, unless mandatory consumer-protection laws of your country apply.
          </Section>

          <Section title="13. Changes">
            We may update these terms from time to time. Material changes will be announced on this page
            and, where relevant, by email. Continued use of the service after changes are posted
            constitutes acceptance.
          </Section>

          <Section title="14. Contact">
            Questions about these terms? Reach us at:
            <div style={{ marginTop: 12, padding: "16px 20px", background: "#FAF6F0", borderRadius: 12 }}>
              <strong>Yogmandu</strong><br />
              Miteri Marg, Mid-Baneshwor-31, Kathmandu, Nepal<br />
              <a href="mailto:info@yogmandu.com" style={linkStyle}>info@yogmandu.com</a><br />
              +977-9862909469
            </div>
          </Section>
        </div>

        <div className="mt-16 pt-8" style={{ borderTop: "1px solid rgba(107,45,139,0.1)" }}>
          <Link href="/privacy" style={{ color: "#6B2D8B", fontSize: 14, marginRight: 24 }}>
            Read our Privacy Policy →
          </Link>
          <Link href="/contact" style={{ color: "#6B2D8B", fontSize: 14 }}>
            Contact us →
          </Link>
        </div>
      </article>
    </main>
    </>
  );
}

const linkStyle: React.CSSProperties = {
  color: "#6B2D8B",
  textDecoration: "underline",
  textDecorationColor: "rgba(107,45,139,0.3)",
};

const listStyle: React.CSSProperties = {
  marginTop: 12,
  marginBottom: 0,
  paddingLeft: 20,
  display: "flex",
  flexDirection: "column",
  gap: 6,
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2
        className="text-2xl font-light mb-3"
        style={{ fontFamily: "Cormorant Garamond, serif", color: "#2A1208" }}
      >
        {title}
      </h2>
      <div style={{ fontSize: 15, color: "#4A2E1A" }}>{children}</div>
    </section>
  );
}
