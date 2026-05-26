import { getSupabaseAdmin, isSupabaseConfigured } from "./supabaseAdmin";

// ── Instructor lookup ─────────────────────────────────────────────────────────
// Fallback used when Supabase is empty or not configured.
const FALLBACK_INSTRUCTORS: Record<string, string> = {
  "inst-chintamani": "Dr. Chintamani Gautam",
  "inst-arjun":      "Arjun Rakhal Magar",
  "inst-dipika":     "Arjun Neupane",
};

export const INSTRUCTORS: Record<string, string> = FALLBACK_INSTRUCTORS;

export interface DBInstructor {
  id:             string;
  name:           string;
  photo?:         string;
  bio?:           string;
  specialties?:   string[];
  certifications?: string;
  years?:         number;
  status?:        string;
  displayOrder?:  number;
  social?:        { instagram?: string; facebook?: string; website?: string };
}

export async function getInstructors(): Promise<DBInstructor[] | null> {
  if (!isSupabaseConfigured) return null;
  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("yogmandu_instructors")
      .select("data")
      .order("display_order", { ascending: true })
      .order("name", { ascending: true });
    if (error) return null;
    return (data ?? []).map((row) => row.data as DBInstructor);
  } catch {
    return null;
  }
}

export async function getInstructorMap(): Promise<Record<string, string>> {
  const list = await getInstructors();
  if (!list || list.length === 0) return FALLBACK_INSTRUCTORS;
  const map: Record<string, string> = { ...FALLBACK_INSTRUCTORS };
  for (const i of list) map[i.id] = i.name;
  return map;
}

export function resolveInstructor(id: string, map: Record<string, string> = FALLBACK_INSTRUCTORS): string {
  return map[id] ?? FALLBACK_INSTRUCTORS[id] ?? id;
}

// ── Style → accent colour ─────────────────────────────────────────────────────
export function styleToAccent(styles: string[]): string {
  const s = styles?.[0] ?? "";
  if (s === "Sound Healing")            return "#6B2D8B";
  if (s === "Hatha")                    return "#F7941D";
  if (s === "Vinyasa" || s === "Vinyasa Flow") return "#F7941D";
  if (s === "Ashtanga" || s === "Ashtanga Vinyasa") return "#F7941D";
  if (s === "Power Yoga" || s === "Power") return "#F7941D";
  if (s === "Flexibility Yoga")         return "#F7941D";
  if (s === "Yin")                      return "#8DC63F";
  if (s === "Restorative")              return "#8DC63F";
  if (s === "Meditation")               return "#6B2D8B";
  if (s === "Pranayama" || s === "Pranayama & Surya Namaskar") return "#6B2D8B";
  if (s === "Asana Flow & Meditation" || s === "Asana & Meditation") return "#6B2D8B";
  if (s === "Asana & Pranayama")        return "#6B2D8B";
  if (s === "Online Zoom Meditation" || s === "Online Meditation") return "#6B2D8B";
  if (s === "Yoga Teacher's Training" || s === "Yoga Teachers Training") return "#4A6418";
  return "#F7941D";
}

// ── Sessions ──────────────────────────────────────────────────────────────────
export interface DBSession {
  id: string;
  name: string;
  shortDescription: string;
  type: string;
  styles: string[];
  level: string;
  days: string[];
  startTime: string;
  endTime: string;
  duration: number;
  instructorId: string;
  price: number;
  status: string;
  featured: boolean;
  homepage: boolean;
  priority: number;
}

export async function getActiveSessions(): Promise<DBSession[] | null> {
  if (!isSupabaseConfigured) return null;
  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("yogmandu_sessions")
      .select("data")
      .in("status", ["Active", "Upcoming"])
      .order("display_order", { ascending: true });
    if (error) return null;
    return (data ?? []).map((row) => row.data as DBSession);
  } catch {
    return null;
  }
}

// ── Blogs ─────────────────────────────────────────────────────────────────────
export interface DBBlog {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  author: string;
  category: string;
  tags: string[];
  status: string;
  featured: boolean;
  featuredImage: string;
  publishDate: string;
  createdAt: string;
  seoTitle: string;
  metaDescription: string;
  ogImage: string;
}

export async function getPublishedBlogs(): Promise<DBBlog[] | null> {
  if (!isSupabaseConfigured) return null;
  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("yogmandu_blogs")
      .select("data")
      .eq("status", "Published")
      .order("published_at", { ascending: false });
    if (error) return null;
    return (data ?? []).map((row) => row.data as DBBlog);
  } catch {
    return null;
  }
}

export async function getBlogBySlug(slug: string): Promise<DBBlog | null> {
  if (!isSupabaseConfigured) return null;
  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("yogmandu_blogs")
      .select("data")
      .eq("slug", slug)
      .eq("status", "Published")
      .single();
    if (error) return null;
    return data?.data as DBBlog ?? null;
  } catch {
    return null;
  }
}

// ── Media ─────────────────────────────────────────────────────────────────────
export interface DBMedia {
  id: string;
  url: string;
  caption: string;
  usedBy: string;
}

// ── Gallery items (admin-managed) ────────────────────────────────────────────
export interface DBGalleryItem {
  id:           string;
  url:          string;
  path?:        string;
  title:        string;
  category:     string;
  displayOrder: number;
  createdAt?:   string;
}

export async function getGalleryItems(): Promise<DBGalleryItem[] | null> {
  if (!isSupabaseConfigured) return null;
  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("yogmandu_gallery_items")
      .select("data")
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: false });
    if (error) return null;
    return (data ?? []).map((row) => row.data as DBGalleryItem);
  } catch {
    return null;
  }
}

export async function getMediaItems(): Promise<DBMedia[] | null> {
  if (!isSupabaseConfigured) return null;
  try {
    const supabase = getSupabaseAdmin();
    // Select the 'data' JSONB column (camelCase) for consistency with other getters.
    // The 'data' column is always populated by both the admin PUT and the upload POST.
    const { data, error } = await supabase
      .from("yogmandu_media")
      .select("data")
      .order("created_at", { ascending: false });
    if (error) return null;
    return (data ?? []).map((row) => row.data as DBMedia);
  } catch {
    return null;
  }
}
