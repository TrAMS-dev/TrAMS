export const activeYears = () => {
    const currentYear = new Date().getFullYear()
    const currentMonth = new Date().getMonth()

    const latestYear = currentMonth >= 6 ? currentYear : currentYear - 1

    return Array.from({ length: 6 }, (_, i) => (latestYear - i) % 100)
}