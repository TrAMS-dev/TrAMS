import type { SupabaseClient } from '@supabase/supabase-js'
import { sendWaitlistSpotsOpenedGuideEmail } from '@/lib/eventSignupEmail'
import type { Database } from '@/types/supabase'

type DbClient = SupabaseClient<Database>

/** Begrenser antall e-poster per operasjon (unngår utilsiktede store utsendinger). */
export const MAX_WAITLIST_SPOT_NOTIFY = 200

/**
 * Sender veilednings-e-post til de første `spotsOpened` på ventelisten (FIFO),
 * når tilsvarende antall bekreftede plasser er blitt ledige eller kapasitet er økt.
 */
export async function notifyWaitlistAfterSpotsOpened(
    supabase: DbClient,
    params: { eventId: number; spotsOpened: number }
): Promise<number> {
    const spotsOpened = Math.min(
        Math.max(0, Math.floor(params.spotsOpened)),
        MAX_WAITLIST_SPOT_NOTIFY
    )
    if (spotsOpened < 1) return 0

    const { data: event, error: eventError } = await supabase
        .from('Events')
        .select(
            'max_attendees, title, slug, start_datetime, location, reg_deadline, contact_email'
        )
        .eq('id', params.eventId)
        .single()

    if (
        eventError ||
        event?.max_attendees == null ||
        event.max_attendees < 1
    ) {
        return 0
    }

    const { data: waiters, error: waitError } = await supabase
        .from('EventParticipants')
        .select('email, name')
        .eq('eventId', params.eventId)
        .eq('status', 'waitlist')
        .order('created_at', { ascending: true })
        .limit(spotsOpened)

    if (waitError) {
        console.error('Waitlist fetch for spot notification:', waitError)
        return 0
    }

    const ctxBase = {
        eventTitle: event.title || 'Arrangement',
        eventSlug: event.slug,
        startDatetime: event.start_datetime,
        location: event.location,
        regDeadline: event.reg_deadline,
        contactEmail: event.contact_email,
    }

    let notified = 0
    for (const w of waiters ?? []) {
        const em = w.email?.trim()
        if (!em) continue
        try {
            await sendWaitlistSpotsOpenedGuideEmail(spotsOpened, {
                ...ctxBase,
                recipientName: (w.name ?? '').trim(),
                recipientEmail: em,
            })
            notified += 1
        } catch (e) {
            console.error('Waitlist spot-opened email failed:', e)
        }
    }

    return notified
}
