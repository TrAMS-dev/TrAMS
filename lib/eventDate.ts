import type { Tables } from '@/types/supabase'
import { APP_TIME_ZONE } from '@/lib/datetimeLocal'

type EventDateFields = Pick<
    Tables<'Events'>,
    'date_unspecified' | 'planned_month' | 'start_datetime'
>

export function isDateUnspecifiedEvent(event: EventDateFields): boolean {
    return Boolean(event.date_unspecified) || (!event.start_datetime && Boolean(event.planned_month))
}

export function formatPlannedMonth(plannedMonth: string | null | undefined): string {
    if (!plannedMonth) return 'Dato kommer'
    const [year, month] = plannedMonth.split('-').map(Number)
    if (!year || !month) return 'Dato kommer'
    const date = new Date(year, month - 1, 1)
    return date.toLocaleDateString('nb-NO', { month: 'long', year: 'numeric' })
}

export function formatEventDate(
    event: EventDateFields,
    options: { style?: 'short' | 'long' } = {}
): string {
    if (isDateUnspecifiedEvent(event)) {
        return formatPlannedMonth(event.planned_month)
    }

    if (event.start_datetime) {
        const style = options.style ?? 'short'
        return new Date(event.start_datetime).toLocaleDateString('nb-NO', {
            timeZone: APP_TIME_ZONE,
            ...(style === 'short'
                ? { month: 'short', day: 'numeric' }
                : { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
        })
    }

    return 'Dato kommer'
}

export function getEventSortTime(event: Tables<'Events'>): number | null {
    if (isDateUnspecifiedEvent(event) && event.planned_month) {
        const [year, month] = event.planned_month.split('-').map(Number)
        if (year && month) return new Date(year, month - 1, 1).getTime()
        return null
    }
    if (event.start_datetime) return new Date(event.start_datetime).getTime()
    return null
}

export function isEventPast(event: Tables<'Events'>, now = new Date()): boolean {
    if (isDateUnspecifiedEvent(event) && event.planned_month) {
        const [year, month] = event.planned_month.split('-').map(Number)
        if (!year || !month) return false
        const endOfMonth = new Date(year, month, 0, 23, 59, 59, 999)
        return endOfMonth.getTime() < now.getTime()
    }

    const startDate = event.start_datetime ? new Date(event.start_datetime) : null
    const endDate = event.end_datetime ? new Date(event.end_datetime) : null
    const comparisonDate = endDate ?? startDate
    return comparisonDate ? comparisonDate.getTime() < now.getTime() : false
}

export function shouldShowInCalendar(event: Tables<'Events'>): boolean {
    return !isDateUnspecifiedEvent(event) && Boolean(event.start_datetime)
}
