import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

function isWaitlistStatus(status: string | null | undefined) {
    return status === 'waitlist'
}

const MAX_BATCH_REMOVE = 40

export async function POST(request: Request) {
    let body: unknown
    try {
        body = await request.json()
    } catch {
        return NextResponse.json({ error: 'Ugyldig forespørsel' }, { status: 400 })
    }

    const o = body as { participantId?: unknown; participantIds?: unknown }

    let participantIds: number[]
    if (Array.isArray(o.participantIds) && o.participantIds.length > 0) {
        participantIds = o.participantIds
            .map((x) => Number(x))
            .filter((n) => Number.isInteger(n) && n >= 1)
    } else {
        const single = Number(o.participantId)
        if (!Number.isInteger(single) || single < 1) {
            return NextResponse.json({ error: 'Ugyldig deltaker-ID' }, { status: 400 })
        }
        participantIds = [single]
    }

    if (participantIds.length === 0) {
        return NextResponse.json({ error: 'Ugyldig deltaker-ID' }, { status: 400 })
    }
    if (participantIds.length > MAX_BATCH_REMOVE) {
        return NextResponse.json(
            { error: `Maks ${MAX_BATCH_REMOVE} deltakere om gangen` },
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

    const { data: rows, error: fetchError } = await supabase
        .from('EventParticipants')
        .select('id, eventId, status, email, name')
        .in('id', participantIds)

    if (fetchError) {
        console.error('Remove participant fetch:', fetchError)
        return NextResponse.json({ error: 'Kunne ikke hente deltakere' }, { status: 500 })
    }

    if (!rows?.length || rows.length !== participantIds.length) {
        return NextResponse.json(
            { error: 'Fant ikke alle deltakerne' },
            { status: 404 }
        )
    }

    const eventId = rows[0].eventId
    if (eventId == null || rows.some((r) => r.eventId !== eventId)) {
        return NextResponse.json(
            { error: 'Deltakerne må tilhøre samme arrangement' },
            { status: 400 }
        )
    }

    const { error: delError } = await supabase
        .from('EventParticipants')
        .delete()
        .in('id', participantIds)

    if (delError) {
        console.error('Remove participant error:', delError)
        return NextResponse.json(
            { error: 'Kunne ikke fjerne deltaker(e)' },
            { status: 500 }
        )
    }

    return NextResponse.json({ success: true, removed: participantIds.length })
}
