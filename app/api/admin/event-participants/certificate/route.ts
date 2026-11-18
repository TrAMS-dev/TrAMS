import { createClient } from '@/utils/supabase/server'
import { certificateUrl } from '@/lib/certificate'
import { NextResponse } from 'next/server'

/** Gir admin lenken til en deltakers kursbevis, f.eks. for å forhåndsvise eller dele den manuelt. */
export async function GET(request: Request) {
    const participantId = Number(new URL(request.url).searchParams.get('participantId'))
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

    const { data: participant } = await supabase
        .from('EventParticipants')
        .select('id, attended')
        .eq('id', participantId)
        .maybeSingle()
    if (!participant) {
        return NextResponse.json({ error: 'Fant ikke deltakeren' }, { status: 404 })
    }
    if (participant.attended !== true) {
        return NextResponse.json(
            { error: 'Kursbevis finnes bare for deltakere registrert som møtt' },
            { status: 400 }
        )
    }

    const url = certificateUrl(participantId)
    if (!url) {
        return NextResponse.json({ error: 'Kursbevis er ikke konfigurert på serveren' }, { status: 500 })
    }
    return NextResponse.json({ url })
}
