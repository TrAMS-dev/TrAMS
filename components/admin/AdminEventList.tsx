'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import {
    Badge,
    Box,
    Button,
    Field,
    Flex,
    Heading,
    HStack,
    Input,
    NativeSelect,
    Progress,
    SimpleGrid,
    Table,
    Text,
} from '@chakra-ui/react'
import { ArrowDown, ArrowUp, ArrowUpDown, Calendar, LayoutGrid, List, MapPin, Users } from 'lucide-react'
import type { Tables } from '@/types/supabase'
import { APP_TIME_ZONE } from '@/lib/datetimeLocal'
import { formatPlannedMonth, getEventSortTime, shouldShowInCalendar } from '@/lib/eventDate'
import { DeleteEventButton } from '@/components/admin/DeleteEventButton'

export type RegistrationStatus = 'open' | 'not-open' | 'closed' | 'undecided'

export interface AdminEventRow {
    event: Tables<'Events'>
    confirmed: number
    isPast: boolean
    registrationStatus: RegistrationStatus
}

type View = 'table' | 'cards' | 'calendar'
type StatusFilter = 'upcoming' | 'past' | 'all'
type RegistrationFilter = 'all' | RegistrationStatus
type CapacityFilter = 'all' | 'available' | 'full'
type SortKey = 'date' | 'title' | 'attendees' | 'fill'
type SortDir = 'asc' | 'desc'

const REGISTRATION_LABELS: Record<RegistrationStatus, { label: string; color: string }> = {
    open: { label: 'Påmelding åpen', color: 'green' },
    'not-open': { label: 'Ikke åpnet', color: 'blue' },
    closed: { label: 'Påmelding stengt', color: 'orange' },
    undecided: { label: 'Påmelding ikke bestemt', color: 'gray' },
}

function formatAdminDate(event: Tables<'Events'>): string {
    if (event.date_unspecified) return formatPlannedMonth(event.planned_month)
    if (!event.start_datetime) return '—'
    return new Date(event.start_datetime).toLocaleDateString('nb-NO', {
        timeZone: APP_TIME_ZONE,
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    })
}

function attendeesLabel({ event, confirmed }: AdminEventRow): string {
    return event.max_attendees != null ? `${confirmed} / ${event.max_attendees}` : String(confirmed)
}

function fillRatio({ event, confirmed }: AdminEventRow): number | null {
    return event.max_attendees ? confirmed / event.max_attendees : null
}

function isFull(row: AdminEventRow): boolean {
    return row.event.max_attendees != null && row.confirmed >= row.event.max_attendees
}

function compareRows(a: AdminEventRow, b: AdminEventRow, key: SortKey, dir: SortDir): number {
    const sign = dir === 'asc' ? 1 : -1
    if (key === 'title') {
        return sign * (a.event.title || '').localeCompare(b.event.title || '', 'nb')
    }

    const value = (row: AdminEventRow): number | null => {
        if (key === 'date') return getEventSortTime(row.event)
        if (key === 'attendees') return row.confirmed
        return fillRatio(row)
    }
    const va = value(a)
    const vb = value(b)
    // Rows without a value always go last, regardless of direction.
    if (va == null && vb == null) return 0
    if (va == null) return 1
    if (vb == null) return -1
    return sign * (va - vb)
}

function EventActions({ row }: { row: AdminEventRow }) {
    const { event, confirmed } = row
    return (
        <Flex justify="flex-end" gap={3}>
            <Link href={`/admin/arrangement/${event.slug}/participants`}>
                <Button size="xs" variant="outline">Deltakere</Button>
            </Link>
            <Link href={`/admin/arrangement/${event.slug}`}>
                <Button size="xs" variant="subtle">Rediger</Button>
            </Link>
            <DeleteEventButton
                eventId={event.id}
                eventTitle={event.title || 'Uten tittel'}
                participantCount={confirmed}
            />
        </Flex>
    )
}

function StatusBadges({ row }: { row: AdminEventRow }) {
    const reg = REGISTRATION_LABELS[row.registrationStatus]
    return (
        <HStack gap={2} wrap="wrap">
            <Badge colorPalette={row.isPast ? 'gray' : 'green'}>
                {row.isPast ? 'Fullført' : 'Kommende'}
            </Badge>
            {!row.isPast && <Badge colorPalette={reg.color} variant="outline">{reg.label}</Badge>}
            {isFull(row) && <Badge colorPalette="red">Fullt</Badge>}
        </HStack>
    )
}

