'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Box, Button, HStack, Heading, Text } from '@chakra-ui/react';
import { CarouselSlide } from '@/types/sanity.types';
import { urlFor } from '@/sanity/lib/image';

interface CarouselProps {
  slides: CarouselSlide[];
}

export default function Carousel({ slides }: CarouselProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [slides.length]);

  const showSlide = (index: number) => {
    if (index < 0) index = slides.length - 1;
    if (index >= slides.length) index = 0;
    setCurrentSlide(index);
  };

  const nextSlide = () => showSlide(currentSlide + 1);
  const prevSlide = () => showSlide(currentSlide - 1);

  const SlideContent = ({ slide }: { slide: CarouselSlide }) => (
    <Box
      position="relative"
      zIndex={3}
      textAlign="center"
      px={{ base: 4, md: 8, lg: 10 }}
      py={{ base: 4, md: 6, lg: 8 }}
      w="100%"
      maxW="1200px"
      mx="auto"
    >
      <Heading
        as="h1"
        mb={{ base: 2, md: 3 }}
        fontSize={{ base: "1.5rem", sm: "2rem", md: "2.5rem", lg: "3rem" }}
        color="white"
        lineHeight="1.2"
      >
        {slide.title}
      </Heading>
      <Box
        w={{ base: "120px", sm: "180px", md: "250px" }}
        h={{ base: "3px", md: "4px" }}
        bg="var(--color-primary)"
        mx="auto"
        mt={{ base: 2, md: 3 }}
        mb={{ base: 3, md: 4 }}
        borderRadius="2px"
      />
      <Text
        fontSize={{ base: "0.875rem", sm: "0.95rem", md: "1rem", lg: "1.1rem" }}
        color="white"
        mx="auto"
        mb={{ base: 4, md: 5 }}
        maxW={{ base: "90%", sm: "85%", md: "75%", lg: "65%" }}
        lineHeight="1.5"
      >
        {slide.description}
      </Text>
      <Box
        as="p"
        bg="var(--color-primary)"
        color="var(--color-bg)"
        px={{ base: 4, md: 5, lg: 6 }}
        py={{ base: 2, md: 2.5, lg: 3 }}
        borderRadius="4px"
        cursor="pointer"
        w={{ base: "80%", sm: "60%", md: "50%", lg: "40%" }}
        maxW="300px"
        mx="auto"
        fontSize={{ base: "0.875rem", md: "1rem" }}
        transition="all 0.3s ease"
        _hover={{
          bg: 'var(--color-secondary)',
          color: 'var(--color-text)',
        }}
      >
        {slide.buttonText}
      </Box>
    </Box>
  );

  return (
    <Box
      as="section"
      position="relative"
      overflow="hidden"
      minH="25vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      p={0}
      boxShadow="0 10px 20px rgba(0,0,0,0.3)"
    >
      <Box
        position="relative"
        w="100%"
        h={{ base: "40vh", md: "50vh", lg: "60vh" }}
        minH={{ base: "300px", md: "400px" }}
      >
        <Box
          display="flex"
          transition="transform 0.8s ease-in-out"
          h="100%"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {slides.map((slide, index) => {
            const imageUrl = slide.backgroundImage
              ? urlFor(slide.backgroundImage).width(1920).height(1080).url()
              : null;

            return (
              <Box
                key={index}
                position="relative"
                minW="100%"
                h="100%"
                style={{
                  backgroundImage: imageUrl ? `url(${imageUrl})` : undefined,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                }}
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <Box
                  position="absolute"
                  inset={0}
                  bg="rgba(0, 0, 0, 0.6)"
                  zIndex={1}
                  pointerEvents="none"
                />
                {slide.buttonLink ? (
                  <Link
                    href={slide.buttonLink}
                    target={slide.buttonLink.startsWith('http') ? '_blank' : undefined}
                    rel={slide.buttonLink.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className="absolute inset-0 z-2 no-underline text-inherit"
                  >
                    <SlideContent slide={slide} />
                  </Link>
                ) : (
                  <Box
                    position="absolute"
                    inset={0}
                    zIndex={2}
                    textDecoration="none"
                    color="inherit"
                    cursor="pointer"
                  >
                    <SlideContent slide={slide} />
                  </Box>
                )}
              </Box>
            );
          })}
        </Box>

        <Button
          onClick={prevSlide}
          aria-label="Previous Slide"
          position="absolute"
          left={{ base: 2, md: 4 }}
          top="50%"
          transform="translateY(-50%)"
          bg="rgba(0,0,0,0.5)"
          color="white"
          border="none"
          p={{ base: 1, md: 2 }}
          minW={{ base: "32px", md: "40px" }}
          h={{ base: "32px", md: "40px" }}
          fontSize={{ base: "1.25rem", md: "2rem" }}
          zIndex={10}
          transition="background 0.3s ease"
          _hover={{ bg: 'rgba(0,0,0,0.8)' }}
        >
          &#10094;
        </Button>
        <Button
          onClick={nextSlide}
          aria-label="Next Slide"
          position="absolute"
          right={{ base: 2, md: 4 }}
          top="50%"
          transform="translateY(-50%)"
          bg="rgba(0,0,0,0.5)"
          color="white"
          border="none"
          p={{ base: 1, md: 2 }}
          minW={{ base: "32px", md: "40px" }}
          h={{ base: "32px", md: "40px" }}
          fontSize={{ base: "1.25rem", md: "2rem" }}
          zIndex={10}
          transition="background 0.3s ease"
          _hover={{ bg: 'rgba(0,0,0,0.8)' }}
        >
          &#10095;
        </Button>

        <HStack
          position="absolute"
          bottom={4}
          w="100%"
          justify="center"
          gap={2}
          zIndex={10}
        >
          {slides.map((_, index) => (
            <Box
              key={index}
              onClick={() => showSlide(index)}
              w={{ base: "8px", md: "10px", lg: "12px" }}
              h={{ base: "8px", md: "10px", lg: "12px" }}
              bg={index === currentSlide ? '#333' : '#888'}
              borderRadius="50%"
              cursor="pointer"
              transition="background 0.3s ease"
              _hover={{ bg: '#333' }}
            />
          ))}
        </HStack>
      </Box>
    </Box>
  );
}
