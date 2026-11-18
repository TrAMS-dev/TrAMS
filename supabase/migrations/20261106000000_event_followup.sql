-- Tracks when a participant got the post-event email (feedback form and/or
-- certificate link), so admins only send it once per person by default.

ALTER TABLE "public"."EventParticipants"
    ADD COLUMN "followup_sent_at" timestamp with time zone;

COMMENT ON COLUMN "public"."EventParticipants"."followup_sent_at" IS
    'When the post-event email (feedback form / certificate link) was last sent';
