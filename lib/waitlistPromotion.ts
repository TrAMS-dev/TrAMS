import type { SupabaseClient } from '@supabase/supabase-js'
import { sendWaitlistPromotedEmail } from '@/lib/eventSignupEmail'
import type { Database } from '@/types/supabase'

type DbClient = SupabaseClient<Database>

/** Begrenser antall deltakere som kan flyttes opp per operasjon. */
export const MAX_WAITLIST_PROMOTE = 100

export interface PromoteFromWaitlistResult {
    promoted: number
    participantIds: number[]
}

/**
 * Flytter et gitt sett med deltakere (som må stå på venteliste for arrangementet)
 * direkte til bekreftet plass, og sender hver av dem en e-post om at de har fått
 * plass. Ingen kapasitetssjekk gjøres her – admin kan bevisst overfylle
 * arrangementet, og dette skjer uavhengig av om påmeldingen er åpen.
 */
export async function promoteWaitlistParticipants(
    supabase: DbClient,
    params: { eventId: number; participantIds: number[] }
): Promise<PromoteFromWaitlistResult> {
    const ids = Array.from(
        new Set(
            params.participantIds
                .map((n) => Math.floor(Number(n)))
                .filter((n) => Number.isInteger(n) && n >= 1)
        )
    )
    if (ids.length === 0) return { promoted: 0, participantIds: [] }

    const { data: event, error: eventError } = await supabase
        .from('Events')
        .select('title, slug, start_datetime, location, reg_deadline, contact_email')
        .eq('id', params.eventId)
        .single()

    if (eventError || !event) {
        throw new Error('Fant ikke arrangementet')
    }

    const { data: waiters, error: waitError } = await supabase
        .from('EventParticipants')
        .select('id, email, name')
        .eq('eventId', params.eventId)
        .eq('status', 'waitlist')
        .in('id', ids)

    if (waitError) {
        throw new Error('Kunne ikke hente venteliste')
    }

    if (!waiters || waiters.length === 0) return { promoted: 0, participantIds: [] }

    const waiterIds = waiters.map((w) => w.id)

    const { data: updated, error: updateError } = await supabase
        .from('EventParticipants')
        .update({ status: 'confirmed' })
        .in('id', waiterIds)
        .eq('status', 'waitlist')
        .select('id')

    if (updateError) {
        throw new Error('Kunne ikke oppdatere status på deltakerne')
    }

    const updatedIds = new Set((updated ?? []).map((r) => r.id))

    const ctxBase = {
        eventTitle: event.title || 'Arrangement',
        eventSlug: event.slug,
        startDatetime: event.start_datetime,
        location: event.location,
        regDeadline: event.reg_deadline,
        contactEmail: event.contact_email,
    }

    for (const w of waiters) {
        if (!updatedIds.has(w.id)) continue
        const em = w.email?.trim()
        if (!em) continue
        try {
            await sendWaitlistPromotedEmail({
                ...ctxBase,
                recipientName: (w.name ?? '').trim(),
                recipientEmail: em,
            })
        } catch (e) {
            console.error('Waitlist promotion email failed:', e)
        }
    }

    return { promoted: updatedIds.size, participantIds: Array.from(updatedIds) }
}

/**
 * Flytter de første `count` på ventelisten (FIFO) direkte til bekreftet plass.
 * Ingen kapasitetssjekk – admin kan bevisst be om flere enn det er ledige
 * plasser (overfylling), og det skjer uavhengig av om påmeldingen er åpen.
 */
export async function promoteFromWaitlist(
    supabase: DbClient,
    params: { eventId: number; count: number }
): Promise<PromoteFromWaitlistResult> {
    const requested = Math.min(
        Math.max(0, Math.floor(params.count)),
        MAX_WAITLIST_PROMOTE
    )
    if (requested < 1) return { promoted: 0, participantIds: [] }

    const { data: waiters, error: waitError } = await supabase
        .from('EventParticipants')
        .select('id')
        .eq('eventId', params.eventId)
        .eq('status', 'waitlist')
        .order('created_at', { ascending: true })
        .limit(requested)

    if (waitError) {
        throw new Error('Kunne ikke hente venteliste')
    }

    if (!waiters || waiters.length === 0) return { promoted: 0, participantIds: [] }

    return promoteWaitlistParticipants(supabase, {
        eventId: params.eventId,
        participantIds: waiters.map((w) => w.id),
    })
}
