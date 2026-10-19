import { createClient } from '@/utils/supabase/server'
import { createAdminClient } from '@/utils/supabase/admin'
import { NextResponse } from 'next/server'

const UUID_RE =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

/** Deletes a pending (not yet approved) user: both the auth account and the profile. */
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

    const admin = createAdminClient()
    if (!admin) {
        console.error('Delete user: SUPABASE_SERVICE_ROLE_KEY is not set')
        return NextResponse.json(
            { error: 'Sletting av brukere er ikke konfigurert på serveren' },
            { status: 500 }
        )
    }

    const { data: target, error: targetError } = await admin
        .from('profiles')
        .select('approved, role')
        .eq('id', userId)
        .maybeSingle()

    if (targetError) {
        console.error('Delete user fetch:', targetError)
        return NextResponse.json({ error: 'Kunne ikke hente brukeren' }, { status: 500 })
    }

    if (target?.approved || target?.role === 'admin') {
        return NextResponse.json(
            { error: 'Kun brukere som venter på godkjenning kan slettes' },
            { status: 400 }
        )
    }

    // Delete the profile explicitly in case its FK to auth.users has no ON DELETE CASCADE
    const { error: profileDeleteError } = await admin.from('profiles').delete().eq('id', userId)
    if (profileDeleteError) {
        console.error('Delete user profile:', profileDeleteError)
        return NextResponse.json({ error: 'Kunne ikke slette brukeren' }, { status: 500 })
    }

    const { error: deleteAuthError } = await admin.auth.admin.deleteUser(userId)
    // A missing auth user just means only the profile was left over
    if (deleteAuthError && deleteAuthError.status !== 404) {
        console.error('Delete auth user:', deleteAuthError)
        return NextResponse.json({ error: 'Kunne ikke slette brukerkontoen' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
}
