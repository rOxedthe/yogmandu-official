// Display helpers for the admin Sessions UI.
//
// The canonical session record (see `DBSession` in lib/publicData.ts, and what
// /api/admin/sessions actually returns) stores `instructorId` as the instructor's
// *display name* and does NOT track `capacity` / `enrolled` — these are drop-in
// classes. Older seed/mock data used a richer shape (instructorId = a real id,
// plus capacity/enrolled/recurring/date). These helpers tolerate both so the
// admin no longer renders "NaN/undefined", "/∞", a blank instructor, or a bare
// "- 05:30" when fed real data. Mirrors the public site's resolveInstructor().

export interface AdminSessionLike {
  instructorId?: string;
  capacity?: number | null;
  enrolled?: number | null;
  days?: string[];
  date?: string;
  startTime?: string;
  recurring?: boolean;
}

export interface InstructorLike {
  id: string;
  name: string;
}

/** Instructor display name: matched record's name, else the stored value
 *  (which IS the name in canonical data), else empty. */
export function sessionInstructorName(
  session: AdminSessionLike | undefined,
  instructors: InstructorLike[] = [],
): string {
  const id = session?.instructorId;
  if (!id) return "";
  const match = instructors.find((item) => item.id === id);
  return match?.name ?? id;
}

/** True only when the session carries a real positive capacity. */
export function sessionTracksCapacity(session: AdminSessionLike | undefined): boolean {
  return (
    typeof session?.capacity === "number" &&
    Number.isFinite(session.capacity) &&
    (session.capacity as number) > 0
  );
}

/** "enrolled/capacity" when capacity is tracked, otherwise "—" (never NaN/∞). */
export function sessionSpotsLabel(session: AdminSessionLike | undefined): string {
  if (!sessionTracksCapacity(session)) return "—";
  const enrolled = Number.isFinite(session?.enrolled as number) ? (session!.enrolled as number) : 0;
  return `${enrolled}/${session!.capacity}`;
}

/** "Mon, Wed - 06:30" from days (or a specific date) + start time. */
export function sessionScheduleLabel(session: AdminSessionLike | undefined): string {
  const when = session?.days && session.days.length ? session.days.join(", ") : session?.date || "";
  const time = session?.startTime || "";
  return [when, time].filter(Boolean).join(" - ");
}
