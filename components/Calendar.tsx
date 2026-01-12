'use client';

import { useState, useEffect } from 'react';
import { Box, Flex, Text, Button, ButtonGroup } from '@chakra-ui/react';
import { Calendar, List, CalendarDays } from 'lucide-react';

export default function ClientCalendar() {
    const [dateInfo, setDateInfo] = useState<{ day: string; monthYear: string } | null>(null);
    const [viewMode, setViewMode] = useState<'MONTH' | 'WEEK' | 'AGENDA'>('MONTH');

    useEffect(() => {
        const today = new Date();
        const day = today.getDate().toString();
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Des'];
        const month = monthNames[today.getMonth()];
        const year = today.getFullYear();
        setDateInfo({
            day,
            monthYear: `${month} ${year}`
        });
    }, []);

    const getCalendarUrl = (mode: string) => {
        return `https://calendar.google.com/calendar/embed?src=c_e561ac20ed81465fce5b8050b5e77c2deae77ebd486c10c45c53092d146bd83d%40group.calendar.google.com&ctz=Europe%2FOslo&mode=${mode}&showTitle=0&showPrint=0&showTabs=0`;
    };

    return (
        <Flex gap={6} flexWrap="wrap" direction={{ base: 'column', lg: 'row' }}>
            {/* Sidebar with Date and Controls */}
            <Box flexShrink={0} display="flex" flexDirection="column" gap={4} minW="200px">
                {/* Today's Date Card */}
                <Box
                    bg="var(--color-secondary)" // specific brand color
                    color="black"
                    p={4}
                    borderRadius="12px"
                    textAlign="center"
                    boxShadow="sm"
                    border="1px solid"
                    borderColor="gray.200"
                >
                    {dateInfo ? (
                        <>
                            <Text fontSize="3rem" fontWeight="800" lineHeight="1">{dateInfo.day}</Text>
                            <Text fontSize="1.2rem" fontWeight="medium">{dateInfo.monthYear}</Text>
                        </>
                    ) : (
                        <Text>Loading...</Text> // Prevent hydration mismatch
                    )}
                    <Text fontSize="0.8rem" mt={2} textTransform="uppercase" letterSpacing="wider" opacity={0.8}>Dagens dato</Text>
                </Box>

                {/* View Controls */}
                <Box>
                    <Text fontSize="sm" fontWeight="bold" mb={2} color="gray.600">Visning</Text>
                    <ButtonGroup attached width="100%" variant="outline">
                        <Button
                            flex={1}
                            onClick={() => setViewMode('MONTH')}
                            variant={viewMode === 'MONTH' ? 'solid' : 'outline'}
                            colorScheme={viewMode === 'MONTH' ? 'blue' : 'gray'}
                        >
                            <Calendar className="w-4 h-4 mr-2" />
                            Måned
                        </Button>
                        <Button
                            flex={1}
                            onClick={() => setViewMode('WEEK')}
                            variant={viewMode === 'WEEK' ? 'solid' : 'outline'}
                            colorScheme={viewMode === 'WEEK' ? 'blue' : 'gray'}
                        >
                            <CalendarDays className="w-4 h-4 mr-2" />
                            Uke
                        </Button>
                        <Button
                            flex={1}
                            onClick={() => setViewMode('AGENDA')}
                            variant={viewMode === 'AGENDA' ? 'solid' : 'outline'}
                            colorScheme={viewMode === 'AGENDA' ? 'blue' : 'gray'}
                        >
                            <List className="w-4 h-4 mr-2" />
                            Liste
                        </Button>
                    </ButtonGroup>
                </Box>
            </Box>

            {/* Calendar Frame */}
            <Box
                flex={1}
                bg="white"
                borderRadius="12px"
                overflow="hidden"
                position="relative"
                minH="600px" // Taller for more info
                boxShadow="lg"
                border="1px solid"
                borderColor="gray.100"
            >
                <Box
                    position="absolute"
                    top={0}
                    left={0}
                    right={0}
                    h="8px"
                    bgGradient="linear(to-r, blue.400, purple.500)" // More vibrant top bar
                />
                <iframe
                    title="TrAMS Studentkalender"
                    className="border-none w-full h-full"
                    style={{ minHeight: '600px' }}
                    src={getCalendarUrl(viewMode)}
                />
            </Box>
        </Flex>
    );
}
