-- Lets admins choose, per event, when signup confirmation/waitlist emails go
-- out: right away (today's behavior and the default), only once the
-- registration deadline passes (batched in one go, so admins have time to
-- manually re-sort confirmed/waitlist participants, e.g. to prioritize older
-- kull, before anyone is notified), or never automatically.

ALTER TABLE "public"."Events"
    ADD COLUMN "confirmation_email_timing" text DEFAULT 'immediate' NOT NULL,
    ADD COLUMN "confirmation_emails_sent_at" timestamp with time zone;

ALTER TABLE "public"."Events"
    ADD CONSTRAINT "Events_confirmation_email_timing_check"
    CHECK ("confirmation_email_timing" IN ('immediate', 'on_deadline', 'never'));

COMMENT ON COLUMN "public"."Events"."confirmation_email_timing" IS
    'When signup confirmation/waitlist emails go out: immediate, on_deadline (batched once reg_deadline passes), or never';
COMMENT ON COLUMN "public"."Events"."confirmation_emails_sent_at" IS
    'Set once the on_deadline batch of confirmation/waitlist emails has been sent for this event, so it is only sent once';
