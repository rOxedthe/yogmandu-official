import { getSupabaseAdmin, isSupabaseConfigured } from "./supabaseAdmin";

// ── Instructor name lookup (IDs from admin panel) ─────────────────────────────
export const INSTRUCTORS: Record<string, string> = {
  "inst-chintamani": "Dr. Chintamani Gautam",
  "inst-arjun":      "Arjun Rakhal Magar",
  "inst-dipika":     "Arjun Neupane",
};

export function resolveInstructor(id: string): string {
  return INSTRUCTORS[id] ?? id;
}

// ── Style → accent colour ─────────────────────────────────────────────────────
export function styleToAccent(styles: string[]): string {
  const s = styles?.[0] ?? "";
  if (s === "Sound Healing") return "#6B2D8B";
  if (s === "Hatha")         return "#F7941D";
  if (s === "Vinyasa")       return "#F7941D";
  if (s === "Ashtanga")      return "#F7941D";
  if (s === "Yin")           return "#8DC63F";
  if (s === "Restorative")   return "#8DC63F";
  if (s === "Meditation")    return "#6B2D8B";
  if (s === "Pranayama")     return "#6B2D8B";
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
