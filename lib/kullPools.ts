import type { Json } from '@/types/supabase'

/** Plasser reservert for ett kull. Resten av max_attendees er åpne for alle. */
export type KullPool = {
    kull: number
    spots: number
}

export type KullPoolUsage = KullPool & {
    taken: number
}

export interface CapacitySummary {
    pools: KullPoolUsage[]
    /** Plasser som ikke er reservert for noe kull. */
    open: { spots: number; taken: number }
}

/** Leser kull_pools-kolonnen og forkaster ugyldige oppføringer. */
export function parseKullPools(value: Json | null | undefined): KullPool[] {
    if (!Array.isArray(value)) return []
    const seen = new Set<number>()
    const pools: KullPool[] = []
    for (const entry of value) {
        if (!entry || typeof entry !== 'object' || Array.isArray(entry)) continue
        const kull = Number(entry.kull)
        const spots = Number(entry.spots)
        if (!Number.isInteger(kull) || !Number.isInteger(spots) || spots < 1) continue
        if (seen.has(kull)) continue
        seen.add(kull)
        pools.push({ kull, spots })
    }
    return pools
}

/** Returnerer en feilmelding dersom puljene ikke passer med arrangementet, ellers null. */
export function validateKullPools(
    pools: KullPool[],
    maxAttendees: number | null,
    allowedKull: number[] | null
): string | null {
    if (pools.length === 0) return null
    if (maxAttendees == null) {
        return 'Reserverte plasser krever at maks antall deltakere er satt'
    }
    if (new Set(pools.map((p) => p.kull)).size !== pools.length) {
        return 'Hvert kull kan bare ha én pulje med reserverte plasser'
    }
    if (pools.some((p) => !Number.isInteger(p.spots) || p.spots < 1)) {
        return 'Antall reserverte plasser må være et heltall større enn 0'
    }
    if (allowedKull && allowedKull.length > 0 && pools.some((p) => !allowedKull.includes(p.kull))) {
        return 'Kan ikke reservere plasser for et kull som ikke kan melde seg på'
    }
    const reserved = pools.reduce((sum, p) => sum + p.spots, 0)
    if (reserved > maxAttendees) {
        return `Reserverte plasser (${reserved}) kan ikke være flere enn maks antall deltakere (${maxAttendees})`
    }
    return null
}

/**
 * Fordeler bekreftede deltakere på puljer: et kull fyller først sin egen pulje,
 * og overskytende deltakere teller mot de åpne plassene.
 */
export function summarizeCapacity(
    maxAttendees: number,
    pools: KullPool[],
    confirmedKull: (number | null)[]
): CapacitySummary {
    const countByKull = new Map<number, number>()
    for (const k of confirmedKull) {
        if (k == null) continue
        countByKull.set(k, (countByKull.get(k) ?? 0) + 1)
    }

    const poolUsage = pools.map((p) => ({
        ...p,
        taken: Math.min(countByKull.get(p.kull) ?? 0, p.spots),
    }))
    const reserved = pools.reduce((sum, p) => sum + p.spots, 0)
    const takenInPools = poolUsage.reduce((sum, p) => sum + p.taken, 0)

    return {
        pools: poolUsage,
        open: {
            spots: Math.max(0, maxAttendees - reserved),
            taken: confirmedKull.length - takenInPools,
        },
    }
}

/** Om en deltaker fra `kull` kan få bekreftet plass nå. */
export function hasFreeSpotForKull(
    maxAttendees: number | null,
    pools: KullPool[],
    confirmedKull: (number | null)[],
    kull: number
): boolean {
    if (maxAttendees == null) return true
    const { pools: usage, open } = summarizeCapacity(maxAttendees, pools, confirmedKull)
    const pool = usage.find((p) => p.kull === kull)
    if (pool && pool.taken < pool.spots) return true
    return open.taken < open.spots
}
