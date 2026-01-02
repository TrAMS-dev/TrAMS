import Link from 'next/link';
import { Box, Flex, Heading, Text, Button, Stack, Link as ChakraLink } from '@chakra-ui/react';
import Navbar from '@/components/Navbar';
import { HeartPulse, Calendar, Users } from 'lucide-react';
import { createClient } from '@/utils/supabase/server';

export const metadata = {
  title: "TrAMS | Trondheim Akuttmedisinske Studentforening",
  description: "Trondheim Akuttmedisinske Studentforening (TrAMS) er en studentforening for medisinstudenter som er interessert i akuttmedisin. Vi organiserer kurs, aktiviteter og samarbeid med andre studentforeninger og organisasjoner.",
}
export default async function Home() {
  const supabase = await createClient()
  const video = supabase.storage.from('assets').getPublicUrl('TrAMS_intro.mp4')
  return (
    <Box as="section" position="relative" h="100vh" w="100vw" overflow="hidden" bg="gray.900">
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        src={video.data.publicUrl}
        poster="/assets/poster.jpg"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          filter: 'brightness(0.6)',
          zIndex: 0
        }}
      />

      {/* Fallback Gradient if video fails/loads */}
      <Box
        position="absolute"
        top={0}
        left={0}
        w="100%"
        h="100%"
        bgGradient="linear(to-br, blue.900, purple.900)"
        opacity={0.8}
        zIndex={-1}
      />

      {/* Overlay to ensure text readability */}
      <Box
        position="absolute"
        top={0}
        left={0}
        w="100%"
        h="100%"
        bg="blackAlpha.600"
        zIndex={1}
      />

      {/* Navbar - Transparent Mode */}
      <Box position="relative" zIndex={100}>
        <Navbar transparent />
      </Box>

      {/* Main Content */}
      <Flex
        position="relative"
        zIndex={10}
        h="calc(100vh - 80px)" // Adjust based on navbar height approx
        align="center"
        justify="center"
        direction="column"
        color="white"
        textAlign="center"
        px={4}
      >
        <Flex direction="column" justify="space-between" align="center" h="100%">

          <Flex direction="column" align="center" gap={6} pt={{ base: 10, md: 40 }}>
            <Heading
              as="h1"
              size={{ base: "2xl", md: "3xl", lg: "4xl" }}
              fontWeight="extrabold"
              letterSpacing="tight"
              textShadow="0 0 20px rgba(0,0,0,0.5)"
              mb={2}
              mt={{ base: 10, md: 0 }}
            >
              Akuttmedisin for Alle
            </Heading>
            <Text
              fontSize="xl"
              maxW="2xl"
              mb={{ base: 2, md: 8 }}
              opacity={0.9}
              textShadow="0 0 10px rgba(0,0,0,0.5)"
            >
              Vi er Trondheim Akuttmedisinske Studentforening. <br />
              Lær livreddende førstehjelp av medisinstudenter.
            </Text>
          </Flex>

          <Stack
            direction={{ base: 'column', md: 'row' }}
            gap={{ base: 2, md: 6 }}
            mt={{ base: 0, md: 8 }}
            w="full"
            justify="center"
            align="center"
          >

            {/* Card 1: Våre Kurs */}
            <Link href="/forstehjelpskurs" style={{ textDecoration: 'none' }}>
              <Button
                height="auto"
                w="280px"
                p={{ base: 4, md: 8 }}
                bg="whiteAlpha.200"
                backdropFilter="blur(10px)"
                border="1px solid"
                borderColor="whiteAlpha.300"
                borderRadius="xl"
                _hover={{
                  bg: 'whiteAlpha.300',
                  transform: 'translateY(-5px)',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.4)'
                }}
                transition="all 0.3s ease"
              >
                <Flex direction="column" align="center" gap={3}>
                  <HeartPulse size={32} />
                  <Text fontSize="xl" fontWeight="bold">Førstehjelpskurs</Text>
                  <Text fontSize="sm" opacity={0.8} fontWeight="normal">Se våre kurstilbud</Text>
                </Flex>
              </Button>
            </Link>

            {/* Card 2: Book Kurs */}
            <Link href="/forstehjelpskurs/book-kurs" style={{ textDecoration: 'none' }}>
              <Button
                height="auto"
                w="280px"
                p={{ base: 4, md: 8 }}
                bg="var(--color-primary)"
                _hover={{
                  bg: 'red.600',
                  transform: 'scale(1.05)',
                  boxShadow: '0 0 30px rgba(229, 62, 62, 0.6)'
                }}
                borderRadius="xl"
                transition="all 0.3s ease"
                boxShadow="0 0 20px rgba(229, 62, 62, 0.4)"
              >
                <Flex direction="column" align="center" gap={3}>
                  <Calendar size={32} />
                  <Text fontSize="xl" fontWeight="bold">Book Kurs</Text>
                  <Text fontSize="sm" opacity={0.9} fontWeight="normal">Bestill til din bedrift</Text>
                </Flex>
              </Button>
            </Link>

            {/* Card 3: Om Oss */}
            <Link href="/om-oss" style={{ textDecoration: 'none' }}>
              <Button
                height="auto"
                w="280px"
                p={{ base: 4, md: 8 }}
                bg="whiteAlpha.200"
                backdropFilter="blur(10px)"
                border="1px solid"
                borderColor="whiteAlpha.300"
                borderRadius="xl"
                _hover={{
                  bg: 'whiteAlpha.300',
                  transform: 'translateY(-5px)',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.4)'
                }}
                transition="all 0.3s ease"
              >
                <Flex direction="column" align="center" gap={3}>
                  <Users size={32} />
                  <Text fontSize="xl" fontWeight="bold">Om Oss</Text>
                  <Text fontSize="sm" opacity={0.8} fontWeight="normal">Hvem er TrAMS?</Text>
                </Flex>
              </Button>
            </Link>
          </Stack>
        </Flex >
      </Flex >

      <ChakraLink
        href="/admin"
        position="absolute"
        bottom={4}
        left="50%"
        transform="translateX(-50%)"
        color="gray.500"
        textDecoration="none"
        _hover={{ color: 'var(--color-primary)', opacity: 1 }}
        fontSize="0.7rem"
        display="inline-block"
        opacity={0.2}
        zIndex={20}
      >
        Adminside
      </ChakraLink>

    </Box>
  );
}
