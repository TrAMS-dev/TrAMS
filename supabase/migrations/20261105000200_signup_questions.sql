-- Multiple signup questions per event, with different answer types.
-- Replaces the single yes/no question (Events.custom_question and
-- EventParticipants.custom_question_response). The old columns are kept for now
-- so this migration is safe to apply before the new code is deployed; drop them
-- in a later migration.

ALTER TABLE "public"."Events"
    ADD COLUMN "signup_questions" "jsonb" DEFAULT '[]'::"jsonb" NOT NULL,
    ADD CONSTRAINT "Events_signup_questions_is_array"
        CHECK (("jsonb_typeof"("signup_questions") = 'array'::"text"));

COMMENT ON COLUMN "public"."Events"."signup_questions" IS
    'Questions asked at signup: [{id, type: checkbox|text|single_choice|multi_choice, label, required, options}]';

ALTER TABLE "public"."EventParticipants"
    ADD COLUMN "question_answers" "jsonb" DEFAULT '{}'::"jsonb" NOT NULL,
    ADD CONSTRAINT "EventParticipants_question_answers_is_object"
        CHECK (("jsonb_typeof"("question_answers") = 'object'::"text"));

COMMENT ON COLUMN "public"."EventParticipants"."question_answers" IS
    'Answers to Events.signup_questions, keyed by question id';

-- Carry over existing single questions as a yes/no question with id "legacy"
UPDATE "public"."Events"
SET "signup_questions" = "jsonb_build_array"("jsonb_build_object"(
        'id', 'legacy',
        'type', 'checkbox',
        'label', "btrim"("custom_question"),
        'required', false,
        'options', '[]'::"jsonb"
    ))
WHERE "custom_question" IS NOT NULL AND "btrim"("custom_question") <> '';

UPDATE "public"."EventParticipants" AS "p"
SET "question_answers" = "jsonb_build_object"('legacy', COALESCE("p"."custom_question_response", false))
FROM "public"."Events" AS "e"
WHERE "e"."id" = "p"."eventId"
  AND "e"."custom_question" IS NOT NULL
  AND "btrim"("e"."custom_question") <> '';
