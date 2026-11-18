-- Before: "Allow authenticated reads" had no TO clause, so it applied to
-- every role — combined with the GRANT ALL ... TO "anon" below, the public
-- anon key could read every course booking's contact details.
-- After: only admins (profiles.role = 'admin') can read CourseSubmissions,
-- for the new admin-only bookings table. Anon keeps INSERT so the public
-- booking form (app/api/supabase/route.ts) still works.

DROP POLICY IF EXISTS "Allow authenticated reads" ON "public"."CourseSubmissions";

CREATE POLICY "course_submissions_select_by_admin" ON "public"."CourseSubmissions"
    FOR SELECT TO "authenticated"
    USING ("public"."is_admin"());

REVOKE ALL ON TABLE "public"."CourseSubmissions" FROM "anon";
GRANT INSERT ON TABLE "public"."CourseSubmissions" TO "anon";
