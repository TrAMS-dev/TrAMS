import { Box, Flex, Text, Link, VStack, SimpleGrid, Button, Spinner, Center } from '@chakra-ui/react';
import Image from 'next/image';
import { SectionHeading, SubsectionHeading, BodyText, CenteredText } from '@/components/Typography';
import { client } from '@/sanity/lib/client';
import { FIRST_AID_COURSE_PAGE_QUERY } from '@/sanity/lib/queries';
import { FIRST_AID_COURSE_PAGE_QUERY_RESULT } from '@/types/sanity.types';
import { urlFor } from '@/sanity/lib/image';
import { SanityImageSource } from "@sanity/image-url/lib/types/types";
import HeroImage from '@/components/HeroImage';
import PreloadHeroImage from '@/components/PreloadHeroImage';
import { PageContainer } from '@/components/PageContainer';
import { ContentCard } from '@/components/ContentCard';



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
  const pageData = await client.fetch<FIRST_AID_COURSE_PAGE_QUERY_RESULT>(FIRST_AID_COURSE_PAGE_QUERY);

  if (!pageData) {
    return (
      <Center minH="80vh">
        <Text fontSize="xl" color="gray.600">Kunne ikke laste inn siden. Vennligst prøv igjen senere.</Text>
      </Center>
    );
  }

  return (
    <>
      <PreloadHeroImage imageUrl="/assets/images/markor_2.jpg" />
      {/* HERO SECTION */}
      <HeroImage
        imageUrl="/assets/images/markor_2.jpg"
        heading="Førstehjelpskurs"
        text="TrAMS tilbyr flere førstehjelpskurs for bedrifter i Trondheim. Lær livreddende førstehjelp i dag."
      />

      <PageContainer>
        {/* INTRO TEXT */}
        <ContentCard>
          <SectionHeading mt={0}>Førstehjelpskurs for bedrifter i Trondheim</SectionHeading>
          <BodyText>{pageData.introText}</BodyText>
          <Link href="/forstehjelpskurs/book-kurs" display="block" w="100%" _hover={{ textDecoration: 'none' }}>
            <Button
              mt={4}
              w="100%"
              bg="var(--color-primary)"
              color="white"
              _hover={{ bg: 'var(--color-secondary)', color: 'black' }}
            >
              Book førstehjelpskurs
            </Button>
          </Link>
        </ContentCard>

        {/* COURSES */}
        {pageData.courses?.map((course, courseIndex) => (
          <Box key={courseIndex} mt={16}>
            <SectionHeading mt={0}>{course.title}</SectionHeading>
            <CenteredText>{course.description}</CenteredText>

            <VStack gap={8}>
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
              <BodyText mt={8} mb={0} textAlign="center" color="gray.500" fontStyle="italic">
                {course.footerNote}
              </BodyText>
            )}
          </Box>
        ))}

        {/* BOTTOM INFO CARDS */}
        <SimpleGrid columns={{ base: 1, md: 2 }} gap={8} mt={16}>
          {/* OTHER COURSES */}
          <InfoCard title="Andre kurs">
            <BodyText>
              Vi tilbyr også andre kurs som er tilpasset studenter eller kunder med helsefaglig bakgrunn.
            </BodyText>
            <BodyText>
              Lurer du på om vi kan tilby et passende kurs for din gruppe? Ta kontakt med{' '}
              <Link href="mailto:eksternsjef@trams.no" color="var(--color-primary)" textDecoration="underline">
                eksternsjef@trams.no
              </Link>{' '}
              for å motta tilbud.
            </BodyText>
            <BodyText mb={0} color="gray.500">
              Vi tilbyr dessverre ikke utlån av dukker og førstehjelpsutstyr til egne kurs.
            </BodyText>
          </InfoCard>

          {/* EVALUATION */}
          <InfoCard title="Evaluering">
            <BodyText>
              Vi ønsker stadig å bli bedre, og for å nå målene våre tar vi gjerne i mot tilbakemeldinger på hvordan
              du har opplevd kurset vårt!
            </BodyText>
            <BodyText>
              Du kan enkelt gi tilbakemelding ved å klikke deg inn på skjemaet. Øvrige spørsmål kan rettes til{' '}
              <Link href="mailto:eksternsjef@trams.no" color="var(--color-primary)" textDecoration="underline">
                eksternsjef@trams.no
              </Link>.
            </BodyText>
            <Link
              href="https://docs.google.com/forms/d/e/1FAIpQLSd11lYE-qow-milodSmnsL_OlqLE20vV8ZNGyLkg-F-cdJVtA/viewform?usp=sharing"
              target="_blank"
              rel="noopener noreferrer"
              _hover={{ textDecoration: 'none' }}
              display="block"
            >
              <Button
                bg="var(--color-primary)"
                color="white"
                _hover={{ bg: 'var(--color-secondary)', color: 'black' }}
                w="full"
              >
                Gå til evalueringsskjema
              </Button>
            </Link>
          </InfoCard>
        </SimpleGrid>
      </PageContainer>
    </>
  );
}

// ---------------------------
// SUB-COMPONENTS
// ---------------------------

function CourseModule({ number, title, description, imageSrc, imageAlt, isReversed = false }: { number: string, title: string, description: string, imageSrc: SanityImageSource | undefined, imageAlt: string, isReversed?: boolean }) {
  return (
    <ContentCard w="100%">
      <Flex
        direction={{ base: "column-reverse", md: isReversed ? "row-reverse" : "row" }}
        align="center"
        justify="space-between"
        gap={{ base: 6, md: 12 }}
      >
        <Box flex={1}>
          <Flex align="center" gap={4} mb={4}>
            <Flex
              w="40px" h="40px"
              align="center" justify="center"
              borderRadius="full"
              bg="var(--color-primary)"
              color="white"
              fontWeight="bold"
              flexShrink={0}
            >
              {number}
            </Flex>
            <SubsectionHeading m={0}>{title}</SubsectionHeading>
          </Flex>
          <BodyText mb={0}>{description}</BodyText>
        </Box>
        <Box w={{ base: "100%", md: "400px" }} h={{ base: "250px", md: "300px" }} flexShrink={0} position="relative" borderRadius="lg" overflow="hidden">
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
    </ContentCard>
  );
}

function InfoCard({ title, children }: { title: string, children: React.ReactNode }) {
  return (
    <ContentCard h="100%">
      <SubsectionHeading as="h3" fontSize="1.4rem" mb={4}>
        {title}
      </SubsectionHeading>
      {children}
    </ContentCard>
  );
}
