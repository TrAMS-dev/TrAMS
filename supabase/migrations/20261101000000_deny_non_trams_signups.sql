-- Only @trams.no accounts can be approved or seen by admins.
-- Sign-ups from other domains still "succeed" for the user, but their profile
-- can never become approved and is hidden from the admin users list.
-- No error is raised, so the denial is silent. Approved users are not affected.

CREATE OR REPLACE FUNCTION "public"."enforce_trams_domain_approval"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
declare
  auth_email text;
begin
  -- Only act when a profile would go from not approved to approved
  if new.approved is not true then
    return new;
  end if;
  if tg_op = 'UPDATE' and old.approved is true then
    return new;
  end if;

  -- Use the auth email, not profiles.email, which the user could change
  select lower(email) into auth_email from auth.users where id = new.id;

  if auth_email is null or auth_email not like '%@trams.no' then
    new.approved := false;
  end if;

  return new;
end;
$$;

ALTER FUNCTION "public"."enforce_trams_domain_approval"() OWNER TO "postgres";

REVOKE ALL ON FUNCTION "public"."enforce_trams_domain_approval"() FROM PUBLIC, "anon", "authenticated";

CREATE OR REPLACE TRIGGER "enforce_trams_domain_approval"
    BEFORE INSERT OR UPDATE OF "approved" ON "public"."profiles"
    FOR EACH ROW EXECUTE FUNCTION "public"."enforce_trams_domain_approval"();

-- Hide pending non-@trams.no sign-ups from admins (mostly phishing).
-- Admins still see every approved profile and every @trams.no profile.
-- profiles.email comes from the auth email at signup, and users can't edit it.
DROP POLICY IF EXISTS "Admins can view all profiles" ON "public"."profiles";

CREATE POLICY "Admins can view all profiles" ON "public"."profiles" FOR SELECT USING (
    "public"."is_admin"()
    AND (
        "approved" IS TRUE
        OR lower("email") LIKE '%@trams.no'
    )
);
