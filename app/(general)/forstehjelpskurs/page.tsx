import { Box, Flex, Text, Link, Container, Button } from '@chakra-ui/react';
import Image from 'next/image';
import { HeroHeading, HeroText, SectionHeading, SubsectionHeading } from '@/components/Typography';
import InfoCard from '@/components/InfoCard';

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
            TrAMS tilbyr førstehjelpskurs i Trondheim og Trøndelag. Les mer om våre kurs og meld deg på i dag!
          </HeroText>
        </Box>
      </Box>

      {/* HERO */}
      <Container maxW="1200px" my={8}>
        <InfoCard />
        {/* Heading */}
        <Box textAlign="center" py={{ base: 4, md: 8 }} px={4}>
          <SectionHeading fontSize="2.2rem" m={0} mb={4}>
            TrAMS standard oppsett eksternkurs:
          </SectionHeading>
          <Text>
            <b>TrAMS standard oppsett eksternkurs</b> er vårt eget kurs utviklet av oss i TrAMS-arrangementer og
            fagpersoner på st. Olavs.
          </Text>
        </Box>

        {/* Angled Section #1 */}
        <Box
          position="relative"
          p={{ base: 6, md: 10 }}
          bg="var(--color-secondary)"
          color="var(--color-text)"
          borderRadius="25px"
          overflow="hidden"
          transition="transform 0.3s ease, box-shadow 0.3s ease"
          mb={{ base: 4, md: 8 }}
          _hover={{
            transform: 'scale(1.02)',
          }}
        >
          <Flex
            alignItems="center"
            justifyContent="space-between"
            w="100%"
            gap={8}
            flexWrap="wrap"
          >
            <Flex gap={4} alignItems="center" flex={1}>
              <Flex alignItems="center" gap={2}>
                <Text fontSize="2rem" fontWeight={800} color="var(--color-primary)">1</Text>
                <Box
                  w="120px"
                  h="120px"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  flexShrink={0}
                  fontSize="1.3rem"
                  color="#fff"
                  bg="var(--color-primary)"
                  borderRadius="50%"
                >
                  <Text>ABC</Text>
                </Box>
              </Flex>
              <Box>
                <SubsectionHeading m={0} mb={2}>ABC-prinsippet</SubsectionHeading>
                <Text m={0} lineHeight="1.4">
                  Undervisning i ABC-drillen, en internasjonalt anerkjent metodikk for å avdekke sykdom eller skade.
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
          p={{ base: 6, md: 10 }}
          bg="var(--color-primary)"
          color="var(--color-light)"
          borderRadius="25px"
          overflow="hidden"
          transition="transform 0.3s ease, box-shadow 0.3s ease"
          mb={{ base: 4, md: 8 }}
          _hover={{
            transform: 'scale(1.02)',
          }}
        >
          <Flex
            alignItems="center"
            justifyContent="space-between"
            w="100%"
            gap={8}
            flexWrap="wrap"
            flexDirection="row-reverse"
          >
            <Flex gap={4} alignItems="center" flex={1}>
              <Flex alignItems="center" gap={2}>
                <Text fontSize="2rem" fontWeight={800} color="var(--color-light)">2</Text>
                <Box
                  w="120px"
                  h="120px"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  flexShrink={0}
                  fontSize="1.3rem"
                  color="var(--color-text)"
                  bg="var(--color-secondary)"
                  borderRadius="25px"
                >
                  <Text>BHLR</Text>
                </Box>
              </Flex>
              <Box>
                <SubsectionHeading m={0} mb={2}>BHLR</SubsectionHeading>
                <Text m={0} lineHeight="1.4">
                  Undervisning og trening på dukker i hjerte- lungeredning, basert på retningslinjer fra Norsk
                  resuscitasjonsråd (NRR).
                </Text>
              </Box>
            </Flex>
            <Image
              src="https://imgur.com/TAoKstN.jpg"
              alt="BHLR kursbilde"
              width={250}
              height={250}
              style={{ objectFit: 'cover', width: '250px', height: '250px' }}
              className="rounded-lg"
            />
          </Flex>
        </Box>

        {/* Angled Section #3 */}
        <Box
          position="relative"
          p={{ base: 6, md: 10 }}
          bg="var(--color-secondary)"
          color="var(--color-text)"
          borderRadius="25px"
          overflow="hidden"
          transition="transform 0.3s ease, box-shadow 0.3s ease"
          mb={{ base: 4, md: 8 }}
          _hover={{
            transform: 'scale(1.02)',
          }}
        >
          <Flex
            alignItems="center"
            justifyContent="space-between"
            w="100%"
            gap={8}
            flexWrap="wrap"
          >
            <Flex gap={4} alignItems="center" flex={1}>
              <Flex alignItems="center" gap={2}>
                <Text fontSize="2rem" fontWeight={800} color="var(--color-primary)">3</Text>
                <Box
                  w="120px"
                  h="120px"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  flexShrink={0}
                  fontSize="1.3rem"
                  color="#fff"
                  bg="var(--color-primary)"
                  clipPath="polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)"
                >
                  <Text>CASE</Text>
                </Box>
              </Flex>
              <Box>
                <SubsectionHeading m={0} mb={2}>CASE</SubsectionHeading>
                <Text m={0} lineHeight="1.4">
                  Case-trening på ulike scenarioer, tilpasset deltakergruppen etter behov.
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

        <Box textAlign="center" py={{ base: 4, md: 8 }} px={4}>
          <SectionHeading fontSize="2.2rem" m={0} mb={4}>
            NRR-sertifisert GHLR kurs
          </SectionHeading>
          <Text>
            <b>NRR-sertifisert GHLR kurs</b> er et kurs utviklet av NRR hvor hver deltager må gjøre NRR sin e-læring i
            forkant av kurset og hvor vi stiller med NRR instruktører. Kurset er beskrevet under.
          </Text>
        </Box>

        {/* NRR GHLR Sections */}
        <Box
          position="relative"
          p={{ base: 6, md: 10 }}
          bg="var(--color-secondary)"
          color="var(--color-text)"
          borderRadius="25px"
          overflow="hidden"
          transition="transform 0.3s ease, box-shadow 0.3s ease"
          mb={{ base: 4, md: 8 }}
          _hover={{
            transform: 'scale(1.02)',
          }}
        >
          <Flex
            alignItems="center"
            justifyContent="space-between"
            w="100%"
            gap={8}
            flexWrap="wrap"
          >
            <Flex gap={4} alignItems="center" flex={1}>
              <Flex alignItems="center" gap={2}>
                <Text fontSize="2rem" fontWeight={800} color="var(--color-primary)">1</Text>
                <Box
                  w="120px"
                  h="120px"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  flexShrink={0}
                  fontSize="1.3rem"
                  color="#fff"
                  bg="var(--color-primary)"
                  borderRadius="50%"
                >
                  <Text>e-læring</Text>
                </Box>
              </Flex>
              <Box>
                <SubsectionHeading m={0} mb={2}>e-læring</SubsectionHeading>
                <Text m={0} lineHeight="1.4">
                  Deltakere gjennomgår NRR sin egne e-læring hvor teori rundt GHLR blir gjennomgått og testet.
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
          p={{ base: 6, md: 10 }}
          bg="var(--color-primary)"
          color="var(--color-light)"
          borderRadius="25px"
          overflow="hidden"
          transition="transform 0.3s ease, box-shadow 0.3s ease"
          mb={{ base: 4, md: 8 }}
          _hover={{
            transform: 'scale(1.02)',
          }}
        >
          <Flex
            alignItems="center"
            justifyContent="space-between"
            w="100%"
            gap={8}
            flexWrap="wrap"
            flexDirection="row-reverse"
          >
            <Flex gap={4} alignItems="center" flex={1}>
              <Flex alignItems="center" gap={2}>
                <Text fontSize="2rem" fontWeight={800} color="var(--color-light)">2</Text>
                <Box
                  w="120px"
                  h="120px"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  flexShrink={0}
                  fontSize="1.3rem"
                  color="var(--color-text)"
                  bg="var(--color-secondary)"
                  borderRadius="25px"
                >
                  <Text>GHLR</Text>
                </Box>
              </Flex>
              <Box>
                <SubsectionHeading m={0} mb={2}>GHLR</SubsectionHeading>
                <Text m={0} lineHeight="1.4">
                  Våre godkjente NRR GHLR instruktører gjennomgår praktisk trening i GHLR på dukker.
                </Text>
              </Box>
            </Flex>
            <Image
              src="https://imgur.com/TAoKstN.jpg"
              alt="BHLR kursbilde"
              width={250}
              height={250}
              style={{ objectFit: 'cover', width: '250px', height: '250px' }}
              className="rounded-lg"
            />
          </Flex>
        </Box>

        {/* Side-by-side Wrapper */}
        <Flex
          flexWrap="wrap"
          gap={{ base: 4, md: 8 }}
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
        </Flex>
      </Container>

    </>
  );
}
