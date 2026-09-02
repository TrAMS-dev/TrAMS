import { createClient } from '@/utils/supabase/server'
import { sendUserApprovedEmail } from '@/lib/userApprovalEmail'
import { NextResponse } from 'next/server'

const UUID_RE =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

export async function POST(request: Request) {
    let body: unknown
    try {
        body = await request.json()
    } catch {
        return NextResponse.json({ error: 'Ugyldig forespørsel' }, { status: 400 })
    }

    const userId = (body as { userId?: unknown }).userId
    if (typeof userId !== 'string' || !UUID_RE.test(userId)) {
        return NextResponse.json({ error: 'Ugyldig bruker-ID' }, { status: 400 })
    }

    const supabase = await createClient()
    const {
        data: { user },
        error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) {
        return NextResponse.json({ error: 'Ikke innlogget' }, { status: 401 })
    }

    const { data: adminProfile, error: adminProfileError } = await supabase
        .from('profiles')
        .select('approved, role')
        .eq('id', user.id)
        .single()

    if (
        adminProfileError ||
        !adminProfile?.approved ||
        adminProfile.role !== 'admin'
    ) {
        return NextResponse.json({ error: 'Ingen tilgang' }, { status: 403 })
    }

    const { data: target, error: targetError } = await supabase
        .from('profiles')
        .select('email, full_name, approved')
        .eq('id', userId)
        .maybeSingle()

    if (targetError || !target) {
        return NextResponse.json({ error: 'Fant ikke brukeren' }, { status: 404 })
    }

    if (!target.approved) {
        return NextResponse.json(
            { error: 'Brukeren er ikke godkjent – ingen e-post sendt' },
            { status: 400 }
        )
    }

    const email = target.email?.trim()
    if (!email) {
        return NextResponse.json(
            { error: 'Brukeren har ingen e-postadresse i profilen' },
            { status: 400 }
        )
    }

    try {
        await sendUserApprovedEmail({
            recipientEmail: email,
            recipientName: target.full_name?.trim() || '',
        })
    } catch (e) {
        console.error('Approval e-post feilet:', e)
        return NextResponse.json(
            { error: 'Kunne ikke sende e-post' },
            { status: 500 }
        )
    }

    return NextResponse.json({ success: true })
}
