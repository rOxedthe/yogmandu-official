import { Resend } from "resend";

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL     = process.env.EMAIL_FROM     || "Yogmandu <no-reply@yogmandu.com>";
const NOTIFY_EMAIL   = process.env.EMAIL_NOTIFY   || "info@yogmandu.com";
const SITE_URL       = process.env.NEXT_PUBLIC_SITE_URL || "https://yogmandu.com";

export const isEmailConfigured = Boolean(RESEND_API_KEY);

let _resend: Resend | null = null;
function getClient(): Resend {
  if (!RESEND_API_KEY) throw new Error("RESEND_API_KEY not configured.");
  if (!_resend) _resend = new Resend(RESEND_API_KEY);
  return _resend;
}

async function send(opts: {
  to:      string | string[];
  subject: string;
  html:    string;
  text:    string;
  replyTo?: string;
}): Promise<{ ok: boolean; error?: string }> {
  if (!isEmailConfigured) {
    console.warn("[email] skipped (RESEND_API_KEY not set):", opts.subject);
    return { ok: false, error: "email-not-configured" };
  }
  try {
    const resend = getClient();
    const { error } = await resend.emails.send({
      from:    FROM_EMAIL,
      to:      opts.to,
      subject: opts.subject,
      html:    opts.html,
      text:    opts.text,
      replyTo: opts.replyTo,
    });
    if (error) {
      console.error("[email] resend error:", error);
      return { ok: false, error: error.message };
    }
    return { ok: true };
  } catch (err) {
    console.error("[email] threw:", err);
    return { ok: false, error: err instanceof Error ? err.message : "unknown" };
  }
}

