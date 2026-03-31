import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

function parseAttendedBody(raw: unknown): boolean | null | undefined {
    if (raw === null) return null
    if (raw === true || raw === 'true') return true
    if (raw === false || raw === 'false') return false
    return undefined
}

export async function PATCH(request: Request) {
    let body: unknown
    try {
        body = await request.json()
    } catch {
        return NextResponse.json({ error: 'Ugyldig forespørsel' }, { status: 400 })
    }

    const o = body as { participantId?: unknown; attended?: unknown }
    const participantId = Number(o.participantId)
    if (!Number.isInteger(participantId) || participantId < 1) {
        return NextResponse.json({ error: 'Ugyldig deltaker-ID' }, { status: 400 })
    }

    const attended = parseAttendedBody(o.attended)
    if (attended === undefined) {
        return NextResponse.json({ error: 'Ugyldig oppmøteverdi' }, { status: 400 })
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

    const { data: row, error } = await supabase
        .from('EventParticipants')
        .update({ attended })
        .eq('id', participantId)
        .select('id, attended')
        .maybeSingle()

    if (error) {
        console.error('Attendance update error:', error)
        return NextResponse.json(
            { error: 'Kunne ikke lagre oppmøte. Sjekk at RLS-policy for EventParticipants er på plass.' },
            { status: 500 }
        )
    }

    if (!row) {
        return NextResponse.json({ error: 'Fant ikke deltakeren eller ingen endring tillatt' }, { status: 404 })
    }

    return NextResponse.json({ participant: row })
}
