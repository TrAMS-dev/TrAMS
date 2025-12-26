'use client'

import { useState } from 'react'
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
} from '@chakra-ui/react'
import { Calendar, List, MapPin, Clock, Users } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface EventCalendarProps {
    events: Tables<'Events'>[]
}

export default function EventCalendar({ events }: EventCalendarProps) {
    const [view, setView] = useState<'calendar' | 'list'>('calendar')
    const router = useRouter()

    // Sort events by date for the list view
    const sortedEvents = [...events].sort((a, b) => {
        return new Date(a.start_datetime || '').getTime() - new Date(b.start_datetime || '').getTime()
    })

    // Transform Supabase events to FullCalendar format
    const calendarEvents = events.map(event => ({
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