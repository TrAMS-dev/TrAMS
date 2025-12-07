'use client';

import { Box, Container, Heading, Text, Link, Button, SimpleGrid, Flex } from '@chakra-ui/react';
import { PortableText } from 'next-sanity';
import { client } from '@/sanity/lib/client';
import { useState, useEffect } from 'react';
import { AkuttCalling } from '@/types/sanity.types';
import { AKUTTKALLING_QUERY } from '@/sanity/lib/queries';
import { portableTextComponents, PageHeading, HeroText, HeroHeading } from '@/components/Typography';
import { urlFor } from '@/sanity/lib/image';
import Image from 'next/image';

export default function AkuttCallingPage() {
    const [data, setData] = useState<AkuttCalling>();

    useEffect(() => {
        client.fetch<AkuttCalling>(AKUTTKALLING_QUERY)
            .then((res) => setData(res))
            .catch((err) => console.error('Failed to fetch akuttcalling:', err));
    }, []);

    if (!data) return <Box p={8} textAlign="center">Laster...</Box>;

    return (
        <>
            <Box
                position="relative"
                h="25vh"
                bgImage='url("https://i.imgur.com/oc9gbos.png")'
                backgroundPosition="center"
                backgroundSize="cover"
                backgroundRepeat="no-repeat"
                display="flex"
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
                textAlign="center"
                p={{ base: "2rem 1rem", md: "3rem 1rem" }}
                boxShadow="0 10px 20px rgba(0,0,0,0.3)"
            >
                <Box position="absolute" inset={0} bg="rgba(0,0,0,0.6)" zIndex={1} />
                <Box position="relative" zIndex={2} maxW="800px" color="var(--color-light)">
                    <HeroHeading fontSize={{ base: "2rem", md: "2.5rem" }}>{data.title.toUpperCase()}</HeroHeading>
                </Box>
                <Box h="10px" bg="var(--color-primary)" mx="auto" mt={4} w='70%' zIndex={2} />

            </Box>
            <Container maxW="80%" py={12}>
                <Box
                    textAlign="center"
                >


                    {data.link && (
                        <Box mb={10}>
                            <Link
                                href={data.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                _hover={{ textDecoration: 'none' }}
                            >
                                <Button
                                    bg="var(--color-primary)"
                                    color="white"
                                    _hover={{
                                        bg: 'var(--color-secondary)',
                                        color: 'black',
                                        transform: 'scale(1.02)'
                                    }}
                                    size="lg"
                                    px={8}
                                    h="56px"
                                    fontSize="1.1rem"
                                    borderRadius="md"
                                    transition="all 0.2s"
                                >
                                    Gå til skjema
                                </Button>
                            </Link>
                        </Box>
                    )}
                    <Box className="portable-text" mx="auto" mb={8} textAlign="left">
                        {data.content && <PortableText value={data.content} components={portableTextComponents} />}
                    </Box>



                    {data.gallery && data.gallery.length > 0 && (
                        <SimpleGrid columns={{ base: 1, lg: 2 }} gap={4}>
                            {data.gallery.map((image: any, index: number) => (
                                <Box key={index} display="flex" justifyContent="center" alignItems="center" height="500px" overflow="hidden">
                                    <Image
                                        src={urlFor(image).url()}
                                        alt={`Akuttcalling bilde ${index + 1}`}
                                        width={500}
                                        height={500}
                                        objectFit="contain"
                                    />
                                </Box>
                            ))}
                        </SimpleGrid>
                    )}
                </Box>
            </Container >
        </>
    );
}
