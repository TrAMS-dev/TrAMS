-- Let specific non-admin accounts read CourseSubmissions (the
-- /admin/kursbestillinger table). Keep this list in sync with
-- lib/courseBookingAccess.ts.
-- Matches on auth.users.email (not profiles.email) and requires an approved
-- profile, same as the /admin route guard.

CREATE OR REPLACE FUNCTION "public"."can_view_course_submissions"() RETURNS boolean
    LANGUAGE "sql" STABLE SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
  select "public"."is_admin"() or exists (
    select 1
    from auth.users u
    join profiles p on p.id = u.id
    where u.id = auth.uid()
      and p.approved
      and lower(u.email) in ('eksternkoordinator@trams.no', 'eksternsjef@trams.no')
  );
$$;

ALTER FUNCTION "public"."can_view_course_submissions"() OWNER TO "postgres";
REVOKE ALL ON FUNCTION "public"."can_view_course_submissions"() FROM PUBLIC, "anon";
GRANT EXECUTE ON FUNCTION "public"."can_view_course_submissions"() TO "authenticated";

DROP POLICY IF EXISTS "course_submissions_select_by_admin" ON "public"."CourseSubmissions";

CREATE POLICY "course_submissions_select_by_viewer" ON "public"."CourseSubmissions"
    FOR SELECT TO "authenticated"
    USING ("public"."can_view_course_submissions"());
