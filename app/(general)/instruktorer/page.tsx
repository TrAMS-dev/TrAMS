import { Box, Flex, Link, Container } from '@chakra-ui/react';
import { SectionHeading, BodyText, CenteredText } from '@/components/Typography';
import LinkGrid from '@/components/LinkGrid';
import HeroImage from '@/components/HeroImage';
import { HeroHeading } from '@/components/Typography';
import PreloadHeroImage from '@/components/PreloadHeroImage';

export const metadata = {
  title: "Instruktører",
  description: "Er du instruktør eller ønsker å bli det? Her finner du informasjon og ressurser for TrAMS-instruktører.",
};

export default function Instruktorer() {

  return (
    <>
      <PreloadHeroImage imageUrl="/assets/images/gruppebilde_2.jpg" />
      <HeroImage
        imageUrl="/assets/images/gruppebilde_2.jpg"
        heading="For instruktører"
        text="Her kan du lese mer om medlemskap i TrAMS, våre kurs og aktiviteter som er spesielt rettet mot instruktører."
      />

      <Container maxW="1200px" mx="auto" px={4} py={8}>
        <LinkGrid />

        <Box mt={12}>
          <Flex flexWrap="wrap" gap={8} alignItems="flex-start">
            <Box flex="1 1 300px" lineHeight="1.5">
              <SectionHeading fontSize="1.8rem" textAlign="center" my={4}>
                Bli instruktør!
              </SectionHeading>
              <CenteredText>
                Som instruktør får du muligheten til å lære bort akuttmedisin på både eksterne og interne kurs. I tillegg
                blir man prioritert på noen av TrAMS sine antallsbegrensede arrangementer. Som instruktør får man ta del i
                et sosialt og hyggelig instruktørmiljø!
              </CenteredText>
              <CenteredText>
                For å kunne søke om å bli instruktør må du være{' '}
                <Link href="/for-medisinstudenter" color="var(--color-primary)" textDecoration="underline">
                  medlem
                </Link>{' '}
                i TrAMS. Opptaket er søknadsbasert. Likevel kan engasjement i foreningen utover det som fremgår av
                søknaden, tas i betraktning.
              </CenteredText>
              <CenteredText>TrAMS tar opp nye eksterne instruktører høsten 2025.</CenteredText>
              <CenteredText>
                Eventuelle spørsmål sendes til{' '}
                <Link href="mailto:instruktoransvarlig@trams.no" color="var(--color-primary)" textDecoration="underline">
                  instruktoransvarlig@trams.no
                </Link>
                .
              </CenteredText>
            </Box>
          </Flex>
        </Box>

        <Box mt={8} textAlign="center">
          <SectionHeading fontSize="1.6rem" mb={4}>
            Ferdighetsinstruktør
          </SectionHeading>
          <BodyText fontSize="0.95rem" textAlign="center" maxW="800px" mx="auto">
            Gjennom året utdanner TrAMS instruktører som holder kurs for andre medisinstudenter i perifer venekanylering
            (PVK), sutur og ultralyd, blant annet. På eldre kull vil man også få muligheten til å være instruktør på
            akuttmedisinkursene TrAMS arrangerer på studiet i samarbeid med NTNU og St. Olavs hospital.
            <br />
            <br />
            De gangene vi tar opp instruktører til internundervisning vil det komme informasjon om dette på mail.
          </BodyText>
        </Box>
      </Container>
    </>
  );
}
