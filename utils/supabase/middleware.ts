import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
                    response = NextResponse.next({
                        request: {
                            headers: request.headers,
                        },
                    })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        response.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    const { data: { user } } = await supabase.auth.getUser()

    if (request.nextUrl.pathname.startsWith('/admin')) {
        // Allow access to public admin pages (login/register)
        if (request.nextUrl.pathname === '/admin/login' || request.nextUrl.pathname === '/admin/register') {
            return response
        }

        if (!user) {
            return NextResponse.redirect(new URL('/admin/login', request.url))
        }

        // Check profile approval
        const { data: profile } = await supabase
            .from('profiles')
            .select('approved')
            .eq('id', user.id)
            .single()

        if (!profile?.approved) {
            // Redirect to a pending page or back to home with a query param?
            // Or maybe just login with error?
            // For now, redirect to login which we updated to show error if logged in but not approved (or it will just redirect back here loop?)
            // Actually, if we are logged in but not approved, we should sign out or show a "not approved" page.
            // But middleware can't sign out easily.
            // Let's redirect to home page with a parameter or a specific error page.
            // The login page handles the check when logging in, but if session persists, middleware catches it.
            const url = new URL('/admin/login', request.url)
            url.searchParams.set('error', 'not_approved')
            return NextResponse.redirect(url)
        }
    }

    return response
}
