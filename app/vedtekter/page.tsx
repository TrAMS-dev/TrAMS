'use client';

import { useEffect, useState } from 'react';
import { Box, Container, Heading, Text } from '@chakra-ui/react';
import { VEDTEKTER_QUERY } from '@/sanity/lib/queries';
import { client } from '@/sanity/lib/client';
import { PortableText } from 'next-sanity';
import { portableTextComponents } from '@/components/Typography';
import { Vedtekter } from '@/types/sanity.types';
import { formatNorwegianDate } from '@/sanity/lib/date';

export default function VedtekterPage() {
    const [vedtekter, setVedtekter] = useState<Vedtekter>();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        client
            .fetch<Vedtekter>(VEDTEKTER_QUERY)
            .then((data) => {
                setVedtekter(data);
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching vedtekter:', error);
                setLoading(false);
            });
    }, []);

    return (
        <>
            {/* Hero Section */}
            <Box
                position="relative"
                h="30vh"
                bgImage="url('https://i.imgur.com/rKhkGGT.jpg')"
                backgroundPosition="center"
                backgroundSize="cover"
                backgroundRepeat="no-repeat"
                color="var(--color-light)"
                display="flex"
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
                textAlign="center"
                p="3rem 1rem"
                boxShadow="0 10px 20px rgba(0,0,0,0.3)"
            >
                <Box position="absolute" inset={0} bg="rgba(0,0,0,0.6)" zIndex={1} />
                <Box position="relative" zIndex={2} maxW="800px">
                    <Heading as="h1" fontSize={{ base: '2rem', md: '2.5rem' }} mb={4} fontWeight={700}>
                        Vedtekter
                    </Heading>
                    {loading && (
                        <Text fontSize={{ base: '1rem', md: '1.2rem' }} lineHeight="1.5">
                            Laster inn...
                        </Text>
                    )}
                    {!vedtekter && (
                        <Text fontSize={{ base: '1rem', md: '1.2rem' }} lineHeight="1.5">
                            Ingen vedtekter funnet
                        </Text>
                    )}
                    {!loading && vedtekter && (
                        <Text fontSize={{ base: '1rem', md: '1.2rem' }} lineHeight="1.5">
                            Sist oppdatert {formatNorwegianDate(vedtekter.lastUpdated)}
                        </Text>
                    )}
                </Box>
            </Box>

            {/* Content Section */}
            <Container maxW="900px" mx="auto" px={4} py={12}>
                {loading ? (
                    <Text textAlign="center" fontSize="1.2rem" color="gray.600">
                        Laster inn...
                    </Text>
                ) : !vedtekter ? (
                    <>
                        <Text fontSize="1.2rem" color="gray.600" mb={4}>
                            Ingen vedtekter funnet
                        </Text>
                        <Text fontSize="1rem" color="gray.500">
                            Vedtekter vil vises her når de er lagt til
                        </Text>
                    </>
                ) : (

                    <PortableText value={vedtekter.content} components={portableTextComponents} />
                )}
            </Container>
        </>
    );
}
