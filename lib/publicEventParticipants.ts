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
    const { data, error } = await supabase.rpc('get_public_event_participants', {
        p_event_id: eventId,
    })
    // Generated types mark name/kull as non-null, but the columns are nullable.
    const rows: PublicEventParticipant[] | null = data ?? null
    return { data: rows, error }
}
