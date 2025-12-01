'use client';

import { Box, Flex, Link, Container, Text } from '@chakra-ui/react';
import Image from 'next/image';
import { HeroHeading, HeroText, PageHeading, SectionHeading, SubsectionHeading, BodyText, CenteredText } from '@/components/Typography';

export default function ForMedisinstudenter() {
  const offers = [
    {
      image: 'https://imgur.com/vnWYSpG.jpg',
      title: 'TrAMS I - Kurs i basal akkuttmedisin',
      description:
        'I samarbeid med fakultetet for medisin og helsevitenskap ved Norges Teknisk-Naturvitenskapelige Universitet (NTNU) arrangerer TrAMS kurs i basal akuttmedisin. Kurset er på 12 timer og fordeles over 3 dager, som en del av timeplanen i semester IA. Kurset innebærer teoretisk gjennomgang av ABC-drillen, en TBL-seanse og virkelighetsnær casetrening. Deltakerne trenes i basal hjerte-lungeredning, sikring av frie luftveier og enkle strategier for blødningskontroll og overvåkning av sirkulasjonsstatus. I tillegg gjennomgås vurdering av bevissthetsnivå etter AVPU-skalaen.',
    },
    {
      image: 'https://imgur.com/FCUWJQ8.jpg',
      title: 'TrAMS II - Kurs i prehospital akkuttmedisin',
      description:
        'TrAMS II kurset er et kurs i prehospital akuttmedisin for medisinstudenter på stadium II. I 2021 ble kurset for første gang timeplanfestet for medisinstudenter i 3. klasse. Kurset omfatter diagnostikk og behandling av akutt respirasjonssvikt, sirkulasjonssvikt og nedsatt bevissthet, monitorering ved akutt kritisk sykdom, samt basal håndtering av traumepasienter. Kurset organiseres i en ferdighetskveld og en ringløype med realistiske caser.',
    },
    {
      image: 'https://imgur.com/t5LRW8B.jpg',
      title: 'TrAMS III - Kurs i akutt mottaksmedisin',
      description:
        'TrAMS III er et kurs i akutt mottaksmedisin for medisinstudenter på stadium III. Kurset omfatter undersøkelse, diagnostikk, monitorering og behandling av kritisk og akutt syke pasienter i akuttmottak. Kurset innebærer praktisk trening i ringløype.',
    },
    {
      image: 'https://imgur.com/8BhcrjG.jpg',
      title: 'Suturkurs',
      description:
        'Suturkursene arrangeres av KirKom. Vi tilbyr både basale suturkurs for nybegynnere og mer avanserte kurs for viderekomne.',
    },
    {
      image: 'https://imgur.com/MiTCD8m.jpg',
      title: 'Gipsekurs',
      description: 'Kurset omfatter teoretisk gjennomgang og praktisk øving i å legge radiuslaske og ankelgips.',
    },
    {
      image: 'https://imgur.com/Q0N4CF1.jpg',
      title: 'PVK-kurs',
      description:
        'Kurset omfatter en gjennomgang av standard prosedyre for perifer venekanylering, samt praktisk trening i mindre grupper med instruktører.',
    },
    {
      image: 'https://imgur.com/0UGQZtp.jpg',
      title: 'Ultralyd-kurs: eFAST',
      description:
        'En akuttmedisinsk ultralyd-undersøkelse, som brukes i traumesammenheng for å oppdage fritt blod rundt hjertet og i buken. Som deltaker vil du få opplæring i selve undersøkelsen, deretter vil du få god tid til praktisk trening under veiledning av instruktører.',
    },
    {
      image: 'https://imgur.com/TK4qFvk.jpg',
      title: 'Ultralyd-kurs: RUSH',
      description:
        'Står for Rapid Ultrasound in Shock and Hypotension. Også en akuttmedisinsk ultralyd-protokoll, som er veldig relevant for LIS1! Som deltaker vil du få opplæring i selve undersøkelsen, deretter vil du få god tid til praktisk trening under veiledning av instruktører. For størst mulig utbytte anbefaler vi sterkt å delta på eFAST før RUSH.',
    },
    {
      image: 'https://imgur.com/B94No1w.jpg',
      title: 'Pediatrisk ringløype',
      description: 'TBA',
    },
    {
      image: 'https://imgur.com/6WJZ7ZM.jpg',
      title: 'Frivillig uketjeneste i akuttmedisin',
      description:
        'Frivillig uketjeneste i akuttmedisin er et tilbud for alle som har deltatt på informasjonsmøte i regi av TrAMS i samarbeid med anestesiavdelingen ved St. Olavs hospital. Dette krever at man studerer medisin på NTNU ved stadium II eller III. Du trenger ikke å være medlem for å benytte deg av tilbudet.',
      link: '#',
      linkText: 'Les mer',
    },
    {
      image: 'https://imgur.com/ugfrz3s.jpg',
      title: 'Markøroppdrag',
      description:
        'Markører er nødvendige for å gjennomføre akuttmedisinske kurs. Som markør spiller man syk eller skadd i en medisinsk simulering. Gjennom året har vi behov for markører til mange av våre egne kurs, deriblant TrAMS II - og TrAMS III - kursene. I tillegg får vi flere spennende forespørsler fra andre aktører, blant annet har vi hatt markøroppdrag for Forsvaret, Politiet, Ambulansen og avdelinger på St.Olavs hospital.',
      link: '#',
      linkText: 'Les mer',
    },
    {
      image: 'https://imgur.com/eWdPbng.jpg',
      title: 'Foredrag',
      description:
        'TrAMS arrangerer også diverse foredrag gjennom et semester med akuttmedisinsk relevans. Foredragene har ulik tematikk og skal sørge for faglig påfyll og inspirasjon.',
      link: '#',
      linkText: 'Les mer',
    },
    {
      image: 'https://imgur.com/jZBTHbd.jpg',
      title: 'Andre arrangementer',
      description:
        'TrAMS arrangerer en rekke andre aktiviteter gjennom skoleåret. Juleverksted og påskeverksted er populære ettermiddagstilbud med ferdighetstrening og hygge før høytidene. Før eksamen arrangerer vi også eksamensøving for å friske opp ferdighetene før OSKE.',
    },
  ];

  const committees = [
    {
      name: 'KirKom - Traume og kirurgisk komité',
      email: 'kirkom@trams.no',
      image: 'https://imgur.com/56Uvds1.png',
      link: '/for-medisinstudenter/kirkom',
    },
    {
      name: 'RadKom - Radiologisk komité',
      email: 'radkom@trams.no',
      image: 'https://imgur.com/GOmZ3mx.png',
      link: '/for-medisinstudenter/radkom',
    },
    {
      name: 'FjellKom - Fjellmedisinsk komité',
      email: 'fjellkom@trams.no',
      image: 'https://imgur.com/doKxS3V.png',
      link: '/for-medisinstudenter/fjellkom',
    },
    {
      name: 'PedKom - Pediatrisk komité',
      email: 'pedkom@trams.no',
      image: 'https://imgur.com/5gHES5V.png',
      link: '/for-medisinstudenter/pedkom',
    },
    {
      name: 'SosKom - Sosialkomitéen',
      email: 'soskom@trams.no',
      image: 'https://imgur.com/evhbL2E.png',
      link: '/for-medisinstudenter/soskom',
    },
    {
      name: 'TrAMS Levanger',
      email: 'levanger@trams.no',
      image: 'https://imgur.com/vUl3eqv.png',
      link: '/for-medisinstudenter/trams-levanger',
    },
  ];

  return (
    <>
      {/* HERO */}
      <Box
        position="relative"
        h="25vh"
        bgImage="url('https://i.imgur.com/521F3ik.jpg')"
        backgroundPosition="center"
        backgroundSize="cover"
        backgroundRepeat="no-repeat"
        color="var(--color-light)"
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        textAlign="center"
        p={{ base: "1.5rem 1rem", md: "3rem 1rem" }}
        boxShadow="0 10px 20px rgba(0,0,0,0.3)"
      >
        <Box position="absolute" inset={0} bg="rgba(0,0,0,0.6)" zIndex={1} />
        <Box position="relative" zIndex={2} maxW="800px">
          <HeroHeading>For Medisinstudenter</HeroHeading>
          <HeroText>
            Her kan du lese mer om medlemskap i TrAMS, våre kurs og aktiviteter som er spesielt rettet mot
            medisinstudenter.
          </HeroText>
        </Box>
      </Box>

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
            <Box w="2px" bg="#ccc" mx={4} />
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

        {/* COURSE-CARDS SCROLL */}
        <Flex
          gap={8}
          overflowX="auto"
          my={12}
          px={4}
          className="scroll-smooth"
          mb={16}
        >
          {offers.map((offer, index) => (
            <Box
              key={index}
              flex="0 0 auto"
              w="300px"
              bg="#fff"
              borderRadius="8px"
              textAlign="center"
              boxShadow="0 0 10px rgba(0,0,0,0.1)"
              display="flex"
              flexDirection="column"
              overflow="hidden"
              mb={5}
            >
              <Box
                w="300px"
                h="300px"
                position="relative"
                overflow="hidden"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <Image
                  src={offer.image}
                  alt={offer.title}
                  width={300}
                  height={300}
                  style={{
                    width: '300px',
                    height: '300px',
                    objectFit: 'cover',
                  }}
                />
              </Box>
              <SubsectionHeading m={4} mb={2} fontSize="1.4rem">
                {offer.title}
              </SubsectionHeading>
              <Text flex={1} mx={4} mb={4} lineHeight="1.4">
                {offer.description}
              </Text>
              {offer.link && (
                <Link
                  href={offer.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  display="block"
                  bg="var(--color-primary)"
                  color="var(--color-light)"
                  fontWeight={700}
                  textDecoration="none"
                  fontSize="1rem"
                  p="0.6rem 1.2rem"
                  borderRadius="4px"
                  transition="background 0.3s ease"
                  cursor="pointer"
                  mx="auto"
                  mb={8}
                  w="80%"
                  maxW="200px"
                  textAlign="center"
                  _hover={{
                    bg: 'var(--color-secondary)',
                    color: 'black',
                  }}
                >
                  {offer.linkText}
                </Link>
              )}
            </Box>
          ))}
        </Flex>

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

          <Flex flexWrap="wrap" gap={8} justifyContent="center">
            {committees.map((committee, index) => (
              <Box
                key={index}
                flex="1 1 250px"
                maxW="250px"
                textAlign="center"
                bg="#fff"
                borderRadius="8px"
                p={4}
                boxShadow="0 0 10px rgba(0,0,0,0.1)"
                display="flex"
                flexDirection="column"
                alignItems="center"
              >
                <Box display="flex" justifyContent="center" alignItems="center" width="100%" mb={4}>
                  <Image
                    src={committee.image}
                    alt={committee.name}
                    width={150}
                    height={150}
                    style={{ display: 'block', margin: '0 auto' }}
                  />
                </Box>
                <SubsectionHeading mb={2} fontSize="1.2rem">
                  {committee.name}
                </SubsectionHeading>
                <Text mb={4} fontSize="0.9rem">
                  <Link href={`mailto:${committee.email}`} color="black" textDecoration="underline">
                    {committee.email}
                  </Link>
                </Text>
                <Link
                  href={committee.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  display="inline-block"
                  p="0.4rem 0.8rem"
                  bg="var(--color-primary)"
                  color="var(--color-light)"
                  textDecoration="none"
                  borderRadius="4px"
                  transition="background 0.3s ease"
                  fontWeight={600}
                  fontSize="0.9rem"
                  _hover={{
                    bg: 'var(--color-secondary)',
                    color: 'black',
                  }}
                >
                  Les mer
                </Link>
              </Box>
            ))}
          </Flex>
        </Box>
      </Container>

    </>
  );
}
