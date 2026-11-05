import type { Metadata } from 'next'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { verifyCertificateToken } from '@/lib/certificate'
import { APP_TIME_ZONE } from '@/lib/datetimeLocal'
import { createAdminClient } from '@/utils/supabase/admin'
import { createClient } from '@/utils/supabase/server'
import PrintButton from './PrintButton'

export const metadata: Metadata = {
    title: 'Kursbevis',
    robots: { index: false, follow: false },
}

function osloDate(d: Date, options: Intl.DateTimeFormatOptions) {
    return d.toLocaleString('nb-NO', { timeZone: APP_TIME_ZONE, ...options })
}

/** «12. mars 2026, kl. 17:00–20:00», eller «12. mars 2026 – 13. mars 2026» over flere dager. */
function formatWhen(startIso: string | null, endIso: string | null): string | null {
    if (!startIso) return null
    const start = new Date(startIso)
    if (Number.isNaN(start.getTime())) return null
    const end = endIso ? new Date(endIso) : null
    const dateOpts: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' }
    const timeOpts: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit' }
    const startDate = osloDate(start, dateOpts)

    if (!end || Number.isNaN(end.getTime())) {
        return `${startDate}, kl. ${osloDate(start, timeOpts)}`
    }
    const endDate = osloDate(end, dateOpts)
    if (endDate !== startDate) return `${startDate} – ${endDate}`
    return `${startDate}, kl. ${osloDate(start, timeOpts)}–${osloDate(end, timeOpts)}`
}

export default async function CertificatePage({
    params,
}: {
    params: Promise<{ token: string }>
}) {
    const { token } = await params
    const participantId = verifyCertificateToken(decodeURIComponent(token))
    if (participantId == null) notFound()

    const supabase = createAdminClient() ?? (await createClient())

    const { data: participant } = await supabase
        .from('EventParticipants')
        .select('name, attended, eventId')
        .eq('id', participantId)
        .maybeSingle()
    if (!participant || participant.attended !== true || participant.eventId == null) notFound()

    const { data: event } = await supabase
        .from('Events')
        .select('title, start_datetime, end_datetime, location')
        .eq('id', participant.eventId)
        .maybeSingle()
    if (!event) notFound()

    const name = participant.name?.trim() || 'Deltaker'
    const title = event.title?.trim() || 'Arrangement'
    const when = formatWhen(event.start_datetime, event.end_datetime)
    const where = event.location?.trim() || null

    return (
        <main className="certificate-page" style={styles.page}>
            <style>{`
                @page { size: A4 landscape; margin: 12mm; }
                @media print {
                    .certificate-page { background: #fff !important; padding: 0 !important; }
                    .certificate-actions { display: none !important; }
                    .certificate { box-shadow: none !important; max-width: none !important; }
                }
            `}</style>

            <div className="certificate-actions" style={styles.actions}>
                <PrintButton />
            </div>

            <article className="certificate" style={styles.certificate}>
                <Image src="/assets/Logo.png" alt="TrAMS" width={110} height={110} priority />
                <p style={styles.kicker}>Kursbevis</p>
                <p style={styles.lead}>Dette bekrefter at</p>
                <h1 style={styles.name}>{name}</h1>
                <p style={styles.lead}>har deltatt på</p>
                <h2 style={styles.title}>{title}</h2>
                {(when || where) && (
                    <p style={styles.details}>{[when, where].filter(Boolean).join(' · ')}</p>
                )}
                <p style={styles.footer}>Trondheim Akuttmedisinske Studentforening (TrAMS)</p>
            </article>
        </main>
    )
}

const styles = {
    page: {
        minHeight: '100vh',
        background: 'var(--color-altBg)',
        padding: '32px 16px',
        color: 'var(--color-text)',
        fontFamily: 'var(--font-family)',
    },
    actions: { maxWidth: 900, margin: '0 auto 24px', display: 'flex', justifyContent: 'flex-end' },
    certificate: {
        maxWidth: 900,
        margin: '0 auto',
        padding: '48px 32px',
        background: '#fff',
        border: '10px double var(--color-primary)',
        boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
    },
    kicker: {
        marginTop: 24,
        fontSize: 14,
        fontWeight: 700,
        letterSpacing: '0.3em',
        textTransform: 'uppercase',
        color: '#6b7280',
    },
    lead: { marginTop: 28, fontSize: 18, color: '#4b5563' },
    name: {
        marginTop: 10,
        padding: '0 24px 12px',
        borderBottom: '2px solid #e5e7eb',
        fontSize: 'clamp(2rem, 5vw, 3rem)',
        fontWeight: 800,
        lineHeight: 1.2,
    },
    title: {
        marginTop: 10,
        fontSize: 'clamp(1.5rem, 3.5vw, 2rem)',
        fontWeight: 700,
        lineHeight: 1.3,
        color: 'var(--color-primary)',
    },
    details: { marginTop: 16, fontSize: 16, color: '#4b5563' },
    footer: { marginTop: 48, fontSize: 14, color: '#6b7280' },
} satisfies Record<string, React.CSSProperties>
