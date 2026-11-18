-- Reusable sets of feedback questions. Choosing a template in the event form
-- copies its questions into Events.feedback_questions, so later edits to a
-- template don't change events that already used it.

CREATE TABLE IF NOT EXISTS "public"."FeedbackTemplates" (
    "id" bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "name" "text" NOT NULL,
    "questions" "jsonb" DEFAULT '[]'::"jsonb" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "created_by" "uuid" DEFAULT "auth"."uid"(),
    CONSTRAINT "FeedbackTemplates_name_length" CHECK (("char_length"("btrim"("name")) BETWEEN 1 AND 100)),
    CONSTRAINT "FeedbackTemplates_questions_is_array" CHECK (("jsonb_typeof"("questions") = 'array'::"text"))
);

COMMENT ON TABLE "public"."FeedbackTemplates" IS
    'Reusable feedback questions, same shape as Events.feedback_questions';

ALTER TABLE "public"."FeedbackTemplates" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "FeedbackTemplates approved read" ON "public"."FeedbackTemplates"
    FOR SELECT TO "authenticated"
    USING ((EXISTS ( SELECT 1 FROM "public"."profiles"
        WHERE (("profiles"."id" = "auth"."uid"()) AND "profiles"."approved"))));

CREATE POLICY "FeedbackTemplates approved insert" ON "public"."FeedbackTemplates"
    FOR INSERT TO "authenticated"
    WITH CHECK ((EXISTS ( SELECT 1 FROM "public"."profiles"
        WHERE (("profiles"."id" = "auth"."uid"()) AND "profiles"."approved"))));

CREATE POLICY "FeedbackTemplates approved update" ON "public"."FeedbackTemplates"
    FOR UPDATE TO "authenticated"
    USING ((EXISTS ( SELECT 1 FROM "public"."profiles"
        WHERE (("profiles"."id" = "auth"."uid"()) AND "profiles"."approved"))))
    WITH CHECK ((EXISTS ( SELECT 1 FROM "public"."profiles"
        WHERE (("profiles"."id" = "auth"."uid"()) AND "profiles"."approved"))));

CREATE POLICY "FeedbackTemplates approved delete" ON "public"."FeedbackTemplates"
    FOR DELETE TO "authenticated"
    USING ((EXISTS ( SELECT 1 FROM "public"."profiles"
        WHERE (("profiles"."id" = "auth"."uid"()) AND "profiles"."approved"))));

GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE "public"."FeedbackTemplates" TO "authenticated";
GRANT ALL ON TABLE "public"."FeedbackTemplates" TO "service_role";
