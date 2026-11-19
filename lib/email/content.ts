import { client } from '@/sanity/lib/client'
import { EMAIL_DEFAULTS, type EmailContentMap, type EmailDocType } from './defaults'

function isFilled(value: unknown): boolean {
    if (typeof value === 'string') return value.trim().length > 0
    if (Array.isArray(value)) return value.length > 0
    return false
}

function merge<T extends object>(defaults: T, fromSanity: Record<string, unknown> | null | undefined): T {
    const result = { ...defaults }
    if (!fromSanity) return result
    for (const field of Object.keys(defaults) as (keyof T & string)[]) {
        const value = fromSanity[field]
        if (isFilled(value)) result[field] = value as T[typeof field]
    }
    return result
}

/**
 * Henter teksten for én e-post og de felles e-postinnstillingene fra Sanity (publisert versjon).
 * Tomme felt og manglende dokumenter faller tilbake til standardteksten i `defaults.ts`,
 * og feil mot Sanity logges uten å stoppe utsendingen.
 */
export async function getEmailContent<K extends Exclude<EmailDocType, 'emailSettings'>>(
    type: K
): Promise<{ content: EmailContentMap[K]; settings: EmailContentMap['emailSettings'] }> {
    let docs: { _type: string }[] = []
    try {
        docs = await client.fetch<{ _type: string }[]>(
            `*[_type in [$type, "emailSettings"] && !(_id in path("drafts.**"))]`,
            { type }
        )
    } catch (error) {
        console.error(`getEmailContent(${type}): Sanity fetch failed, using default text`, error)
    }

    const find = (t: string) => docs.find((d) => d._type === t) as Record<string, unknown> | undefined

    return {
        content: merge(EMAIL_DEFAULTS[type], find(type)),
        settings: merge(EMAIL_DEFAULTS.emailSettings, find('emailSettings')),
    }
}
