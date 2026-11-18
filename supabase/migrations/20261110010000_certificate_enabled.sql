-- Whether participants who attended get a certificate (kursbevis).
-- Off by default for new events; existing events keep sending certificates
-- as they did before this setting existed.

ALTER TABLE "public"."Events"
    ADD COLUMN "certificate_enabled" boolean DEFAULT false NOT NULL;

UPDATE "public"."Events" SET "certificate_enabled" = true;

COMMENT ON COLUMN "public"."Events"."certificate_enabled" IS
    'Send a certificate (kursbevis) to participants marked as attended';
