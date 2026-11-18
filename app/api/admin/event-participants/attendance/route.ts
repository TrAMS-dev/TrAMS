import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'
import {
    FOLLOWUP_EVENT_COLUMNS,
    autoFollowupContent,
    isInAutoFollowupWindow,
    sendFollowup,
} from '@/lib/eventFollowup'

type Supabase = Awaited<ReturnType<typeof createClient>>

/**
 * Sends the follow-up email (feedback form and certificate) to a participant who was
 * just marked as attended, if the event has ended recently and they haven't had it yet.
 * Returns when it was sent, or null. Failures are logged and don't affect the attendance change.
 */
async function sendAutoFollowup(supabase: Supabase, participantId: number): Promise<string | null> {
    try {
        const { data: participant } = await supabase
            .from('EventParticipants')
            .select('id, name, email, eventId, followup_sent_at')
            .eq('id', participantId)
            .single()
        if (!participant?.eventId || participant.followup_sent_at) return null

        const { data: event } = await supabase
            .from('Events')
            .select(FOLLOWUP_EVENT_COLUMNS)
            .eq('id', participant.eventId)
            .single()
        // Before the event has ended, the daily cron (/api/cron/event-followups) sends it later
        if (!event || !isInAutoFollowupWindow(event)) return null

        const content = autoFollowupContent(event)
        if (!content.sendFeedback && !content.sendCertificate) return null

        const { sentIds, sentAt } = await sendFollowup(supabase, event, [participant], content)
        return sentIds.length > 0 ? sentAt : null
    } catch (e) {
        console.error('Attendance: automatic followup failed', e)
        return null
    }
}

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

    const followupSentAt = row.attended === true ? await sendAutoFollowup(supabase, row.id) : null

    return NextResponse.json({ participant: row, followupSentAt })
}
