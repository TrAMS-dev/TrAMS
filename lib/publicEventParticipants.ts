import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/types/supabase'

/** Fields the public event page may see. Never add contact or health data here. */
export type PublicEventParticipant = {
    id: number
    name: string | null
    kull: number | null
    status: string
}

/**
 * Public participant list for an event, ordered by signup time.
 * Uses the get_public_event_participants() database function, because anon users
 * can no longer read EventParticipants directly (it holds email, phone, allergies).
 */
export async function fetchPublicEventParticipants(
    supabase: SupabaseClient<Database>,
    eventId: number
) {
    // The function is added by migration 20261105000000 and is not in the generated
    // types until `npm run typegen` runs against a database that has it. Drop this
    // cast once types/supabase.ts includes get_public_event_participants.
    const untyped = supabase as unknown as SupabaseClient
    const { data, error } = await untyped.rpc('get_public_event_participants', {
        p_event_id: eventId,
    })
    return { data: (data as PublicEventParticipant[] | null) ?? null, error }
}
