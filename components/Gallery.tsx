'use client';

import { Box, Button, HStack } from '@chakra-ui/react';
import Image from 'next/image';
import { urlFor } from '@/sanity/lib/image';
import { useState, useEffect } from 'react';
import { SanityImageSource } from "@sanity/image-url/lib/types/types";

interface GalleryProps {
    images: SanityImageSource[];
}

export default function Gallery({ images }: GalleryProps) {
    const [currentSlide, setCurrentSlide] = useState(0);

    // Auto-advance slides every 5 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % images.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [images.length]);

    if (!images || images.length === 0) return null;

    const showSlide = (index: number) => {
        if (index < 0) index = images.length - 1;
        if (index >= images.length) index = 0;
        setCurrentSlide(index);
    };

    const nextSlide = () => showSlide(currentSlide + 1);
    const prevSlide = () => showSlide(currentSlide - 1);

    return (
        <Box
            position="relative"
            width="100%"
            maxW="800px" // Restrict max width to keep images from looking too stretched on large screens
            mx="auto"
            h={{ base: "300px", md: "500px" }}
            overflow="hidden"
            borderRadius="md"
            boxShadow="md"
            my={8}
            role="region"
            aria-label="Image Carousel"
        >
            {/* Slides Container */}
            <Box
                display="flex"
                transition="transform 0.5s ease-in-out"
                h="100%"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
                {images.map((image, index) => (
                    <Box
                        key={index}
                        minW="100%"
                        h="100%"
                        position="relative"
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        bg="gray.100"
                    >
                        <Image
                            src={urlFor(image).url()}
                            alt={`Galleri bilde ${index + 1}`}
                            fill
                            style={{ objectFit: 'cover' }} // or 'contain' if you want to see the whole image without cropping
                        />
                    </Box>
                ))}
            </Box>

            {/* Navigation Buttons */}
            <Button
                onClick={prevSlide}
                position="absolute"
                left={2}
                top="50%"
                transform="translateY(-50%)"
                bg="rgba(0,0,0,0.5)"
                color="white"
                _hover={{ bg: 'rgba(0,0,0,0.7)' }}
                zIndex={2}
                minW="auto"
                p={2}
                borderRadius="full"
            >
                &#10094;
            </Button>
            <Button
                onClick={nextSlide}
                position="absolute"
                right={2}
                top="50%"
                transform="translateY(-50%)"
                bg="rgba(0,0,0,0.5)"
                color="white"
                _hover={{ bg: 'rgba(0,0,0,0.7)' }}
                zIndex={2}
                minW="auto"
                p={2}
                borderRadius="full"
            >
                &#10095;
            </Button>

            {/* Dots Indicator */}
            <HStack
                position="absolute"
                bottom={4}
                w="100%"
                justify="center"
                gap={2}
                zIndex={2}
            >
                {images.map((_, index) => (
                    <Box
                        key={index}
                        onClick={() => showSlide(index)}
                        w={{ base: "8px", md: "10px" }}
                        h={{ base: "8px", md: "10px" }}
                        bg={index === currentSlide ? 'white' : 'rgba(255,255,255,0.5)'}
                        borderRadius="50%"
                        cursor="pointer"
                        transition="background 0.3s ease"
                        _hover={{ bg: 'white' }}
                    />
                ))}
            </HStack>
        </Box>
    );
}
