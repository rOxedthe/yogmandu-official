"use client";

import React, { useEffect, useMemo, useReducer, useState } from "react";
import {
  Activity,
  Archive,
  BarChart3,
  Bell,
  BookOpen,
  CalendarDays,
  Camera,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock,
  Copy,
  Download,
  Edit3,
  Eye,
  FileText,
  Globe2,
  Image,
  LayoutDashboard,
  Link,
  ListFilter,
  Menu,
  Plus,
  RefreshCw,
  Save,
  Search,
  Settings,
  ShieldCheck,
  Sparkles,
  Trash2,
  Upload,
  Users,
  X,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const STORAGE_KEY = "yogmandu-admin-state-v2";
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const SESSION_TYPES = ["Class", "Workshop", "Retreat", "Drop-in", "Online"];
const LEVELS = ["All Levels", "Beginner", "Intermediate", "Advanced"];
const STATUSES = ["Draft", "Published", "Scheduled", "Archived"];
const SESSION_STATUSES = ["Active", "Paused", "Full", "Cancelled", "Upcoming", "Archived"];
const STYLES = ["Vinyasa", "Hatha", "Ashtanga", "Yin", "Restorative", "Pranayama", "Meditation", "Sound Healing"];
const COLORS = ["#059669", "#0f766e", "#d97706", "#7c3aed", "#64748b"];

function seededRandom(seed) {
  let value = seed;
  return () => {
    value = (value * 9301 + 49297) % 233280;
    return value / 233280;
  };
}

function uid(prefix = "id") {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function toMoney(value) {
  if (!value) return "Free";
  return `NPR ${Number(value).toLocaleString()}`;
}

function readTime(body) {
  return Math.max(1, Math.ceil((body || "").trim().split(/\s+/).filter(Boolean).length / 200));
}

function scoreSeo(page, allPages = []) {
  let score = 0;
  const title = page.seoTitle || page.title || "";
  const description = page.metaDescription || page.excerpt || page.description || "";
  if (title && title.length <= 60) score += 20;
  if (description && description.length <= 160) score += 20;
  if (page.ogImage || page.featuredImage) score += 15;
  if (page.schemaJson && isValidJson(page.schemaJson)) score += 15;
  if (page.canonical) score += 10;
  if (page.robotsIndex === "index" && page.robotsFollow === "follow") score += 10;
  const duplicates = allPages.filter((item) => (item.seoTitle || item.title) === title);
  if (title && duplicates.length <= 1) score += 10;
  return Math.min(100, score);
}

function isValidJson(value) {
  try {
    JSON.parse(value || "{}");
    return true;
  } catch {
    return false;
  }
}

function makeSeo(route, title, description, schemaType = "LocalBusiness") {
  return {
    id: uid("seo"),
    pageName: title.replace(" | Yogmandu", ""),
    route,
    title,
    seoTitle: title,
    metaDescription: description,
    canonical: `https://yogmandu.com${route === "/" ? "" : route}`,
    robotsIndex: "index",
    robotsFollow: "follow",
    ogTitle: title,
    ogDescription: description,
    ogImage: "https://images.unsplash.com/photo-1545389336-cf090694435e?w=1200&auto=format&fit=crop",
    ogType: "website",
    twitterCard: "summary_large_image",
    twitterTitle: title,
    twitterDescription: description,
    twitterImage: "https://images.unsplash.com/photo-1545389336-cf090694435e?w=1200&auto=format&fit=crop",
    schemaType,
    schemaJson: JSON.stringify({ "@context": "https://schema.org", "@type": schemaType, name: "Yogmandu", url: `https://yogmandu.com${route}` }, null, 2),
    customHeadTags: "",
    sitemapPriority: 0.8,
    changeFrequency: "weekly",
    updatedAt: new Date().toISOString().slice(0, 10),
  };
}

const initialInstructors = [
  {
    id: "inst-chintamani",
    name: "Dr. Chintamani Gautam",
    photo: "",
    bio: "Founder & President of Yogmandu. PhD in Yogic Science, E-RYT 500. Has trained over 3,000 teachers from 50+ countries since 2015. Expert in Tibetan singing bowl sound healing and classical yoga lineage.",
    specialties: ["Hatha", "Meditation", "Sound Healing", "Pranayama"],
    certifications: "PhD Yogic Science, E-RYT 500, Yoga Alliance USA, Yoga Alliance International (Australia)",
    years: 20,
    social: { instagram: "@yogmandu", facebook: "yogmandu", website: "https://yogmandu.com" },
    status: "Active",
  },
  {
    id: "inst-arjun",
    name: "Arjun Rakhal Magar",
    photo: "/images/teachers/arjun-rakhal-magar.jpg",
    bio: "Senior Yoga Teacher at Yogmandu specialising in Hatha, Vinyasa, and Ashtanga. Leads morning flows, intensive workshops, and teacher training practical sessions.",
    specialties: ["Hatha", "Vinyasa", "Ashtanga"],
    certifications: "RYT 500, Yoga Alliance Registered",
    years: 12,
    social: { instagram: "@yogmandu", facebook: "", website: "" },
    status: "Active",
  },
  {
    id: "inst-dipika",
    name: "Arjun Neupane",
    photo: "/images/teachers/arjun-neupane.jpg",
    bio: "Yoga Teacher at Yogmandu. Specialises in restorative yoga, Yin, Yoga Nidra, pranayama, and therapeutic applications of yoga for wellness and rehabilitation.",
    specialties: ["Yin", "Restorative", "Yoga Nidra", "Pranayama"],
    certifications: "Yoga Teacher, RYT 500",
    years: 10,
    social: { instagram: "@yogmandu", facebook: "", website: "" },
    status: "Active",
  },
];

const initialSessions = [
  {
    id: "session-morning-hatha",
    name: "Morning Hatha Flow",
    shortDescription: "An energising sunrise Hatha practice to build clarity, strength and steady breath.",
    fullDescription: "Start your day grounded. This 90-minute Hatha class moves through foundational postures with breath awareness, building heat and focus for the day ahead. Suitable for all levels.",
    type: "Class",
    styles: ["Hatha"],
    level: "All Levels",
    language: "Both",
    recurring: true,
    days: ["Mon", "Wed", "Fri"],
    date: "",
    startDate: "2026-05-01",
    endDate: "",
    startTime: "06:30",
    endTime: "08:00",
    duration: 90,
    instructorId: "inst-arjun",
    location: "In-studio",
    room: "Main Hall",
    meetingLink: "",
    capacity: 20,
    enrolled: 15,
    waitlist: false,
    waitlistCount: 0,
    pricingType: "Fixed Price",
    price: 800,
    trial: true,
    image: "https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=900&auto=format&fit=crop",
    gallery: [],
    video: "",
    status: "Active",
    homepage: true,
    featured: true,
    tags: ["morning", "hatha", "all-levels"],
    priority: 1,
    notes: "Open windows before class. Mats provided.",
    equipment: "Yoga mat, blocks and straps provided",
    prerequisites: "None",
    views: 3200,
  },
  {
    id: "session-pranayama-meditation",
    name: "Pranayama & Meditation",
    shortDescription: "Breathwork and seated meditation to calm the nervous system and centre the mind.",
    fullDescription: "A 60-minute practice of classical pranayama techniques (Nadi Shodhana, Kapalabhati, Bhramari) followed by guided meditation. Perfect before or after asana practice.",
    type: "Class",
    styles: ["Pranayama", "Meditation"],
    level: "All Levels",
    language: "Both",
    recurring: true,
    days: ["Mon", "Wed", "Thu"],
    date: "",
    startDate: "2026-05-01",
    endDate: "",
    startTime: "09:00",
    endTime: "10:00",
    duration: 60,
    instructorId: "inst-dipika",
    location: "In-studio",
    room: "Meditation Room",
    meetingLink: "",
    capacity: 20,
    enrolled: 14,
    waitlist: false,
    waitlistCount: 0,
    pricingType: "Fixed Price",
    price: 600,
    trial: false,
    image: "https://images.unsplash.com/photo-1474418397713-7ede21d49118?w=900&auto=format&fit=crop",
    gallery: [],
    video: "",
    status: "Active",
    homepage: false,
    featured: true,
    tags: ["breathwork", "meditation", "daily"],
    priority: 2,
    notes: "Keep cushions arranged in a circle.",
    equipment: "Meditation cushions provided",
    prerequisites: "None",
    views: 2100,
  },
  {
    id: "session-vinyasa",
    name: "Vinyasa Flow",
    shortDescription: "A dynamic flowing practice linking breath with movement.",
    fullDescription: "75-minute Vinyasa class for intermediate students. Builds heat through sun salutations and creative sequences, with emphasis on breath-to-movement coordination.",
    type: "Class",
    styles: ["Vinyasa"],
    level: "Intermediate",
    language: "Both",
    recurring: true,
    days: ["Mon", "Wed", "Fri"],
    date: "",
    startDate: "2026-05-01",
    endDate: "",
    startTime: "17:00",
    endTime: "18:15",
    duration: 75,
    instructorId: "inst-arjun",
    location: "In-studio",
    room: "Main Hall",
    meetingLink: "",
    capacity: 18,
    enrolled: 13,
    waitlist: false,
    waitlistCount: 0,
    pricingType: "Fixed Price",
    price: 800,
    trial: false,
    image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=900&auto=format&fit=crop",
    gallery: [],
    video: "",
    status: "Active",
    homepage: true,
    featured: true,
    tags: ["vinyasa", "flow", "intermediate"],
    priority: 3,
    notes: "",
    equipment: "Yoga mat provided",
    prerequisites: "Basic yoga experience recommended",
    views: 2650,
  },
  {
    id: "session-ashtanga",
    name: "Ashtanga Primary Series",
    shortDescription: "Traditional Ashtanga Vinyasa — primary series with full breath-led rhythm.",
    fullDescription: "90-minute guided Ashtanga Primary Series practice. Students work through the fixed sequence of postures with Ujjayi breath, bandhas and drishti. Builds strength, flexibility and focus.",
    type: "Class",
    styles: ["Ashtanga"],
    level: "Intermediate",
    language: "Both",
    recurring: true,
    days: ["Tue", "Thu"],
    date: "",
    startDate: "2026-05-01",
    endDate: "",
    startTime: "06:30",
    endTime: "08:00",
    duration: 90,
    instructorId: "inst-arjun",
    location: "In-studio",
    room: "Main Hall",
    meetingLink: "",
    capacity: 15,
    enrolled: 10,
    waitlist: false,
    waitlistCount: 0,
    pricingType: "Fixed Price",
    price: 800,
    trial: false,
    image: "https://images.unsplash.com/photo-1599447292180-45fd84092ef4?w=900&auto=format&fit=crop",
    gallery: [],
    video: "",
    status: "Active",
    homepage: false,
    featured: false,
    tags: ["ashtanga", "primary-series", "traditional"],
    priority: 4,
    notes: "",
    equipment: "Yoga mat provided",
    prerequisites: "Minimum 3 months yoga experience",
    views: 1850,
  },
  {
    id: "session-sound-healing",
    name: "Sound Healing Session",
    shortDescription: "Authentic Tibetan singing bowl therapy — deep vibration for stress relief and inner balance.",
    fullDescription: "60-minute individual or small-group Tibetan singing bowl session. Bowls placed on and around the body transmit healing frequencies through tissue and bone, releasing tension at a cellular level. NPR 2,000 / USD 20 per person (min 5 for group, NPR 1,000 pp).",
    type: "Class",
    styles: ["Sound Healing"],
    level: "All Levels",
    language: "Both",
    recurring: true,
    days: ["Tue", "Fri"],
    date: "",
    startDate: "2026-05-01",
    endDate: "",
    startTime: "10:00",
    endTime: "11:00",
    duration: 60,
    instructorId: "inst-chintamani",
    location: "In-studio",
    room: "Sound Healing Room",
    meetingLink: "",
    capacity: 10,
    enrolled: 6,
    waitlist: false,
    waitlistCount: 0,
    pricingType: "Fixed Price",
    price: 2000,
    trial: false,
    image: "https://images.unsplash.com/photo-1545389336-cf090694435e?w=900&auto=format&fit=crop",
    gallery: [],
    video: "",
    status: "Active",
    homepage: true,
    featured: true,
    tags: ["sound-healing", "tibetan-bowls", "stress-relief"],
    priority: 5,
    notes: "Pre-booking required. WhatsApp +977-9862909469.",
    equipment: "Tibetan singing bowls provided. Wear comfortable loose clothing.",
    prerequisites: "None",
    views: 3800,
  },
  {
    id: "session-yin",
    name: "Yin Yoga",
    shortDescription: "Long-held floor postures for deep connective tissue release and quiet integration.",
    fullDescription: "75-minute Yin Yoga class. Postures are held for 3–5 minutes, targeting fascia, ligaments and joints. Deeply restorative — suitable for all levels including those recovering from stress or injury.",
    type: "Class",
    styles: ["Yin"],
    level: "All Levels",
    language: "English",
    recurring: true,
    days: ["Tue"],
    date: "",
    startDate: "2026-05-01",
    endDate: "",
    startTime: "17:30",
    endTime: "18:45",
    duration: 75,
    instructorId: "inst-dipika",
    location: "In-studio",
    room: "Main Hall",
    meetingLink: "",
    capacity: 15,
    enrolled: 9,
    waitlist: false,
    waitlistCount: 0,
    pricingType: "Fixed Price",
    price: 800,
    trial: false,
    image: "https://images.unsplash.com/photo-1510894347713-fc3ed6fdf539?w=900&auto=format&fit=crop",
    gallery: [],
    video: "",
    status: "Active",
    homepage: false,
    featured: false,
    tags: ["yin", "restorative", "connective-tissue"],
    priority: 6,
    notes: "Bolsters and blankets provided.",
    equipment: "Bolsters, blankets, blocks provided",
    prerequisites: "None",
    views: 1900,
  },
  {
    id: "session-tibetan-bowl",
    name: "Tibetan Bowl Healing",
    shortDescription: "Extended group sound bath with multiple Tibetan bowls for deep chakra balancing.",
    fullDescription: "90-minute group Tibetan singing bowl healing session. Multiple bowls create a rich soundscape that guides participants into theta brainwave states, promoting deep rest, chakra alignment and stress release.",
    type: "Class",
    styles: ["Sound Healing"],
    level: "All Levels",
    language: "Both",
    recurring: true,
    days: ["Wed", "Sun"],
    date: "",
    startDate: "2026-05-01",
    endDate: "",
    startTime: "11:00",
    endTime: "12:30",
    duration: 90,
    instructorId: "inst-chintamani",
    location: "In-studio",
    room: "Sound Healing Room",
    meetingLink: "",
    capacity: 12,
    enrolled: 8,
    waitlist: false,
    waitlistCount: 0,
    pricingType: "Fixed Price",
    price: 1000,
    trial: false,
    image: "https://images.unsplash.com/photo-1545389336-cf090694435e?w=900&auto=format&fit=crop",
    gallery: [],
    video: "",
    status: "Active",
    homepage: false,
    featured: false,
    tags: ["sound-healing", "group", "chakra"],
    priority: 7,
    notes: "Pre-booking required. Min 5 participants for group rate.",
    equipment: "Tibetan bowls provided. Yoga mat optional.",
    prerequisites: "None",
    views: 2200,
  },
  {
    id: "session-restorative",
    name: "Restorative Yoga",
    shortDescription: "Supported postures and deep relaxation to restore the nervous system.",
    fullDescription: "60-minute restorative yoga class using props (bolsters, blankets, blocks) to fully support the body in passive postures. Ideal after a long week or as a regular recovery practice.",
    type: "Class",
    styles: ["Restorative"],
    level: "All Levels",
    language: "Both",
    recurring: true,
    days: ["Mon", "Fri"],
    date: "",
    startDate: "2026-05-01",
    endDate: "",
    startTime: "19:00",
    endTime: "20:00",
    duration: 60,
    instructorId: "inst-dipika",
    location: "In-studio",
    room: "Main Hall",
    meetingLink: "",
    capacity: 15,
    enrolled: 10,
    waitlist: false,
    waitlistCount: 0,
    pricingType: "Fixed Price",
    price: 700,
    trial: false,
    image: "https://images.unsplash.com/photo-1599447292180-45fd84092ef4?w=900&auto=format&fit=crop",
    gallery: [],
    video: "",
    status: "Active",
    homepage: false,
    featured: false,
    tags: ["restorative", "relaxation", "evening"],
    priority: 8,
    notes: "",
    equipment: "All props provided",
    prerequisites: "None",
    views: 1600,
  },
  {
    id: "session-weekend-ashtanga",
    name: "Weekend Ashtanga",
    shortDescription: "Two-hour Saturday morning Ashtanga practice for all levels.",
    fullDescription: "120-minute weekend Ashtanga class. Open to all levels — beginners receive foundational cues while experienced students can deepen their primary series. A full, unhurried practice with time for Q&A.",
    type: "Class",
    styles: ["Ashtanga"],
    level: "All Levels",
    language: "Both",
    recurring: true,
    days: ["Sat"],
    date: "",
    startDate: "2026-05-01",
    endDate: "",
    startTime: "07:00",
    endTime: "09:00",
    duration: 120,
    instructorId: "inst-arjun",
    location: "In-studio",
    room: "Main Hall",
    meetingLink: "",
    capacity: 20,
    enrolled: 14,
    waitlist: false,
    waitlistCount: 0,
    pricingType: "Fixed Price",
    price: 1000,
    trial: true,
    image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=900&auto=format&fit=crop",
    gallery: [],
    video: "",
    status: "Active",
    homepage: true,
    featured: true,
    tags: ["weekend", "ashtanga", "all-levels"],
    priority: 9,
    notes: "Popular — book ahead via WhatsApp.",
    equipment: "Yoga mat provided",
    prerequisites: "None",
    views: 2900,
  },
  {
    id: "session-group-sound-healing",
    name: "Group Sound Healing",
    shortDescription: "Saturday group sound bath — deep collective healing with Tibetan singing bowls.",
    fullDescription: "90-minute Saturday group sound healing session. USD 10 / NPR 1,000 per person (minimum 5 participants). Pre-booking mandatory. Experience profound stillness, chakra balancing and stress relief as a group.",
    type: "Class",
    styles: ["Sound Healing"],
    level: "All Levels",
    language: "Both",
    recurring: true,
    days: ["Sat"],
    date: "",
    startDate: "2026-05-01",
    endDate: "",
    startTime: "10:00",
    endTime: "11:30",
    duration: 90,
    instructorId: "inst-chintamani",
    location: "In-studio",
    room: "Sound Healing Room",
    meetingLink: "",
    capacity: 15,
    enrolled: 8,
    waitlist: false,
    waitlistCount: 0,
    pricingType: "Fixed Price",
    price: 1000,
    trial: false,
    image: "https://images.unsplash.com/photo-1545389336-cf090694435e?w=900&auto=format&fit=crop",
    gallery: [],
    video: "",
    status: "Active",
    homepage: false,
    featured: false,
    tags: ["sound-healing", "group", "saturday"],
    priority: 10,
    notes: "Min 5 participants. Pre-booking mandatory via WhatsApp +977-9862909469.",
    equipment: "Tibetan bowls, yoga mats provided",
    prerequisites: "None",
    views: 2400,
  },
  {
    id: "session-yoga-nidra",
    name: "Yoga Nidra",
    shortDescription: "Guided yogic sleep — the practice of conscious deep rest.",
    fullDescription: "45-minute Yoga Nidra (yogic sleep) session. Participants lie down in Savasana while being guided through systematic body scan, visualisation and intention-setting. Equivalent to 4 hours of sleep for the nervous system.",
    type: "Class",
    styles: ["Meditation"],
    level: "All Levels",
    language: "Both",
    recurring: true,
    days: ["Wed"],
    date: "",
    startDate: "2026-05-01",
    endDate: "",
    startTime: "19:00",
    endTime: "19:45",
    duration: 45,
    instructorId: "inst-dipika",
    location: "In-studio",
    room: "Meditation Room",
    meetingLink: "",
    capacity: 20,
    enrolled: 12,
    waitlist: false,
    waitlistCount: 0,
    pricingType: "Fixed Price",
    price: 500,
    trial: false,
    image: "https://images.unsplash.com/photo-1474418397713-7ede21d49118?w=900&auto=format&fit=crop",
    gallery: [],
    video: "",
    status: "Active",
    homepage: false,
    featured: false,
    tags: ["nidra", "relaxation", "sleep"],
    priority: 11,
    notes: "Blankets and eye pillows provided.",
    equipment: "Yoga mat, blanket, eye pillow provided",
    prerequisites: "None",
    views: 1750,
  },
];

const blogTopics = [
  ["Finding Stillness in Kathmandu", "Dr. Chintamani Gautam", "Yoga Philosophy", ["mindfulness", "kathmandu"], "Published", 4230],
  ["A Beginner Guide to Pranayama", "Dr. Dipika", "Breathwork", ["breath", "beginners"], "Published", 3880],
  ["Why Yin Yoga Supports Better Sleep", "Dr. Dipika", "Restorative", ["yin", "sleep"], "Published", 2760],
  ["Preparing for Your 200hr Yoga Teacher Training", "Dr. Chintamani Gautam", "Teacher Training", ["YTT", "200hr", "nepal"], "Draft", 920],
  ["Yoga Events in Kathmandu This Month", "Yogi Arjun Rakhal", "Community", ["events", "kathmandu"], "Scheduled", 1840],
  ["Sound Healing and Nervous-System Care", "Dr. Chintamani Gautam", "Sound Healing", ["sound", "healing", "tibetan-bowls"], "Published", 3310],
  ["Hatha Foundations for New Students", "Yogi Arjun Rakhal", "Practice", ["hatha", "alignment"], "Published", 1760],
  ["The Meaning of Daily Sadhana", "Dr. Chintamani Gautam", "Yoga Philosophy", ["sadhana", "routine"], "Published", 2010],
  ["Choosing Between Vinyasa and Ashtanga", "Yogi Arjun Rakhal", "Practice", ["vinyasa", "ashtanga"], "Draft", 1110],
];

function makeInitialState() {
  const pages = [
    makeSeo("/", "Home | Yogmandu", "Yoga Alliance certified teacher training, sound healing, and daily yoga classes in Kathmandu."),
    makeSeo("/about", "About Yogmandu | Founded 2015, 3,000+ Teachers Trained", "Dr. Chintamani Gautam leads Yogmandu — Nepal's first Yoga Alliance registered school. ERYT 500, PhD Yogic Science, 3,000+ teachers from 50+ countries."),
    makeSeo("/class-schedule", "Yoga Class Schedule Kathmandu | Yogmandu", "Weekly yoga timetable at Yogmandu Kathmandu — Hatha, Vinyasa, Ashtanga, Yin, Pranayama, Meditation and Sound Healing sessions.", "Event"),
    makeSeo("/blog", "Yogmandu Blog", "Yoga philosophy, breathwork, retreat notes, and Kathmandu wellness stories.", "Article"),
    makeSeo("/contact", "Contact Yogmandu | Miteri Marg, Mid-Baneshwor, Kathmandu", "Book a class or teacher training at Yogmandu. WhatsApp +977-9862909469. Miteri Marg, Mid-Baneshwor-31, Kathmandu."),
    makeSeo("/sound-healing-therapy", "Sound Healing Therapy Nepal — Tibetan Singing Bowls | Yogmandu", "Authentic Tibetan singing bowl sound healing in Kathmandu. Individual USD 20, Group USD 10/person, Level I & II Certification. Book with Yogmandu.", "Course"),
    makeSeo("/gallery", "Yogmandu Gallery | Yoga & Sound Healing in Kathmandu", "See the studio, classes, retreats, and sound healing sessions at Yogmandu Kathmandu."),
    makeSeo("/yoga-teacher-training", "200hr & 300hr Yoga Teacher Training Nepal | Yogmandu", "Yoga Alliance RYS 200 & 300 certified teacher training in Kathmandu, Nepal. USD 600 non-residential, USD 1,400 residential. 2026 batches: June, July, August.", "Course"),
  ];

  return {
    seoPages: pages,
    instructors: initialInstructors,
    sessions: initialSessions,
    media: initialSessions.slice(0, 4).map((session) => ({ id: uid("media"), url: session.image, caption: session.name, usedBy: session.id })),
    blogs: blogTopics.map(([title, author, category, tags, status, views], index) => ({
      id: uid("post"),
      title,
      slug: slugify(title),
      excerpt: `${title} with practical guidance from the Yogmandu teaching team.`,
      body: `## ${title}\n\nBegin with breath, soften the jaw, and let the practice become specific to the day you are living.\n\n- Arrive gently\n- Practice steadily\n- Close with gratitude`,
      featuredImage: `https://images.unsplash.com/photo-${["1545389336-cf090694435e", "1506126613408-eca07ce68773", "1510894347713-fc3ed6fdf539", "1474418397713-7ede21d49118"][index % 4]}?w=900&auto=format&fit=crop`,
      gallery: [],
      author,
      category,
      tags,
      status,
      views,
      createdAt: `2026-05-${String(18 - index).padStart(2, "0")}`,
      publishDate: `2026-05-${String(20 + index).padStart(2, "0")}T08:00`,
      allowComments: true,
      featured: index < 3,
      revisions: [],
      lastSavedAt: new Date().toISOString(),
      seoTitle: title,
      metaDescription: `${title} from Yogmandu: yoga practice, breathwork, and wellness guidance in Kathmandu.`,
      canonical: `https://yogmandu.com/blog/${slugify(title)}`,
      robotsIndex: "index",
      robotsFollow: "follow",
      ogTitle: title,
      ogDescription: `${title} from the Yogmandu blog.`,
      ogImage: "",
      ogType: "article",
      twitterCard: "summary_large_image",
      twitterTitle: title,
      twitterDescription: `${title} from Yogmandu.`,
      twitterImage: "",
      schemaType: "Article",
      schemaJson: JSON.stringify({ "@context": "https://schema.org", "@type": "Article", headline: title, author }, null, 2),
      customHeadTags: "",
      sitemapPriority: 0.6,
      changeFrequency: "monthly",
    })),
    settings: {
      siteName: "Yogmandu",
      tagline: "Yoga Alliance certified teacher training & authentic Sound Healing in Kathmandu, Nepal",
      siteUrl: "https://yogmandu.com",
      logoUrl: "/logo.png",
      address: "Miteri Marg, Mid-Baneshwor-31, Kathmandu, Nepal",
      phone: "+977-9862909469 / +977-9810263277",
      email: "info@yogmandu.com",
      defaultOgImage: "https://images.unsplash.com/photo-1545389336-cf090694435e?w=1200&auto=format&fit=crop",
      twitterHandle: "@yogmandu",
      analyticsId: "",
      searchConsoleTag: "",
      pixelId: "",
      packages: ["Individual Sound Healing - NPR 2,000 / USD 20", "3-Session Sound Healing Package - NPR 5,500 / USD 55", "Group Sound Healing (min 5) - NPR 1,000 pp / USD 10 pp", "200hr YTT Non-Residential - NPR 70,000 / USD 600", "200hr YTT Residential - USD 1,400 (meals & accommodation included)"],
      bookingFields: "Name, Email, Phone, Program, Message",
      autoReply: "Namaste, thank you for contacting Yogmandu. We will reply within 24 hours. You can also reach us on WhatsApp: +977-9862909469",
    },
  };
}

function usePersistentAdminState() {
  const [state, setState] = useState(makeInitialState);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) setState(JSON.parse(stored));
    setReady(true);
  }, []);
  useEffect(() => {
    if (ready) localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [ready, state]);
  return [state, setState, ready];
}

