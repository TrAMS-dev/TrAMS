import { Box, Flex, Text, Link, Container, VStack, SimpleGrid, Button, Spinner, Center } from '@chakra-ui/react';
import Image from 'next/image';
import { SectionHeading, SubsectionHeading } from '@/components/Typography';
import { client } from '@/sanity/lib/client';
import { FIRST_AID_COURSE_PAGE_QUERY } from '@/sanity/lib/queries';
import { FIRST_AID_COURSE_PAGE_QUERYResult } from '@/types/sanity.types';
import { urlFor } from '@/sanity/lib/image';
import { SanityImageSource } from "@sanity/image-url/lib/types/types";
import HeroImage from '@/components/HeroImage';
import PreloadHeroImage from '@/components/PreloadHeroImage';



import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Førstehjelpskurs i Trondheim",
  description: "Book førstehjelpskurs i Trondheim for din bedrift. TrAMS tilbyr profesjonelle kurs i HLR, akuttmedisin og livreddende førstehjelp. First aid course Trondheim for businesses - learn CPR and emergency medicine.",
  keywords: ["førstehjelpskurs trondheim", "førstehjelpskurs bedrift", "HLR kurs", "akuttmedisin kurs", "first aid course trondheim", "CPR course", "førstehjelp opplæring"],
  openGraph: {
    title: "Førstehjelpskurs Trondheim - HLR og Akuttmedisin Kurs | TrAMS",
    description: "Book førstehjelpskurs i Trondheim for din bedrift. TrAMS tilbyr profesjonelle kurs i HLR, akuttmedisin og livreddende førstehjelp.",
    url: "https://www.trams.no/forstehjelpskurs",
    images: [{ url: "/assets/images/markor_2.jpg", width: 1200, height: 630, alt: "Førstehjelpskurs Trondheim - TrAMS" }],
  },
};

export default async function Forstehjelpskurs() {
  const pageData = await client.fetch<FIRST_AID_COURSE_PAGE_QUERYResult>(FIRST_AID_COURSE_PAGE_QUERY);

  if (!pageData) {
    return (
      <Center minH="80vh">
        <Text fontSize="xl" color="gray.600">Kunne ikke laste inn siden. Vennligst prøv igjen senere.</Text>
      </Center>
    );
  }

  return (
    <Box>
      <PreloadHeroImage imageUrl="/assets/images/markor_2.jpg" />
      {/* HERO SECTION */}
      <HeroImage
        imageUrl="/assets/images/markor_2.jpg"
        heading="Førstehjelpskurs"
        text="TrAMS tilbyr flere førstehjelpskurs for bedrifter i Trondheim. Lær livreddende førstehjelp i dag."
      />

      {/* INTRO TEXT */}
      <Container maxW="container.md" py={{ base: 8, md: 12 }}>
        <Text fontSize={{ base: "1.1rem", md: "1.25rem" }} lineHeight="1.8" textAlign="center" color="gray.700">
          {pageData.introText}
        </Text>
        <Flex justifyContent="center" mt={6}>
          <Link href="/forstehjelpskurs/book-kurs" _hover={{ textDecoration: 'none' }}>
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
              <Text fontSize="xl" fontWeight="bold">Book førstehjelpskurs</Text>
            </Button>
          </Link>
        </Flex>
      </Container>

      {/* COURSES */}
      {pageData.courses?.map((course, courseIndex) => (
        <Box
          key={courseIndex}
          bg={courseIndex % 2 === 0 ? 'gray.50' : 'white'}
          py={{ base: 12, md: 20 }}
        >
          <Container maxW="container.xl">
            <Box textAlign="center" mb={16}>
              <SectionHeading mb={6}>{course.title}</SectionHeading>
              <Text maxW="container.md" mx="auto" fontSize="lg" color="gray.600">
                {course.description}
              </Text>
            </Box>

            <VStack gap={{ base: 8, md: 12 }}>
              {course.modules?.map((module, moduleIndex) => (
                <CourseModule
                  key={moduleIndex}
                  number={module.number || ''}
                  title={module.title || ''}
                  description={module.description || ''}
                  imageSrc={module.imageSrc}
                  imageAlt={module.imageAlt || ''}
                  isReversed={module.isReversed || false}
                />
              ))}
            </VStack>

            {course.footerNote && (
              <Text mt={12} textAlign="center" color="gray.500" fontStyle="italic">
                {course.footerNote}
              </Text>
            )}
          </Container>
        </Box>
      ))}

      {/* BOTTOM INFO CARDS */}
      <Box bg="var(--color-antigravity)" py={{ base: 12, md: 20 }} borderTop="1px solid" borderColor="gray.100">
        <Container maxW="container.xl">
          <SimpleGrid columns={{ base: 1, md: 2 }} gap={8}>
            {/* OTHER COURSES */}
            <InfoCard title="Andre kurs">
              <Text mb={4} color="gray.600" lineHeight="1.6">
                Vi tilbyr også andre kurs som er tilpasset studenter eller kunder med helsefaglig bakgrunn.
              </Text>
              <Text mb={4} color="gray.600" lineHeight="1.6">
                Lurer du på om vi kan tilby et passende kurs for din gruppe? Ta kontakt med{' '}
                <Link href="mailto:eksternsjef@trams.no" color="var(--color-primary)" fontWeight="bold">
                  eksternsjef@trams.no
                </Link>{' '}
                for å motta tilbud.
              </Text>
              <Text fontSize="sm" color="gray.500">
                Vi tilbyr dessverre ikke utlån av dukker og førstehjelpsutstyr til egne kurs.
              </Text>
            </InfoCard>

            {/* EVALUATION */}
            <InfoCard title="Evaluering">
              <Text mb={6} color="gray.600" lineHeight="1.6">
                Vi ønsker stadig å bli bedre, og for å nå målene våre tar vi gjerne i mot tilbakemeldinger på hvordan
                du har opplevd kurset vårt!
              </Text>
              <Text mb={6} color="gray.600">
                Du kan enkelt gi tilbakemelding ved å klikke deg inn på skjemaet. Øvrige spørsmål kan rettes til{' '}
                <Link href="mailto:eksternsjef@trams.no" color="var(--color-primary)" fontWeight="bold">
                  eksternsjef@trams.no
                </Link>.
              </Text>
              <Link
                href="https://docs.google.com/forms/d/e/1FAIpQLSd11lYE-qow-milodSmnsL_OlqLE20vV8ZNGyLkg-F-cdJVtA/viewform?usp=sharing"
                target="_blank"
                rel="noopener noreferrer"
                _hover={{ textDecoration: 'none' }}
              >
                <Button colorScheme="red" size="lg" w="full">
                  Gå til evalueringsskjema
                </Button>
              </Link>
            </InfoCard>
          </SimpleGrid>
        </Container>
      </Box>
    </Box>
  );
}

