'use client'

import { useEffect, useState } from 'react';
import { Box, Container, Text } from '@chakra-ui/react';
import { VEDTEKTER_QUERY } from '@/sanity/lib/queries';
import { client } from '@/sanity/lib/client';
import { PortableText } from 'next-sanity';
import { portableTextComponents } from '@/components/Typography';
import { Vedtekter } from '@/types/sanity.types';
import { formatNorwegianDate } from '@/sanity/lib/date';
import HeroImage from '@/components/HeroImage';

export default function VedtekterContent() {

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

    const lastUpdated = loading 
        ? "Laster inn..."
        : !vedtekter 
            ? "Ingen vedtekter funnet"
            : `Sist oppdatert ${formatNorwegianDate(vedtekter.lastUpdated)}`;

    return (
        <>


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

                    <>
                        <Text fontSize="1.2rem" color="gray.600" mb={4}>
                            Sist oppdatert {formatNorwegianDate(vedtekter.lastUpdated)}
                        </Text>
                        <PortableText value={vedtekter.content} components={portableTextComponents} />
                    </>
                )}
            </Container>
        </>
    );
}