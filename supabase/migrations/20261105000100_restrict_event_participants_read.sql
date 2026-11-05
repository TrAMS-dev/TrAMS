-- Step 2 of 2. Apply only after the app code that uses
-- get_public_event_participants() and the service-role signup route is deployed.
--
-- Before: anyone with the public anon key could read every participant's
-- email, phone, allergies and signup answers.
-- After:
--   * anon: no direct reads. The public page uses get_public_event_participants().
--     Anon keeps INSERT (the existing "Enable insert access for all users" policy).
--   * authenticated: can read and delete rows only if their profile is approved
--     (same rule as the existing UPDATE policy). Unapproved accounts see nothing.
--   * service_role (signup API route, cron): bypasses RLS, unchanged.

DROP POLICY IF EXISTS "Enable read access for all users" ON "public"."EventParticipants";

CREATE POLICY "event_participants_select_by_approved_profile" ON "public"."EventParticipants"
    FOR SELECT TO "authenticated"
    USING ((EXISTS ( SELECT 1
       FROM "public"."profiles" "p"
      WHERE (("p"."id" = "auth"."uid"()) AND ("p"."approved" IS TRUE)))));

-- DELETE was open to every signed-in account (USING true), approved or not.
-- Only approved profiles may delete now (admin remove and event delete routes).
DROP POLICY IF EXISTS "Admins can delete event participants" ON "public"."EventParticipants";

CREATE POLICY "Admins can delete event participants" ON "public"."EventParticipants"
    FOR DELETE TO "authenticated"
    USING ((EXISTS ( SELECT 1
       FROM "public"."profiles" "p"
      WHERE (("p"."id" = "auth"."uid"()) AND ("p"."approved" IS TRUE)))));

-- Defence in depth: anon only needs INSERT on this table.
REVOKE ALL ON TABLE "public"."EventParticipants" FROM "anon";
GRANT INSERT ON TABLE "public"."EventParticipants" TO "anon";