// ---------------------------
// SUB-COMPONENTS
// ---------------------------

function CourseModule({ number, title, description, imageSrc, imageAlt, isReversed = false }: { number: string, title: string, description: string, imageSrc: SanityImageSource | undefined, imageAlt: string, isReversed?: boolean }) {
  return (
    <Flex
      direction={{ base: "column-reverse", md: isReversed ? "row-reverse" : "row" }}
      align="center"
      justify="space-between"
      gap={{ base: 8, md: 16 }}
      w="100%"
      bg="white"
      p={{ base: 6, md: 10 }}
      borderRadius="2xl"
      boxShadow="sm"
      border="1px solid"
      borderColor="gray.100"
      transition="transform 0.2s"
      _hover={{ transform: "translateY(-2px)", boxShadow: "md" }}
    >
      <Box flex={1}>
        <Flex align="center" gap={4} mb={4}>
          <Flex
            w="50px" h="50px"
            align="center" justify="center"
            borderRadius="full"
            bg="var(--color-primary)"
            color="white"
            fontSize="xl"
            fontWeight="bold"
            flexShrink={0}
          >
            {number}
          </Flex>
          <SubsectionHeading m={0}>{title}</SubsectionHeading>
        </Flex>
        <Text fontSize="lg" color="gray.600" lineHeight="1.7">
          {description}
        </Text>
      </Box>
      <Box w={{ base: "100%", md: "400px" }} h={{ base: "250px", md: "300px" }} flexShrink={0} position="relative" borderRadius="xl" overflow="hidden" boxShadow="md">
        {imageSrc && (
          <Image
            src={urlFor(imageSrc).url()}
            alt={imageAlt}
            fill
            style={{ objectFit: 'cover' }}
          />
        )}
      </Box>
    </Flex>
  );
}

function InfoCard({ title, children }: { title: string, children: React.ReactNode }) {
  return (
    <Box
      bg="white"
      p={{ base: 8, md: 10 }}
      borderRadius="2xl"
      boxShadow="sm"
      border="1px solid"
      borderColor="gray.100"
      h="100%"
    >
      <SubsectionHeading as="h3" fontSize="1.8rem" mb={6} color="var(--color-secondary)">
        {title}
      </SubsectionHeading>
      {children}
    </Box>
  );
}
