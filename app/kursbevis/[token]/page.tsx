import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { FALLBACK_CERTIFICATE_SIGNER, verifyCertificateToken } from '@/lib/certificate'
import { client } from '@/sanity/lib/client'
import { CERTIFICATE_SETTINGS_QUERY } from '@/sanity/lib/queries'
import { APP_TIME_ZONE } from '@/lib/datetimeLocal'
import { createAdminClient } from '@/utils/supabase/admin'
import { createClient } from '@/utils/supabase/server'
import PrintButton from './PrintButton'

export const metadata: Metadata = {
    title: 'Kursbevis',
    robots: { index: false, follow: false },
}

/** «25.11.24», or «25.11.24–26.11.24» when the event spans several days (Oslo time). */
function formatCourseDate(startIso: string | null, endIso: string | null): string | null {
    const fmt = (iso: string) =>
        new Date(iso).toLocaleDateString('nb-NO', {
            timeZone: APP_TIME_ZONE,
            day: '2-digit',
            month: '2-digit',
            year: '2-digit',
        })
    if (!startIso || Number.isNaN(new Date(startIso).getTime())) return null
    const start = fmt(startIso)
    const end = endIso && !Number.isNaN(new Date(endIso).getTime()) ? fmt(endIso) : start
    return end === start ? start : `${start}–${end}`
}

/** The signer from Sanity («Kursbevis (signatur)»), or the fallback until that is filled in. */
async function getSigner() {
    try {
        const settings = await client.fetch(CERTIFICATE_SETTINGS_QUERY)
        if (settings?.signerName && settings.signatureUrl) {
            return {
                name: settings.signerName,
                title: settings.signerTitle || 'Leder TrAMS',
                signatureSrc: settings.signatureUrl,
            }
        }
    } catch (e) {
        console.error('Certificate: could not fetch signer from Sanity', e)
    }
    return FALLBACK_CERTIFICATE_SIGNER
}

/** The thin red line with a heartbeat near the right edge, as on the printed certificate. */
function EcgLine() {
    return (
        <svg
            viewBox="0 0 596 60"
            preserveAspectRatio="none"
            style={{ position: 'absolute', left: 0, right: 0, top: '81.1%', width: '100%', height: '7%' }}
            aria-hidden
        >
            <path
                d="M0 36 H532 L537 33 L541 40 L548 30 L556 8 L563 54 L568 36 H596"
                fill="none"
                stroke={RED}
                strokeWidth="1.6"
                strokeLinejoin="round"
                vectorEffect="non-scaling-stroke"
            />
        </svg>
    )
}

const RED = '#e5392c'

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
        .select('title, start_datetime, end_datetime, certificate_description')
        .eq('id', participant.eventId)
        .maybeSingle()
    if (!event) notFound()

    const name = participant.name?.trim() || 'Deltaker'
    const title = event.title?.trim() || 'arrangementet'
    const date = formatCourseDate(event.start_datetime, event.end_datetime)
    const description = event.certificate_description?.trim() || null
    const signer = await getSigner()

    return (
        <main className="certificate-page" style={styles.page}>
            <style>{`
                @page { size: A4 portrait; margin: 0; }
                @media print {
                    html, body { background: #fff !important; }
                    .certificate-page { padding: 0 !important; background: #fff !important; }
                    .certificate-actions { display: none !important; }
                    .certificate-frame { width: 210mm !important; max-width: none !important; }
                    .certificate { box-shadow: none !important; }
                }
            `}</style>

            <div className="certificate-actions" style={styles.actions}>
                <PrintButton />
            </div>

            {/* Sized in container units (cqw) so the page scales like a sheet of A4 */}
            <div className="certificate-frame" style={styles.frame}>
                <article className="certificate" style={styles.certificate}>
                    {/* eslint-disable-next-line @next/next/no-img-element -- plain img prints reliably */}
                    <img src="/assets/Logo.png" alt="TrAMS" style={styles.logo} />

                    <h1 style={styles.heading}>KURSBEVIS</h1>

                    <p style={{ ...styles.text, marginTop: '9cqw' }}>Det bekreftes herved at</p>
                    <p style={styles.name}>{name}</p>
                    <p style={styles.text}>har deltatt på {title}.</p>

                    {date && (
                        <p style={{ ...styles.text, marginTop: '4.5cqw' }}>
                            Kurset ble arrangert {date} av Trondheim akuttmedisinske
                            studentforening (TrAMS).
                        </p>
                    )}
                    {description && (
                        <p style={{ ...styles.text, marginTop: '4.5cqw' }}>{description}</p>
                    )}

                    <div style={styles.signature}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={signer.signatureSrc}
                            alt={`Signatur, ${signer.name}`}
                            style={styles.signatureImage}
                        />
                        <p style={styles.signer}>{signer.name}</p>
                        <p style={styles.signer}>{signer.title}</p>
                    </div>

                    <EcgLine />

                    <footer style={styles.footer}>
                        <p style={{ fontSize: '2.1cqw' }}>Trondheim akuttmedisinske studentforening</p>
                        <p style={{ marginTop: '3cqw' }}>
                            Fakultet for medisin og helsevitenskap, Fred Kavli-bygget, 1.et ved
                            varemottak,
                            <br />
                            7491 Trondheim
                        </p>
                        <p style={{ color: '#222' }}>web@trams.no &nbsp;|&nbsp; www.trams.no</p>
                    </footer>
                </article>
            </div>
        </main>
    )
}

const BODY_FONT = '"Century Gothic", "Futura", "Avenir Next", "Avenir", var(--font-family), sans-serif'

const styles = {
    page: {
        minHeight: '100vh',
        background: 'var(--color-altBg)',
        padding: '32px 16px',
        color: '#111',
    },
    actions: { maxWidth: 794, margin: '0 auto 24px', display: 'flex', justifyContent: 'flex-end' },
    frame: { width: '100%', maxWidth: 794, margin: '0 auto', containerType: 'inline-size' },
    certificate: {
        position: 'relative',
        width: '100%',
        aspectRatio: '210 / 297',
        background: '#fff',
        boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        padding: '7.5cqw 13cqw 0',
        fontFamily: BODY_FONT,
        overflow: 'hidden',
    },
    logo: { width: '19.5cqw', height: '19.5cqw' },
    heading: {
        marginTop: '9cqw',
        fontFamily: BODY_FONT,
        fontSize: '6.6cqw',
        fontWeight: 400,
        letterSpacing: '0.02em',
        color: RED,
        lineHeight: 1,
    },
    text: { marginTop: '3cqw', fontSize: '2.25cqw', lineHeight: 1.55 },
    name: {
        marginTop: '3cqw',
        fontSize: '2.6cqw',
        textDecoration: 'underline',
        textUnderlineOffset: '0.35em',
    },
    signature: {
        position: 'absolute',
        top: '66%',
        left: 0,
        right: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    signatureImage: { width: '40cqw', height: 'auto' },
    signer: {
        fontFamily: '"Times New Roman", Times, serif',
        fontSize: '3.1cqw',
        lineHeight: 1.4,
    },
    footer: {
        position: 'absolute',
        top: '88%',
        left: 0,
        right: 0,
        fontSize: '1.85cqw',
        color: '#8a8a8a',
        lineHeight: 1.5,
    },
} satisfies Record<string, React.CSSProperties>