// ─── HTML template wrapper ──────────────────────────────────────────────────
function wrap(opts: { preheader?: string; title: string; bodyHtml: string; ctaHref?: string; ctaLabel?: string }): string {
  const preheader = opts.preheader
    ? `<div style="display:none;max-height:0;overflow:hidden;font-size:1px;line-height:1px;color:#fff;opacity:0">${opts.preheader}</div>`
    : "";
  const cta = opts.ctaHref && opts.ctaLabel
    ? `<table role="presentation" cellspacing="0" cellpadding="0" style="margin:32px 0">
         <tr>
           <td style="background:#F7941D;border-radius:999px">
             <a href="${opts.ctaHref}" style="display:inline-block;padding:14px 32px;color:#ffffff;text-decoration:none;font-weight:500;font-size:15px;font-family:'DM Sans',Arial,sans-serif">
               ${opts.ctaLabel}
             </a>
           </td>
         </tr>
       </table>`
    : "";

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width" />
<title>${opts.title}</title>
</head>
<body style="margin:0;padding:0;background:#FAF6F0;font-family:'DM Sans',Arial,sans-serif;color:#2A1208">
${preheader}
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#FAF6F0;padding:40px 0">
  <tr>
    <td align="center">
      <table role="presentation" width="560" cellspacing="0" cellpadding="0" style="max-width:560px;width:100%;background:#FFFFFF;border-radius:16px;overflow:hidden;box-shadow:0 4px 32px rgba(107,45,139,0.08)">
        <tr>
          <td style="padding:36px 40px 0">
            <div style="display:inline-block;background:linear-gradient(135deg,#6B2D8B,#F7941D);width:48px;height:48px;border-radius:50%;line-height:48px;text-align:center;color:#fff;font-size:22px;font-weight:600;font-family:Georgia,serif">Y</div>
            <h1 style="font-family:'Cormorant Garamond',Georgia,serif;font-size:26px;font-weight:500;color:#2A1208;margin:24px 0 8px;line-height:1.2">${opts.title}</h1>
          </td>
        </tr>
        <tr>
          <td style="padding:8px 40px 40px;color:#4A2E1A;font-size:15px;line-height:1.7">
            ${opts.bodyHtml}
            ${cta}
          </td>
        </tr>
        <tr>
          <td style="padding:24px 40px;border-top:1px solid #f0e8f8;background:#fafafa;color:#9A7860;font-size:12px;line-height:1.6">
            <strong style="color:#6B2D8B">Yogmandu</strong> · Miteri Marg, Mid-Baneshwor-31, Kathmandu, Nepal<br />
            <a href="${SITE_URL}" style="color:#6B2D8B;text-decoration:none">yogmandu.com</a> · <a href="mailto:info@yogmandu.com" style="color:#6B2D8B;text-decoration:none">info@yogmandu.com</a>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
</body>
</html>`;
}

// ─── Public senders ─────────────────────────────────────────────────────────

export function sendWelcomeEmail(opts: { to: string; fullName: string; verifyUrl?: string }) {
  const greeting = opts.fullName.split(" ")[0] || "there";
  const verifyBlock = opts.verifyUrl
    ? `<p style="margin:0 0 12px">To get started, please confirm your email address:</p>`
    : "";
  return send({
    to: opts.to,
    subject: "Welcome to Yogmandu",
    html: wrap({
      title: `Welcome, ${greeting} 🙏`,
      preheader: "Your Yogmandu account is ready.",
      bodyHtml: `
        <p style="margin:0 0 16px">Namaste ${greeting},</p>
        <p style="margin:0 0 16px">Your Yogmandu account is ready. We're delighted to have you with us.</p>
        ${verifyBlock}
        <p style="margin:0 0 16px">From here you can explore our class schedule, learn about our Yoga Alliance certified 200hr and 300hr teacher training, and book Tibetan sound-healing sessions.</p>
        <p style="margin:0">Questions? Just reply to this email or <a href="https://wa.me/9779862909469" style="color:#6B2D8B">message us on WhatsApp</a>.</p>
      `,
      ctaHref: opts.verifyUrl || `${SITE_URL}/account`,
      ctaLabel: opts.verifyUrl ? "Verify email address" : "Go to your account",
    }),
    text:
      `Namaste ${greeting},\n\n` +
      `Your Yogmandu account is ready.\n\n` +
      (opts.verifyUrl ? `Please confirm your email: ${opts.verifyUrl}\n\n` : `Visit your account: ${SITE_URL}/account\n\n`) +
      `Questions? Reply here or message us on WhatsApp: https://wa.me/9779862909469\n\n` +
      `— Yogmandu, Kathmandu, Nepal`,
  });
}

export function sendVerifyEmail(opts: { to: string; fullName: string; verifyUrl: string }) {
  const greeting = opts.fullName.split(" ")[0] || "there";
  return send({
    to: opts.to,
    subject: "Confirm your Yogmandu email",
    html: wrap({
      title: "Confirm your email",
      preheader: "Tap the button to verify your email address.",
      bodyHtml: `
        <p style="margin:0 0 16px">Hi ${greeting},</p>
        <p style="margin:0 0 16px">Please confirm this is your email address so we can keep your account secure and send you important updates.</p>
        <p style="margin:0 0 8px;color:#9A7860;font-size:13px">This link expires in 24 hours. If you didn't create an account, you can ignore this email.</p>
      `,
      ctaHref: opts.verifyUrl,
      ctaLabel: "Verify email",
    }),
    text:
      `Hi ${greeting},\n\n` +
      `Please confirm your email by opening this link:\n${opts.verifyUrl}\n\n` +
      `This link expires in 24 hours.\n\nIf you didn't create an account, ignore this email.\n\n— Yogmandu`,
  });
}

