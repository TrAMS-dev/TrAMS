-- BookKursForm requires and submits "organisasjonsnummer", and
-- app/api/supabase/route.ts has always tried to insert it, but the
-- column never existed on CourseSubmissions. Every insert failed with
-- "column organisasjonsnummer does not exist", and the client only
-- logs that failure (see app/api/supabase/route.ts and
-- components/BookKursForm.tsx) without surfacing it to the user, so
-- submissions silently never reached the database.

ALTER TABLE "public"."CourseSubmissions"
    ADD COLUMN IF NOT EXISTS "organisasjonsnummer" "text";