async function fetchJson(path, options) {
  const response = await fetch(path, {
    headers: { "Content-Type": "application/json", ...(options?.headers || {}) },
    ...options,
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.error || `Request failed: ${path}`);
  return payload;
}

async function loadRemoteCms() {
  const [blogs, sessions, media] = await Promise.all([
    fetchJson("/api/admin/blogs"),
    fetchJson("/api/admin/sessions"),
    fetchJson("/api/admin/media"),
  ]);

  return {
    configured: blogs.configured || sessions.configured || media.configured,
    blogs: blogs.data || [],
    sessions: sessions.data || [],
    media: media.data || [],
  };
}

function generateTraffic(days = 30) {
  const rand = seededRandom(days * 17);
  return Array.from({ length: days }, (_, index) => {
    const date = new Date(2026, 4, 19 - days + index + 1);
    const weekend = [0, 6].includes(date.getDay());
    const views = Math.round(2600 + rand() * 1200 + (weekend ? 900 : 0));
    return {
      date: date.toLocaleDateString("en", { month: "short", day: "numeric" }),
      views,
      visitors: Math.round(views * (0.28 + rand() * 0.1)),
      conversions: Math.round(18 + rand() * 28 + (weekend ? 12 : 0)),
    };
  });
}

function classNames(...items) {
  return items.filter(Boolean).join(" ");
}

function typeColor(type) {
  return {
    Class: "bg-emerald-100 text-emerald-700",
    Workshop: "bg-amber-100 text-amber-700",
    Retreat: "bg-orange-100 text-orange-700",
    "Drop-in": "bg-teal-100 text-teal-700",
    Online: "bg-sky-100 text-sky-700",
  }[type] || "bg-stone-100 text-stone-700";
}

function scoreColor(score) {
  if (score >= 80) return "bg-emerald-100 text-emerald-700";
  if (score >= 50) return "bg-amber-100 text-amber-700";
  return "bg-red-100 text-red-700";
}

function Button({ children, variant = "primary", className = "", ...props }) {
  const variants = {
    primary: "bg-emerald-600 text-white hover:bg-emerald-700",
    secondary: "border border-stone-300 bg-white text-stone-700 hover:bg-stone-50",
    ghost: "text-stone-600 hover:bg-stone-100",
    danger: "bg-red-600 text-white hover:bg-red-700",
  };
  return (
    <button
      className={classNames("inline-flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50", variants[variant], className)}
      {...props}
    >
      {children}
    </button>
  );
}

function Field({ label, hint, className = "", children }) {
  return (
    <label className={classNames("block", className)}>
      <span className="mb-1 flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-stone-500">
        {label}
        {hint && <span className="font-normal normal-case tracking-normal text-stone-400">{hint}</span>}
      </span>
      {children}
    </label>
  );
}

function TextInput({ className = "", ...props }) {
  return <input className={classNames("w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm text-stone-800 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100", className)} {...props} />;
}

function TextArea({ className = "", ...props }) {
  return <textarea className={classNames("min-h-24 w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm text-stone-800 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100", className)} {...props} />;
}

function Select({ className = "", ...props }) {
  return <select className={classNames("w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm text-stone-800 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100", className)} {...props} />;
}

function Badge({ children, className = "" }) {
  return <span className={classNames("inline-flex items-center rounded-full px-2 py-1 text-xs font-semibold", className)}>{children}</span>;
}

function Modal({ title, children, onClose, wide = false }) {
  useEffect(() => {
    const onKey = (event) => event.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/60 p-4">
      <div className={classNames("max-h-[92vh] w-full overflow-hidden rounded-xl bg-stone-50 shadow-2xl", wide ? "max-w-6xl" : "max-w-2xl")}>
        <div className="flex items-center justify-between border-b border-stone-200 bg-white px-5 py-4">
          <h2 className="text-lg font-semibold text-stone-900">{title}</h2>
          <Button variant="ghost" className="h-9 w-9 p-0" onClick={onClose} aria-label="Close modal"><X size={18} /></Button>
        </div>
        <div className="max-h-[calc(92vh-72px)] overflow-y-auto p-5">{children}</div>
      </div>
    </div>
  );
}

function EmptyState({ icon: Icon, title, text, action }) {
  return (
    <div className="rounded-xl border border-dashed border-stone-300 bg-white p-8 text-center">
      <Icon className="mx-auto mb-3 text-stone-400" size={28} />
      <h3 className="font-semibold text-stone-800">{title}</h3>
      <p className="mx-auto mt-1 max-w-md text-sm text-stone-500">{text}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

async function uploadFile(event, callback, options = {}) {
  const file = event.target.files?.[0];
  if (!file) return;
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("caption", options.caption || file.name);
    formData.append("usedBy", options.usedBy || "");
    const response = await fetch("/api/admin/media/upload", {
      method: "POST",
      body: formData,
    });
    const payload = await response.json().catch(() => ({}));
    if (response.ok && payload.data?.url) {
      callback(payload.data.url, payload.data);
      return;
    }
  } catch {
    // Fall through to local base64 storage for unconfigured development.
  }
  const reader = new FileReader();
  reader.onload = () => callback(reader.result, {
    id: uid("media"),
    url: reader.result,
    caption: options.caption || file.name,
    usedBy: options.usedBy || "",
  });
  reader.readAsDataURL(file);
}

function SeoEditorFields({ value, onChange, allPages = [] }) {
  const update = (key, next) => onChange({ ...value, [key]: next });
  const score = scoreSeo(value, allPages);
  const [jsonMessage, setJsonMessage] = useState("");
  return (
    <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
      <div className="space-y-5">
        <section className="rounded-xl border border-stone-200 bg-white p-4">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-semibold text-stone-900">Basic SEO</h3>
            <Badge className={scoreColor(score)}>{score}/100</Badge>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Page title" hint={`${(value.seoTitle || "").length}/60`}>
              <TextInput value={value.seoTitle || ""} onChange={(e) => update("seoTitle", e.target.value)} />
            </Field>
            <Field label="Canonical URL">
              <TextInput value={value.canonical || ""} onChange={(e) => update("canonical", e.target.value)} />
            </Field>
            <Field label="Meta description" hint={`${(value.metaDescription || "").length}/160`} className="md:col-span-2">
              <TextArea value={value.metaDescription || ""} onChange={(e) => update("metaDescription", e.target.value)} />
            </Field>
            <Field label="Robots index">
              <Select value={value.robotsIndex || "index"} onChange={(e) => update("robotsIndex", e.target.value)}>
                <option>index</option>
                <option>noindex</option>
              </Select>
            </Field>
            <Field label="Robots follow">
              <Select value={value.robotsFollow || "follow"} onChange={(e) => update("robotsFollow", e.target.value)}>
                <option>follow</option>
                <option>nofollow</option>
              </Select>
            </Field>
          </div>
        </section>

        <section className="rounded-xl border border-stone-200 bg-white p-4">
          <h3 className="mb-3 font-semibold text-stone-900">Open Graph & Twitter</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="OG title"><TextInput value={value.ogTitle || ""} onChange={(e) => update("ogTitle", e.target.value)} /></Field>
            <Field label="OG type"><Select value={value.ogType || "website"} onChange={(e) => update("ogType", e.target.value)}><option>website</option><option>article</option><option>product</option></Select></Field>
            <Field label="OG description" className="md:col-span-2"><TextArea value={value.ogDescription || ""} onChange={(e) => update("ogDescription", e.target.value)} /></Field>
            <Field label="OG image URL" className="md:col-span-2"><TextInput value={value.ogImage || ""} onChange={(e) => update("ogImage", e.target.value)} /></Field>
            {value.ogImage && <img src={value.ogImage} alt="" className="h-28 w-44 rounded-lg object-cover" />}
            <Field label="Twitter card"><Select value={value.twitterCard || "summary_large_image"} onChange={(e) => update("twitterCard", e.target.value)}><option>summary</option><option>summary_large_image</option></Select></Field>
            <Field label="Twitter title"><TextInput value={value.twitterTitle || ""} onChange={(e) => update("twitterTitle", e.target.value)} /></Field>
            <Field label="Twitter image URL"><TextInput value={value.twitterImage || ""} onChange={(e) => update("twitterImage", e.target.value)} /></Field>
            <Field label="Twitter description" className="md:col-span-2"><TextArea value={value.twitterDescription || ""} onChange={(e) => update("twitterDescription", e.target.value)} /></Field>
          </div>
        </section>

        <section className="rounded-xl border border-stone-200 bg-white p-4">
          <h3 className="mb-3 font-semibold text-stone-900">Schema & Advanced</h3>
          <div className="grid gap-4">
            <Field label="Schema type">
              <Select value={value.schemaType || "Article"} onChange={(e) => update("schemaType", e.target.value)}>
                {["Article", "LocalBusiness", "Product", "FAQ", "BreadcrumbList", "Event", "Course"].map((item) => <option key={item}>{item}</option>)}
              </Select>
            </Field>
            <Field label="JSON-LD editor">
              <TextArea rows={9} value={value.schemaJson || ""} onChange={(e) => update("schemaJson", e.target.value)} className="font-mono" />
            </Field>
            <div className="flex items-center gap-3">
              <Button variant="secondary" onClick={() => setJsonMessage(isValidJson(value.schemaJson) ? "Valid JSON-LD" : "Invalid JSON. Check commas, quotes, and braces.")}>
                <ShieldCheck size={16} /> Validate JSON
              </Button>
              {jsonMessage && <span className={classNames("text-sm", jsonMessage.startsWith("Valid") ? "text-emerald-700" : "text-red-600")}>{jsonMessage}</span>}
            </div>
            <Field label="Custom head tags"><TextArea value={value.customHeadTags || ""} onChange={(e) => update("customHeadTags", e.target.value)} /></Field>
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Sitemap priority" hint={value.sitemapPriority || 0.5}>
                <input type="range" min="0.1" max="1" step="0.1" value={value.sitemapPriority || 0.5} onChange={(e) => update("sitemapPriority", Number(e.target.value))} className="w-full accent-emerald-600" />
              </Field>
              <Field label="Change frequency">
                <Select value={value.changeFrequency || "weekly"} onChange={(e) => update("changeFrequency", e.target.value)}>
                  {["always", "hourly", "daily", "weekly", "monthly", "yearly", "never"].map((item) => <option key={item}>{item}</option>)}
                </Select>
              </Field>
            </div>
          </div>
        </section>
      </div>
      <aside className="space-y-4">
        <section className="rounded-xl border border-stone-200 bg-white p-4">
          <h3 className="mb-3 font-semibold text-stone-900">Google Preview</h3>
          <p className="text-xs text-emerald-700">{value.canonical}</p>
          <p className="mt-1 text-lg text-blue-700">{value.seoTitle || "Untitled page"}</p>
          <p className="mt-1 text-sm leading-relaxed text-stone-600">{value.metaDescription || "Add a meta description to preview the search snippet."}</p>
        </section>
        <section className="rounded-xl border border-stone-200 bg-white p-4">
          <h3 className="mb-3 font-semibold text-stone-900">Score Checklist</h3>
          {[
            ["Title present and <= 60 chars", value.seoTitle && value.seoTitle.length <= 60],
            ["Description present and <= 160 chars", value.metaDescription && value.metaDescription.length <= 160],
            ["OG image present", value.ogImage || value.featuredImage],
            ["Valid schema markup", value.schemaJson && isValidJson(value.schemaJson)],
            ["Canonical URL set", value.canonical],
            ["Robots index, follow", value.robotsIndex === "index" && value.robotsFollow === "follow"],
          ].map(([label, ok]) => (
            <div key={label} className="flex items-center gap-2 py-1 text-sm text-stone-600">
              <Check size={15} className={ok ? "text-emerald-600" : "text-stone-300"} /> {label}
            </div>
          ))}
        </section>
      </aside>
    </div>
  );
}

function Dashboard({ data, setActive, toast }) {
  const [range, setRange] = useState("30");
  const traffic = useMemo(() => generateTraffic(Number(range) || 30), [range]);
  const topPages = useMemo(() => data.seoPages.slice(0, 5).map((page, index) => ({ page: page.pageName, views: [32100, 24100, 18600, 14200, 11900][index] })), [data.seoPages]);
  const sources = [
    { name: "Organic", value: 46 },
    { name: "Direct", value: 24 },
    { name: "Social", value: 15 },
    { name: "Referral", value: 10 },
    { name: "Email", value: 5 },
  ];
  const activeSessions = data.sessions.filter((item) => item.status === "Active");
  const lowSpots = data.sessions.filter((item) => item.capacity - item.enrolled < 3 && item.status !== "Archived");
  const mostPopular = [...data.sessions].sort((a, b) => b.views - a.views)[0];

  function exportCsv() {
    const rows = [["Metric", "Value"], ["Total Page Views", "128450"], ["Unique Visitors", "34820"], ["Sessions This Month", data.sessions.length], ["Enquiries", "318"], [], ["Top Pages", "Views"], ...topPages.map((item) => [item.page, item.views])];
    const csv = rows.map((row) => row.join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "yogmandu-dashboard.csv";
    link.click();
    URL.revokeObjectURL(url);
    toast("Dashboard CSV exported");
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-2">
          {["7", "30", "90"].map((item) => <Button key={item} variant={range === item ? "primary" : "secondary"} onClick={() => setRange(item)}>Last {item} days</Button>)}
          <Button variant={range === "45" ? "primary" : "secondary"} onClick={() => setRange("45")}>Custom</Button>
        </div>
        <Button variant="secondary" onClick={exportCsv}><Download size={16} /> Export CSV</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          ["Total Page Views", "128,450", "+12.4%", Activity],
          ["Unique Visitors", "34,820", "+8.1%", Users],
          ["Sessions This Month", "124", "+6", CalendarDays],
          ["Enquiries / Bookings", "318", "+22%", Bell],
        ].map(([label, value, change, Icon]) => (
          <div key={label} className="rounded-xl border border-stone-200 bg-white p-4 shadow-sm">
            <div className="flex items-start justify-between">
              <Icon className="text-emerald-600" />
              <Badge className="bg-emerald-100 text-emerald-700">{change}</Badge>
            </div>
            <p className="mt-4 text-sm text-stone-500">{label}</p>
            <p className="mt-1 text-3xl font-semibold text-stone-900">{value}</p>
          </div>
        ))}
      </div>

      <section className="rounded-xl border border-stone-200 bg-white p-4">
        <h3 className="mb-4 font-semibold text-stone-900">Sessions Overview</h3>
        <div className="grid gap-3 md:grid-cols-5">
          <div className="rounded-lg bg-emerald-50 p-3"><p className="text-xs text-emerald-700">Active this week</p><p className="text-2xl font-semibold text-emerald-900">{activeSessions.length}</p></div>
          <div className="rounded-lg bg-teal-50 p-3"><p className="text-xs text-teal-700">Most popular</p><p className="truncate text-sm font-semibold text-teal-900">{mostPopular?.name}</p></div>
          <div className="rounded-lg bg-amber-50 p-3"><p className="text-xs text-amber-700">Low spots</p><p className="text-2xl font-semibold text-amber-900">{lowSpots.length}</p></div>
          <div className="rounded-lg bg-red-50 p-3"><p className="text-xs text-red-700">Fully booked</p><p className="text-2xl font-semibold text-red-900">{data.sessions.filter((item) => item.enrolled >= item.capacity).length}</p></div>
          <div className="rounded-lg bg-stone-100 p-3"><p className="text-xs text-stone-600">Upcoming workshops</p><p className="text-2xl font-semibold text-stone-900">{data.sessions.filter((item) => item.status === "Upcoming").length}</p></div>
        </div>
      </section>

      <div className="grid gap-4 xl:grid-cols-2">
        <ChartCard title="Traffic Over Last 30 Days">
          <LineChart data={traffic}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="date" /><YAxis /><Tooltip /><Legend /><Line type="monotone" dataKey="views" stroke="#059669" strokeWidth={2} dot={false} /><Line type="monotone" dataKey="visitors" stroke="#0f766e" strokeWidth={2} dot={false} /></LineChart>
        </ChartCard>
        <ChartCard title="Top 5 Pages by Views">
          <BarChart data={topPages} layout="vertical"><CartesianGrid strokeDasharray="3 3" /><XAxis type="number" /><YAxis dataKey="page" type="category" width={110} /><Tooltip /><Bar dataKey="views" fill="#059669" radius={[0, 8, 8, 0]} /></BarChart>
        </ChartCard>
        <ChartCard title="Traffic Sources">
          <PieChart><Pie data={sources} dataKey="value" nameKey="name" innerRadius={58} outerRadius={90} paddingAngle={3}>{sources.map((_, index) => <Cell key={index} fill={COLORS[index]} />)}</Pie><Tooltip /><Legend /></PieChart>
        </ChartCard>
        <ChartCard title="Conversions Over Time">
          <AreaChart data={traffic}><defs><linearGradient id="conversionFill" x1="0" x2="0" y1="0" y2="1"><stop offset="5%" stopColor="#059669" stopOpacity={0.35} /><stop offset="95%" stopColor="#059669" stopOpacity={0} /></linearGradient></defs><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="date" /><YAxis /><Tooltip /><Area type="monotone" dataKey="conversions" stroke="#059669" fill="url(#conversionFill)" /></AreaChart>
        </ChartCard>
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <MiniTable title="Recent Blog Posts" action={() => setActive("blog")} columns={["Title", "Views", "Status"]} rows={data.blogs.slice(0, 5).map((post) => [post.title, post.views.toLocaleString(), post.status])} />
        <MiniTable title="Upcoming Sessions" action={() => setActive("sessions")} columns={["Session", "Instructor", "Spots"]} rows={data.sessions.slice(0, 5).map((session) => [session.name, data.instructors.find((item) => item.id === session.instructorId)?.name || "", `${session.capacity - session.enrolled}/${session.capacity}`])} />
        <MiniTable title="SEO Health Overview" action={() => setActive("seo")} columns={["Page", "Score", "Missing"]} rows={data.seoPages.slice(0, 5).map((page) => [page.pageName, `${scoreSeo(page, data.seoPages)}/100`, scoreSeo(page, data.seoPages) > 80 ? "None" : "Review tags"])} />
      </div>
    </div>
  );
}

function ChartCard({ title, children }) {
  return (
    <section className="rounded-xl border border-stone-200 bg-white p-4 shadow-sm">
      <h3 className="mb-4 font-semibold text-stone-900">{title}</h3>
      <div className="h-72"><ResponsiveContainer width="100%" height="100%">{children}</ResponsiveContainer></div>
    </section>
  );
}

function MiniTable({ title, columns, rows, action }) {
  return (
    <section className="rounded-xl border border-stone-200 bg-white p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-semibold text-stone-900">{title}</h3>
        <Button variant="ghost" onClick={action}>Open</Button>
      </div>
      <table className="w-full text-left text-sm">
        <thead className="text-xs uppercase text-stone-400"><tr>{columns.map((item) => <th key={item} className="py-2">{item}</th>)}</tr></thead>
        <tbody className="divide-y divide-stone-100">{rows.map((row, index) => <tr key={index}>{row.map((cell, idx) => <td key={idx} className="py-2 text-stone-700">{cell}</td>)}</tr>)}</tbody>
      </table>
    </section>
  );
}

function SeoManager({ pages, setPages, toast }) {
  const [selectedId, setSelectedId] = useState(pages[0]?.id);
  const selected = pages.find((page) => page.id === selectedId) || pages[0];
  const [draft, setDraft] = useState(selected);
  useEffect(() => setDraft(selected), [selectedId, selected]);
  if (!selected) return null;

  function copyTags() {
    const snippet = `<title>${draft.seoTitle}</title>
<meta name="description" content="${draft.metaDescription}" />
<link rel="canonical" href="${draft.canonical}" />
<meta name="robots" content="${draft.robotsIndex}, ${draft.robotsFollow}" />
<meta property="og:title" content="${draft.ogTitle}" />
<meta property="og:description" content="${draft.ogDescription}" />
<meta property="og:image" content="${draft.ogImage}" />
<script type="application/ld+json">${draft.schemaJson}</script>`;
    navigator.clipboard.writeText(snippet);
    toast("Meta tags copied");
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[260px_1fr]">
      <aside className="rounded-xl border border-stone-200 bg-white p-3">
        <Button className="mb-3 w-full" onClick={() => {
          const page = makeSeo("/new-page", "New Page | Yogmandu", "Describe this Yogmandu page.");
          setPages([...pages, page]);
          setSelectedId(page.id);
        }}><Plus size={16} /> Add Page</Button>
        <div className="space-y-1">
          {pages.map((page) => <button key={page.id} onClick={() => setSelectedId(page.id)} className={classNames("flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm", selectedId === page.id ? "bg-emerald-50 text-emerald-800" : "text-stone-600 hover:bg-stone-50")}><span>{page.pageName}</span><Badge className={scoreColor(scoreSeo(page, pages))}>{scoreSeo(page, pages)}</Badge></button>)}
        </div>
        <div className="mt-4 rounded-lg bg-stone-50 p-3">
          <p className="text-xs font-semibold uppercase text-stone-500">Bulk robots</p>
          <Button variant="secondary" className="mt-2 w-full" onClick={() => { setPages(pages.map((page) => ({ ...page, robotsIndex: "index", robotsFollow: "follow" }))); toast("Robots applied to all pages"); }}>Apply index, follow</Button>
        </div>
      </aside>
      <main className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-stone-200 bg-white p-4">
          <div>
            <h2 className="text-xl font-semibold text-stone-900">{draft.pageName}</h2>
            <p className="text-sm text-stone-500">{draft.route}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={copyTags}><Copy size={16} /> Copy Meta Tags</Button>
            <Button variant="secondary" onClick={() => setDraft(selected)}>Discard</Button>
            <Button onClick={() => { setPages(pages.map((page) => page.id === draft.id ? { ...draft, updatedAt: new Date().toISOString().slice(0, 10) } : page)); toast("SEO page saved"); }}><Save size={16} /> Save</Button>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <Field label="Page name"><TextInput value={draft.pageName} onChange={(e) => setDraft({ ...draft, pageName: e.target.value })} /></Field>
          <Field label="Route"><TextInput value={draft.route} onChange={(e) => setDraft({ ...draft, route: e.target.value })} /></Field>
          <Field label="Last updated"><TextInput value={draft.updatedAt} onChange={(e) => setDraft({ ...draft, updatedAt: e.target.value })} /></Field>
        </div>
        <SeoEditorFields value={draft} onChange={setDraft} allPages={pages} />
      </main>
    </div>
  );
}

function BlogManager({ blogs, setBlogs, media, setMedia, toast }) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("All");
  const [sort, setSort] = useState("Date");
  const [selected, setSelected] = useState([]);
  const [editing, setEditing] = useState(null);
  const filtered = blogs
    .filter((post) => status === "All" || post.status === status)
    .filter((post) => `${post.title} ${post.tags.join(" ")}`.toLowerCase().includes(query.toLowerCase()))
    .sort((a, b) => sort === "Views" ? b.views - a.views : sort === "Title" ? a.title.localeCompare(b.title) : sort === "Status" ? a.status.localeCompare(b.status) : b.createdAt.localeCompare(a.createdAt));

  const bulk = (nextStatus) => {
    setBlogs(blogs.map((post) => selected.includes(post.id) ? { ...post, status: nextStatus } : post));
    setSelected([]);
    toast(`Selected posts moved to ${nextStatus}`);
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          <div className="relative"><Search className="absolute left-3 top-2.5 text-stone-400" size={16} /><TextInput placeholder="Search posts or tags" value={query} onChange={(e) => setQuery(e.target.value)} className="pl-9" /></div>
          <Select value={status} onChange={(e) => setStatus(e.target.value)}>{["All", ...STATUSES].map((item) => <option key={item}>{item}</option>)}</Select>
          <Select value={sort} onChange={(e) => setSort(e.target.value)}>{["Date", "Views", "Title", "Status"].map((item) => <option key={item}>{item}</option>)}</Select>
        </div>
        <Button onClick={() => setEditing(newPost())}><Plus size={16} /> New Post</Button>
      </div>
      {selected.length > 0 && <div className="flex flex-wrap items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-900"><span>{selected.length} selected</span><Button variant="secondary" onClick={() => bulk("Published")}>Publish</Button><Button variant="secondary" onClick={() => bulk("Archived")}>Archive</Button><Button variant="danger" onClick={() => { setBlogs(blogs.filter((post) => !selected.includes(post.id))); setSelected([]); toast("Selected posts deleted"); }}>Delete</Button></div>}
      <section className="overflow-hidden rounded-xl border border-stone-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-stone-50 text-xs uppercase text-stone-500"><tr><th className="p-3"><input type="checkbox" onChange={(e) => setSelected(e.target.checked ? filtered.map((post) => post.id) : [])} /></th>{["Title", "Author", "Category", "Tags", "Status", "Views", "Date Created", "Actions"].map((item) => <th key={item} className="p-3">{item}</th>)}</tr></thead>
          <tbody className="divide-y divide-stone-100">
            {filtered.map((post) => (
              <tr key={post.id} className="hover:bg-stone-50">
                <td className="p-3"><input type="checkbox" checked={selected.includes(post.id)} onChange={(e) => setSelected(e.target.checked ? [...selected, post.id] : selected.filter((id) => id !== post.id))} /></td>
                <td className="p-3 font-medium text-stone-900">{post.title}</td>
                <td className="p-3 text-stone-600">{post.author}</td>
                <td className="p-3 text-stone-600">{post.category}</td>
                <td className="p-3"><div className="flex flex-wrap gap-1">{post.tags.slice(0, 2).map((tag) => <Badge key={tag} className="bg-stone-100 text-stone-600">{tag}</Badge>)}</div></td>
                <td className="p-3"><Badge className={post.status === "Published" ? "bg-emerald-100 text-emerald-700" : "bg-stone-100 text-stone-600"}>{post.status}</Badge></td>
                <td className="p-3 text-stone-600">{post.views.toLocaleString()}</td>
                <td className="p-3 text-stone-600">{post.createdAt}</td>
                <td className="p-3"><Button variant="ghost" onClick={() => setEditing(post)}><Edit3 size={16} /></Button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
      {editing && <BlogEditor post={editing} blogs={blogs} setBlogs={setBlogs} media={media} setMedia={setMedia} onClose={() => setEditing(null)} toast={toast} />}
    </div>
  );
}

function newPost() {
  const title = "Untitled Yogmandu Post";
  return {
    id: uid("post"),
    title,
    slug: slugify(title),
    excerpt: "",
    body: "",
    featuredImage: "",
    gallery: [],
    author: "Priya Sharma",
    category: "Practice",
    tags: [],
    status: "Draft",
    views: 0,
    createdAt: new Date().toISOString().slice(0, 10),
    publishDate: new Date().toISOString().slice(0, 16),
    allowComments: true,
    featured: false,
    revisions: [],
    lastSavedAt: new Date().toISOString(),
    seoTitle: title,
    metaDescription: "",
    canonical: "https://yogmandu.com/blog/untitled-yogmandu-post",
    robotsIndex: "index",
    robotsFollow: "follow",
    ogTitle: title,
    ogDescription: "",
    ogImage: "",
    ogType: "article",
    twitterCard: "summary_large_image",
    twitterTitle: title,
    twitterDescription: "",
    twitterImage: "",
    schemaType: "Article",
    schemaJson: JSON.stringify({ "@context": "https://schema.org", "@type": "Article", headline: title }, null, 2),
    customHeadTags: "",
    sitemapPriority: 0.6,
    changeFrequency: "monthly",
  };
}

function BlogEditor({ post, blogs, setBlogs, media, setMedia, onClose, toast }) {
  const [draft, setDraft] = useState(post);
  const [tab, setTab] = useState("Content");
  const [preview, setPreview] = useState(false);
  const exists = blogs.some((item) => item.id === post.id);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setDraft((current) => ({ ...current, lastSavedAt: new Date().toISOString(), revisions: [snapshot(current), ...(current.revisions || [])].slice(0, 5) }));
    }, 30000);
    return () => window.clearInterval(timer);
  }, []);

  const save = () => {
    const next = { ...draft, readingTime: readTime(draft.body), lastSavedAt: new Date().toISOString(), revisions: [snapshot(draft), ...(draft.revisions || [])].slice(0, 5) };
    setBlogs(exists ? blogs.map((item) => item.id === next.id ? next : item) : [next, ...blogs]);
    toast("Post saved");
    onClose();
  };

  const wrap = (before, after = before) => {
    setDraft({ ...draft, body: `${draft.body}${draft.body ? "\n" : ""}${before}selected text${after}` });
  };

  return (
    <Modal title={draft.title || "Post Editor"} onClose={onClose} wide>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-2">{["Content", "SEO", "Revisions"].map((item) => <Button key={item} variant={tab === item ? "primary" : "secondary"} onClick={() => setTab(item)}>{item}</Button>)}</div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => setPreview(true)}><Eye size={16} /> Preview</Button>
          <Button variant="secondary" onClick={() => { const copy = { ...draft, id: uid("post"), title: `${draft.title} Copy`, slug: `${draft.slug}-copy`, status: "Draft" }; setBlogs([copy, ...blogs]); toast("Post duplicated"); }}>Duplicate</Button>
          {exists && <Button variant="danger" onClick={() => { if (confirm("Delete this post?")) { setBlogs(blogs.filter((item) => item.id !== draft.id)); toast("Post deleted"); onClose(); } }}><Trash2 size={16} /> Delete</Button>}
          <Button onClick={save}><Save size={16} /> Save</Button>
        </div>
      </div>
      {tab === "Content" && (
        <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
          <div className="space-y-4">
            <Field label="Title" hint={`${draft.title.length} chars`}><TextInput value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value, slug: slugify(e.target.value), seoTitle: e.target.value, ogTitle: e.target.value, twitterTitle: e.target.value })} /></Field>
            <Field label="Slug" hint={`/blog/${draft.slug}`}><TextInput value={draft.slug} onChange={(e) => setDraft({ ...draft, slug: slugify(e.target.value), canonical: `https://yogmandu.com/blog/${slugify(e.target.value)}` })} /></Field>
            <Field label="Excerpt" hint={`${draft.excerpt.length}/160`}><TextArea maxLength={160} value={draft.excerpt} onChange={(e) => setDraft({ ...draft, excerpt: e.target.value, metaDescription: e.target.value })} /></Field>
            <div className="rounded-xl border border-stone-200 bg-white p-3">
              <div className="mb-3 flex flex-wrap gap-2">
                {[["B", "**", "**"], ["I", "_", "_"], ["U", "<u>", "</u>"], ["S", "~~", "~~"], ["H1", "# ", ""], ["H2", "## ", ""], ["H3", "### ", ""], ["H4", "#### ", ""], ["•", "- ", ""], ["1.", "1. ", ""], ["Quote", "> ", ""], ["Code", "`", "`"], ["Block", "```\n", "\n```"], ["HR", "\n---\n", ""]].map(([label, before, after]) => <Button key={label} variant="secondary" onClick={() => wrap(before, after)}>{label}</Button>)}
                <Button variant="secondary" onClick={() => wrap("[link text](", ")") }><Link size={15} /> Link</Button>
              </div>
              <TextArea rows={14} value={draft.body} onChange={(e) => setDraft({ ...draft, body: e.target.value })} />
            </div>
            <GalleryEditor items={draft.gallery} onChange={(gallery) => setDraft({ ...draft, gallery })} />
          </div>
          <aside className="space-y-4">
            <Field label="Featured Image"><TextInput value={draft.featuredImage} onChange={(e) => setDraft({ ...draft, featuredImage: e.target.value, ogImage: e.target.value, twitterImage: e.target.value })} /></Field>
            <input type="file" accept="image/*" onChange={(e) => uploadFile(e, (url, item) => { setDraft({ ...draft, featuredImage: url, ogImage: url, twitterImage: url }); setMedia([item || { id: uid("media"), url, caption: draft.title, usedBy: draft.id }, ...media]); }, { caption: draft.title, usedBy: draft.id })} className="text-sm" />
            {draft.featuredImage && <img src={draft.featuredImage} alt="" className="h-40 w-full rounded-xl object-cover" />}
            <Field label="Author"><TextInput value={draft.author} onChange={(e) => setDraft({ ...draft, author: e.target.value })} /></Field>
            <Field label="Category"><TextInput value={draft.category} onChange={(e) => setDraft({ ...draft, category: e.target.value })} /></Field>
            <TagInput value={draft.tags} onChange={(tags) => setDraft({ ...draft, tags })} />
            <Field label="Publish Date"><TextInput type="datetime-local" value={draft.publishDate} onChange={(e) => setDraft({ ...draft, publishDate: e.target.value })} /></Field>
            <Field label="Status"><Select value={draft.status} onChange={(e) => setDraft({ ...draft, status: e.target.value })}>{STATUSES.map((item) => <option key={item}>{item}</option>)}</Select></Field>
            <div className="rounded-xl bg-stone-100 p-3 text-sm text-stone-600">Reading time: {readTime(draft.body)} min</div>
            <Toggle label="Allow comments" checked={draft.allowComments} onChange={(checked) => setDraft({ ...draft, allowComments: checked })} />
            <Toggle label="Featured post" checked={draft.featured} onChange={(checked) => setDraft({ ...draft, featured: checked })} />
          </aside>
        </div>
      )}
      {tab === "SEO" && <SeoEditorFields value={draft} onChange={setDraft} allPages={blogs} />}
      {tab === "Revisions" && <div className="space-y-3">{(draft.revisions || []).length ? draft.revisions.map((rev) => <div key={rev.savedAt} className="flex items-center justify-between rounded-xl border border-stone-200 bg-white p-3"><div><p className="font-medium">{rev.title}</p><p className="text-sm text-stone-500">{new Date(rev.savedAt).toLocaleString()}</p></div><Button variant="secondary" onClick={() => setDraft({ ...draft, ...rev })}><RefreshCw size={16} /> Restore</Button></div>) : <EmptyState icon={Clock} title="No revisions yet" text="Auto-save keeps the last five saved versions here." />}</div>}
      {preview && <Modal title="Post Preview" onClose={() => setPreview(false)} wide><article className="mx-auto max-w-3xl rounded-xl bg-white p-8"><h1 className="text-4xl font-semibold text-stone-900">{draft.title}</h1><p className="mt-3 text-stone-500">{draft.excerpt}</p>{draft.featuredImage && <img src={draft.featuredImage} alt="" className="my-6 h-72 w-full rounded-xl object-cover" />}<pre className="whitespace-pre-wrap font-sans leading-7 text-stone-700">{draft.body}</pre></article></Modal>}
    </Modal>
  );
}

