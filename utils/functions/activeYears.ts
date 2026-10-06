export const activeYears = () => {
    const currentYear = new Date().getFullYear()
    const currentMonth = new Date().getMonth()

    const latestYear = currentMonth >= 6 ? currentYear : currentYear - 1

    return Array.from({ length: 6 }, (_, i) => (latestYear - i) % 100)
}

/** Study year (1 = newest kull) for a two-digit kull, based on the current school year. */
export const kullToKlasse = (kull: number) => activeYears()[0] - kull + 1

/** Null or empty `allowedKull` means every kull may sign up. */
export const isKullAllowed = (kull: number, allowedKull: number[] | null | undefined) =>
    !allowedKull || allowedKull.length === 0 || allowedKull.includes(kull)

