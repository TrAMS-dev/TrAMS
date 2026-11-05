import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

/**
 * Server-component guard mirroring the /admin approval check already done in
 * middleware.ts. Redundant with it by design (defense in depth): middleware
 * blocks the request, this blocks the component if it ever runs anyway.
 */
export async function requireApprovedUser() {
    const supabase = await createClient()
    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        redirect('/admin/login')
    }

    const { data: profile } = await supabase
        .from('profiles')
        .select('approved')
        .eq('id', user.id)
        .single()

    if (!profile?.approved) {
        redirect('/admin/login?error=not_approved')
    }

    return { supabase, user }
}
