import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { join } from "path";

const DATA_DIR = join(process.cwd(), "data");
const CONFIG_PATH = join(DATA_DIR, "site-config.json");

export const defaultNavConfig = {
  services: [
    { href: "/class-schedule",        label: "Class Schedule",          icon: "🗓", desc: "Weekly yoga class timetable" },
    { href: "/yoga-teacher-training", label: "200hr Teacher Training",  icon: "🧘", desc: "Yoga Alliance RYS 200 certified" },
    { href: "/yoga-teacher-training", label: "300hr Advanced Training", icon: "⭐", desc: "Yoga Alliance RYS 300 certified" },
    { href: "/sound-healing-therapy", label: "Sound Healing Sessions",  icon: "🎵", desc: "Individual & group sessions" },
    { href: "/sound-healing-therapy", label: "Sound Healing Cert.",     icon: "📜", desc: "Become a certified practitioner" },
  ],
  leftLinks: [
    { href: "/about",   label: "About" },
    { href: "/gallery", label: "Gallery" },
  ],
  rightLinks: [
    { href: "/blog",    label: "Blog" },
    { href: "/contact", label: "Contact" },
  ],
  youtubeUrl:    "https://www.youtube.com/@yogmandu",
  tagline:       "Yoga & Sound Healing · Nepal",
  bookNowLabel:  "Book Now",
  bookNowHref:   "/contact",
};

export const defaultFooterConfig = {
  tagline:     "Nepal is calling.",
  taglineEm:   "Are you ready?",
  description: "Yoga Alliance certified teacher training & authentic Tibetan Sound Healing in Kathmandu, Nepal. Transforming practitioners since 2018.",
  programs: [
    { href: "/class-schedule",        label: "Class Schedule" },
    { href: "/yoga-teacher-training", label: "200hr Teacher Training" },
    { href: "/yoga-teacher-training", label: "300hr Advanced Training" },
    { href: "/sound-healing-therapy", label: "Sound Healing Sessions" },
    { href: "/sound-healing-therapy", label: "Sound Healing Cert." },
  ],
  company: [
    { href: "/about",   label: "About Us" },
    { href: "/gallery", label: "Gallery" },
    { href: "/blog",    label: "Blog" },
    { href: "/contact", label: "Contact" },
  ],
  contact: [
    { icon: "📍", text: "Miteri Marg, Mid-Baneshwor-31, Kathmandu, Nepal" },
    { icon: "📞", text: "+977-9810263277" },
    { icon: "✉️", text: "info@yogmandu.com" },
    { icon: "🕐", text: "Sun–Fri · 5:30–18:30" },
  ],
  youtubeUrl:   "https://www.youtube.com/@yogmandu",
  instagramUrl: "https://instagram.com/yogmandu",
  facebookUrl:  "https://facebook.com/yogmandu",
  whatsappUrl:  "https://wa.me/9779810263277",
  badge:        "Yoga Alliance RYS 200 & 300 · Kathmandu, Nepal",
  ctaTagline:   "Begin your journey",
};

export function readSiteConfig() {
  try {
    if (existsSync(CONFIG_PATH)) {
      return JSON.parse(readFileSync(CONFIG_PATH, "utf-8"));
    }
  } catch {}
  return { nav: defaultNavConfig, footer: defaultFooterConfig };
}

export function writeSiteConfig(config: object) {
  try {
    if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });
    writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2), "utf-8");
    return true;
  } catch {
    return false;
  }
}
