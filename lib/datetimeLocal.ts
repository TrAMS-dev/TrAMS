/**
 * TrAMS is used only in Oslo: every `datetime-local` value is interpreted as
 * civil time in Europe/Oslo, and DB instants are shown as Oslo wall clock in
 * the admin picker. This avoids wrong times when the browser timezone is not Oslo.
 *
 * Values are still stored in Postgres as timestamptz (UTC instants).
 */

/** Canonical zone for all event times in TrAMS (Oslo-only audience). */
export const APP_TIME_ZONE = 'Europe/Oslo'

const osloPartsFormatter = new Intl.DateTimeFormat('en-GB', {
    timeZone: APP_TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
})

function readOsloParts(d: Date) {
    const parts = osloPartsFormatter.formatToParts(d)
    const n = (type: Intl.DateTimeFormatPartTypes) =>
        Number(parts.find((p) => p.type === type)?.value)
    return {
        y: n('year'),
        mo: n('month'),
        da: n('day'),
        h: n('hour'),
        m: n('minute'),
        s: n('second'),
    }
}

/**
 * Find UTC ms such that this instant's Oslo clock matches the given wall time.
 * Steps by whole minutes in a ±18h window (covers offsets and DST).
 * Returns null if that wall time does not exist in Oslo (spring DST gap).
 * If ambiguous (fall-back hour), returns the earlier UTC instant.
 */
function osloWallClockToUtcMs(
    y: number,
    mo: number,
    da: number,
    h: number,
    mi: number,
    matchSeconds: boolean,
    se: number
): number | null {
    const center = Date.UTC(y, mo - 1, da, h, mi, 0)
    const halfWindow = 18 * 60 * 60 * 1000

    for (let delta = -halfWindow; delta <= halfWindow; delta += 60 * 1000) {
        const t = center + delta
        const p = readOsloParts(new Date(t))
        if (p.y !== y || p.mo !== mo || p.da !== da || p.h !== h || p.m !== mi) continue
        if (matchSeconds && p.s !== se) continue
        return t
    }
    return null
}

function parseNaiveLocal(local: string) {
    const t = local.trim()
    if (!t) return null

    const [datePart, timePart] = t.split('T')
    if (!datePart || !timePart) return null

    const [ys, ms, ds] = datePart.split('-')
    const y = Number(ys)
    const mo = Number(ms)
    const da = Number(ds)
    const timeSegs = timePart.split(':')
    const h = Number(timeSegs[0])
    const mi = timeSegs[1] !== undefined ? Number(timeSegs[1]) : 0
    const se = timeSegs[2] !== undefined ? Number(timeSegs[2]) : 0

    if (![y, mo, da, h, mi, se].every((n) => Number.isFinite(n))) return null
    if (mo < 1 || mo > 12 || da < 1 || da > 31) return null

    return { y, mo, da, h, mi, se }
}

/** Parse picker value as Oslo civil time → UTC ISO for timestamptz storage. */
export function datetimeLocalToUtcIso(local: string): string | null {
    const parsed = parseNaiveLocal(local)
    if (!parsed) return null

    const { y, mo, da, h, mi, se } = parsed
    const hasSeconds =
        local.includes(':') && local.trim().split(':').length > 2

    const utcMs = osloWallClockToUtcMs(y, mo, da, h, mi, hasSeconds, se)
    if (utcMs === null) return null

    return new Date(utcMs).toISOString()
}

/** timestamptz from DB → `datetime-local` value showing Oslo wall clock. */
export function utcIsoToDatetimeLocalValue(iso: string | null | undefined): string {
    if (!iso) return ''
    const d = new Date(iso)
    if (Number.isNaN(d.getTime())) return ''

    const p = readOsloParts(d)
    const pad2 = (n: number) => String(n).padStart(2, '0')
    return `${p.y}-${pad2(p.mo)}-${pad2(p.da)}T${pad2(p.h)}:${pad2(p.m)}`
}
