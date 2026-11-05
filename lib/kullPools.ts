import type { Json } from '@/types/supabase'
import { kullToKlasse } from '@/utils/functions/activeYears'

/** Plasser reservert for ett eller flere kull. Resten av max_attendees er åpne for alle. */
export type KullPool = {
    kull: number[]
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
    const pools: KullPool[] = []
    for (const entry of value) {
        if (!entry || typeof entry !== 'object' || Array.isArray(entry)) continue
        const spots = Number(entry.spots)
        const kull = Array.isArray(entry.kull)
            ? Array.from(new Set(entry.kull.map(Number).filter(Number.isInteger)))
            : []
        if (kull.length === 0 || !Number.isInteger(spots) || spots < 1) continue
        pools.push({ kull: kull.sort((a, b) => a - b), spots })
    }
    return pools
}

/** F.eks. «3.–6. klasse» for sammenhengende klasser, ellers «2., 4. klasse». */
export function formatPoolKlasser(kull: number[]): string {
    const klasser = kull.map(kullToKlasse).sort((a, b) => a - b)
    const contiguous = klasser.every((k, i) => i === 0 || k === klasser[i - 1] + 1)
    if (klasser.length > 2 && contiguous) {
        return `${klasser[0]}.–${klasser[klasser.length - 1]}. klasse`
    }
    return `${klasser.map((k) => `${k}.`).join(', ')} klasse`
}

const isSubset = (a: number[], b: number[]) => a.every((k) => b.includes(k))

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
    if (pools.some((p) => p.kull.length === 0)) {
        return 'Velg minst ett kull for hver pulje'
    }
    if (pools.some((p) => !Number.isInteger(p.spots) || p.spots < 1)) {
        return 'Antall reserverte plasser må være et heltall større enn 0'
    }
    if (
        allowedKull &&
        allowedKull.length > 0 &&
        pools.some((p) => !isSubset(p.kull, allowedKull))
    ) {
        return 'Kan ikke reservere plasser for et kull som ikke kan melde seg på'
    }
    // Pools must be disjoint or nested, so "most specific pool first" is always the
    // best placement. Partly overlapping pools (e.g. 3.–4. and 4.–5.) are ambiguous.
    for (let i = 0; i < pools.length; i++) {
        for (let j = i + 1; j < pools.length; j++) {
            const a = pools[i].kull
            const b = pools[j].kull
            if (isSubset(a, b) && isSubset(b, a)) {
                return 'To puljer kan ikke gjelde nøyaktig de samme klassene'
            }
            const overlaps = a.some((k) => b.includes(k))
            if (overlaps && !isSubset(a, b) && !isSubset(b, a)) {
                return `${formatPoolKlasser(a)} og ${formatPoolKlasser(b)} overlapper delvis. En pulje må enten ligge helt innenfor en annen eller ikke dele klasser med den.`
            }
        }
    }
    const reserved = pools.reduce((sum, p) => sum + p.spots, 0)
    if (reserved > maxAttendees) {
        return `Reserverte plasser (${reserved}) kan ikke være flere enn maks antall deltakere (${maxAttendees})`
    }
    return null
}

/**
 * Fordeler bekreftede deltakere på puljer. Den mest spesifikke puljen (færrest kull)
 * fylles først, deretter bredere puljer som også dekker kullet, og til slutt de åpne
 * plassene. Siden puljene er nøstet eller adskilte, gir dette flest mulig plasser.
 */
export function summarizeCapacity(
    maxAttendees: number,
    pools: KullPool[],
    confirmedKull: (number | null)[]
): CapacitySummary {
    const remainingByKull = new Map<number, number>()
    for (const k of confirmedKull) {
        if (k == null) continue
        remainingByKull.set(k, (remainingByKull.get(k) ?? 0) + 1)
    }

    const order = pools
        .map((pool, index) => ({ pool, index }))
        .sort((a, b) => a.pool.kull.length - b.pool.kull.length)

    const taken = new Array<number>(pools.length).fill(0)
    for (const { pool, index } of order) {
        let free = pool.spots
        for (const k of pool.kull) {
            if (free === 0) break
            const n = Math.min(free, remainingByKull.get(k) ?? 0)
            if (n === 0) continue
            remainingByKull.set(k, (remainingByKull.get(k) ?? 0) - n)
            free -= n
        }
        taken[index] = pool.spots - free
    }

    const reserved = pools.reduce((sum, p) => sum + p.spots, 0)
    const takenInPools = taken.reduce((sum, n) => sum + n, 0)

    return {
        pools: pools.map((p, i) => ({ ...p, taken: taken[i] })),
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
    // Place everyone including the newcomer. There's room if they land in a pool, or if
    // the open spots still aren't overfilled (admins may already have overfilled them).
    const before = summarizeCapacity(maxAttendees, pools, confirmedKull).open
    const after = summarizeCapacity(maxAttendees, pools, [...confirmedKull, kull]).open
    return after.taken === before.taken || after.taken <= after.spots
}
