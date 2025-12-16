"use client"

import { Box, Heading, Text, Link, HStack } from "@chakra-ui/react";
import BoardMemberCard from '@/components/BoardMemberCard';
import { BoardMember } from "@/types/sanity.types";
import { client } from "@/sanity/lib/client";
import { BOARD_MEMBERS_QUERY } from "@/sanity/lib/queries";
import { useEffect, useState } from "react";

export default function BoardMemberSection() {
    const [boardMembers, setBoardMembers] = useState<BoardMember[]>([]);

    useEffect(() => {
        const fetchMembers = async () => {
            try {
                const data = await client.fetch<BoardMember[]>(BOARD_MEMBERS_QUERY);
                setBoardMembers(data);
            } catch (error) {
                console.error("Failed to fetch board members:", error);
            }
        };
        fetchMembers();
    }, []);

    return (
        <Box bg="white" borderRadius="8px" mb={{ base: 4, md: 8 }} p={{ base: 4, md: 8 }} id="BoardMembers">
            <Heading
                as="h2"
                textAlign="center"
                color="black"
                fontWeight={700}
                position="relative"
                pb={2}
                fontSize="2rem"
            >
                Styret i TrAMS
                <Box display="block" w="120px" h="4px" bg="var(--color-primary)" mx="auto" mt={2} borderRadius="2px" />
            </Heading>
            <HStack
                gap={8}
                overflowX="auto"
                pb={8}
                pt={8}
                style={{ scrollSnapType: 'x mandatory' }}
            >
                {boardMembers.map((member) => (
                    <BoardMemberCard key={member._id} member={member} href={`/styret/${member.role?.toLowerCase() || ''}`} />
                ))}
            </HStack>
            <Box textAlign="center" mb={6}>
                <Link href="/styret/tidligere-styrer">
                    <Text as="span" color="var(--color-primary)" _hover={{ textDecoration: 'underline' }} cursor="pointer">
                        Se tidligere styrer
                    </Text>
                </Link>
            </Box>
        </Box>
    )
}
