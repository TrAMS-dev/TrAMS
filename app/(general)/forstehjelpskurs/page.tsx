import { Box, Flex, Text, VStack, SimpleGrid, Center } from '@chakra-ui/react';
import Image from 'next/image';
import { SectionHeading, SubsectionHeading, BodyText, CenteredText, RichText } from '@/components/Typography';
import { client } from '@/sanity/lib/client';
import { FIRST_AID_COURSE_PAGE_QUERY } from '@/sanity/lib/queries';
import type { FIRST_AID_COURSE_PAGE_QUERY_RESULT } from '@/types/sanity.types';
import { urlFor } from '@/sanity/lib/image';
import { SanityImageSource } from "@sanity/image-url/lib/types/types";
import HeroImage from '@/components/HeroImage';
import { getPageHero } from '@/sanity/lib/pageHero';
import PreloadHeroImage from '@/components/PreloadHeroImage';
import { PageContainer } from '@/components/PageContainer';
import { ContentCard } from '@/components/ContentCard';
import { PrimaryLinkButton } from '@/components/PrimaryLinkButton';



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
  const [pageData, hero] = await Promise.all([
    client.fetch(FIRST_AID_COURSE_PAGE_QUERY),
    getPageHero('forstehjelpskurs'),
  ]);

  if (!pageData) {
    return (
      <Center minH="80vh">
        <Text fontSize="xl" color="gray.600">Kunne ikke laste inn siden. Vennligst prøv igjen senere.</Text>
      </Center>
    );
  }

  const boxes = getBoxes(pageData);

  return (
    <>
      <PreloadHeroImage imageUrl="/assets/images/markor_2.jpg" />
      {/* HERO SECTION */}
      <HeroImage
        imageUrl="/assets/images/markor_2.jpg"
        heading={hero.heading}
        text={hero.text}
      />

      <PageContainer>
        {/* BOXES: side by side on desktop, stacked on mobile */}
        <SimpleGrid columns={{ base: 1, lg: Math.min(boxes.length, 3) }} gap={8}>
          {boxes.map(({ key, ...box }) => (
            <CallToActionCard key={key} {...box} />
          ))}
        </SimpleGrid>

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
            <RichText value={pageData.otherCoursesText} />
          </InfoCard>

          {/* EVALUATION */}
          <InfoCard title="Evaluering">
            <RichText value={pageData.evaluationText} />
            {pageData.evaluationFormUrl && (
              <PrimaryLinkButton href={pageData.evaluationFormUrl} external>
                Gå til evalueringsskjema
              </PrimaryLinkButton>
            )}
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

type PageData = NonNullable<FIRST_AID_COURSE_PAGE_QUERY_RESULT>;
type CtaBox = { key: string, heading: string, text: string, buttonLabel: string, href: string };

/**
 * The boxes at the top of the page. Falls back to the old intro and box medic fields
 * until their content has been moved into "boxes" in Sanity.
 */
function getBoxes(pageData: PageData): CtaBox[] {
  const boxes = (pageData.boxes ?? []).filter((box) => box.heading && box.link);
  if (boxes.length) {
    return boxes.map((box) => ({
      key: box._key,
      heading: box.heading!,
      text: box.text ?? '',
      buttonLabel: box.buttonLabel ?? '',
      href: box.link!,
    }));
  }

  const legacy: CtaBox[] = [{
    key: 'intro',
    heading: pageData.introHeading || 'Førstehjelpskurs for bedrifter i Trondheim',
    text: pageData.introText ?? '',
    buttonLabel: pageData.introButtonLabel || 'Book førstehjelpskurs',
    href: '/forstehjelpskurs/book-kurs',
  }];
  if (pageData.boxMedic?.heading && pageData.boxMedic.formUrl) {
    legacy.push({
      key: 'boxMedic',
      heading: pageData.boxMedic.heading,
      text: pageData.boxMedic.text ?? '',
      buttonLabel: pageData.boxMedic.buttonLabel || 'Gå til skjema',
      href: pageData.boxMedic.formUrl,
    });
  }
  return legacy;
}

function CallToActionCard({ heading, text, buttonLabel, href }: Omit<CtaBox, 'key'>) {
  // Links to other sites open in a new tab
  const external = /^https?:\/\//.test(href);
  return (
    <ContentCard h="100%" display="flex" flexDirection="column">
      <SectionHeading mt={0}>{heading}</SectionHeading>
      {text && <BodyText>{text}</BodyText>}
      {/* Pushes the button to the bottom so both cards line up side by side */}
      <Box mt="auto">
        <PrimaryLinkButton href={href} external={external}>{buttonLabel}</PrimaryLinkButton>
      </Box>
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
