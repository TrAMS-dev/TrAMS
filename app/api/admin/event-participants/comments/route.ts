import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

const MAX_COMMENT_LENGTH = 2000

async function getApprovedUser() {
    const supabase = await createClient()
    const {
        data: { user },
        error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) {
        return { error: NextResponse.json({ error: 'Ikke innlogget' }, { status: 401 }) }
    }

    const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('approved, full_name')
        .eq('id', user.id)
        .single()

    if (profileError || !profile?.approved) {
        return { error: NextResponse.json({ error: 'Ingen tilgang' }, { status: 403 }) }
    }

    return { supabase, user, profile }
}

export async function POST(request: Request) {
    let body: unknown
    try {
        body = await request.json()
    } catch {
        return NextResponse.json({ error: 'Ugyldig forespørsel' }, { status: 400 })
    }

    const o = body as { participantId?: unknown; body?: unknown }
    const participantId = Number(o.participantId)
    if (!Number.isInteger(participantId) || participantId < 1) {
        return NextResponse.json({ error: 'Ugyldig deltaker-ID' }, { status: 400 })
    }

    const text = typeof o.body === 'string' ? o.body.trim() : ''
    if (!text) {
        return NextResponse.json({ error: 'Kommentaren kan ikke være tom' }, { status: 400 })
    }
    if (text.length > MAX_COMMENT_LENGTH) {
        return NextResponse.json(
            { error: `Kommentaren kan maks være ${MAX_COMMENT_LENGTH} tegn` },
            { status: 400 }
        )
    }

    const auth = await getApprovedUser()
    if ('error' in auth) return auth.error
    const { supabase, user, profile } = auth

    const { data: comment, error } = await supabase
        .from('ParticipantComments')
        .insert({
            participantId,
            author_id: user.id,
            author_name: profile.full_name || user.email || null,
            body: text,
        })
        .select('*')
        .single()

    if (error) {
        console.error('Comment insert error:', error)
        return NextResponse.json({ error: 'Kunne ikke lagre kommentar' }, { status: 500 })
    }

    return NextResponse.json({ comment })
}

export async function DELETE(request: Request) {
    let body: unknown
    try {
        body = await request.json()
    } catch {
        return NextResponse.json({ error: 'Ugyldig forespørsel' }, { status: 400 })
    }

    const commentId = Number((body as { commentId?: unknown }).commentId)
    if (!Number.isInteger(commentId) || commentId < 1) {
        return NextResponse.json({ error: 'Ugyldig kommentar-ID' }, { status: 400 })
    }

    const auth = await getApprovedUser()
    if ('error' in auth) return auth.error
    const { supabase, user } = auth

    const { data: row, error } = await supabase
        .from('ParticipantComments')
        .delete()
        .eq('id', commentId)
        .eq('author_id', user.id)
        .select('id')
        .maybeSingle()

    if (error) {
        console.error('Comment delete error:', error)
        return NextResponse.json({ error: 'Kunne ikke slette kommentar' }, { status: 500 })
    }

    if (!row) {
        return NextResponse.json(
            { error: 'Fant ikke kommentaren, eller du er ikke forfatteren' },
            { status: 404 }
        )
    }

    return NextResponse.json({ deleted: row.id })
}
