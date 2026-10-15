import { createClient } from '@/utils/supabase/server'
import { createAdminClient } from '@/utils/supabase/admin'
import { NextResponse } from 'next/server'

const MAX_NAME_LENGTH = 100

/**
 * Lets the logged-in user change their own full_name. Goes through the
 * service-role client so profiles RLS never has to allow self-updates (which
 * would also expose role/approved); only full_name is ever written here.
 */
export async function POST(request: Request) {
    let body: unknown
    try {
        body = await request.json()
    } catch {
        return NextResponse.json({ error: 'Ugyldig forespørsel' }, { status: 400 })
    }

    const rawName = (body as { fullName?: unknown }).fullName
    const fullName = typeof rawName === 'string' ? rawName.trim().replace(/\s+/g, ' ') : ''
    if (!fullName || fullName.length > MAX_NAME_LENGTH) {
        return NextResponse.json(
            { error: `Navnet må være mellom 1 og ${MAX_NAME_LENGTH} tegn` },
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

    const admin = createAdminClient()
    if (!admin) {
        console.error('Change name: SUPABASE_SERVICE_ROLE_KEY is not set')
        return NextResponse.json(
            { error: 'Navneendring er ikke konfigurert på serveren' },
            { status: 500 }
        )
    }

    const { error: profileError } = await admin
        .from('profiles')
        .update({ full_name: fullName })
        .eq('id', user.id)
    if (profileError) {
        console.error('Change name profile update:', profileError)
        return NextResponse.json({ error: 'Kunne ikke oppdatere navnet' }, { status: 500 })
    }

    // Keep auth metadata in sync with the profile (it was set from here at signup)
    const { error: metadataError } = await supabase.auth.updateUser({ data: { full_name: fullName } })
    if (metadataError) {
        console.error('Change name metadata update:', metadataError)
    }

    return NextResponse.json({ success: true, fullName })
}