function SortableHeader({
    label,
    sortKey,
    activeKey,
    dir,
    onSort,
}: {
    label: string
    sortKey: SortKey
    activeKey: SortKey
    dir: SortDir
    onSort: (key: SortKey) => void
}) {
    const active = sortKey === activeKey
    const Icon = !active ? ArrowUpDown : dir === 'asc' ? ArrowUp : ArrowDown
    return (
        <Table.ColumnHeader
            cursor="pointer"
            userSelect="none"
            onClick={() => onSort(sortKey)}
            aria-sort={active ? (dir === 'asc' ? 'ascending' : 'descending') : 'none'}
        >
            <HStack gap={1} color={active ? 'gray.900' : undefined}>
                <span>{label}</span>
                <Icon size={14} opacity={active ? 1 : 0.4} />
            </HStack>
        </Table.ColumnHeader>
    )
}

export function AdminEventList({ rows }: { rows: AdminEventRow[] }) {
    const router = useRouter()
    const [view, setView] = useState<View>('table')
    const [search, setSearch] = useState('')
    const [statusFilter, setStatusFilter] = useState<StatusFilter>('upcoming')
    const [registrationFilter, setRegistrationFilter] = useState<RegistrationFilter>('all')
    const [capacityFilter, setCapacityFilter] = useState<CapacityFilter>('all')
    const [sortKey, setSortKey] = useState<SortKey>('date')
    const [sortDir, setSortDir] = useState<SortDir>('asc')

    const pastCount = useMemo(() => rows.filter((r) => r.isPast).length, [rows])

    const visibleRows = useMemo(() => {
        const query = search.trim().toLowerCase()
        return rows
            .filter((row) => {
                if (statusFilter === 'upcoming' && row.isPast) return false
                if (statusFilter === 'past' && !row.isPast) return false
                if (registrationFilter !== 'all' && row.registrationStatus !== registrationFilter) return false
                if (capacityFilter === 'full' && !isFull(row)) return false
                if (capacityFilter === 'available' && isFull(row)) return false
                if (!query) return true
                return [row.event.title, row.event.location, row.event.author]
                    .filter(Boolean)
                    .join(' ')
                    .toLowerCase()
                    .includes(query)
            })
            .sort((a, b) => compareRows(a, b, sortKey, sortDir))
    }, [rows, search, statusFilter, registrationFilter, capacityFilter, sortKey, sortDir])

    const handleHeaderSort = (key: SortKey) => {
        if (key === sortKey) {
            setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
        } else {
            setSortKey(key)
            setSortDir(key === 'attendees' || key === 'fill' ? 'desc' : 'asc')
        }
    }

    const calendarEvents = useMemo(
        () =>
            visibleRows
                .filter((row) => shouldShowInCalendar(row.event))
                .map(({ event, isPast }) => ({
                    id: String(event.id),
                    title: event.title || 'Uten tittel',
                    start: event.start_datetime || undefined,
                    end: event.end_datetime || undefined,
                    url: event.slug ? `/admin/arrangement/${event.slug}` : undefined,
                    color: isPast ? '#a0aec0' : '#3182ce',
                })),
        [visibleRows]
    )
    const undatedCount = visibleRows.length - calendarEvents.length

    const hasActiveFilters =
        search !== '' || statusFilter !== 'upcoming' || registrationFilter !== 'all' || capacityFilter !== 'all'

    const resetFilters = () => {
        setSearch('')
        setStatusFilter('upcoming')
        setRegistrationFilter('all')
        setCapacityFilter('all')
    }

    const viewButton = (value: View, label: string, Icon: typeof List) => (
        <Button
            size="sm"
            variant={view === value ? 'solid' : 'ghost'}
            bg={view === value ? 'white' : undefined}
            color={view === value ? 'gray.900' : 'gray.600'}
            shadow={view === value ? 'xs' : undefined}
            onClick={() => setView(value)}
            aria-pressed={view === value}
        >
            <Icon size={16} />
            {label}
        </Button>
    )

    return (
        <Box>
            <Flex
                bg="white"
                shadow="sm"
                rounded="lg"
                p={4}
                mb={4}
                gap={4}
                direction={{ base: 'column', lg: 'row' }}
                align={{ base: 'stretch', lg: 'flex-end' }}
            >
                <SimpleGrid columns={{ base: 1, sm: 2, md: 5 }} gap={3} flex="1">
                    <Field.Root>
                        <Field.Label fontSize="sm" color="gray.600">Søk</Field.Label>
                        <Input
                            size="sm"
                            placeholder="Tittel, sted, arrangør"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </Field.Root>
                    <Field.Root>
                        <Field.Label fontSize="sm" color="gray.600">Status</Field.Label>
                        <NativeSelect.Root size="sm">
                            <NativeSelect.Field
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
                            >
                                <option value="upcoming">Kommende</option>
                                <option value="past">Fullførte ({pastCount})</option>
                                <option value="all">Alle</option>
                            </NativeSelect.Field>
                            <NativeSelect.Indicator />
                        </NativeSelect.Root>
                    </Field.Root>
                    <Field.Root>
                        <Field.Label fontSize="sm" color="gray.600">Påmelding</Field.Label>
                        <NativeSelect.Root size="sm">
                            <NativeSelect.Field
                                value={registrationFilter}
                                onChange={(e) => setRegistrationFilter(e.target.value as RegistrationFilter)}
                            >
                                <option value="all">Alle</option>
                                {(Object.keys(REGISTRATION_LABELS) as RegistrationStatus[]).map((key) => (
                                    <option key={key} value={key}>
                                        {REGISTRATION_LABELS[key].label}
                                    </option>
                                ))}
                            </NativeSelect.Field>
                            <NativeSelect.Indicator />
                        </NativeSelect.Root>
                    </Field.Root>
                    <Field.Root>
                        <Field.Label fontSize="sm" color="gray.600">Kapasitet</Field.Label>
                        <NativeSelect.Root size="sm">
                            <NativeSelect.Field
                                value={capacityFilter}
                                onChange={(e) => setCapacityFilter(e.target.value as CapacityFilter)}
                            >
                                <option value="all">Alle</option>
                                <option value="available">Ledige plasser</option>
                                <option value="full">Fulle</option>
                            </NativeSelect.Field>
                            <NativeSelect.Indicator />
                        </NativeSelect.Root>
                    </Field.Root>
                    <Field.Root>
                        <Field.Label fontSize="sm" color="gray.600">Sorter</Field.Label>
                        <NativeSelect.Root size="sm">
                            <NativeSelect.Field
                                value={`${sortKey}-${sortDir}`}
                                onChange={(e) => {
                                    const [key, dir] = e.target.value.split('-') as [SortKey, SortDir]
                                    setSortKey(key)
                                    setSortDir(dir)
                                }}
                            >
                                <option value="date-asc">Dato (tidligst først)</option>
                                <option value="date-desc">Dato (senest først)</option>
                                <option value="title-asc">Tittel (A–Å)</option>
                                <option value="title-desc">Tittel (Å–A)</option>
                                <option value="attendees-desc">Flest påmeldte</option>
                                <option value="attendees-asc">Færrest påmeldte</option>
                                <option value="fill-desc">Fyllingsgrad (høyest)</option>
                                <option value="fill-asc">Fyllingsgrad (lavest)</option>
                            </NativeSelect.Field>
                            <NativeSelect.Indicator />
                        </NativeSelect.Root>
                    </Field.Root>
                </SimpleGrid>
                <HStack gap={1} bg="gray.100" p={1} rounded="lg" alignSelf={{ base: 'flex-start', lg: 'flex-end' }}>
                    {viewButton('table', 'Tabell', List)}
                    {viewButton('cards', 'Kort', LayoutGrid)}
                    {viewButton('calendar', 'Kalender', Calendar)}
                </HStack>
            </Flex>

            <Flex justify="space-between" align="center" mb={3} px={1}>
                <Text fontSize="sm" color="gray.600">
                    Viser {visibleRows.length} av {rows.length} arrangementer
                    {view === 'calendar' && undatedCount > 0 && ` (${undatedCount} uten fast dato vises ikke i kalenderen)`}
                </Text>
                {hasActiveFilters && (
                    <Button size="xs" variant="ghost" onClick={resetFilters}>
                        Nullstill filtre
                    </Button>
                )}
            </Flex>

            {visibleRows.length === 0 && view !== 'calendar' ? (
                <Box p={8} textAlign="center" bg="white" rounded="lg" border="1px dashed" borderColor="gray.200">
                    <Text color="gray.500">Ingen arrangementer matcher filtrene.</Text>
                </Box>
            ) : view === 'table' ? (
                <Box bg="white" shadow="sm" rounded="lg" overflow="hidden">
                    <Table.Root striped interactive>
                        <Table.Header>
                            <Table.Row>
                                <SortableHeader label="Tittel" sortKey="title" activeKey={sortKey} dir={sortDir} onSort={handleHeaderSort} />
                                <SortableHeader label="Dato" sortKey="date" activeKey={sortKey} dir={sortDir} onSort={handleHeaderSort} />
                                <SortableHeader label="Påmeldte" sortKey="attendees" activeKey={sortKey} dir={sortDir} onSort={handleHeaderSort} />
                                <Table.ColumnHeader>Status</Table.ColumnHeader>
                                <Table.ColumnHeader textAlign="right">Handlinger</Table.ColumnHeader>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {visibleRows.map((row) => (
                                <Table.Row key={row.event.id}>
                                    <Table.Cell fontWeight="medium">{row.event.title}</Table.Cell>
                                    <Table.Cell>{formatAdminDate(row.event)}</Table.Cell>
                                    <Table.Cell>{attendeesLabel(row)}</Table.Cell>
                                    <Table.Cell><StatusBadges row={row} /></Table.Cell>
                                    <Table.Cell textAlign="right"><EventActions row={row} /></Table.Cell>
                                </Table.Row>
                            ))}
                        </Table.Body>
                    </Table.Root>
                </Box>
            ) : view === 'cards' ? (
                <SimpleGrid columns={{ base: 1, md: 2, xl: 3 }} gap={4}>
                    {visibleRows.map((row) => {
                        const ratio = fillRatio(row)
                        return (
                            <Flex
                                key={row.event.id}
                                direction="column"
                                bg="white"
                                shadow="sm"
                                rounded="lg"
                                p={4}
                                gap={3}
                                border="1px solid"
                                borderColor="gray.100"
                            >
                                <Box>
                                    <Text fontSize="sm" color="gray.500">{formatAdminDate(row.event)}</Text>
                                    <Heading size="md" lineClamp={2}>{row.event.title || 'Uten tittel'}</Heading>
                                </Box>
                                <StatusBadges row={row} />
                                <HStack color="gray.600" fontSize="sm" gap={4}>
                                    <HStack gap={1}>
                                        <MapPin size={14} />
                                        <Text lineClamp={1}>{row.event.location || 'Sted ikke satt'}</Text>
                                    </HStack>
                                    <HStack gap={1} flexShrink={0}>
                                        <Users size={14} />
                                        <Text>{attendeesLabel(row)}</Text>
                                    </HStack>
                                </HStack>
                                {ratio != null && (
                                    <Progress.Root
                                        size="xs"
                                        value={Math.min(ratio, 1) * 100}
                                        colorPalette={ratio >= 1 ? 'red' : ratio >= 0.8 ? 'orange' : 'green'}
                                    >
                                        <Progress.Track>
                                            <Progress.Range />
                                        </Progress.Track>
                                    </Progress.Root>
                                )}
                                <Box mt="auto" pt={2}>
                                    <EventActions row={row} />
                                </Box>
                            </Flex>
                        )
                    })}
                </SimpleGrid>
            ) : (
                <Box bg="white" shadow="sm" rounded="lg" p={4}>
                    <FullCalendar
                        plugins={[dayGridPlugin, interactionPlugin]}
                        initialView="dayGridMonth"
                        firstDay={1}
                        events={calendarEvents}
                        eventClick={(info) => {
                            if (info.event.url) {
                                info.jsEvent.preventDefault()
                                router.push(info.event.url)
                            }
                        }}
                        headerToolbar={{
                            left: 'prev,next today',
                            center: 'title',
                            right: 'dayGridMonth,dayGridWeek',
                        }}
                        buttonText={{ today: 'I dag', month: 'Måned', week: 'Uke' }}
                        height="auto"
                        eventDisplay="block"
                        eventTimeFormat={{ hour: '2-digit', minute: '2-digit', hour12: false }}
                    />
                </Box>
            )}
        </Box>
    )
}
