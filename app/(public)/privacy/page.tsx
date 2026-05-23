import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Yogmandu collects, uses and protects your personal data. Read our full privacy policy.",
  alternates: { canonical: "https://yogmandu.com/privacy" },
  robots: { index: true, follow: true },
};

const LAST_UPDATED = "May 2026";

export default function PrivacyPolicyPage() {
  return (
    <main className="pt-32 pb-24 px-6" style={{ background: "#FFFFFF" }}>
      <article className="max-w-3xl mx-auto">
        <p className="text-xs tracking-[0.3em] uppercase mb-6" style={{ color: "#8DC63F" }}>
          Legal
        </p>
        <h1
          className="text-5xl md:text-6xl font-light leading-[1.05] mb-4"
          style={{ fontFamily: "Cormorant Garamond, serif", color: "#2A1208" }}
        >
          Privacy <em style={{ color: "#F7941D" }}>Policy</em>
        </h1>
        <p className="text-sm mb-12" style={{ color: "#7A5840" }}>Last updated: {LAST_UPDATED}</p>

        <div className="prose-yogmandu space-y-8" style={{ color: "#4A2E1A", lineHeight: 1.75 }}>
          <Section title="1. Who we are">
            Yogmandu (“we”, “us”, “our”) is a yoga teacher-training and sound-healing centre located at
            Miteri Marg, Mid-Baneshwor-31, Kathmandu, Nepal. We can be reached at{" "}
            <a href="mailto:info@yogmandu.com" style={linkStyle}>info@yogmandu.com</a>.
          </Section>

          <Section title="2. What we collect">
            <ul style={listStyle}>
              <li><strong>Account information</strong> — name, email, phone, nationality, yoga experience level, profile photo, bio.</li>
              <li><strong>Contact submissions</strong> — name, email, message, program of interest.</li>
              <li><strong>Authentication data</strong> — encrypted password hash and session cookie.</li>
              <li><strong>Usage data</strong> — anonymised page views, device, country and browser via Google Analytics 4.</li>
              <li><strong>Technical data</strong> — IP address (hashed before storage) for spam-prevention and rate-limiting.</li>
            </ul>
          </Section>

          <Section title="3. Why we collect it">
            <ul style={listStyle}>
              <li>To create and manage your student account.</li>
              <li>To respond to your enquiries and to send programme information you request.</li>
              <li>To improve our website, content and programmes.</li>
              <li>To protect the site against fraud, abuse and automated attacks.</li>
              <li>To comply with our legal obligations under Nepali and applicable international law.</li>
            </ul>
          </Section>

          <Section title="4. How long we keep it">
            Account data is retained while your account is active. Contact-form submissions are retained
            for up to 24 months. Analytics data is retained for 14 months. You can request deletion of your
            account and associated personal data at any time by emailing{" "}
            <a href="mailto:info@yogmandu.com" style={linkStyle}>info@yogmandu.com</a>.
          </Section>

          <Section title="5. Who we share it with">
            We do not sell your personal data. We share it only with:
            <ul style={listStyle}>
              <li><strong>Supabase</strong> — our database and storage provider (EU/US data centres).</li>
              <li><strong>Google Analytics</strong> — for anonymised usage metrics.</li>
              <li><strong>Cloudflare</strong> — for hosting, content delivery and security.</li>
              <li><strong>Resend</strong> — for transactional email delivery.</li>
              <li><strong>Law enforcement</strong> — only when legally compelled.</li>
            </ul>
          </Section>

          <Section title="6. Cookies">
            We use the following cookies:
            <ul style={listStyle}>
              <li><code>yogmandu_user_session</code> — required for login. Expires after 7 days.</li>
              <li><code>yogmandu_admin_session</code> — admin authentication only.</li>
              <li>Google Analytics cookies (<code>_ga</code>, <code>_ga_*</code>) — anonymised traffic measurement. You can opt out via your browser settings or by installing the Google Analytics Opt-Out add-on.</li>
            </ul>
          </Section>

          <Section title="7. Your rights">
            Under GDPR, UK GDPR, CCPA and equivalent regulations you have the right to:
            <ul style={listStyle}>
              <li>Access the personal data we hold about you.</li>
              <li>Correct or update inaccurate data.</li>
              <li>Request deletion of your data ("right to be forgotten").</li>
              <li>Export your data in a machine-readable format.</li>
              <li>Object to or restrict processing.</li>
              <li>Withdraw consent at any time.</li>
            </ul>
            To exercise any of these rights, email{" "}
            <a href="mailto:info@yogmandu.com" style={linkStyle}>info@yogmandu.com</a>. We respond within 30 days.
          </Section>

          <Section title="8. Security">
            Passwords are hashed with scrypt (16-byte salt, 64-byte key). Sessions are HMAC-signed and
            transmitted over HTTPS with secure, http-only cookies. All connections are encrypted in
            transit (TLS 1.2+). Despite our efforts, no method of transmission over the internet is
            100% secure — please use a strong, unique password.
          </Section>

          <Section title="9. Children">
            Our services are not directed at children under 16. We do not knowingly collect data from
            anyone under 16. If you believe a child has provided us data, contact us and we will delete it.
          </Section>

          <Section title="10. International transfers">
            Our service providers may store data outside Nepal, including in the EU, UK and US.
            Where applicable, transfers are protected by Standard Contractual Clauses or equivalent
            safeguards.
          </Section>

          <Section title="11. Changes to this policy">
            We may update this policy from time to time. Material changes will be announced on this page
            and, where relevant, by email. The “Last updated” date at the top reflects the current version.
          </Section>

          <Section title="12. Contact">
            For any privacy-related question, contact us at:
            <div style={{ marginTop: 12, padding: "16px 20px", background: "#FAF6F0", borderRadius: 12 }}>
              <strong>Yogmandu</strong><br />
              Miteri Marg, Mid-Baneshwor-31, Kathmandu, Nepal<br />
              <a href="mailto:info@yogmandu.com" style={linkStyle}>info@yogmandu.com</a><br />
              +977-9862909469
            </div>
          </Section>
        </div>

        <div className="mt-16 pt-8" style={{ borderTop: "1px solid rgba(107,45,139,0.1)" }}>
          <Link href="/terms" style={{ color: "#6B2D8B", fontSize: 14, marginRight: 24 }}>
            Read our Terms of Service →
          </Link>
          <Link href="/contact" style={{ color: "#6B2D8B", fontSize: 14 }}>
            Contact us →
          </Link>
        </div>
      </article>
    </main>
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
