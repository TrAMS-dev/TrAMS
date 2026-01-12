'use client';

import { useEffect, useState } from 'react';
import { Box, Flex, Link, Container, Text } from '@chakra-ui/react';
import Image from 'next/image';
import { SubsectionHeading } from '@/components/Typography';
import { COMMITTEES_QUERY } from '@/sanity/lib/queries';
import { urlFor } from '@/sanity/lib/image';
import { client } from '@/sanity/lib/client';
import { Committee } from '@/types/sanity.types';

export default function CommiteeCards() {
    const [committees, setCommittees] = useState<Committee[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            client.fetch<Committee[]>(COMMITTEES_QUERY),
        ])
            .then(([committeeData]) => {
                setCommittees(committeeData);
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
                setLoading(false);
            });
    }, []);

    return (
        <Flex flexWrap="wrap" gap={8} justifyContent="center">
            {committees.map((committee) => {
                const logoUrl = committee.logo
                    ? urlFor(committee.logo).width(400).height(400).url()
                    : null;

                return (
                    <Box
                        key={committee._id}
                        flex="1 1 250px"
                        maxW="250px"
                        textAlign="center"
                        bg="#fff"
                        borderRadius="8px"
                        p={4}
                        boxShadow="0 0 10px rgba(0,0,0,0.1)"
                        display="flex"
                        flexDirection="column"
                        alignItems="center"
                    >
                        {logoUrl && (
                            <Box display="flex" justifyContent="center" alignItems="center" width="100%" mb={4}>
                                <Image
                                    src={logoUrl}
                                    alt={committee.name}
                                    width={150}
                                    height={150}
                                    style={{ display: 'block', margin: '0 auto' }}
                                />
                            </Box>
                        )}
                        <SubsectionHeading mb={2} fontSize="1.2rem">
                            {committee.name}
                        </SubsectionHeading>
                        {committee.email && (
                            <Text mb={4} fontSize="0.9rem">
                                <Link href={`mailto:${committee.email}`} color="black" textDecoration="underline">
                                    {committee.email}
                                </Link>
                            </Text>
                        )}
                        <Link
                            href={`/for-medisinstudenter/${committee.slug.current}`}
                            display="inline-block"
                            p="0.4rem 0.8rem"
                            bg="var(--color-primary)"
                            color="var(--color-light)"
                            textDecoration="none"
                            borderRadius="4px"
                            transition="background 0.3s ease"
                            fontWeight={600}
                            fontSize="0.9rem"
                            _hover={{
                                bg: 'var(--color-secondary)',
                                color: 'black',
                            }}
                        >
                            Les mer
                        </Link>
                    </Box>
                );
            })}
        </Flex>
    );
}