function snapshot(post) {
  return { title: post.title, excerpt: post.excerpt, body: post.body, savedAt: new Date().toISOString() };
}

function TagInput({ value, onChange, label = "Tags" }) {
  const [text, setText] = useState("");
  return (
    <Field label={label}>
      <div className="rounded-lg border border-stone-300 bg-white p-2 focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-100">
        <div className="mb-2 flex flex-wrap gap-1">{value.map((tag) => <Badge key={tag} className="bg-emerald-100 text-emerald-700">{tag}<button className="ml-1" onClick={() => onChange(value.filter((item) => item !== tag))}>x</button></Badge>)}</div>
        <input className="w-full text-sm outline-none" value={text} placeholder="Type and press Enter" onChange={(e) => setText(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" && text.trim()) { e.preventDefault(); onChange([...new Set([...value, text.trim()])]); setText(""); } }} />
      </div>
    </Field>
  );
}

function Toggle({ label, checked, onChange }) {
  return <label className="flex items-center justify-between rounded-lg border border-stone-200 bg-white p-3 text-sm font-medium text-stone-700"><span>{label}</span><input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="h-5 w-5 accent-emerald-600" /></label>;
}

function GalleryEditor({ items, onChange }) {
  return (
    <section className="rounded-xl border border-stone-200 bg-white p-4">
      <div className="mb-3 flex items-center justify-between"><h3 className="font-semibold">Image Gallery</h3><Button variant="secondary" onClick={() => onChange([...items, { id: uid("gallery"), url: "", caption: "" }])}><Plus size={16} /> Add Image</Button></div>
      <div className="grid gap-3 md:grid-cols-2">{items.map((item, index) => <div key={item.id} className="rounded-lg border border-stone-200 p-3"><TextInput placeholder="Image URL" value={item.url} onChange={(e) => onChange(items.map((img) => img.id === item.id ? { ...img, url: e.target.value } : img))} /><TextInput placeholder="Caption" value={item.caption} onChange={(e) => onChange(items.map((img) => img.id === item.id ? { ...img, caption: e.target.value } : img))} className="mt-2" />{item.url && <img src={item.url} alt="" className="mt-2 h-28 w-full rounded-lg object-cover" />}<div className="mt-2 flex gap-2"><Button variant="secondary" disabled={index === 0} onClick={() => { const next = [...items]; [next[index - 1], next[index]] = [next[index], next[index - 1]]; onChange(next); }}>Up</Button><Button variant="secondary" disabled={index === items.length - 1} onClick={() => { const next = [...items]; [next[index + 1], next[index]] = [next[index], next[index + 1]]; onChange(next); }}>Down</Button><Button variant="danger" onClick={() => onChange(items.filter((img) => img.id !== item.id))}><Trash2 size={16} /></Button></div></div>)}</div>
    </section>
  );
}

function SessionsManager({ sessions, setSessions, instructors, setInstructors, media, setMedia, toast }) {
  const [view, setView] = useState("Table");
  const [tab, setTab] = useState("Sessions");
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useReducer((state, patch) => ({ ...state, ...patch }), { type: "All", instructor: "All", level: "All", status: "All", day: "All" });
  const [editing, setEditing] = useState(null);
  const filtered = sessions.filter((session) => {
    const instructor = instructors.find((item) => item.id === session.instructorId)?.name || "";
    return (filters.type === "All" || session.type === filters.type) && (filters.instructor === "All" || session.instructorId === filters.instructor) && (filters.level === "All" || session.level === filters.level) && (filters.status === "All" || session.status === filters.status) && (filters.day === "All" || session.days.includes(filters.day)) && `${session.name} ${instructor} ${session.tags.join(" ")}`.toLowerCase().includes(query.toLowerCase());
  });

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-2">{["Sessions", "Weekly Schedule", "Instructors"].map((item) => <Button key={item} variant={tab === item ? "primary" : "secondary"} onClick={() => setTab(item)}>{item}</Button>)}</div>
        {tab === "Sessions" && <Button onClick={() => setEditing(newSession(instructors[0]?.id))}><Plus size={16} /> Add New Session</Button>}
      </div>

      {tab === "Sessions" && (
        <>
          <div className="grid gap-3 rounded-xl border border-stone-200 bg-white p-4 md:grid-cols-3 xl:grid-cols-7">
            <div className="relative md:col-span-2"><Search className="absolute left-3 top-2.5 text-stone-400" size={16} /><TextInput placeholder="Search sessions, instructors, or tags" value={query} onChange={(e) => setQuery(e.target.value)} className="pl-9" /></div>
            <Select value={filters.type} onChange={(e) => setFilters({ type: e.target.value })}>{["All", ...SESSION_TYPES].map((item) => <option key={item}>{item}</option>)}</Select>
            <Select value={filters.instructor} onChange={(e) => setFilters({ instructor: e.target.value })}><option>All</option>{instructors.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</Select>
            <Select value={filters.level} onChange={(e) => setFilters({ level: e.target.value })}>{["All", ...LEVELS].map((item) => <option key={item}>{item}</option>)}</Select>
            <Select value={filters.status} onChange={(e) => setFilters({ status: e.target.value })}>{["All", ...SESSION_STATUSES].map((item) => <option key={item}>{item}</option>)}</Select>
            <Select value={filters.day} onChange={(e) => setFilters({ day: e.target.value })}>{["All", ...DAYS].map((item) => <option key={item}>{item}</option>)}</Select>
          </div>
          <div className="flex justify-end gap-2"><Button variant={view === "Table" ? "primary" : "secondary"} onClick={() => setView("Table")}><ListFilter size={16} /> Table</Button><Button variant={view === "Grid" ? "primary" : "secondary"} onClick={() => setView("Grid")}><Image size={16} /> Grid</Button></div>
          {view === "Table" ? <SessionsTable sessions={filtered} instructors={instructors} onEdit={setEditing} setSessions={setSessions} toast={toast} /> : <SessionsGrid sessions={filtered} instructors={instructors} onEdit={setEditing} />}
        </>
      )}

      {tab === "Weekly Schedule" && <WeeklySchedule sessions={sessions} instructors={instructors} onEdit={setEditing} />}
      {tab === "Instructors" && <InstructorsManager instructors={instructors} setInstructors={setInstructors} sessions={sessions} toast={toast} />}
      {editing && <SessionEditor session={editing} sessions={sessions} setSessions={setSessions} instructors={instructors} media={media} setMedia={setMedia} onClose={() => setEditing(null)} toast={toast} />}
    </div>
  );
}

function newSession(instructorId) {
  return { id: uid("session"), name: "New Yoga Session", shortDescription: "", fullDescription: "", type: "Class", styles: [], level: "All Levels", language: "Both", recurring: true, days: ["Mon"], date: "", startDate: new Date().toISOString().slice(0, 10), endDate: "", startTime: "07:00", endTime: "08:00", duration: 60, instructorId, location: "In-studio", room: "Main Hall", meetingLink: "", capacity: 15, enrolled: 0, waitlist: true, waitlistCount: 0, pricingType: "Fixed Price", price: 800, trial: false, image: "", gallery: [], video: "", status: "Active", homepage: false, featured: false, tags: [], priority: 10, notes: "", equipment: "", prerequisites: "", views: 0 };
}

function SessionsTable({ sessions, instructors, onEdit, setSessions, toast }) {
  return (
    <section className="overflow-hidden rounded-xl border border-stone-200 bg-white">
      <table className="w-full text-left text-sm">
        <thead className="bg-stone-50 text-xs uppercase text-stone-500"><tr>{["Session Name", "Type", "Instructor", "Schedule", "Duration", "Level", "Capacity", "Price", "Status", "Actions"].map((item) => <th key={item} className="p-3">{item}</th>)}</tr></thead>
        <tbody className="divide-y divide-stone-100">{sessions.map((session) => <tr key={session.id} className="hover:bg-stone-50"><td className="p-3 font-medium text-stone-900">{session.name}</td><td className="p-3"><Badge className={typeColor(session.type)}>{session.type}</Badge></td><td className="p-3 text-emerald-700">{instructors.find((item) => item.id === session.instructorId)?.name}</td><td className="p-3 text-stone-600">{session.recurring ? session.days.join(", ") : session.date} - {session.startTime}</td><td className="p-3 text-stone-600">{session.duration} min</td><td className="p-3"><Badge className="bg-stone-100 text-stone-700">{session.level}</Badge></td><td className="p-3 text-stone-600">{session.enrolled}/{session.capacity || "∞"}</td><td className="p-3 text-stone-600">{toMoney(session.price)}</td><td className="p-3"><Badge className={session.status === "Active" ? "bg-emerald-100 text-emerald-700" : session.status === "Cancelled" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"}>{session.status}</Badge></td><td className="p-3"><div className="flex gap-1"><Button variant="ghost" onClick={() => onEdit(session)}><Edit3 size={16} /></Button><Button variant="ghost" onClick={() => { setSessions((items) => [{ ...session, id: uid("session"), name: `${session.name} Copy`, status: "Paused" }, ...items]); toast("Session duplicated"); }}><Copy size={16} /></Button><Button variant="ghost" onClick={() => setSessions((items) => items.map((item) => item.id === session.id ? { ...item, status: "Archived" } : item))}><Archive size={16} /></Button><Button variant="ghost" onClick={() => { if (confirm("Delete this session?")) setSessions((items) => items.filter((item) => item.id !== session.id)); }}><Trash2 size={16} /></Button></div></td></tr>)}</tbody>
      </table>
    </section>
  );
}

function SessionsGrid({ sessions, instructors, onEdit }) {
  return <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{sessions.map((session) => <article key={session.id} className="overflow-hidden rounded-xl border border-stone-200 bg-white shadow-sm"><img src={session.image || "https://images.unsplash.com/photo-1545389336-cf090694435e?w=900&auto=format&fit=crop"} alt="" className="h-44 w-full object-cover" /><div className="p-4"><div className="mb-2 flex items-center justify-between"><Badge className={typeColor(session.type)}>{session.type}</Badge><Badge className="bg-stone-100 text-stone-700">{session.status}</Badge></div><h3 className="text-lg font-semibold text-stone-900">{session.name}</h3><p className="mt-1 text-sm text-stone-500">{session.shortDescription}</p><p className="mt-3 text-sm text-stone-600">{instructors.find((item) => item.id === session.instructorId)?.name} - {session.days.join(", ")} {session.startTime}</p><Button className="mt-4 w-full" onClick={() => onEdit(session)}><Edit3 size={16} /> Edit Session</Button></div></article>)}</div>;
}

function SessionEditor({ session, sessions, setSessions, instructors, media, setMedia, onClose, toast }) {
  const [draft, setDraft] = useState(session);
  const [tab, setTab] = useState("Basic");
  const exists = sessions.some((item) => item.id === session.id);
  const update = (key, value) => setDraft((current) => ({ ...current, [key]: value }));
  const save = () => {
    const next = { ...draft, duration: calculateDuration(draft.startTime, draft.endTime, draft.duration) };
    setSessions(exists ? sessions.map((item) => item.id === next.id ? next : item) : [next, ...sessions]);
    toast("Session saved");
    onClose();
  };

  return (
    <Modal title={draft.name} onClose={onClose} wide>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-2">{["Basic", "Schedule", "Media", "SEO", "Notes"].map((item) => <Button key={item} variant={tab === item ? "primary" : "secondary"} onClick={() => setTab(item)}>{item}</Button>)}</div>
        <Button onClick={save}><Save size={16} /> Save Session</Button>
      </div>
      {tab === "Basic" && <div className="grid gap-4 md:grid-cols-2"><Field label="Session Name" hint={`${draft.name.length}/80`}><TextInput maxLength={80} value={draft.name} onChange={(e) => update("name", e.target.value)} /></Field><Field label="Type"><Select value={draft.type} onChange={(e) => update("type", e.target.value)}>{SESSION_TYPES.map((item) => <option key={item}>{item}</option>)}</Select></Field><Field label="Short Description" hint={`${draft.shortDescription.length}/200`} className="md:col-span-2"><TextArea maxLength={200} value={draft.shortDescription} onChange={(e) => update("shortDescription", e.target.value)} /></Field><Field label="Full Description" className="md:col-span-2"><TextArea rows={6} value={draft.fullDescription} onChange={(e) => update("fullDescription", e.target.value)} /></Field><Field label="Difficulty"><Select value={draft.level} onChange={(e) => update("level", e.target.value)}>{LEVELS.map((item) => <option key={item}>{item}</option>)}</Select></Field><Field label="Language"><Select value={draft.language} onChange={(e) => update("language", e.target.value)}>{["English", "Nepali", "Both"].map((item) => <option key={item}>{item}</option>)}</Select></Field><TagChooser label="Styles" options={STYLES} value={draft.styles} onChange={(value) => update("styles", value)} /><TagInput value={draft.tags} onChange={(value) => update("tags", value)} /></div>}
      {tab === "Schedule" && <div className="grid gap-4 md:grid-cols-2"><Toggle label="Recurring session" checked={draft.recurring} onChange={(checked) => update("recurring", checked)} />{draft.recurring ? <TagChooser label="Days of week" options={DAYS} value={draft.days} onChange={(value) => update("days", value)} /> : <Field label="Specific date"><TextInput type="date" value={draft.date} onChange={(e) => update("date", e.target.value)} /></Field>}<Field label="Start time"><TextInput type="time" value={draft.startTime} onChange={(e) => update("startTime", e.target.value)} /></Field><Field label="End time"><TextInput type="time" value={draft.endTime} onChange={(e) => update("endTime", e.target.value)} /></Field><Field label="Start date"><TextInput type="date" value={draft.startDate} onChange={(e) => update("startDate", e.target.value)} /></Field><Field label="Optional end date"><TextInput type="date" value={draft.endDate} onChange={(e) => update("endDate", e.target.value)} /></Field><div className="rounded-xl bg-stone-100 p-4 text-sm text-stone-600">Duration: {calculateDuration(draft.startTime, draft.endTime, draft.duration)} min<br />Time zone: Nepal Time, UTC+5:45</div><Field label="Instructor"><Select value={draft.instructorId} onChange={(e) => update("instructorId", e.target.value)}>{instructors.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</Select></Field><Field label="Location"><Select value={draft.location} onChange={(e) => update("location", e.target.value)}>{["In-studio", "Online", "Both"].map((item) => <option key={item}>{item}</option>)}</Select></Field>{draft.location !== "Online" && <Field label="Room"><TextInput value={draft.room} onChange={(e) => update("room", e.target.value)} /></Field>}{draft.location !== "In-studio" && <Field label="Meeting link"><TextInput value={draft.meetingLink} onChange={(e) => update("meetingLink", e.target.value)} /></Field>}<Field label="Max Capacity"><TextInput type="number" value={draft.capacity} onChange={(e) => update("capacity", Number(e.target.value))} /></Field><Field label="Current Enrollment"><TextInput readOnly value={draft.enrolled} /></Field><Toggle label="Allow waitlist when full" checked={draft.waitlist} onChange={(checked) => update("waitlist", checked)} /><Field label="Pricing type"><Select value={draft.pricingType} onChange={(e) => update("pricingType", e.target.value)}>{["Free", "Fixed Price", "Drop-in + Package"].map((item) => <option key={item}>{item}</option>)}</Select></Field><Field label="NPR Amount"><TextInput type="number" value={draft.price} onChange={(e) => update("price", Number(e.target.value))} /></Field><Toggle label="Trial class available" checked={draft.trial} onChange={(checked) => update("trial", checked)} /><Field label="Status"><Select value={draft.status} onChange={(e) => update("status", e.target.value)}>{SESSION_STATUSES.map((item) => <option key={item}>{item}</option>)}</Select></Field><Toggle label="Show on homepage" checked={draft.homepage} onChange={(checked) => update("homepage", checked)} /><Toggle label="Featured session" checked={draft.featured} onChange={(checked) => update("featured", checked)} /><Field label="Display order"><TextInput type="number" value={draft.priority} onChange={(e) => update("priority", Number(e.target.value))} /></Field></div>}
      {tab === "Media" && <div className="space-y-4"><Field label="Featured Image"><TextInput value={draft.image} onChange={(e) => update("image", e.target.value)} /></Field><input type="file" accept="image/*" onChange={(e) => uploadFile(e, (url, item) => { update("image", url); setMedia([item || { id: uid("media"), url, caption: draft.name, usedBy: draft.id }, ...media]); }, { caption: draft.name, usedBy: draft.id })} className="text-sm" />{draft.image && <img src={draft.image} alt="" className="h-64 w-full rounded-xl object-cover" />}<GalleryEditor items={draft.gallery} onChange={(gallery) => update("gallery", gallery)} /><Field label="Promo video URL"><TextInput value={draft.video} onChange={(e) => update("video", e.target.value)} /></Field></div>}
      {tab === "SEO" && <SeoEditorFields value={sessionSeoDraft(draft)} onChange={(next) => setDraft({ ...draft, ...next })} allPages={sessions.map(sessionSeoDraft)} />}
      {tab === "Notes" && <div className="grid gap-4"><Field label="Admin-only notes"><TextArea rows={5} value={draft.notes} onChange={(e) => update("notes", e.target.value)} /></Field><Field label="Props / equipment needed"><TextArea value={draft.equipment} onChange={(e) => update("equipment", e.target.value)} /></Field><Field label="Prerequisites"><TextArea value={draft.prerequisites} onChange={(e) => update("prerequisites", e.target.value)} /></Field></div>}
    </Modal>
  );
}

function sessionSeoDraft(session) {
  const title = session.seoTitle || `${session.name} | Yogmandu`;
  return { ...session, seoTitle: title, metaDescription: session.metaDescription || session.shortDescription, canonical: session.canonical || `https://yogmandu.com/sessions/${slugify(session.name)}`, robotsIndex: session.robotsIndex || "index", robotsFollow: session.robotsFollow || "follow", ogTitle: session.ogTitle || title, ogDescription: session.ogDescription || session.shortDescription, ogImage: session.ogImage || session.image, ogType: "article", twitterCard: "summary_large_image", twitterTitle: session.twitterTitle || title, twitterDescription: session.twitterDescription || session.shortDescription, twitterImage: session.twitterImage || session.image, schemaType: "Event", schemaJson: session.schemaJson || JSON.stringify({ "@context": "https://schema.org", "@type": "Event", name: session.name, startDate: session.date || session.startDate }, null, 2), customHeadTags: session.customHeadTags || "", sitemapPriority: session.sitemapPriority || 0.7, changeFrequency: session.changeFrequency || "weekly" };
}

function calculateDuration(start, end, fallback) {
  if (!start || !end) return fallback;
  const [sh, sm] = start.split(":").map(Number);
  const [eh, em] = end.split(":").map(Number);
  const minutes = eh * 60 + em - (sh * 60 + sm);
  return minutes > 0 ? minutes : fallback;
}

function TagChooser({ label, options, value, onChange }) {
  return <Field label={label} className="md:col-span-2"><div className="flex flex-wrap gap-2">{options.map((option) => <button key={option} className={classNames("rounded-full border px-3 py-1 text-sm", value.includes(option) ? "border-emerald-600 bg-emerald-50 text-emerald-700" : "border-stone-300 bg-white text-stone-600")} onClick={() => onChange(value.includes(option) ? value.filter((item) => item !== option) : [...value, option])}>{option}</button>)}</div></Field>;
}

function WeeklySchedule({ sessions, instructors, onEdit }) {
  const [instructor, setInstructor] = useState("All");
  const [location, setLocation] = useState("All");
  const times = ["06:00", "07:00", "08:00", "12:00", "18:00", "20:00"];
  const filtered = sessions.filter((session) => session.status === "Active" && (instructor === "All" || session.instructorId === instructor) && (location === "All" || session.location === location));
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 rounded-xl border border-stone-200 bg-white p-4"><Select value={instructor} onChange={(e) => setInstructor(e.target.value)}><option>All</option>{instructors.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</Select><Select value={location} onChange={(e) => setLocation(e.target.value)}>{["All", "In-studio", "Online", "Both"].map((item) => <option key={item}>{item}</option>)}</Select><Button variant="secondary" onClick={() => window.print()}><Download size={16} /> Print Schedule</Button></div>
      <section className="overflow-auto rounded-xl border border-stone-200 bg-white p-4">
        <div className="grid min-w-[850px] grid-cols-[80px_repeat(7,1fr)] gap-2">
          <div />
          {DAYS.map((day) => <div key={day} className="rounded-lg bg-stone-100 p-2 text-center text-sm font-semibold text-stone-700">{day}</div>)}
          {times.map((time) => <React.Fragment key={time}><div className="py-3 text-sm text-stone-500">{time}</div>{DAYS.map((day) => <div key={`${day}-${time}`} className="min-h-24 rounded-lg border border-stone-100 bg-stone-50 p-1">{filtered.filter((session) => session.days.includes(day) && session.startTime === time).map((session) => <button key={session.id} onClick={() => onEdit(session)} className={classNames("mb-1 block w-full rounded-lg p-2 text-left text-xs", typeColor(session.type))}><strong>{session.name}</strong><br />{session.enrolled}/{session.capacity} spots</button>)}</div>)}</React.Fragment>)}
        </div>
      </section>
    </div>
  );
}

function InstructorsManager({ instructors, setInstructors, sessions, toast }) {
  const [editing, setEditing] = useState(null);
  return (
    <div className="space-y-4">
      <div className="flex justify-end"><Button onClick={() => setEditing({ id: uid("inst"), name: "", photo: "", bio: "", specialties: [], certifications: "", years: 1, social: { instagram: "", facebook: "", website: "" }, status: "Active" })}><Plus size={16} /> Add Instructor</Button></div>
      <section className="overflow-hidden rounded-xl border border-stone-200 bg-white">
        <table className="w-full text-left text-sm"><thead className="bg-stone-50 text-xs uppercase text-stone-500"><tr>{["Name", "Photo", "Specialties", "Active Sessions", "Status", "Actions"].map((item) => <th key={item} className="p-3">{item}</th>)}</tr></thead><tbody className="divide-y divide-stone-100">{instructors.map((inst) => <tr key={inst.id}><td className="p-3 font-medium">{inst.name}</td><td className="p-3">{inst.photo && <img src={inst.photo} alt="" className="h-12 w-12 rounded-full object-cover" />}</td><td className="p-3"><div className="flex flex-wrap gap-1">{inst.specialties.map((item) => <Badge key={item} className="bg-emerald-100 text-emerald-700">{item}</Badge>)}</div></td><td className="p-3">{sessions.filter((session) => session.instructorId === inst.id && session.status === "Active").length}</td><td className="p-3"><Badge className="bg-stone-100 text-stone-700">{inst.status}</Badge></td><td className="p-3"><Button variant="ghost" onClick={() => setEditing(inst)}><Edit3 size={16} /></Button></td></tr>)}</tbody></table>
      </section>
      {editing && <InstructorEditor instructor={editing} instructors={instructors} setInstructors={setInstructors} onClose={() => setEditing(null)} toast={toast} />}
    </div>
  );
}

function InstructorEditor({ instructor, instructors, setInstructors, onClose, toast }) {
  const [draft, setDraft] = useState(instructor);
  const exists = instructors.some((item) => item.id === instructor.id);
  const update = (key, value) => setDraft({ ...draft, [key]: value });
  return <Modal title="Instructor" onClose={onClose}><div className="grid gap-4"><Field label="Full name"><TextInput value={draft.name} onChange={(e) => update("name", e.target.value)} /></Field><Field label="Profile photo"><TextInput value={draft.photo} onChange={(e) => update("photo", e.target.value)} /></Field><input type="file" accept="image/*" onChange={(e) => uploadFile(e, (url) => update("photo", url))} className="text-sm" />{draft.photo && <img src={draft.photo} alt="" className="h-32 w-32 rounded-full object-cover" />}<Field label="Short bio"><TextArea value={draft.bio} onChange={(e) => update("bio", e.target.value)} /></Field><TagChooser label="Specialties" options={STYLES} value={draft.specialties} onChange={(value) => update("specialties", value)} /><Field label="Certifications"><TextArea value={draft.certifications} onChange={(e) => update("certifications", e.target.value)} /></Field><Field label="Years of experience"><TextInput type="number" value={draft.years} onChange={(e) => update("years", Number(e.target.value))} /></Field><div className="grid gap-3 md:grid-cols-3"><Field label="Instagram"><TextInput value={draft.social.instagram} onChange={(e) => update("social", { ...draft.social, instagram: e.target.value })} /></Field><Field label="Facebook"><TextInput value={draft.social.facebook} onChange={(e) => update("social", { ...draft.social, facebook: e.target.value })} /></Field><Field label="Website"><TextInput value={draft.social.website} onChange={(e) => update("social", { ...draft.social, website: e.target.value })} /></Field></div><Field label="Status"><Select value={draft.status} onChange={(e) => update("status", e.target.value)}>{["Active", "On Leave", "Archived"].map((item) => <option key={item}>{item}</option>)}</Select></Field><div className="flex justify-end gap-2"><Button variant="danger" onClick={() => { if (exists && confirm("Archive this instructor?")) { setInstructors(instructors.map((item) => item.id === draft.id ? { ...item, status: "Archived" } : item)); toast("Instructor archived"); onClose(); } }}>Archive</Button><Button onClick={() => { setInstructors(exists ? instructors.map((item) => item.id === draft.id ? draft : item) : [draft, ...instructors]); toast("Instructor saved"); onClose(); }}><Save size={16} /> Save</Button></div></div></Modal>;
}

function MediaLibrary({ media, setMedia, blogs, sessions, toast }) {
  const [filter, setFilter] = useState("All");
  const usedIds = new Set([...blogs.map((post) => post.featuredImage), ...sessions.map((session) => session.image)]);
  const filtered = media.filter((item) => filter === "All" || (filter === "Used" ? usedIds.has(item.url) || item.usedBy : !usedIds.has(item.url) && !item.usedBy));
  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-2">{["All", "Used", "Unused"].map((item) => <Button key={item} variant={filter === item ? "primary" : "secondary"} onClick={() => setFilter(item)}>{item}</Button>)}</div>
        <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-emerald-600 px-3 py-2 text-sm font-medium text-white hover:bg-emerald-700"><Upload size={16} /> Upload Image<input type="file" accept="image/*" className="hidden" onChange={(e) => uploadFile(e, (url, item) => { setMedia([item || { id: uid("media"), url, caption: "Uploaded image", usedBy: "" }, ...media]); toast("Image uploaded"); }, { caption: "Uploaded image" })} /></label>
      </div>
      <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-4">{filtered.map((item) => <article key={item.id} className="overflow-hidden rounded-xl border border-stone-200 bg-white"><img src={item.url} alt="" className="h-44 w-full object-cover" /><div className="p-3"><TextInput value={item.caption} onChange={(e) => setMedia(media.map((img) => img.id === item.id ? { ...img, caption: e.target.value } : img))} /><div className="mt-3 flex gap-2"><Button variant="secondary" onClick={() => { navigator.clipboard.writeText(item.url); toast("Image URL copied"); }}><Copy size={16} /></Button><Button variant="danger" onClick={() => setMedia(media.filter((img) => img.id !== item.id))}><Trash2 size={16} /></Button></div></div></article>)}</div>
    </div>
  );
}

function SettingsPage({ settings, setSettings, instructors, setInstructors, sessions, toast }) {
  const [xml, setXml] = useState("");
  const update = (key, value) => setSettings({ ...settings, [key]: value });
  return (
    <div className="grid gap-5 xl:grid-cols-2">
      <SettingsCard title="Site Settings"><Field label="Site name"><TextInput value={settings.siteName} onChange={(e) => update("siteName", e.target.value)} /></Field><Field label="Tagline"><TextInput value={settings.tagline} onChange={(e) => update("tagline", e.target.value)} /></Field><Field label="Site URL"><TextInput value={settings.siteUrl} onChange={(e) => update("siteUrl", e.target.value)} /></Field><Field label="Logo URL"><TextInput value={settings.logoUrl} onChange={(e) => update("logoUrl", e.target.value)} /></Field><Field label="Studio address"><TextInput value={settings.address} onChange={(e) => update("address", e.target.value)} /></Field><div className="grid gap-3 md:grid-cols-2"><Field label="Phone"><TextInput value={settings.phone} onChange={(e) => update("phone", e.target.value)} /></Field><Field label="Email"><TextInput value={settings.email} onChange={(e) => update("email", e.target.value)} /></Field></div></SettingsCard>
      <SettingsCard title="SEO Defaults"><Field label="Default OG image"><TextInput value={settings.defaultOgImage} onChange={(e) => update("defaultOgImage", e.target.value)} /></Field><Field label="Twitter handle"><TextInput value={settings.twitterHandle} onChange={(e) => update("twitterHandle", e.target.value)} /></Field><Field label="Google Analytics ID"><TextInput value={settings.analyticsId} onChange={(e) => update("analyticsId", e.target.value)} /></Field><Field label="Search Console verification tag"><TextInput value={settings.searchConsoleTag} onChange={(e) => update("searchConsoleTag", e.target.value)} /></Field><Field label="Facebook Pixel ID"><TextInput value={settings.pixelId} onChange={(e) => update("pixelId", e.target.value)} /></Field></SettingsCard>
      <SettingsCard title="Pricing & Packages"><TextArea rows={6} value={settings.packages.join("\n")} onChange={(e) => update("packages", e.target.value.split("\n"))} /></SettingsCard>
      <SettingsCard title="Booking / Enquiry Settings"><Field label="Contact form fields"><TextArea value={settings.bookingFields} onChange={(e) => update("bookingFields", e.target.value)} /></Field><Field label="Auto-reply email template"><TextArea value={settings.autoReply} onChange={(e) => update("autoReply", e.target.value)} /></Field></SettingsCard>
      <SettingsCard title="Session Categories"><TagChooser label="Session styles" options={STYLES} value={STYLES} onChange={() => {}} /><div className="grid grid-cols-3 gap-2">{SESSION_TYPES.map((type, index) => <label key={type} className="text-sm text-stone-600">{type}<input type="color" defaultValue={COLORS[index]} className="mt-1 h-9 w-full rounded" /></label>)}</div></SettingsCard>
      <SettingsCard title="Sitemap Settings"><Button onClick={() => { const output = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${["/", "/about", "/sessions", "/blog", ...sessions.map((s) => `/sessions/${slugify(s.name)}`)].map((path) => `  <url><loc>${settings.siteUrl}${path}</loc></url>`).join("\n")}\n</urlset>`; setXml(output); toast("Sitemap regenerated"); }}><RefreshCw size={16} /> Regenerate Sitemap</Button>{xml && <TextArea rows={10} value={xml} readOnly className="mt-3 font-mono" />}</SettingsCard>
      <SettingsCard title="Instructor Management"><InstructorsManager instructors={instructors} setInstructors={setInstructors} sessions={sessions} toast={toast} /></SettingsCard>
    </div>
  );
}

function SettingsCard({ title, children }) {
  return <section className="space-y-4 rounded-xl border border-stone-200 bg-white p-4"><h3 className="font-semibold text-stone-900">{title}</h3>{children}</section>;
}

function AdminLogin({ onAuthenticated, passwordConfigured }) {
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const submit = async (event) => {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      await fetchJson("/api/admin/auth", { method: "POST", body: JSON.stringify({ password }) });
      onAuthenticated();
    } catch (nextError) {
      setError(nextError.message || "Could not sign in.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-stone-950 p-4 text-stone-100">
      <form onSubmit={submit} className="w-full max-w-sm rounded-xl border border-stone-800 bg-stone-900 p-6 shadow-2xl">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-300">
            <ShieldCheck size={24} />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-white">Yogmandu Admin</h1>
            <p className="text-sm text-stone-400">Sign in to manage remote CMS data.</p>
          </div>
        </div>
        {!passwordConfigured && (
          <div className="mb-4 rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-sm text-amber-100">
            Set ADMIN_PASSWORD to enable protected Supabase editing.
          </div>
        )}
        <Field label="Admin password">
          <TextInput
            autoFocus
            disabled={!passwordConfigured || busy}
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </Field>
        {error && <p className="mt-3 text-sm text-red-300">{error}</p>}
        <Button disabled={!passwordConfigured || busy} className="mt-5 w-full">
          <ShieldCheck size={16} /> {busy ? "Signing in" : "Sign In"}
        </Button>
      </form>
    </div>
  );
}

function AdminWorkspace({ onLogout }) {
  const [state, setState, ready] = usePersistentAdminState();
  const [active, setActive] = useState("dashboard");
  const [collapsed, setCollapsed] = useState(false);
  const [toast, setToast] = useState("");
  const [syncStatus, setSyncStatus] = useState("Checking Supabase");
  const notify = (message) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 3000);
  };
  const logout = async () => {
    await fetch("/api/admin/auth", { method: "DELETE" }).catch(() => {});
    onLogout();
  };
  const saveRemote = async (key, value) => {
    const endpoint = { blogs: "/api/admin/blogs", sessions: "/api/admin/sessions", media: "/api/admin/media" }[key];
    if (!endpoint) return;
    try {
      setSyncStatus("Saving to Supabase");
      await fetchJson(endpoint, { method: "PUT", body: JSON.stringify(value) });
      setSyncStatus("Saved to Supabase");
    } catch (error) {
      setSyncStatus("Local changes only");
      notify(error.message || "Supabase save failed");
    }
  };
  const setPart = (key) => (valueOrUpdater) => {
    setState((current) => {
      const nextValue = typeof valueOrUpdater === "function" ? valueOrUpdater(current[key]) : valueOrUpdater;
      if (["blogs", "sessions", "media"].includes(key)) {
        window.setTimeout(() => saveRemote(key, nextValue), 0);
      }
      return { ...current, [key]: nextValue };
    });
  };

  useEffect(() => {
    if (!ready) return;
    let cancelled = false;
    loadRemoteCms()
      .then((remote) => {
        if (cancelled) return;
        if (!remote.configured) {
          setSyncStatus("Supabase not configured");
          return;
        }
        setState((current) => ({
          ...current,
          blogs: remote.blogs.length ? remote.blogs : current.blogs,
          sessions: remote.sessions.length ? remote.sessions : current.sessions,
          media: remote.media.length ? remote.media : current.media,
        }));
        setSyncStatus("Connected to Supabase");
      })
      .catch((error) => {
        if (!cancelled) {
          setSyncStatus("Local fallback active");
          notify(error.message || "Could not load Supabase data");
        }
      });
    return () => {
      cancelled = true;
    };
  }, [ready]);

  const nav = [
    ["dashboard",   "Dashboard",    LayoutDashboard],
    ["siteLayout",  "Site Layout",  Globe2],
    ["seo",         "SEO Manager",  ShieldCheck],
    ["blog",        "Blog Manager", BookOpen],
    ["sessions",    "Sessions",     CalendarDays],
    ["instructors", "Instructors",  Users],
    ["media",       "Media",        Camera],
    ["settings",    "Settings",     Settings],
  ];
  const title = nav.find(([id]) => id === active)?.[1] || "Dashboard";

  if (!ready) {
    return <div className="min-h-screen bg-stone-50 p-8"><div className="mx-auto max-w-5xl space-y-4">{Array.from({ length: 5 }, (_, i) => <div key={i} className="h-24 animate-pulse rounded-xl bg-stone-200" />)}</div></div>;
  }

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900">
      <aside className={classNames("fixed inset-y-0 left-0 z-30 hidden bg-stone-950 p-3 text-stone-200 transition-all md:block", collapsed ? "w-20" : "w-60")}>
        <div className="mb-6 flex items-center justify-between">
          <div className={classNames("flex items-center gap-2", collapsed && "justify-center")}><Sparkles className="text-emerald-400" /><span className={classNames("font-semibold text-white", collapsed && "hidden")}>Yogmandu</span></div>
          <Button variant="ghost" className="text-stone-300 hover:bg-stone-800" onClick={() => setCollapsed(!collapsed)}>{collapsed ? <ChevronRight size={17} /> : <ChevronLeft size={17} />}</Button>
        </div>
        <nav className="space-y-1">{nav.map(([id, label, Icon]) => <button key={id} onClick={() => setActive(id)} className={classNames("flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition", active === id ? "bg-emerald-600 text-white" : "text-stone-300 hover:bg-stone-800 hover:text-white", collapsed && "justify-center")}><Icon size={18} /> <span className={collapsed ? "hidden" : ""}>{label}</span></button>)}</nav>
      </aside>
      <div className={classNames("transition-all", collapsed ? "md:pl-20" : "md:pl-60")}>
        <header className="sticky top-0 z-20 border-b border-stone-200 bg-white/90 px-4 py-3 backdrop-blur">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-3">
            <div className="flex items-center gap-3"><Button variant="ghost" className="md:hidden" onClick={() => setCollapsed(false)}><Menu size={18} /></Button><div><h1 className="text-xl font-semibold text-stone-900">{title}</h1><p className="text-sm text-stone-500">Calm studio operations, clear content, healthy search presence.</p></div></div>
            <div className="flex items-center gap-3"><Badge className={syncStatus.includes("Supabase") || syncStatus.includes("Connected") || syncStatus.includes("Saved") ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}>{syncStatus}</Badge><button className="relative rounded-full p-2 hover:bg-stone-100"><Bell size={18} /><span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-emerald-500" /></button><Button variant="secondary" onClick={logout}><ShieldCheck size={16} /> Logout</Button><div className="h-9 w-9 rounded-full bg-emerald-700 text-center text-sm font-semibold leading-9 text-white">YM</div></div>
          </div>
        </header>
        <main className="mx-auto max-w-7xl p-4 md:p-6">
          {active === "dashboard"  && <Dashboard data={state} setActive={setActive} toast={notify} />}
          {active === "siteLayout" && <SiteLayoutManager toast={notify} />}
          {active === "seo"        && <SeoManager pages={state.seoPages} setPages={setPart("seoPages")} toast={notify} />}
          {active === "blog" && <BlogManager blogs={state.blogs} setBlogs={setPart("blogs")} media={state.media} setMedia={setPart("media")} toast={notify} />}
          {active === "sessions" && <SessionsManager sessions={state.sessions} setSessions={setPart("sessions")} instructors={state.instructors} setInstructors={setPart("instructors")} media={state.media} setMedia={setPart("media")} toast={notify} />}
          {active === "instructors" && <InstructorsManager instructors={state.instructors} setInstructors={setPart("instructors")} sessions={state.sessions} toast={notify} />}
          {active === "media" && <MediaLibrary media={state.media} setMedia={setPart("media")} blogs={state.blogs} sessions={state.sessions} toast={notify} />}
          {active === "settings" && <SettingsPage settings={state.settings} setSettings={setPart("settings")} instructors={state.instructors} setInstructors={setPart("instructors")} sessions={state.sessions} toast={notify} />}
        </main>
      </div>
      {toast && <div className="fixed bottom-5 right-5 z-50 rounded-xl bg-stone-950 px-4 py-3 text-sm font-medium text-white shadow-xl">{toast} <Check className="ml-2 inline text-emerald-400" size={16} /></div>}
    </div>
  );
}

/* ─────────────────────────────────────────────
   Site Layout Manager  (Nav + Footer editor)
───────────────────────────────────────────── */
const DEFAULT_NAV = {
  services: [
    { href: "/class-schedule",        label: "Class Schedule",          icon: "🗓", desc: "Weekly yoga class timetable" },
    { href: "/yoga-teacher-training", label: "200hr Teacher Training",  icon: "🧘", desc: "Yoga Alliance RYS 200 certified" },
    { href: "/yoga-teacher-training", label: "300hr Advanced Training", icon: "⭐", desc: "Yoga Alliance RYS 300 certified" },
    { href: "/sound-healing-therapy", label: "Sound Healing Sessions",  icon: "🎵", desc: "Individual & group sessions" },
    { href: "/sound-healing-therapy", label: "Sound Healing Cert.",     icon: "📜", desc: "Become a certified practitioner" },
  ],
  leftLinks:    [{ href: "/about", label: "About" }, { href: "/gallery", label: "Gallery" }],
  rightLinks:   [{ href: "/blog",  label: "Blog"  }, { href: "/contact", label: "Contact" }],
  youtubeUrl:   "https://www.youtube.com/@yogmandu",
  tagline:      "Yoga & Sound Healing · Nepal",
  bookNowLabel: "Book Now",
  bookNowHref:  "/contact",
};

const DEFAULT_FOOTER = {
  tagline:     "Nepal is calling.",
  taglineEm:   "Are you ready?",
  ctaTagline:  "Begin your journey",
  description: "Yoga Alliance certified teacher training & authentic Tibetan Sound Healing in Kathmandu, Nepal. Transforming practitioners since 2015.",
  programs: [
    { href: "/class-schedule",        label: "Class Schedule" },
    { href: "/yoga-teacher-training", label: "200hr Teacher Training" },
    { href: "/yoga-teacher-training", label: "300hr Advanced Training" },
    { href: "/sound-healing-therapy", label: "Sound Healing Sessions" },
    { href: "/sound-healing-therapy", label: "Sound Healing Cert." },
  ],
  company: [
    { href: "/about",   label: "About Us" },
    { href: "/gallery", label: "Gallery"  },
    { href: "/blog",    label: "Blog"     },
    { href: "/contact", label: "Contact"  },
  ],
  contact: [
    { icon: "📍", text: "Miteri Marg, Mid-Baneshwor-31, Kathmandu, Nepal" },
    { icon: "📞", text: "+977-9862909469 / +977-9810263277" },
    { icon: "✉️", text: "info@yogmandu.com" },
    { icon: "🕐", text: "Mon–Sun · 6:00–20:00" },
  ],
  youtubeUrl:   "https://www.youtube.com/@yogmandu",
  instagramUrl: "https://instagram.com/yogmandu",
  facebookUrl:  "https://facebook.com/yogmandu",
  whatsappUrl:  "https://wa.me/9779862909469",
  badge:        "Yoga Alliance RYS 200 & 300 · Kathmandu, Nepal",
};

function LinkListEditor({ label, value, onChange, withIcon = false, withDesc = false }) {
  const update = (i, key, val) => {
    const next = value.map((item, idx) => idx === i ? { ...item, [key]: val } : item);
    onChange(next);
  };
  const remove = (i) => onChange(value.filter((_, idx) => idx !== i));
  const add    = () => onChange([...value, { href: "/", label: "New Link", icon: "🔗", desc: "" }]);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-semibold uppercase tracking-wide text-stone-500">{label}</span>
        <Button variant="secondary" className="h-7 px-2 text-xs" onClick={add}><Plus size={12} /> Add</Button>
      </div>
      {value.map((item, i) => (
        <div key={i} className="flex gap-2 items-start rounded-lg border border-stone-200 bg-white p-3">
          {withIcon && (
            <TextInput className="w-12 text-center text-lg p-1" value={item.icon || ""} onChange={e => update(i, "icon", e.target.value)} placeholder="🔗" />
          )}
          <div className="flex-1 grid gap-2">
            <div className="grid grid-cols-2 gap-2">
              <TextInput value={item.label} onChange={e => update(i, "label", e.target.value)} placeholder="Label" />
              <TextInput value={item.href}  onChange={e => update(i, "href",  e.target.value)} placeholder="/path" />
            </div>
            {withDesc && (
              <TextInput value={item.desc || ""} onChange={e => update(i, "desc", e.target.value)} placeholder="Short description" />
            )}
          </div>
          <Button variant="ghost" className="h-8 w-8 p-0 text-red-400 hover:text-red-600" onClick={() => remove(i)}><Trash2 size={14} /></Button>
        </div>
      ))}
    </div>
  );
}

function ContactListEditor({ value, onChange }) {
  const update = (i, key, val) => onChange(value.map((item, idx) => idx === i ? { ...item, [key]: val } : item));
  const remove = (i) => onChange(value.filter((_, idx) => idx !== i));
  const add    = () => onChange([...value, { icon: "📌", text: "" }]);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-semibold uppercase tracking-wide text-stone-500">Contact Info</span>
        <Button variant="secondary" className="h-7 px-2 text-xs" onClick={add}><Plus size={12} /> Add</Button>
      </div>
      {value.map((item, i) => (
        <div key={i} className="flex gap-2 items-center rounded-lg border border-stone-200 bg-white p-2">
          <TextInput className="w-12 text-center text-lg p-1" value={item.icon} onChange={e => update(i, "icon", e.target.value)} />
          <TextInput className="flex-1" value={item.text} onChange={e => update(i, "text", e.target.value)} placeholder="Contact detail" />
          <Button variant="ghost" className="h-8 w-8 p-0 text-red-400" onClick={() => remove(i)}><Trash2 size={14} /></Button>
        </div>
      ))}
    </div>
  );
}

function SiteLayoutManager({ toast }) {
  const [tab,    setTab]    = useState("nav");
  const [nav,    setNav]    = useState(DEFAULT_NAV);
  const [footer, setFooter] = useState(DEFAULT_FOOTER);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/admin/site-config")
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data?.nav)    setNav(prev    => ({ ...prev, ...data.nav }));
        if (data?.footer) setFooter(prev => ({ ...prev, ...data.footer }));
      })
      .catch(() => {});
  }, []);

  async function save() {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/site-config", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nav, footer }),
      });
      if (res.ok) toast("Site layout saved — visible on next page load");
      else toast("Save failed — check admin password is set");
    } catch {
      toast("Save failed — server error");
    }
    setSaving(false);
  }

  const updateNav    = (key, val) => setNav(prev    => ({ ...prev, [key]: val }));
  const updateFooter = (key, val) => setFooter(prev => ({ ...prev, [key]: val }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-stone-900">Site Layout</h2>
          <p className="text-sm text-stone-500">Edit the navigation bar and footer. Changes are live after saving.</p>
        </div>
        <Button onClick={save} disabled={saving}>
          <Save size={16} /> {saving ? "Saving…" : "Save & Publish"}
        </Button>
      </div>

      <div className="flex gap-2 border-b border-stone-200 pb-0">
        {["nav", "footer"].map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={classNames("px-4 py-2 text-sm font-medium border-b-2 -mb-px transition",
              tab === t ? "border-emerald-600 text-emerald-700" : "border-transparent text-stone-500 hover:text-stone-700")}>
            {t === "nav" ? "Navigation Bar" : "Footer"}
          </button>
        ))}
      </div>

      {tab === "nav" && (
        <div className="space-y-6">
          <div className="grid gap-4 rounded-xl border border-stone-200 bg-stone-50 p-5 md:grid-cols-2">
            <Field label="Tagline (under logo)">
              <TextInput value={nav.tagline} onChange={e => updateNav("tagline", e.target.value)} />
            </Field>
            <Field label="YouTube URL">
              <TextInput value={nav.youtubeUrl} onChange={e => updateNav("youtubeUrl", e.target.value)} />
            </Field>
            <Field label="Book Now button label">
              <TextInput value={nav.bookNowLabel} onChange={e => updateNav("bookNowLabel", e.target.value)} />
            </Field>
            <Field label="Book Now button link">
              <TextInput value={nav.bookNowHref} onChange={e => updateNav("bookNowHref", e.target.value)} />
            </Field>
          </div>

          <div className="rounded-xl border border-stone-200 bg-stone-50 p-5 space-y-6">
            <LinkListEditor label="Services Dropdown" value={nav.services} onChange={v => updateNav("services", v)} withIcon withDesc />
            <LinkListEditor label="Left Nav Links" value={nav.leftLinks}   onChange={v => updateNav("leftLinks",  v)} />
            <LinkListEditor label="Right Nav Links" value={nav.rightLinks}  onChange={v => updateNav("rightLinks", v)} />
          </div>
        </div>
      )}

      {tab === "footer" && (
        <div className="space-y-6">
          <div className="grid gap-4 rounded-xl border border-stone-200 bg-stone-50 p-5 md:grid-cols-2">
            <Field label="CTA tag (small text above heading)">
              <TextInput value={footer.ctaTagline} onChange={e => updateFooter("ctaTagline", e.target.value)} />
            </Field>
            <Field label="Tagline">
              <TextInput value={footer.tagline} onChange={e => updateFooter("tagline", e.target.value)} />
            </Field>
            <Field label="Tagline emphasis (orange italic)">
              <TextInput value={footer.taglineEm} onChange={e => updateFooter("taglineEm", e.target.value)} />
            </Field>
            <Field label="Badge text (bottom right)">
              <TextInput value={footer.badge} onChange={e => updateFooter("badge", e.target.value)} />
            </Field>
            <Field label="Description" className="md:col-span-2">
              <TextArea value={footer.description} onChange={e => updateFooter("description", e.target.value)} />
            </Field>
          </div>

          <div className="rounded-xl border border-stone-200 bg-stone-50 p-5 space-y-6">
            <LinkListEditor label="Programs Links" value={footer.programs} onChange={v => updateFooter("programs", v)} />
            <LinkListEditor label="Company Links"  value={footer.company}  onChange={v => updateFooter("company",  v)} />
            <ContactListEditor value={footer.contact} onChange={v => updateFooter("contact", v)} />
          </div>

          <div className="grid gap-4 rounded-xl border border-stone-200 bg-stone-50 p-5 md:grid-cols-2">
            <Field label="YouTube URL">
              <TextInput value={footer.youtubeUrl}   onChange={e => updateFooter("youtubeUrl",   e.target.value)} />
            </Field>
            <Field label="Instagram URL">
              <TextInput value={footer.instagramUrl} onChange={e => updateFooter("instagramUrl", e.target.value)} />
            </Field>
            <Field label="Facebook URL">
              <TextInput value={footer.facebookUrl}  onChange={e => updateFooter("facebookUrl",  e.target.value)} />
            </Field>
            <Field label="WhatsApp URL">
              <TextInput value={footer.whatsappUrl}  onChange={e => updateFooter("whatsappUrl",  e.target.value)} />
            </Field>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminPanel() {
  const [auth, setAuth] = useState({ loading: true, passwordConfigured: false, authenticated: false });

  useEffect(() => {
    let cancelled = false;
    fetchJson("/api/admin/auth")
      .then((payload) => {
        if (!cancelled) setAuth({ loading: false, passwordConfigured: payload.passwordConfigured, authenticated: payload.authenticated });
      })
      .catch(() => {
        if (!cancelled) setAuth({ loading: false, passwordConfigured: false, authenticated: false });
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (auth.loading) {
    return <div className="min-h-screen bg-stone-50 p-8"><div className="mx-auto max-w-5xl space-y-4">{Array.from({ length: 5 }, (_, i) => <div key={i} className="h-24 animate-pulse rounded-xl bg-stone-200" />)}</div></div>;
  }

  if (auth.passwordConfigured && !auth.authenticated) {
    return <AdminLogin passwordConfigured={auth.passwordConfigured} onAuthenticated={() => setAuth((current) => ({ ...current, authenticated: true }))} />;
  }

  if (!auth.passwordConfigured) {
    return <AdminWorkspace onLogout={() => setAuth((current) => ({ ...current, authenticated: false }))} />;
  }

  return <AdminWorkspace onLogout={() => setAuth((current) => ({ ...current, authenticated: false }))} />;
}
