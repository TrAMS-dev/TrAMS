'use client';

import { useEffect } from 'react';
import { Box, Flex, Text } from '@chakra-ui/react';

export default function ClientCalendar() {
    useEffect(() => {
        const dayDisplay = document.getElementById('day-display');
        const monthYearDisplay = document.getElementById('month-year-display');
        if (dayDisplay && monthYearDisplay) {
            const today = new Date();
            const day = today.getDate();
            const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Des'];
            const month = monthNames[today.getMonth()];
            const year = today.getFullYear();
            dayDisplay.textContent = day.toString();
            monthYearDisplay.textContent = `${month} ${year}`;
        }
    }, []);

    return (
        <Flex gap={4} flexWrap="wrap">
            <Box flex={1} display="flex" flexDirection="column" justifyContent="flex-start" minW="200px">
                <Box
                    bg="var(--color-secondary)"
                    color="black"
                    p={2}
                    borderRadius="4px"
                    textAlign="center"
                    mb={2}
                >
                    <Text id="day-display" fontSize="1.5rem" display="block" fontWeight="bold"></Text>
                    <Text id="month-year-display" fontSize="0.9rem"></Text>
                    <Text fontSize="0.7rem" m={0} textAlign="left">Studentkalender</Text>
                </Box>
            </Box>
            <Box
                flex={2}
                bg="white"
                borderRadius="8px"
                overflow="hidden"
                position="relative"
                minW="300px"
            >
                <Box
                    position="absolute"
                    top={0}
                    left={0}
                    bg="var(--color-primary)"
                    h="5px"
                    w="100%"
                />
                <iframe
                    className="border-none h-[400px] w-full"
                    src="https://calendar.google.com/calendar/embed?src=c_e561ac20ed81465fce5b8050b5e77c2deae77ebd486c10c45c53092d146bd83d%40group.calendar.google.com&ctz=Europe%2FOslo&mode=MONTH"
                    frameBorder="0"
                    scrolling="no"
                />
            </Box>
        </Flex>
    );
}
