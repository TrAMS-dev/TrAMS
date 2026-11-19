// Non-admin users who may view course bookings (/admin/kursbestillinger).
// Keep in sync with public.can_view_course_submissions() in supabase/migrations,
// which enforces the same list in RLS.
export const COURSE_BOOKING_VIEWER_EMAILS = [
    'eksternkoordinator@trams.no',
    'eksternsjef@trams.no',
]

export function canViewCourseBookings(isAdmin: boolean, email: string | null | undefined): boolean {
    if (isAdmin) return true
    if (!email) return false
    return COURSE_BOOKING_VIEWER_EMAILS.includes(email.toLowerCase())
}
