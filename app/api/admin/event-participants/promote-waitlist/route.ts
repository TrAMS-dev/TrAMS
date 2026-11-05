import { createClient } from '@/utils/supabase/server'
import {
    MAX_WAITLIST_PROMOTE,
    promoteFromWaitlist,
} from '@/lib/waitlistPromotion'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
    let body: unknown
    try {
        body = await request.json()
    } catch {
        return NextResponse.json({ error: 'Ugyldig forespørsel' }, { status: 400 })
    }

    const o = body as { eventId?: unknown; count?: unknown }
    const eventId = Number(o.eventId)
    if (!Number.isInteger(eventId) || eventId < 1) {
        return NextResponse.json({ error: 'Ugyldig arrangement-ID' }, { status: 400 })
    }

    const count = Number(o.count)
    if (!Number.isInteger(count) || count < 1) {
        return NextResponse.json(
            { error: 'Oppgi antall som skal flyttes opp (heltall minst 1)' },
            { status: 400 }
        )
    }
    if (count > MAX_WAITLIST_PROMOTE) {
        return NextResponse.json(
            { error: `Maks ${MAX_WAITLIST_PROMOTE} deltakere om gangen` },
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

    try {
        const result = await promoteFromWaitlist(supabase, { eventId, count })
        return NextResponse.json({
            success: true,
            promoted: result.promoted,
            participantIds: result.participantIds,
        })
    } catch (e) {
        console.error('Promote waitlist error:', e)
        return NextResponse.json(
            { error: e instanceof Error ? e.message : 'Kunne ikke flytte opp fra venteliste' },
            { status: 500 }
        )
    }
}
