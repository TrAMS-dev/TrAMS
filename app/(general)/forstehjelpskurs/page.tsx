import { Box, Flex, Text, Link, Container, VStack, SimpleGrid, Button } from '@chakra-ui/react';
import Image from 'next/image';
import { SectionHeading, SubsectionHeading } from '@/components/Typography';
import { Heading } from '@chakra-ui/react';

export const metadata = {
  title: "Førstehjelpskurs | TrAMS",
  description: "TrAMS tilbyr flere førstehjelpskurs for bedrifter i Trondheim. Lær livreddende førstehjelp i dag.",
};

export default function Forstehjelpskurs() {
  return (
    <Box>
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
          <Heading as="h1" fontSize={{ base: '2rem', md: '2.5rem' }} mb={4} fontWeight={700}>
            Førstehjelpskurs
          </Heading>
          <Text fontSize={{ base: '1rem', md: '1.2rem' }} lineHeight="1.5">
            TrAMS tilbyr flere førstehjelpskurs for bedrifter i Trondheim. Lær livreddende førstehjelp i dag.
          </Text>
        </Box >
      </Box>

      {/* INTRO TEXT */}
      < Container maxW="container.md" py={{ base: 8, md: 12 }}>
        <Text fontSize={{ base: "1.1rem", md: "1.25rem" }} lineHeight="1.8" textAlign="center" color="gray.700">
          Vi tilbyr to ulike førstehjelpskurs som resulterer i to ulike kursbevis. Kursholderene er to medisinstudenter ved NTNU som har gjennomgått instruktørutdanning gjennom TrAMS og følger et standardisert oppsett. Vi stiller med dukker og hjertestartere til den praktiske delen på alle kurs.
        </Text>
        <Flex
          justifyContent="center"
          mt={6}
        >
          <Link
            href="/forstehjelpskurs/book-kurs"
            _hover={{ textDecoration: 'none' }}
          >
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
      </Container >



      {/* STANDARD KURS */}
      < Box bg="gray.50" py={{ base: 12, md: 20 }}>
        <Container maxW="container.xl">
          <Box textAlign="center" mb={16}>
            <SectionHeading mb={6}>Standard oppsett eksternkurs</SectionHeading>
            <Text maxW="container.md" mx="auto" fontSize="lg" color="gray.600">
              Dette kurset er utviklet av TrAMS, med utgangspunkt i NRR sine retningslinjer, og er kvalitetssikret av flere anestesileger ved St.Olavs Hospital. Vi kan derfor holde førstehjelpskurs på en forsvarlig, lærerik og casebasert måte. Dette kurset består av tre deler, og varer i totalt tre timer.
            </Text>
          </Box>

          <VStack gap={{ base: 8, md: 12 }}>
            <CourseModule
              number="1"
              title="ABC-drillen"
              description="Vi forklarer ABC-drillen, og lærer bort hvordan den kan brukes på en god måte. Dette er med et formål om at deltakerne skal kunne falle tilbake på en prioritert fremgangsmåte der de mest fatale/kritiske tilstandene behandles først. Instruktørene går blant annet gjennom hvordan man gir en fri luftvei, legger i sideleie, stopper blødninger og hvilke andre tiltak som er viktig å tenke på i en akutt førstehjelpssituasjon."
              imageSrc="https://imgur.com/mr1fEpu.jpg"
              imageAlt="ABC-drillen"
            />
            <CourseModule
              number="2"
              title="HLR"
              description="Etter innføringen av ABC-drillen, går vi gjennom hvordan hjerte-lungeredning gjøres korrekt, slik at kompresjoner og innblåsninger faktisk har effekt. Nøyaktig og effektiv utførelse av HLR og bruk av hjertestarter er to viktige komponenter når det kommer livredning. Vi etterstreber så mye hands-on-øving som mulig, ettersom vi mener dette er den beste måten å lære på."
              imageSrc="https://imgur.com/TAoKstN.jpg"
              imageAlt="HLR"
              isReversed
            />
            <CourseModule
              number="3"
              title="Casetrening"
              description="Etter to timer med mye informasjon og veiledning, får man endelig muligheten til å flette alt sammen. Kursholderene vil dele opp gruppen og legge til rette for å simulere realistiske førstehjelpssituasjoner. Nå må gruppene bruke hva de har lært for å kunne håndtere scenarioene på best mulig måte."
              imageSrc="https://imgur.com/t7jgYaG.jpg"
              imageAlt="Casetrening"
            />
          </VStack>

          <Text mt={12} textAlign="center" color="gray.500" fontStyle="italic">
            Etter endt kurs, vil alle registrerte deltakere få godkjent kursbevis gjennom TrAMS, dersom det er ønskelig.
          </Text>
        </Container>
      </Box >

      {/* NRR KURS */}
      < Box py={{ base: 12, md: 20 }}>
        <Container maxW="container.xl">
          <Box textAlign="center" mb={16}>
            <SectionHeading mb={6}>NRR-sertifisert GHLR kurs</SectionHeading>
            <Text maxW="container.md" mx="auto" fontSize="lg" color="gray.600">
              Dette er et grunnleggende hjerte-lungeredningskurs utviklet av Norsk Resuscitasjonsråd i samarbeid med Lærdal Medical AS. Kurset følger norske rettingslinjer for førstehjelp og gjenopplivning og fokuserer på praktisk HLR-opplæring for personer uten forkunnskaper innen hjerte-lungeredning.
            </Text>
          </Box>

          <VStack gap={{ base: 8, md: 12 }}>
            <CourseModule
              number="1"
              title="E-læring"
              description="Ved bestilling av dette kurset, må deltakerne betale for, og utføre, et e-læringskurs på forkant av kurset. Denne kostnaden vil være ekskludert fra hva TrAMS fakturerer for selve kurset, og kommer på 60 kr per deltaker."
              imageSrc="https://imgur.com/mr1fEpu.jpg" // Using same image as placeholder/standard
              imageAlt="E-læring"
            />
            <CourseModule
              number="2"
              title="GHLR"
              description="Kursholderene forklarer og demonstrerer grunnleggende hjerte-lungeredning, og man vil få et NRR-kursbevis etter at kurset er holdt. Kurset i seg selv vil vare 90 minutter."
              imageSrc="https://imgur.com/TAoKstN.jpg"
              imageAlt="GHLR"
              isReversed
            />
          </VStack>
        </Container>
      </Box >

      {/* BOTTOM INFO CARDS */}
      < Box bg="var(--color-antigravity)" py={{ base: 12, md: 20 }} borderTop="1px solid" borderColor="gray.100" >
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
      </Box >
    </Box >
  );
}

// ---------------------------
// SUB-COMPONENTS
// ---------------------------

function CourseModule({ number, title, description, imageSrc, imageAlt, isReversed = false }: { number: string, title: string, description: string, imageSrc: string, imageAlt: string, isReversed?: boolean }) {
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
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          style={{ objectFit: 'cover' }}
        />
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
