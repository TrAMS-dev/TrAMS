import { createClient } from '@/utils/supabase/server'
import { promoteWaitlistParticipants } from '@/lib/waitlistPromotion'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
    let body: unknown
    try {
        body = await request.json()
    } catch {
        return NextResponse.json({ error: 'Ugyldig forespørsel' }, { status: 400 })
    }

    const o = body as { participantId?: unknown }
    const participantId = Number(o.participantId)
    if (!Number.isInteger(participantId) || participantId < 1) {
        return NextResponse.json({ error: 'Ugyldig deltaker-ID' }, { status: 400 })
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

    const { data: participant, error: participantError } = await supabase
        .from('EventParticipants')
        .select('id, eventId, status')
        .eq('id', participantId)
        .single()

    if (participantError || !participant) {
        return NextResponse.json({ error: 'Fant ikke deltakeren' }, { status: 404 })
    }

    if (participant.status !== 'waitlist' || participant.eventId == null) {
        return NextResponse.json(
            { error: 'Deltakeren står ikke på venteliste' },
            { status: 400 }
        )
    }

    try {
        const result = await promoteWaitlistParticipants(supabase, {
            eventId: participant.eventId,
            participantIds: [participantId],
        })
        return NextResponse.json({
            success: true,
            promoted: result.promoted,
            participantIds: result.participantIds,
        })
    } catch (e) {
        console.error('Promote participant error:', e)
        return NextResponse.json(
            { error: e instanceof Error ? e.message : 'Kunne ikke flytte opp deltakeren' },
            { status: 500 }
        )
    }
}
