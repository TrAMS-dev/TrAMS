import { Box, Flex, Text, Link, Container, Button } from '@chakra-ui/react';
import Image from 'next/image';
import { HeroHeading, HeroText, SectionHeading, SubsectionHeading } from '@/components/Typography';

export const metadata = {
  title: "Førstehjelpskurs | TrAMS",
  description: "TrAMS tilbyr flere førstehjelpskurs for bedrifter i Trondheim. Lær livreddende førstehjelp i dag.",
};
export default function Forstehjelpskurs() {


  return (
    <>
      {/* TOP IMAGE HERO */}
      <Box
        position="relative"
        h="25vh"
        bgImage='url("https://imgur.com/7SCYgTC.jpg")'
        backgroundPosition="center"
        backgroundSize="cover"
        backgroundRepeat="no-repeat"
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        textAlign="center"
        p={{ base: "2rem 1rem", md: "3rem 1rem" }}
        boxShadow="0 10px 20px rgba(0,0,0,0.3)"
      >
        <Box position="absolute" inset={0} bg="rgba(0,0,0,0.6)" zIndex={1} />
        <Box position="relative" zIndex={2} maxW="800px" color="var(--color-light)">
          <HeroHeading fontSize={{ base: "2rem", md: "2.5rem" }}>Førstehjelpskurs</HeroHeading>
          <HeroText fontSize={{ base: "1rem", md: "1.2rem" }}>
            TrAMS tilbyr førstehjelpskurs i Trondheim og Trøndelag. Les mer om våre kurs!
          </HeroText>
        </Box>
      </Box>
      <Box
        position="relative"
        p={8}
        mt={{ base: 4, md: 8 }}
      >        <Text textAlign="center">Vi tilbyr to ulike førstehjelpskurs som resulterer i to ulike kursbevis. Kursholderene er to medisinstudenter ved NTNU som har gjennomgått instruktør- utdanning gjennom TrAMS. og følger et standardisert oppsett. Vi stiller med dukker og hjertestartere til den praktiske delen på alle kurs. Under følger en oversikt over hva våre to kursene inneholder.
        </Text>
      </Box>

      {/* HERO */}
      <Container maxW="1200px" my={8}>
        <Box textAlign="center" py={{ base: 4, md: 8 }} px={4}>
          <SectionHeading fontSize="2.2rem" m={0} mb={4}>
            Standard oppsett eksternkurs
          </SectionHeading>
          <Text>
            Dette kurset er utviklet av TrAMS, med utgangspunkt i NRR sine retningslinjer, og er kvalitetssikret av flere anestesileger ved St.Olavs Hospital. Vi kan derfor holde førstehjelpskurs på en forsvarlig, lærerik og casebasert måte. Dette kurset består av tre deler, og varer i totalt tre timer.
          </Text>
        </Box>

        {/* Angled Section #1 */}
        <Box
          position="relative"
          p={{ base: 8, md: 12 }}
          bg="var(--color-secondary)"
          color="var(--color-text)"
          borderRadius="25px"
          overflow="hidden"
          mb={{ base: 4, md: 8 }}
        >
          <Flex
            alignItems="center"
            justifyContent="space-between"
            w="100%"
            gap={12}
            flexWrap="wrap"
          >
            <Flex gap={6} alignItems="center" flex={1}>
              <Flex alignItems="center" gap={2}>
                <Text fontSize="2rem" fontWeight={800} color="var(--color-primary)">1</Text>
              </Flex>
              <Box>
                <SubsectionHeading m={0} mb={4}>ABC-drillen</SubsectionHeading>
                <Text m={0} lineHeight="1.6">
                  Vi forklarer ABC-drillen, og lærer bort hvordan den kan brukes på en god måte. Dette er med et formål om at deltakerne skal kunne falle tilbake på en prioritert fremgangsmåte der de mest <b>fatale/kritiske</b> tilstandene behandles først. Instruktørene går blant annet gjennom hvordan man gir en fri luftvei, legger i sideleie, stopper blødninger og hvilke andre tiltak som er viktig å tenke på i en akutt førstehjelpssituasjon.
                </Text>
              </Box>
            </Flex>
            <Image
              src="https://imgur.com/mr1fEpu.jpg"
              alt="ABC kursbilde"
              width={250}
              height={250}
              style={{ objectFit: 'cover', width: '250px', height: '250px' }}
              className="rounded-lg"
            />
          </Flex>
        </Box>

        {/* Angled Section #2 (reverse) */}
        <Box
          position="relative"
          p={{ base: 8, md: 12 }}
          bg="var(--color-primary)"
          color="var(--color-light)"
          borderRadius="25px"
          overflow="hidden"
          mb={{ base: 4, md: 8 }}
        >
          <Flex
            alignItems="center"
            justifyContent="space-between"
            w="100%"
            gap={12}
            flexWrap="wrap"
          >
            <Image
              src="https://imgur.com/TAoKstN.jpg"
              alt="BHLR kursbilde"
              width={250}
              height={250}
              style={{ objectFit: 'cover', width: '250px', height: '250px' }}
              className="rounded-lg"
            />
            <Flex gap={6} alignItems="center" flex={1}>
              <Text fontSize="2rem" fontWeight={800} color="var(--color-light)">2</Text>
              <Box>
                <SubsectionHeading m={0} mb={4}>HLR</SubsectionHeading>
                <Text m={0} lineHeight="1.6">
                  Etter innføringen av ABC-drillen, går vi gjennom hvordan hjerte-lungeredning gjøres korrekt, slik at kompresjoner og innblåsninger faktisk har effekt. Nøyaktig og effektiv utførelse av HLR og bruk av hjertestarter er to viktige komponenter når det kommer livredning. Vi etterstreber så mye hands-on-øving som mulig, ettersom vi mener dette er den beste måten å lære på. I tillegg vil den praktiske øvingen gjøre deltakerne tryggere på å ta avgjørelsen om å sette i gang slik gjenopplivning i en eventuell reell situasjon.
                </Text>
              </Box>
            </Flex>
          </Flex>

        </Box>

        {/* Angled Section #3 */}
        <Box
          position="relative"
          p={{ base: 8, md: 12 }}
          bg="var(--color-secondary)"
          color="var(--color-text)"
          borderRadius="25px"
          overflow="hidden"
          mb={{ base: 4, md: 8 }}
        >
          <Flex
            alignItems="center"
            justifyContent="space-between"
            w="100%"
            gap={12}
            flexWrap="wrap"
          >
            <Flex gap={6} alignItems="center" flex={1}>
              <Text fontSize="2rem" fontWeight={800} color="var(--color-primary)">3</Text>
              <Box>
                <SubsectionHeading m={0} mb={4}>Casetrening</SubsectionHeading>
                <Text m={0} lineHeight="1.6">
                  Etter to timer med mye informasjon og veiledning, får man endelig muligheten til å flette alt sammen. Kursholderene vil dele opp gruppen og legge til rette for å simulere realistiske førstehjelpssituasjoner. Nå må gruppene bruke hva de har lært for å kunne håndtere scenarioene på best mulig måte.
                </Text>
              </Box>
            </Flex>
            <Image
              src="https://imgur.com/t7jgYaG.jpg"
              alt="CASE kursbilde"
              width={250}
              height={250}
              style={{ objectFit: 'cover', width: '250px', height: '250px' }}
              className="rounded-lg"
            />
          </Flex>
        </Box>
        <Text my={4} w="100%" textAlign="center">
          Etter endt kurs, vil alle registrerte deltakere få godkjent kursbevis gjennom TrAMS, dersom det er ønskelig.
        </Text>
        <Box textAlign="center" py={{ base: 4, md: 8 }} px={4}>
          <SectionHeading fontSize="2.2rem" m={0} mb={4}>
            NRR-sertifisert GHLR kurs
          </SectionHeading>
          <Text>
            Dette er et grunnleggende hjerte-lungeredningskurs utviklet av Norsk Resuscitasjonsråd i samarbeid med Lærdal Medical AS. Kurset følger norske rettingslinjer for førstehjelp og gjenopplivning og fokuserer på praktisk HLR-opplæring for personer uten forkunnskaper innen hjerte-lungeredning.
          </Text>
        </Box>

        {/* NRR GHLR Sections */}
        <Box
          position="relative"
          p={{ base: 8, md: 12 }}
          bg="var(--color-secondary)"
          color="var(--color-text)"
          borderRadius="25px"
          overflow="hidden"
          mb={{ base: 4, md: 8 }}
        >
          <Flex
            alignItems="center"
            justifyContent="space-between"
            w="100%"
            gap={12}
            flexWrap="wrap"
          >
            <Flex gap={6} alignItems="center" flex={1}>
              <Text fontSize="2rem" fontWeight={800} color="var(--color-primary)">1</Text>
              <Box>
                <SubsectionHeading m={0} mb={4}>e-læring</SubsectionHeading>
                <Text m={0} lineHeight="1.6">
                  Ved bestilling av dette kurset, må deltakerne betale for, og utføre, et e-læringskurs på forkant av kurset. Denne kostnaden vil være ekskludert fra hva TrAMS fakturerer for selve kurset, og kommer på 60 kr per deltaker).
                </Text>
              </Box>
            </Flex>
            <Image
              src="https://imgur.com/mr1fEpu.jpg"
              alt="ABC kursbilde"
              width={250}
              height={250}
              style={{ objectFit: 'cover', width: '250px', height: '250px' }}
              className="rounded-lg"
            />
          </Flex>
        </Box>

        <Box
          position="relative"
          p={{ base: 8, md: 12 }}
          bg="var(--color-primary)"
          color="var(--color-light)"
          borderRadius="25px"
          overflow="hidden"
          mb={{ base: 4, md: 8 }}
        >
          <Flex
            alignItems="center"
            justifyContent="space-between"
            w="100%"
            gap={12}
            flexWrap="wrap"
          >
            <Image
              src="https://imgur.com/TAoKstN.jpg"
              alt="BHLR kursbilde"
              width={250}
              height={250}
              style={{ objectFit: 'cover', width: '250px', height: '250px' }}
              className="rounded-lg"
            />
            <Flex gap={6} alignItems="center" flex={1}>
              <Text fontSize="2rem" fontWeight={800} color="var(--color-light)">2</Text>
              <Box>
                <SubsectionHeading m={0} mb={4}>GHLR</SubsectionHeading>
                <Text m={0} lineHeight="1.6">
                  Kursholderene forklarer og demonstrerer grunnleggende hjerte-lungeredning, og man vil få et NRR-kursbevis etter at kurset er holdt. Kurset i seg selv vil vare 90 minutter.                </Text>
              </Box>
            </Flex>
          </Flex>

        </Box >

        {/* Side-by-side Wrapper */}
        < Flex
          flexWrap="wrap"
          gap={{ base: 4, md: 8 }
          }
          p={{ base: 4, md: 8 }}
          bg="var(--color-altBg)"
          borderRadius="8px"
          mb={{ base: 4, md: 8 }}
        >
          <Box
            id="other-courses"
            flex="1 1 300px"
            bg="#fff"
            borderRadius="8px"
            boxShadow="0 0 10px rgba(0,0,0,0.1)"
            display="flex"
            flexDirection="row"
            gap={4}
            p={4}
            alignItems="center"
            justifyContent="space-between"
          >
            <Box flex={1}>
              <SubsectionHeading as="h2" mt={0} mb={4} color="var(--color-primary)" fontSize="1.5rem">
                Andre kurs
              </SubsectionHeading>
              <Text mb={4} lineHeight="1.5">
                Vi tilbyr også andre kurs som er tilpasset studenter eller kunder med helsefaglig bakgrunn.
                <br />
                <br />
                Lurer du på om vi kan tilby et passende kurs for din gruppe? Ta kontakt med{' '}
                <Link href="mailto:eksternsjef@trams.no" color="var(--color-primary)" textDecoration="underline">
                  eksternsjef@trams.no
                </Link>{' '}
                for å motta tilbud.
                <br />
                <br />
                Vi tilbyr desverre ikke utlån av dukker og førstehjelpsutstyr til egne kurs.
              </Text>
            </Box>
          </Box>

          <Box
            id="evaluering"
            flex="1 1 300px"
            bg="#fff"
            borderRadius="8px"
            boxShadow="0 0 10px rgba(0,0,0,0.1)"
            display="flex"
            flexDirection="row"
            gap={4}
            p={4}
            alignItems="center"
            justifyContent="space-between"
          >
            <Box flex={1}>
              <SubsectionHeading as="h2" mt={0} mb={4} color="var(--color-primary)" fontSize="1.5rem">
                Evaluering
              </SubsectionHeading>
              <Text mb={4} lineHeight="1.5">
                Vi ønsker stadig å bli bedre, og for å nå målene våre tar vi gjerne i mot tilbakemeldinger på hvordan
                du har opplevd kurset vårt!
                <br />
                <br />
                Du kan enkelt gi tilbakemelding ved å klikke deg inn på skjemaet. Øvrige spørsmål eller kommentarer
                kan rettes til{' '}
                <Link href="mailto:eksternsjef@trams.no" color="var(--color-primary)" textDecoration="underline">
                  eksternsjef@trams.no
                </Link>
                .
              </Text>
              <Link
                href="https://docs.google.com/forms/d/e/1FAIpQLSd11lYE-qow-milodSmnsL_OlqLE20vV8ZNGyLkg-F-cdJVtA/viewform?usp=sharing"
                target="_blank"
                rel="noopener noreferrer"
                display="inline-block"
                p="0.6rem 1.2rem"
                borderRadius="4px"
                textDecoration="none"
                fontWeight={700}
                color="var(--color-light)"
                bg="var(--color-primary)"
                transition="all 0.3s ease"
                mt={2}
                _hover={{
                  bg: 'var(--color-secondary)',
                  color: 'var(--color-text)',
                  boxShadow: '0 0 15px rgba(0,0,0,0.2)',
                }}
              >
                Evalueringsskjema
              </Link>
            </Box>
          </Box>
        </Flex >
      </Container >

    </>
  );
}
