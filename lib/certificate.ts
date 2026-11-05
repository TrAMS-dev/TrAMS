import { createHmac, timingSafeEqual } from 'crypto'

/**
 * Signerte lenker til personlige kursbevis. Kun for server (bruker hemmelig nøkkel).
 *
 * Token er `<deltaker-id>.<signatur>`. Signaturen hindrer at noen kan gjette seg
 * fram til andres kursbevis ved å endre id-en. Vi lagrer ikke token i databasen
 * fordi EventParticipants kan leses av alle.
 */

const SITE_ORIGIN = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.trams.no').replace(/\/$/, '')

function signingKey(): string | null {
    const secret = process.env.CERTIFICATE_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY
    // Prefiks slik at nøkkelen bare brukes til dette formålet
    return secret ? `kursbevis:${secret}` : null
}

function sign(participantId: number, key: string): string {
    return createHmac('sha256', key).update(String(participantId)).digest('base64url').slice(0, 32)
}

export function isCertificateSigningConfigured(): boolean {
    return signingKey() !== null
}

export function certificateToken(participantId: number): string | null {
    const key = signingKey()
    if (!key) return null
    return `${participantId}.${sign(participantId, key)}`
}

export function certificateUrl(participantId: number): string | null {
    const token = certificateToken(participantId)
    return token ? `${SITE_ORIGIN}/kursbevis/${token}` : null
}

/** Returnerer deltaker-id-en dersom token er gyldig, ellers null. */
export function verifyCertificateToken(token: string): number | null {
    const key = signingKey()
    if (!key) return null

    const match = /^(\d{1,15})\.([A-Za-z0-9_-]{32})$/.exec(token)
    if (!match) return null

    const participantId = Number(match[1])
    if (!Number.isSafeInteger(participantId) || participantId < 1) return null

    const expected = Buffer.from(sign(participantId, key))
    const given = Buffer.from(match[2])
    if (expected.length !== given.length || !timingSafeEqual(expected, given)) return null

    return participantId
}