export function sendPasswordResetEmail(opts: { to: string; fullName: string; resetUrl: string }) {
  const greeting = opts.fullName?.split(" ")[0] || "there";
  return send({
    to: opts.to,
    subject: "Reset your Yogmandu password",
    html: wrap({
      title: "Reset your password",
      preheader: "Use the button below to set a new password.",
      bodyHtml: `
        <p style="margin:0 0 16px">Hi ${greeting},</p>
        <p style="margin:0 0 16px">We received a request to reset the password on your Yogmandu account. Use the button below to choose a new one.</p>
        <p style="margin:0 0 8px;color:#9A7860;font-size:13px">This link expires in 1 hour and can only be used once. If you didn't request this, you can safely ignore this email — your password won't change.</p>
      `,
      ctaHref: opts.resetUrl,
      ctaLabel: "Set new password",
    }),
    text:
      `Hi ${greeting},\n\n` +
      `Reset your Yogmandu password using this link (expires in 1 hour):\n${opts.resetUrl}\n\n` +
      `If you didn't request this, ignore this email — your password won't change.\n\n— Yogmandu`,
  });
}

export function sendContactAck(opts: { to: string; name: string; program: string; message: string }) {
  const greeting = opts.name.split(" ")[0] || "there";
  return send({
    to: opts.to,
    subject: "We received your message — Yogmandu",
    html: wrap({
      title: "Thank you for reaching out",
      preheader: "We'll reply within 24 hours.",
      bodyHtml: `
        <p style="margin:0 0 16px">Namaste ${greeting},</p>
        <p style="margin:0 0 16px">Thank you for getting in touch with Yogmandu. We've received your message and will reply within 24 hours.</p>
        ${opts.program ? `<p style="margin:0 0 8px;color:#9A7860;font-size:13px">Interested in: <strong style="color:#6B2D8B">${escapeHtml(opts.program)}</strong></p>` : ""}
        <div style="margin:16px 0;padding:14px 18px;background:#FAF6F0;border-left:3px solid #F7941D;border-radius:8px;font-size:14px;color:#5C3D2E;white-space:pre-wrap">${escapeHtml(opts.message)}</div>
        <p style="margin:0">Need a faster reply? Message us directly on <a href="https://wa.me/9779862909469" style="color:#6B2D8B">WhatsApp</a>.</p>
      `,
    }),
    text:
      `Namaste ${greeting},\n\n` +
      `Thank you for getting in touch. We'll reply within 24 hours.\n\n` +
      (opts.program ? `Interested in: ${opts.program}\n\n` : "") +
      `Your message:\n${opts.message}\n\n` +
      `Faster reply: https://wa.me/9779862909469\n\n— Yogmandu`,
  });
}

export function sendContactNotify(opts: { name: string; email: string; program: string; message: string }) {
  return send({
    to: NOTIFY_EMAIL,
    replyTo: opts.email,
    subject: `New enquiry · ${opts.program || "General"} · ${opts.name}`,
    html: wrap({
      title: "New website enquiry",
      preheader: `${opts.name} — ${opts.program || "General Inquiry"}`,
      bodyHtml: `
        <p style="margin:0 0 4px;color:#9A7860;font-size:13px;text-transform:uppercase;letter-spacing:0.1em">From</p>
        <p style="margin:0 0 16px;font-size:15px"><strong>${escapeHtml(opts.name)}</strong><br /><a href="mailto:${opts.email}" style="color:#6B2D8B">${escapeHtml(opts.email)}</a></p>

        <p style="margin:0 0 4px;color:#9A7860;font-size:13px;text-transform:uppercase;letter-spacing:0.1em">Program</p>
        <p style="margin:0 0 16px;font-size:15px">${escapeHtml(opts.program || "—")}</p>

        <p style="margin:0 0 4px;color:#9A7860;font-size:13px;text-transform:uppercase;letter-spacing:0.1em">Message</p>
        <div style="padding:14px 18px;background:#FAF6F0;border-left:3px solid #F7941D;border-radius:8px;font-size:14px;color:#2A1208;white-space:pre-wrap">${escapeHtml(opts.message)}</div>
      `,
      ctaHref: `mailto:${opts.email}`,
      ctaLabel: "Reply by email",
    }),
    text:
      `New website enquiry\n\n` +
      `From: ${opts.name} <${opts.email}>\n` +
      `Program: ${opts.program || "—"}\n\n` +
      `Message:\n${opts.message}\n`,
  });
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
