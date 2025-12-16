'use client';

import { PortableText } from 'next-sanity';
import { client } from '@/sanity/lib/client';
import { useState, useEffect } from 'react';
import { FirstAidInfo } from '@/types/sanity.types';
import { FIRST_AID_INFO_QUERY } from '@/sanity/lib/queries';
import { portableTextComponents } from '@/components/Typography';
import { Box, Flex, Button, Spinner, Center } from '@chakra-ui/react';

export default function InfoCard() {
    const [firstAidInfo, setFirstAidInfo] = useState<FirstAidInfo>();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        client.fetch<FirstAidInfo>(FIRST_AID_INFO_QUERY)
            .then((data) => setFirstAidInfo(data))
            .catch((err) => console.error('Failed to fetch first aid info:', err))
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <Center minH="200px">
                <Spinner size="xl" color="var(--color-primary)" />
            </Center>
        );
    }

    return (
        firstAidInfo && (
            <Box
                bg="var(--color-altBg)"
                boxShadow="0 10px 20px rgba(0,0,0,0.1)"
                p={{ base: 4, md: 8 }}
                borderRadius="8px"
            >
                <Flex flexWrap="wrap" gap={8}>
                    <Box flex="1 1 300px" p={4}>
                        <PortableText value={firstAidInfo.col1} components={portableTextComponents} />
                    </Box>

                    <Box w={{ base: "0", md: "2px" }} bg="#ccc" mx={4} />

                    <Box flex="1 1 300px" p={4}>
                        <PortableText value={firstAidInfo.col2} components={portableTextComponents} />

                        <Flex gap={4} mt={8}>
                            <Button
                                onClick={() => {
                                    window.scrollTo({
                                        top: document.getElementById('other-courses')?.offsetTop || 0,
                                        behavior: 'smooth',
                                    });
                                }}
                                bg="var(--color-primary)"
                                color="var(--color-light)"
                                fontWeight={700}
                                fontSize="1rem"
                                p="0.6rem 1.2rem"
                                borderRadius="4px"
                                transition="all 0.3s ease"
                                _hover={{
                                    bg: 'var(--color-secondary)',
                                    color: 'var(--color-text)',
                                    boxShadow: '0 0 15px rgba(0,0,0,0.2)',
                                }}
                            >
                                Andre kurs
                            </Button>
                            <Button
                                onClick={() => {
                                    window.scrollTo({
                                        top: document.getElementById('evaluering')?.offsetTop || 0,
                                        behavior: 'smooth',
                                    });
                                }}
                                bg="var(--color-primary)"
                                color="var(--color-light)"
                                fontWeight={700}
                                fontSize="1rem"
                                p="0.6rem 1.2rem"
                                borderRadius="4px"
                                transition="all 0.3s ease"
                                _hover={{
                                    bg: 'var(--color-secondary)',
                                    color: 'var(--color-text)',
                                    boxShadow: '0 0 15px rgba(0,0,0,0.2)',
                                }}
                            >
                                Evaluering
                            </Button>
                        </Flex>
                    </Box>
                </Flex>
            </Box>
        )
    );
}
