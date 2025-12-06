'use client';

import { useEffect, useState } from 'react';
import { Box, Container, Heading, Flex, Text } from '@chakra-ui/react';
import { BOARD_MEMBERS_QUERY } from '@/sanity/lib/queries';
import { client } from '@/sanity/lib/client';
import { BoardMember } from '@/types/sanity.types';
import BoardMemberCard from '@/components/BoardMemberCard';

export default function TidligereStyrerPage() {
    const [groupedMembers, setGroupedMembers] = useState<Record<string, BoardMember[]>>({});
    const [sortedPeriods, setSortedPeriods] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        client.fetch<BoardMember[]>(BOARD_MEMBERS_QUERY)
            .then((members) => {
                const groups: Record<string, BoardMember[]> = {};

                members.forEach((member) => {
                    if (!member.activeFrom || !member.activeTo) return;

                    const fromYear = new Date(member.activeFrom).getFullYear().toString().slice(-2);
                    const toYear = new Date(member.activeTo).getFullYear().toString().slice(-2);
                    const period = `${fromYear}/${toYear}`;

                    if (!groups[period]) {
                        groups[period] = [];
                    }
                    groups[period].push(member);
                });

                // Sort periods descending (e.g. 25/26 before 24/25)
                const periods = Object.keys(groups).sort((a, b) => {
                    const [aStart] = a.split('/').map(Number);
                    const [bStart] = b.split('/').map(Number);
                    return bStart - aStart;
                });

                setGroupedMembers(groups);
                setSortedPeriods(periods);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Failed to fetch board members:", err);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return (
            <Container maxW="container.xl" py={8} textAlign="center">
                <Text>Laster...</Text>
            </Container>
        );
    }

    return (
        <Container maxW="1200px" py={12}>
            <Heading as="h1" textAlign="center" mb={12} fontSize="2.5rem">
                Tidligere styrer
                <Box display="block" w="100px" h="4px" bg="var(--color-primary)" mx="auto" mt={2} borderRadius="2px" />
            </Heading>

            {sortedPeriods.length === 0 ? (
                <Text textAlign="center">Ingen tidligere styremedlemmer funnet.</Text>
            ) : (
                sortedPeriods.map((period) => (
                    <Box key={period} mb={16}>
                        <Heading as="h2" fontSize="2rem" mb={8} borderBottom="2px solid var(--color-altBg)" pb={2}>
                            Styret {period}
                        </Heading>
                        <Flex flexWrap="wrap" gap={8} justify="center">
                            {groupedMembers[period].map((member) => (
                                <BoardMemberCard key={member._id} member={member} href={`/styret/tidligere-styrer/${member.slug?.current || ''}`} />
                            ))}
                        </Flex>
                    </Box>
                ))
            )}
        </Container>
    );
}
