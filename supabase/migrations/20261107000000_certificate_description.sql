-- Optional course description shown on the certificate (kursbevis),
-- e.g. "Kurset omfatter en gjennomgang av ...".

ALTER TABLE "public"."Events"
    ADD COLUMN "certificate_description" "text";

COMMENT ON COLUMN "public"."Events"."certificate_description" IS
    'Course description shown on the certificate; omitted when empty';
