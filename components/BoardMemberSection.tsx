"use client"

import { Box, Text, Link, HStack } from "@chakra-ui/react";
import BoardMemberCard from '@/components/BoardMemberCard';
import { SectionHeading } from '@/components/Typography';
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
        <Box id="BoardMembers">
            <SectionHeading mt={0}>Styret i TrAMS</SectionHeading>
            <HStack
                gap={8}
                overflowX="auto"
                pb={8}
                pt={8}
                style={{ scrollSnapType: 'x mandatory' }}
            >
                {boardMembers.map((member) => (
                    <BoardMemberCard key={member._id} member={member} href={`/om-oss/styret/${member.role?.toLowerCase() || ''}`} />
                ))}
            </HStack>
            <Box textAlign="center" mb={6}>
                <Link href="/om-oss/styret/tidligere-styrer">
                    <Text as="span" color="var(--color-primary)" _hover={{ textDecoration: 'underline' }} cursor="pointer">
                        Se tidligere styrer
                    </Text>
                </Link>
            </Box>
        </Box>
    )
}
