import { Box, Flex, Link, Container } from '@chakra-ui/react';
import { HeroHeading, HeroText, SectionHeading, BodyText, CenteredText } from '@/components/Typography';
import LinkGrid from '@/components/LinkGrid';


export const metadata = {
  title: "Instruktører | TrAMS",
  description: "Er du instruktør eller ønsker å bli det? Her finner du informasjon og ressurser for TrAMS-instruktører.",
};

export default function Instruktorer() {



  return (
    <>
      <Box
        position="relative"
        h="25vh"
        bgImage="url('https://i.imgur.com/rKhkGGT.jpg')"
        backgroundPosition="center"
        backgroundSize="cover"
        backgroundRepeat="no-repeat"
        color="var(--color-light)"
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        textAlign="center"
        p="3rem 1rem"
        boxShadow="0 10px 20px rgba(0,0,0,0.3)"
      >
        <Box position="absolute" inset={0} bg="rgba(0,0,0,0.6)" zIndex={1} />
        <Box position="relative" zIndex={2} maxW="800px">
          <HeroHeading fontSize="2.2rem">For instruktører</HeroHeading>
          <HeroText fontSize="1.1rem" lineHeight="1.5">
            Her kan du lese mer om medlemskap i TrAMS, våre kurs og aktiviteter som er spesielt rettet mot instruktører.
          </HeroText>
        </Box>
      </Box>

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
