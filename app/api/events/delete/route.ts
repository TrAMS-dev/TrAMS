import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

/** Postgres error code for foreign key violations. */
const FOREIGN_KEY_VIOLATION = '23503'

export async function POST(request: Request) {
    let body: unknown
    try {
        body = await request.json()
    } catch {
        return NextResponse.json({ error: 'Ugyldig forespørsel' }, { status: 400 })
    }

    const eventId = Number((body as { eventId?: unknown }).eventId)
    if (!Number.isInteger(eventId) || eventId < 1) {
        return NextResponse.json({ error: 'Ugyldig arrangement-ID' }, { status: 400 })
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

    const deleteEvent = () =>
        supabase.from('Events').delete().eq('id', eventId).select('id')

    // Try the event first so participants are never removed if the event delete is
    // blocked (e.g. by RLS). Only fall back to clearing participants when the
    // foreign key (without ON DELETE CASCADE) is what stops the delete.
    let { data: deletedRows, error: delError } = await deleteEvent()

    if (delError?.code === FOREIGN_KEY_VIOLATION) {
        const { error: participantsError } = await supabase
            .from('EventParticipants')
            .delete()
            .eq('eventId', eventId)

        if (participantsError) {
            console.error('Delete event participants error:', participantsError)
            return NextResponse.json(
                { error: 'Kunne ikke slette deltakerne til arrangementet' },
                { status: 500 }
            )
        }

        ;({ data: deletedRows, error: delError } = await deleteEvent())
    }

    if (delError) {
        console.error('Delete event error:', delError)
        return NextResponse.json({ error: 'Kunne ikke slette arrangement' }, { status: 500 })
    }

    if (!deletedRows || deletedRows.length === 0) {
        return NextResponse.json(
            { error: 'Arrangementet ble ikke slettet. Vennligst sjekk RLS-rettigheter.' },
            { status: 403 }
        )
    }

    return NextResponse.json({ success: true })
}
