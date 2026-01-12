"use client";

import { useEffect, useState } from 'react';
import { Box, Container, Heading, Text, SimpleGrid, Link as ChakraLink, AspectRatio } from '@chakra-ui/react';
import Image from 'next/image';
import { MEDIA_ITEMS_QUERY } from '@/sanity/lib/queries';
import { urlFor } from '@/sanity/lib/image';
import { client } from '@/sanity/lib/client';
import { MediaItem } from '@/types/sanity.types';
import { PortableText } from 'next-sanity';
import { portableTextComponents } from '@/components/Typography';

export default function MediaGrid() {
    const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        client
            .fetch<MediaItem[]>(MEDIA_ITEMS_QUERY)
            .then((items) => {
                setMediaItems(items);
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching media items:', error);
                setLoading(false);
            });
    }, []);

    // Helper function to extract YouTube video ID
    const getYouTubeVideoId = (url: string): string | null => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return match && match[2].length === 11 ? match[2] : null;
    };
    return (
        <Container maxW="1200px" mx="auto" px={4} py={12}>
            {
                loading ? (
                    <Text textAlign="center" fontSize="1.2rem" color="gray.600" >
                        Laster inn...
                    </Text>
                ) : mediaItems.length === 0 ? (
                    <Box textAlign="center" py={12}>
                        <Text fontSize="1.2rem" color="gray.600" mb={4}>
                            Ingen medieelementer funnet
                        </Text>
                        <Text fontSize="1rem" color="gray.500">
                            Medieelementer vil vises her når de er lagt til
                        </Text>
                    </Box>
                ) : (
                    <SimpleGrid columns={{ base: 1, md: 2 }} gap={8}>
                        {mediaItems.map((item) => {
                            const thumbnailUrl = item.thumbnail
                                ? urlFor(item.thumbnail).width(600).height(400).url()
                                : null;
                            const youtubeId = item.videoUrl ? getYouTubeVideoId(item.videoUrl) : null;
                            const externalLink = item.externalLink ? item.externalLink : null;

                            return (
                                <Box
                                    key={item._id}
                                    bg="white"
                                    borderRadius="12px"
                                    overflow="hidden"
                                    boxShadow="0 4px 12px rgba(0,0,0,0.1)"
                                    transition="all 0.3s ease"
                                    _hover={{
                                        transform: 'translateY(-4px)',
                                        boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
                                    }}
                                >
                                    {/* Media Content - Video or Image */}
                                    {youtubeId ? (
                                        <AspectRatio ratio={16 / 9}>
                                            <iframe
                                                src={`https://www.youtube.com/embed/${youtubeId}`}
                                                title={item.title}
                                                allowFullScreen
                                                style={{ border: 'none' }}
                                            />
                                        </AspectRatio>
                                    ) : thumbnailUrl ? (
                                        externalLink ? (
                                            <AspectRatio ratio={16 / 9}>
                                                <ChakraLink href={item.externalLink} position="relative" width="100%" height="100%">
                                                    <Image
                                                        src={thumbnailUrl}
                                                        alt={item.title}
                                                        fill
                                                        style={{ objectFit: 'cover' }}
                                                    />
                                                </ChakraLink>
                                            </AspectRatio>
                                        ) : (
                                            <AspectRatio ratio={16 / 9}>
                                                <Box position="relative" width="100%" height="100%">
                                                    <Image
                                                        src={thumbnailUrl}
                                                        alt={item.title}
                                                        fill
                                                        style={{ objectFit: 'cover' }}
                                                    />
                                                </Box>
                                            </AspectRatio>
                                        )
                                    ) : (
                                        <Box
                                            width="100%"
                                            height="250px"
                                            bg="gray.200"
                                            display="flex"
                                            alignItems="center"
                                            justifyContent="center"
                                        >
                                            <Text color="gray.500">Ingen bilde</Text>
                                        </Box>
                                    )}

                                    {/* Content */}
                                    <Box p={6}>
                                        <Heading
                                            as="h2"
                                            fontSize="1.5rem"
                                            mb={2}
                                            color="var(--color-primary)"
                                            fontWeight={600}
                                        >
                                            {item.title}
                                        </Heading>
                                        <Text fontSize="0.9rem" color="gray.600" mb={3} fontWeight={500}>
                                            {item.year}
                                        </Text>
                                        <PortableText value={item.description} components={portableTextComponents} />
                                    </Box>
                                </Box>
                            );
                        })}
                    </SimpleGrid>
                )
            }
        </Container >
    );
}