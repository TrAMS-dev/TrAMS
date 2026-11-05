-- Step 1 of 2 (safe to apply at any time, changes no existing access).
-- Public participant list for the event page. Returns only the fields the page
-- shows, so anon users never need to read EventParticipants directly.
-- Rows come ordered by signup time, so the waitlist keeps its queue order.

CREATE OR REPLACE FUNCTION "public"."get_public_event_participants"("p_event_id" bigint)
    RETURNS TABLE ("id" bigint, "name" text, "kull" bigint, "status" text)
    LANGUAGE "sql" STABLE SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
  select p.id, p.name, p.kull, p.status
  from "EventParticipants" p
  where p."eventId" = p_event_id
  order by p.created_at asc, p.id asc;
$$;

ALTER FUNCTION "public"."get_public_event_participants"(bigint) OWNER TO "postgres";

REVOKE ALL ON FUNCTION "public"."get_public_event_participants"(bigint) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION "public"."get_public_event_participants"(bigint) TO "anon", "authenticated", "service_role";
