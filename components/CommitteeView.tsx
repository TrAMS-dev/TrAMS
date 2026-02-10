'use client';

import { Box, Container, Heading, Text, Link as ChakraLink } from '@chakra-ui/react';
import Image from 'next/image';
import { urlFor } from '@/sanity/lib/image';
import { PortableText } from 'next-sanity';
import { portableTextComponents } from '@/components/Typography';
import { Committee } from '@/types/sanity.types';
import HeroImage from '@/components/HeroImage';

export default function CommitteeView({ committee }: { committee: Committee | null }) {
    if (!committee) {
        return (
            <Container maxW="1200px" mx="auto" px={4} py={12}>
                <Box textAlign="center" py={12}>
                    <Heading as="h1" fontSize="2rem" mb={4} color="var(--color-primary)">
                        Komité ikke funnet
                    </Heading>
                    <Text fontSize="1.2rem" color="gray.600" mb={4}>
                        Vi kunne ikke finne denne komiteen.
                    </Text>
                    <ChakraLink
                        href="/for-medisinstudenter"
                        color="var(--color-primary)"
                        textDecoration="underline"
                    >
                        Gå tilbake til oversikten
                    </ChakraLink>
                </Box>
            </Container>
        );
    }

    const headerImageUrl = committee.headerImage
        ? urlFor(committee.headerImage).width(1920).height(600).url()
        : "/assets/images/kirurgi.jpg";

    const committeeImageUrl = committee.committeeImage
        ? urlFor(committee.committeeImage).width(1200).height(800).url()
        : null;

    return (
        <>
            {/* Hero Section */}
            <HeroImage
                imageUrl={headerImageUrl}
                heading={committee.name}
            />

            {/* Content Section */}
            <Container maxW="1200px" mx="auto" px={4} py={12}>
                {/* Contact Info */}
                {committee.email && (
                    <Box textAlign="center" mb={8}>
                        <Text fontSize="1.1rem" color="gray.700">
                            Kontakt:{' '}
                            <ChakraLink
                                href={`mailto:${committee.email}`}
                                color="var(--color-primary)"
                                textDecoration="underline"
                            >
                                {committee.email}
                            </ChakraLink>
                        </Text>
                    </Box>
                )}

                {/* Description */}
                <Box mb={8}>
                    <PortableText value={committee.description} components={portableTextComponents} />
                </Box>

                {/* Committee Image */}
                {committeeImageUrl && (
                    <Box mb={8} textAlign="center">
                        <Image
                            src={committeeImageUrl}
                            alt={`${committee.name} medlemmer`}
                            width={1200}
                            height={800}
                            style={{
                                width: '75%',
                                height: 'auto',
                                borderRadius: '8px',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                            }}
                        />
                    </Box>
                )}
            </Container >
        </>
    );
}
