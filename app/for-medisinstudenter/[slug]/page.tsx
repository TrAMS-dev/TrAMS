'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Box, Container, Heading, Text, Link as ChakraLink } from '@chakra-ui/react';
import Image from 'next/image';
import { COMMITTEE_QUERY } from '@/sanity/lib/queries';
import { urlFor } from '@/sanity/lib/image';
import { client } from '@/sanity/lib/client';
import { PortableText } from 'next-sanity';
import { portableTextComponents, HeroHeading } from '@/components/Typography';
import { Committee } from '@/types/sanity.types';


export default function CommitteePage() {
    const params = useParams();
    const slug = params?.slug as string;
    const [committee, setCommittee] = useState<Committee>();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (slug) {
            client
                .fetch<Committee>(COMMITTEE_QUERY, { slug })
                .then((data) => {
                    setCommittee(data);
                    setLoading(false);
                })
                .catch((error) => {
                    console.error('Error fetching committee:', error);
                    setLoading(false);
                });
        }
    }, [slug]);

    if (loading) {
        return (
            <Container maxW="1200px" mx="auto" px={4} py={12}>
                <Text textAlign="center" fontSize="1.2rem" color="gray.600">
                    Laster inn...
                </Text>
            </Container>
        );
    }

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
        : 'https://i.imgur.com/521F3ik.jpg';

    const committeeImageUrl = committee.committeeImage
        ? urlFor(committee.committeeImage).width(1200).height(800).url()
        : null;

    return (
        <>
            {/* Hero Section */}
            <Box
                position="relative"
                h="25vh"
                bgImage={`url('${headerImageUrl}')`}
                backgroundPosition="center"
                backgroundSize="cover"
                backgroundRepeat="no-repeat"
                color="var(--color-light)"
                display="flex"
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
                textAlign="center"
                p={{ base: "1.5rem 1rem", md: "3rem 1rem" }}
                boxShadow="0 10px 20px rgba(0,0,0,0.3)"
            >
                <Box position="absolute" inset={0} bg="rgba(0,0,0,0.6)" zIndex={1} />
                <Box position="relative" zIndex={2} maxW="800px">
                    <HeroHeading>{committee.name}</HeroHeading>
                </Box>
            </Box>

            {/* Content Section */}
            <Container maxW="1200px" mx="auto" px={4} py={12}>
                <Box bg="white" borderRadius="12px" p={{ base: 6, md: 8 }} boxShadow="0 4px 12px rgba(0,0,0,0.1)">
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
                                    width: '100%',
                                    height: 'auto',
                                    borderRadius: '8px',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                                }}
                            />
                        </Box>
                    )}


                    {/* Back Link */}
                    <Box textAlign="center" mt={8}>
                        <ChakraLink
                            href="/for-medisinstudenter"
                            color="var(--color-primary)"
                            fontSize="1.1rem"
                            textDecoration="underline"
                            _hover={{ color: 'var(--color-secondary)' }}
                        >
                            ← Tilbake til oversikten
                        </ChakraLink>
                    </Box>
                </Box>
            </Container>
        </>
    );
}
