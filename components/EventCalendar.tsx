'use client'

import { useMemo, useState } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import type { Tables } from '@/types/supabase'
import {
    Box,
    Flex,
    Heading,
    Text,
    Button,
    HStack,
    Badge,
    Image,
    SimpleGrid,
    Input,
    NativeSelect,
    Switch,
    Field,
} from '@chakra-ui/react'
import { Calendar, List, MapPin, Clock, Users } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface EventCalendarProps {
    events: Tables<'Events'>[]
}

export default function EventCalendar({ events }: EventCalendarProps) {
    const [view, setView] = useState<'calendar' | 'list'>('list')
    const [searchTerm, setSearchTerm] = useState('')
    const [locationFilter, setLocationFilter] = useState('all')
    const [sortBy, setSortBy] = useState<'date-asc' | 'date-desc' | 'title-asc' | 'title-desc'>('date-asc')
    const [includePast, setIncludePast] = useState(false)
    const router = useRouter()

    const locationOptions = useMemo(() => {
        const options = events
            .map((event) => event.location)
            .filter((location): location is string => Boolean(location))

        return Array.from(new Set(options)).sort((a, b) => a.localeCompare(b))
    }, [events])

    const filteredEvents = useMemo(() => {
        const now = new Date()
        const query = searchTerm.trim().toLowerCase()

        return events.filter((event) => {
            const startDate = event.start_datetime ? new Date(event.start_datetime) : null
            const endDate = event.end_datetime ? new Date(event.end_datetime) : null
            const comparisonDate = endDate ?? startDate
            const isPast = comparisonDate ? comparisonDate.getTime() < now.getTime() : false

            if (!includePast && isPast) {
                return false
            }

            if (locationFilter !== 'all' && event.location !== locationFilter) {
                return false
            }

            if (!query) {
                return true
            }

            const haystack = [
                event.title,
                event.description,
                event.location,
            ]
                .filter(Boolean)
                .join(' ')
                .toLowerCase()

            return haystack.includes(query)
        })
    }, [events, includePast, locationFilter, searchTerm])

    const sortedEvents = useMemo(() => {
        const getEventTime = (event: Tables<'Events'>) => {
            const dateValue = event.start_datetime ? new Date(event.start_datetime) : null
            return dateValue ? dateValue.getTime() : null
        }

        return [...filteredEvents].sort((a, b) => {
            if (sortBy === 'title-asc' || sortBy === 'title-desc') {
                const titleA = (a.title || '').localeCompare(b.title || '', 'nb')
                return sortBy === 'title-asc' ? titleA : -titleA
            }

            const timeA = getEventTime(a)
            const timeB = getEventTime(b)
            const safeA = timeA ?? (sortBy === 'date-asc' ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY)
            const safeB = timeB ?? (sortBy === 'date-asc' ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY)

            return sortBy === 'date-asc' ? safeA - safeB : safeB - safeA
        })
    }, [filteredEvents, sortBy])

    // Transform Supabase events to FullCalendar format
    const calendarEvents = filteredEvents.map(event => ({
        id: event.id.toString(),
        title: event.title || 'Untitled Event',
        start: event.start_datetime || undefined,
        end: event.end_datetime || undefined,
        url: event.slug ? `/arrangementer/${event.slug}` : undefined,
        extendedProps: {
            description: event.description,
            location: event.location,
            image: event.image,
            author: event.author,
            maxAttendees: event.max_attendees,
            regDeadline: event.reg_deadline,
        }
    }))

    return (
        <Box>
            <Flex justify="space-between" align="center" mb={6}>
                <Heading size="lg">Arrangementer</Heading>
                <HStack gap={2} bg="gray.100" p={1} borderRadius="lg">
                    <Button
                        size="sm"
                        variant={view === 'calendar' ? 'solid' : 'ghost'}
                        colorScheme={view === 'calendar' ? 'blue' : 'gray'}
                        onClick={() => setView('calendar')}
                    >
                        <Calendar size={16} style={{ marginRight: '8px' }} />
                        Kalender
                    </Button>
                    <Button
                        size="sm"
                        variant={view === 'list' ? 'solid' : 'ghost'}
                        colorScheme={view === 'list' ? 'blue' : 'gray'}
                        onClick={() => setView('list')}
                    >
                        <List size={16} style={{ marginRight: '8px' }} />
                        Liste
                    </Button>
                </HStack>
            </Flex>

            {view === 'list' && (
                <SimpleGrid columns={{ base: 1, md: 4 }} gap={4} mb={6}>
                    <Field.Root>
                        <Field.Label fontSize="sm" color="gray.600">Søk</Field.Label>
                        <Input
                            placeholder="Søk i arrangementer"
                            value={searchTerm}
                            onChange={(event) => setSearchTerm(event.target.value)}
                        />
                    </Field.Root>
                    <Field.Root>
                        <Field.Label fontSize="sm" color="gray.600">Sted</Field.Label>
                        <NativeSelect.Root>
                            <NativeSelect.Field
                                value={locationFilter}
                                onChange={(event) => setLocationFilter(event.target.value)}
                            >
                                <option value="all">Alle steder</option>
                                {locationOptions.map((location) => (
                                    <option key={location} value={location}>
                                        {location}
                                    </option>
                                ))}
                            </NativeSelect.Field>
                            <NativeSelect.Indicator />
                        </NativeSelect.Root>
                    </Field.Root>
                    <Field.Root>
                        <Field.Label fontSize="sm" color="gray.600">Sorter</Field.Label>
                        <NativeSelect.Root>
                            <NativeSelect.Field
                                value={sortBy}
                                onChange={(event) => setSortBy(event.target.value as typeof sortBy)}
                            >
                                <option value="date-asc">Dato (stigende)</option>
                                <option value="date-desc">Dato (synkende)</option>
                                <option value="title-asc">Tittel (A-Å)</option>
                                <option value="title-desc">Tittel (Å-A)</option>
                            </NativeSelect.Field>
                            <NativeSelect.Indicator />
                        </NativeSelect.Root>
                    </Field.Root>
                    <HStack gap={3} pt={{ base: 2, md: 6 }}>
                        <Switch.Root
                            checked={includePast}
                            onCheckedChange={(details: { checked: boolean }) => setIncludePast(details.checked)}
                        >
                            <Switch.HiddenInput />
                            <Switch.Control>
                                <Switch.Thumb />
                            </Switch.Control>
                        </Switch.Root>
                        <Text fontSize="sm" color="gray.600">
                            Vis tidligere
                        </Text>
                    </HStack>
                </SimpleGrid>
            )}

            {view === 'calendar' ? (
                <Box
                    bg="white"
                    p={4}
                    borderRadius="xl"
                    boxShadow="sm"
                    border="1px solid"
                    borderColor="gray.200"
                >
                    <FullCalendar
                        plugins={[dayGridPlugin, interactionPlugin]}
                        initialView="dayGridMonth"
                        events={calendarEvents}
                        eventClick={(info) => {
                            if (info.event.url) {
                                info.jsEvent.preventDefault();
                                router.push(info.event.url);
                            }
                        }}
                        headerToolbar={{
                            left: 'prev,next today',
                            center: 'title',
                            right: 'dayGridMonth,dayGridWeek'
                        }}
                        height="auto"
                        eventColor="#3182ce"
                        eventDisplay="block"
                        displayEventTime={true}
                        eventTimeFormat={{
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: false
                        }}
                    />
                </Box>
            ) : (
                <SimpleGrid columns={{ base: 1, md: 1 }} gap={4}>
                    {sortedEvents.length > 0 ? (
                        sortedEvents.map((event) => (
                            <Box
                                key={event.id}
                                borderWidth="1px"
                                borderRadius="lg"
                                overflow="hidden"
                                bg="white"
                                borderColor="gray.200"
                                _hover={{ borderColor: 'blue.400', boxShadow: 'md', transform: 'translateY(-2px)' }}
                                transition="all 0.2s"
                                cursor="pointer"
                                onClick={() => event.slug && router.push(`/arrangementer/${event.slug}`)}
                                display="flex"
                                flexDirection={{ base: 'column', sm: 'row' }}
                            >
                                {event.image && (
                                    <Image
                                        objectFit="cover"
                                        maxW={{ base: '100%', sm: '200px' }}
                                        src={event.image}
                                        alt={event.title || 'Event image'}
                                    />
                                )}

                                <Box p={4} flex="1">
                                    <Flex direction="column" justify="space-between" h="100%" gap={3}>
                                        <Box>
                                            <Flex justify="space-between" align="start">
                                                <Badge colorScheme="blue" mb={2} borderRadius="full" px={2}>
                                                    {event.start_datetime ? new Date(event.start_datetime).toLocaleDateString('nb-NO', { month: 'short', day: 'numeric' }) : 'Dato kommer'}
                                                </Badge>
                                                {event.reg_deadline && new Date(event.reg_deadline) > new Date() && (
                                                    <Badge colorScheme="green" variant="subtle" borderRadius="full">
                                                        Påmelding åpen
                                                    </Badge>
                                                )}
                                            </Flex>
                                            <Heading size="md" mb={2}>{event.title}</Heading>
                                            <Text lineClamp={2} color="gray.500" fontSize="sm">
                                                {event.description}
                                            </Text>
                                        </Box>

                                        <SimpleGrid columns={{ base: 1, sm: 2 }} gap={4} mt="auto">
                                            <HStack color="gray.500" fontSize="sm">
                                                <Clock size={16} />
                                                <Text>
                                                    {event.start_datetime ? new Date(event.start_datetime).toLocaleTimeString('nb-NO', { hour: '2-digit', minute: '2-digit' }) : 'Tid kommer'}
                                                </Text>
                                            </HStack>
                                            <HStack color="gray.500" fontSize="sm">
                                                <MapPin size={16} />
                                                <Text lineClamp={1}>{event.location || 'Sted kommer'}</Text>
                                            </HStack>
                                            {event.max_attendees && (
                                                <HStack color="gray.500" fontSize="sm">
                                                    <Users size={16} />
                                                    <Text>{event.max_attendees} plasser</Text>
                                                </HStack>
                                            )}
                                        </SimpleGrid>
                                    </Flex>
                                </Box>
                            </Box>
                        ))
                    ) : (
                        <Box p={8} textAlign="center" bg="white" borderRadius="xl" border="1px dashed" borderColor="gray.200">
                            <Text color="gray.500">Ingen arrangementer funnet.</Text>
                        </Box>
                    )}
                </SimpleGrid>
            )}
        </Box>
    )
}
