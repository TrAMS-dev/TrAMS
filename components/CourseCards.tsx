'use client';

import { useEffect, useState } from 'react';
import { Box, Flex, Link, Container, Text } from '@chakra-ui/react';
import Image from 'next/image';
import { HeroHeading, HeroText, PageHeading, SectionHeading, SubsectionHeading, BodyText, CenteredText, portableTextComponents } from '@/components/Typography';
import { COURSE_OFFERINGS_QUERY } from '@/sanity/lib/queries';
import { urlFor } from '@/sanity/lib/image';
import { client } from '@/sanity/lib/client';
import { PortableText } from 'next-sanity';
import { CourseOffering } from '@/types/sanity.types';



export default function CourseCards() {
    const [offers, setOffers] = useState<CourseOffering[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            client.fetch<CourseOffering[]>(COURSE_OFFERINGS_QUERY),
        ])
            .then(([courseOfferings]) => {
                setOffers(courseOfferings);
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return (
            <Flex
                justifyContent="center"
                alignItems="center"
                height="100vh"
                bg="var(--color-altBg)"
            >
                <Text fontSize="2rem" fontWeight="bold" color="var(--color-primary)">Loading...</Text>
            </Flex>
        );
    }
    return (
        <Flex
            gap={8}
            overflowX="auto"
            my={12}
            px={4}
            className="scroll-smooth"
            mb={16}
        >
            {offers.map((offer) => {
                const imageUrl = offer.image
                    ? urlFor(offer.image).width(800).height(800).url()
                    : null;

                return (
                    <Box
                        key={offer._id}
                        flex="0 0 auto"
                        w="300px"
                        bg="#fff"
                        borderRadius="8px"
                        textAlign="center"
                        boxShadow="0 0 10px rgba(0,0,0,0.1)"
                        display="flex"
                        flexDirection="column"
                        overflow="hidden"
                        mb={5}
                    >
                        {imageUrl && (
                            <Box
                                w="300px"
                                h="300px"
                                position="relative"
                                overflow="hidden"
                                display="flex"
                                alignItems="center"
                                justifyContent="center"
                            >
                                <Image
                                    src={imageUrl}
                                    alt={offer.title}
                                    width={300}
                                    height={300}
                                    style={{
                                        width: '300px',
                                        height: '300px',
                                        objectFit: 'cover',
                                    }}
                                />
                            </Box>
                        )}
                        <SubsectionHeading m={4} mb={2} fontSize="1.4rem">
                            {offer.title}
                        </SubsectionHeading>
                        <Box flex={1} mx={4} mb={4} lineHeight="1.4" textAlign="left">
                            <PortableText value={offer.description} components={portableTextComponents} />
                        </Box>
                        {offer.link && (
                            <Link
                                href={offer.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                display="block"
                                bg="var(--color-primary)"
                                color="var(--color-light)"
                                fontWeight={700}
                                textDecoration="none"
                                fontSize="1rem"
                                p="0.6rem 1.2rem"
                                borderRadius="4px"
                                transition="background 0.3s ease"
                                cursor="pointer"
                                mx="auto"
                                mb={8}
                                w="80%"
                                maxW="200px"
                                textAlign="center"
                                _hover={{
                                    bg: 'var(--color-secondary)',
                                    color: 'black',
                                }}
                            >
                                {offer.linkText}
                            </Link>
                        )}
                    </Box>
                );
            })
            }
        </Flex>
    );
}