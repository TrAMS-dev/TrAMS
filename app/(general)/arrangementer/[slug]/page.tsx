import { client } from '@/sanity/lib/client'
import { FOR_MEDISINSTUDENTER_PAGE_QUERY } from '@/sanity/lib/queries'
import EventArrangementDetailClient from './EventArrangementDetailClient'

/** Same fallback as `app/(general)/for-medisinstudenter/page.tsx` when Sanity has no URL. */
const FALLBACK_MEMBERSHIP_SIGNUP_URL = 'https://forms.gle/GDLsAZTeVvTKmCqw9'

export default async function ArrangementSlugPage() {
    const pageData = await client.fetch<{ membershipSignupUrl?: string | null }>(
        FOR_MEDISINSTUDENTER_PAGE_QUERY
    )
    const membershipSignupHref =
        pageData?.membershipSignupUrl?.trim() || FALLBACK_MEMBERSHIP_SIGNUP_URL

    return (
        <EventArrangementDetailClient membershipSignupHref={membershipSignupHref} />
    )
}
