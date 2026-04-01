import { createClient } from '@/utils/supabase/server'
import {
    MAX_WAITLIST_SPOT_NOTIFY,
    notifyWaitlistAfterSpotsOpened,
} from '@/lib/waitlistSpotNotifications'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
    let body: unknown
    try {
        body = await request.json()
    } catch {
        return NextResponse.json({ error: 'Ugyldig forespørsel' }, { status: 400 })
    }

    const o = body as { eventId?: unknown; spotsOpened?: unknown }
    const eventId = Number(o.eventId)
    if (!Number.isInteger(eventId) || eventId < 1) {
        return NextResponse.json({ error: 'Ugyldig arrangement-ID' }, { status: 400 })
    }

    const spotsOpened = Number(o.spotsOpened)
    if (!Number.isInteger(spotsOpened) || spotsOpened < 1) {
        return NextResponse.json(
            { error: 'Oppgi antall plasser (heltall minst 1)' },
            { status: 400 }
        )
    }
    if (spotsOpened > MAX_WAITLIST_SPOT_NOTIFY) {
        return NextResponse.json(
            { error: `Maks ${MAX_WAITLIST_SPOT_NOTIFY} plasser per utsending` },
            { status: 400 }
        )
    }

    const supabase = await createClient()
    const {
        data: { user },
        error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) {
        return NextResponse.json({ error: 'Ikke innlogget' }, { status: 401 })
    }

    const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('approved')
        .eq('id', user.id)
        .single()

    if (profileError || !profile?.approved) {
        return NextResponse.json({ error: 'Ingen tilgang' }, { status: 403 })
    }

    const notified = await notifyWaitlistAfterSpotsOpened(supabase, {
        eventId,
        spotsOpened,
    })

    return NextResponse.json({ success: true, notified })
}
