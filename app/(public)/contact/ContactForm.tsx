"use client";
import { useState } from "react";
import type { FormEvent } from "react";

const programs = [
  "200hr Yoga Teacher Training",
  "300hr Advanced Teacher Training",
  "Sound Healing Session",
  "Sound Healing Certification",
  "General Inquiry",
];

export default function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", program: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/contact", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong. Please try again.");
      } else {
        setSubmitted(true);
      }
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* Hero */}
      <section className="pt-36 pb-16 px-6" style={{ background: "#FFFFFF" }}>
        <div className="max-w-5xl mx-auto">
          <p className="text-xs tracking-[0.3em] uppercase mb-6" style={{ color: "#8DC63F" }}>Reach Out</p>
          <h1 className="text-5xl md:text-7xl font-light leading-[1.05] mb-6"
            style={{ fontFamily: "Cormorant Garamond, serif", color: "#2A1208" }}>
            Let's begin the
            <br />
            <em style={{ color: "#F7941D" }}>conversation</em>
          </h1>
          <p className="text-base font-light max-w-lg" style={{ color: "#5C3D2E" }}>
            Every journey starts with a question. Whether you're ready to book or still exploring, we reply within 24 hours.
          </p>
        </div>
      </section>

      <section className="pb-28 px-6" style={{ background: "#FFFFFF" }}>
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-12">
          {/* Contact info */}
          <div className="md:col-span-2 space-y-8">
            {[
              {
                label: "WhatsApp / Phone",
                value: "+977-9862909469",
                sub: "+977-9810263277 · Fastest response, usually within 2 hours",
                color: "#8DC63F",
                href: "https://wa.me/9779862909469",
                icon: (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="#8DC63F">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
                  </svg>
                ),
              },
              {
                label: "Email",
                value: "info@yogmandu.com",
                sub: "For detailed enquiries and documents",
                color: "#F7941D",
                href: "mailto:info@yogmandu.com",
                icon: (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F7941D" strokeWidth="1.5">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                ),
              },
              {
                label: "Location",
                value: "Miteri Marg, Mid-Baneshwor-31",
                sub: "Kathmandu, Nepal — near Baneshwor Chowk",
                color: "#6B2D8B",
                href: "https://maps.google.com/?q=Mid-Baneshwor+Kathmandu+Nepal",
                icon: (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6B2D8B" strokeWidth="1.5">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                    <circle cx="12" cy="10" r="3"/>
                  </svg>
                ),
              },
            ].map(item => (
              <a key={item.label} href={item.href} target="_blank" rel="noopener noreferrer"
                className="card-light flex gap-4 items-start p-6 block transition-colors group">
                <div className="w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center"
                  style={{ background: `${item.color}15`, border: `1px solid ${item.color}25` }}>
                  {item.icon}
                </div>
                <div>
                  <p className="text-xs tracking-wide uppercase font-light mb-1" style={{ color: item.color }}>{item.label}</p>
                  <p className="text-sm font-light" style={{ color: "#2A1208" }}>{item.value}</p>
                  <p className="text-xs font-light mt-0.5" style={{ color: "#7A5840" }}>{item.sub}</p>
                </div>
              </a>
            ))}
          </div>

          {/* Form */}
          <div className="md:col-span-3">
            {submitted ? (
              <div className="card-light p-12 text-center h-full flex flex-col items-center justify-center">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mb-6"
                  style={{ background: "rgba(141,198,63,0.12)", border: "1px solid rgba(141,198,63,0.2)" }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#8DC63F" strokeWidth="1.5">
                    <path d="M20 6 9 17l-5-5"/>
                  </svg>
                </div>
                <h3 className="text-3xl font-light mb-3" style={{ fontFamily: "Cormorant Garamond, serif", color: "#2A1208" }}>
                  Message received
                </h3>
                <p className="text-sm font-light" style={{ color: "#5C3D2E" }}>
                  We'll be in touch within 24 hours. Namaste 🙏
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="card-light p-8 space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs tracking-widest uppercase font-light mb-2" style={{ color: "#7A5840" }}>Your Name</label>
                    <input required type="text" value={form.name}
                      onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl text-sm font-light outline-none transition-all duration-200"
                      style={{ background: "#FAF6F0", border: "1px solid rgba(107,45,139,0.15)", color: "#2A1208" }}
                      placeholder="Ramesh Sharma" />
                  </div>
                  <div>
                    <label className="block text-xs tracking-widest uppercase font-light mb-2" style={{ color: "#7A5840" }}>Email Address</label>
                    <input required type="email" value={form.email}
                      onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl text-sm font-light outline-none transition-all duration-200"
                      style={{ background: "#FAF6F0", border: "1px solid rgba(107,45,139,0.15)", color: "#2A1208" }}
                      placeholder="you@email.com" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs tracking-widest uppercase font-light mb-2" style={{ color: "#7A5840" }}>Interested In</label>
                  <select value={form.program} onChange={e => setForm(f => ({ ...f, program: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl text-sm font-light outline-none appearance-none"
                    style={{ background: "#FAF6F0", border: "1px solid rgba(107,45,139,0.15)", color: form.program ? "#2A1208" : "#9A7860" }}>
                    <option value="" style={{ background: "#E8DDD4" }}>Select a program…</option>
                    {programs.map(p => <option key={p} value={p} style={{ background: "#E8DDD4" }}>{p}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-xs tracking-widest uppercase font-light mb-2" style={{ color: "#7A5840" }}>Your Message</label>
                  <textarea required rows={5} value={form.message}
                    onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl text-sm font-light outline-none resize-none"
                    style={{ background: "#FAF6F0", border: "1px solid rgba(107,45,139,0.15)", color: "#2A1208" }}
                    placeholder="Tell us a little about where you are in your practice and what you're looking for…" />
                </div>

                {error && (
                  <div style={{ background: "rgba(220,38,38,0.07)", border: "1px solid rgba(220,38,38,0.2)", borderRadius: 12, padding: "10px 16px", fontSize: 13, color: "#b91c1c" }}>
                    {error}
                  </div>
                )}

                <button type="submit" disabled={loading} className="cta-lift w-full py-3.5 rounded-full font-medium text-sm"
                  style={{ background: loading ? "rgba(247,148,29,0.55)" : "#F7941D", color: "#FFFFFF", cursor: loading ? "not-allowed" : "pointer" }}>
                  {loading ? "Sending…" : "Send Message"}
                </button>

                <p className="text-xs text-center font-light" style={{ color: "#7A5840" }}>
                  Prefer instant reply? Message us directly on{" "}
                  <a href="https://wa.me/9779862909469" className="underline" style={{ color: "#8DC63F" }}>WhatsApp</a>
                </p>
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
