import { Box, Badge, Heading, HStack, Image, Link, SimpleGrid, Text } from '@chakra-ui/react';
import { Clock, MapPin } from 'lucide-react';
import type { Tables } from '@/types/supabase';
import { cardStyles, cardHoverStyles } from '@/components/ContentCard';
import { APP_TIME_ZONE } from '@/lib/datetimeLocal';
import { formatEventDate, getEventSortTime, isDateUnspecifiedEvent, isEventPast } from '@/lib/eventDate';

interface LatestEventCardsProps {
  events: Tables<'Events'>[];
  count?: number;
}

/** Picks the next upcoming events, soonest first. Events without a date go last. */
export function pickUpcomingEvents(events: Tables<'Events'>[], count = 3): Tables<'Events'>[] {
  const now = new Date();
  return events
    .filter((event) => !isEventPast(event, now))
    .sort((a, b) => (getEventSortTime(a) ?? Infinity) - (getEventSortTime(b) ?? Infinity))
    .slice(0, count);
}

/** Card linking to a single event */
export function EventCard({ event }: { event: Tables<'Events'> }) {
  return (
    <Link
      href={event.slug ? `/arrangementer/${event.slug}` : '/arrangementer'}
      {...cardStyles}
      overflow="hidden"
      display="flex"
      flexDirection="column"
      alignItems="stretch"
      transition="all 0.2s"
      _hover={{ ...cardHoverStyles, textDecoration: 'none', borderColor: 'var(--color-primary)' }}
    >
      {event.image ? (
        <Image src={event.image} alt={event.title || 'Arrangement'} objectFit="cover" h="180px" w="100%" />
      ) : (
        <Box h="180px" w="100%" bg="var(--color-altBg)" />
      )}
      <Box p={4} display="flex" flexDirection="column" gap={2} flex="1">
        <Badge alignSelf="flex-start" borderRadius="full" px={2}>
          {formatEventDate(event, { style: 'short' })}
        </Badge>
        <Heading size="md">{event.title}</Heading>
        <Text lineClamp={3} color="gray.500" fontSize="sm">
          {event.description}
        </Text>
        <HStack color="gray.500" fontSize="sm" mt="auto" pt={2} gap={4}>
          <HStack gap={1}>
            <Clock size={14} />
            <Text>
              {!isDateUnspecifiedEvent(event) && event.start_datetime
                ? new Date(event.start_datetime).toLocaleTimeString('nb-NO', {
                    timeZone: APP_TIME_ZONE,
                    hour: '2-digit',
                    minute: '2-digit',
                  })
                : 'Tid kommer'}
            </Text>
          </HStack>
          <HStack gap={1} minW={0}>
            <MapPin size={14} />
            <Text lineClamp={1}>{event.location || 'Sted kommer'}</Text>
          </HStack>
        </HStack>
      </Box>
    </Link>
  );
}

export default function LatestEventCards({ events, count = 3 }: LatestEventCardsProps) {
  const upcoming = pickUpcomingEvents(events, count);

  if (upcoming.length === 0) {
    return (
      <Box {...cardStyles} p={8} textAlign="center">
        <Text color="gray.500">Ingen kommende arrangementer akkurat nå.</Text>
      </Box>
    );
  }

  return (
    <SimpleGrid columns={{ base: 1, md: 3 }} gap={6}>
      {upcoming.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </SimpleGrid>
  );
}
