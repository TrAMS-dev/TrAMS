import { Box, Flex, Link, Container, Text } from '@chakra-ui/react';
import { PageHeading, SectionHeading, SubsectionHeading, BodyText, CenteredText } from '@/components/Typography';
import CommiteeCards from '@/components/CommiteeCards';
import CourseCards from '@/components/CourseCards';
import HeroImage from '@/components/HeroImage';
import PreloadHeroImage from '@/components/PreloadHeroImage';

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "For Medisinstudenter",
  description: "Bli medlem i TrAMS - Trondheims akuttmedisinske studentforening. Lær akuttmedisin, delta på HLR-kurs og bli instruktør. For medical students interested in emergency medicine in Trondheim.",
  keywords: ["akuttmedisin", "medisinstudenter trondheim", "NTNU medisin", "akuttmedisinsk studentforening", "HLR instruktør", "emergency medicine students"],
  openGraph: {
    title: "For Medisinstudenter - Akuttmedisin og Medlemskap | TrAMS",
    description: "Bli medlem i TrAMS - Trondheims akuttmedisinske studentforening. Lær akuttmedisin og delta på kurs.",
    url: "https://www.trams.no/for-medisinstudenter",
    images: [{ url: "/assets/images/cbrn.jpg", width: 1200, height: 630, alt: "TrAMS for medisinstudenter" }],
  },
};

export default function ForMedisinstudenter() {
  return (
    <>
      <PreloadHeroImage imageUrl="/assets/images/cbrn.jpg" />
      {/* HERO */}
      <HeroImage
        imageUrl="/assets/images/cbrn.jpg"
        heading="For Medisinstudenter"
        text="Her kan du lese mer om medlemskap i TrAMS, våre kurs og aktiviteter som er spesielt rettet mot medisinstudenter."
      />

      {/* MEMBERSHIP SECTION */}
      <Container maxW="1200px" my={8}>
        <Box
          bg="var(--color-altBg)"
          boxShadow="0 10px 20px rgba(0,0,0,0.1)"
          p={{ base: 4, md: 8 }}
          borderRadius="8px"
        >
          <Flex flexWrap="wrap" gap={8}>
            <Box flex="1 1 300px" p={4}>
              <PageHeading mt={0}>Bli medlem!</PageHeading>
              <BodyText>
                TrAMS er studentforeningen for medisinstudenter ved NTNU som er interesserte i akuttmedisin! Som medlem kan
                du blant annet delta på TrAMS-arrangementer forbeholdt medlemmer, du får gratis ferdighetskurs og muligheten
                til å delta på vår generalforsamling.
              </BodyText>
              <BodyText>
                Du kan også engasjere deg ytterligere i foreningen ved å bli instruktør eller bli med i foreningens
                komiteer.
              </BodyText>
              <BodyText>
                TrAMS-medlemskapet er et livstidsmedlemskap med kontingent på 250 kr. For å bli medlem må du være
                medisinstudent ved NTNU, tidligere medisinstudent ved NTNU, eller lege ved St. Olavs Hospital.
              </BodyText>
            </Box>
            <Box w={{ base: "0", md: "2px" }} bg="#ccc" mx={4} />
            <Box flex="1 1 300px" p={4}>
              <SubsectionHeading as="h3" mb={4} fontSize="1.4rem">Meld deg inn nå!</SubsectionHeading>
              <Text mb={4}>
                Ønsker du å engasjere deg i akuttmedisin, lære nye ferdigheter og bli en del av et engasjert
                studentmiljø?
              </Text>
              <Text mb={4}>
                <strong>Bli medlem i dag ved å klikke på knappen!</strong>
              </Text>
              <Link
                href="https://forms.gle/GDLsAZTeVvTKmCqw9"
                target="_blank"
                rel="noopener noreferrer"
                display="inline-block"
                bg="var(--color-primary)"
                color="var(--color-light)"
                fontWeight={700}
                textDecoration="none"
                fontSize="1rem"
                p="0.6rem 1.2rem"
                borderRadius="4px"
                transition="background 0.3s ease"
                cursor="pointer"
                mt={4}
                _hover={{
                  bg: 'var(--color-secondary)',
                  color: 'black',
                }}
              >
                Bli medlem!
              </Link>
            </Box>
          </Flex>
        </Box>
      </Container>

      {/* OUR OFFERS */}
      <Container maxW="1200px" mx="auto" px={4}>
        <SectionHeading>Våre tilbud</SectionHeading>
        <CenteredText>
          TrAMS arrangerer en rekke kurs, foredrag, skillskvelder og annet moro i løpet av et semester. Klikk deg inn
          under for å lese mer om de ulike tilbudene. Noen tilbud er åpne for alle medisinstudenter, mens andre er kun
          for medlemmer. I tillegg kan du som medlem søke om å bli instruktør i TrAMS eller bli med i en av komiteene
          våre!
        </CenteredText>
        <CourseCards />

        {/* COMMITTEES SECTION */}
        <Box my={16}>
          <SectionHeading>Komitéer</SectionHeading>
          <CenteredText mb={12}>
            Er du interessert i å fordype deg innenfor TrAMS? Som medlem i en av TrAMS sine komitéer kan du bli med å
            utvikle caser, nye kurs, eller innhold til skillskvelder. Som komitémedlem får involvere deg masse i TrAMS
            og du vil få lære mye om både fag og organisering. Det skal være gøy å være med i en komité og derfor legger
            man opp aktiviteten etter hva komiteen selv ønsker. Klikk inn på hver komité under for å lese mer om dem!
            <br />
            <br />
            Har du spørsmål om TrAMS sine komitéer, eller en idé om å stifte en ny komité? Ta kontakt med{' '}
            <Link href="mailto:komiteansvarlig@trams.no" color="var(--color-primary)" textDecoration="underline">
              komiteansvarlig@trams.no
            </Link>{' '}
            eller kontakt komitéen direkte.
          </CenteredText>
          <CommiteeCards />
        </Box>
      </Container>

    </>
  );
}
