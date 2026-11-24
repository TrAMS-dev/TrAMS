-- Adds a fourth choice for when signup confirmation/waitlist emails go out:
-- 'scheduled', at a date and time the admin picks (confirmation_email_send_at).

ALTER TABLE "public"."Events"
    ADD COLUMN "confirmation_email_send_at" timestamp with time zone;

ALTER TABLE "public"."Events"
    DROP CONSTRAINT "Events_confirmation_email_timing_check";

ALTER TABLE "public"."Events"
    ADD CONSTRAINT "Events_confirmation_email_timing_check"
    CHECK ("confirmation_email_timing" IN ('immediate', 'on_deadline', 'scheduled', 'never'));

ALTER TABLE "public"."Events"
    ADD CONSTRAINT "Events_confirmation_email_send_at_check"
    CHECK ("confirmation_email_timing" <> 'scheduled' OR "confirmation_email_send_at" IS NOT NULL);

COMMENT ON COLUMN "public"."Events"."confirmation_email_timing" IS
    'When signup confirmation/waitlist emails go out: immediate, on_deadline (batched once reg_deadline passes), scheduled (batched at confirmation_email_send_at), or never';
COMMENT ON COLUMN "public"."Events"."confirmation_email_send_at" IS
    'When the batch of confirmation/waitlist emails is sent, for confirmation_email_timing = scheduled';
