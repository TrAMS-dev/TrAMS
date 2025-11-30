'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Box, Button, HStack, Heading, Text } from '@chakra-ui/react';

interface Slide {
  backgroundImage: string;
  title: string;
  description: string;
  buttonText: string;
  link?: string;
  onClick?: () => void;
}

interface CarouselProps {
  slides: Slide[];
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

  const SlideContent = ({ slide }: { slide: Slide }) => (
    <Box position="relative" zIndex={3} textAlign="center" p={5} m={0}>
      <Heading
        as="h1"
        mb={2}
        fontSize="2.5rem"
        color="white"
        lineHeight="1.2"
        className="md:text-2xl text-xl"
      >
        {slide.title}
      </Heading>
      <Box
        w="250px"
        h="4px"
        bg="var(--color-primary)"
        mx="auto"
        mt={2}
        borderRadius="2px"
      />
      <Text
        fontSize="1rem"
        color="white"
        m="1rem 10%"
        w="75%"
        lineHeight="1.3"
        className="md:text-base text-sm"
      >
        {slide.description}
      </Text>
      <Box
        as="p"
        bg="var(--color-primary)"
        color="var(--color-bg)"
        px={4}
        py={2}
        borderRadius="4px"
        cursor="pointer"
        w="50%"
        ml="24%"
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
      <Box position="relative" w="100%" h="50vh" minH="25vh">
        <Box
          display="flex"
          transition="transform 0.8s ease-in-out"
          h="100%"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {slides.map((slide, index) => (
            <Box
              key={index}
              position="relative"
              minW="100%"
              h="100%"
              style={{
                backgroundImage: `url(${slide.backgroundImage})`,
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
              {slide.link ? (
                <Link
                  href={slide.link}
                  target={slide.link.startsWith('http') ? '_blank' : undefined}
                  rel={slide.link.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className="absolute inset-0 z-2 no-underline text-inherit"
                >
                  <SlideContent slide={slide} />
                </Link>
              ) : (
                <Box
                  onClick={slide.onClick}
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
          ))}
        </Box>

        <Button
          onClick={prevSlide}
          aria-label="Previous Slide"
          position="absolute"
          left={4}
          top="50%"
          transform="translateY(-50%)"
          bg="rgba(0,0,0,0.5)"
          color="white"
          border="none"
          p={2}
          fontSize="2rem"
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
          right={4}
          top="50%"
          transform="translateY(-50%)"
          bg="rgba(0,0,0,0.5)"
          color="white"
          border="none"
          p={2}
          fontSize="2rem"
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
              w="12px"
              h="12px"
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
