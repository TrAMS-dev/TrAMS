'use client';

import { useEffect, useState } from 'react';
import { Box, Flex, Link, Container, Text } from '@chakra-ui/react';
import { HeroHeading, HeroText, SectionHeading, SubsectionHeading, BodyText, CenteredText } from '@/components/Typography';
import { client } from '@/sanity/lib/client';
import { INSTRUKT_LINKS_QUERY } from '@/sanity/lib/queries';
import { InstruktorLink } from '@/types/sanity.types';

export default function Instruktorer() {
  const [links, setLinks] = useState<InstruktorLink[]>([]);

  useEffect(() => {
    client.fetch<InstruktorLink[]>(INSTRUKT_LINKS_QUERY)
      .then((data) => setLinks(data))
      .catch((err) => console.error('Failed to fetch instruktorer links:', err));
  }, []);

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
        <Flex flexWrap="wrap" gap={8} mt={8} justifyContent="center">
          {links.map((box) => (
            <Box
              key={box._id}
              flex="1 1 300px"
              bg="var(--color-light)"
              boxShadow="0 2px 5px rgba(0,0,0,0.1)"
              borderRadius="8px"
              p={6}
              textAlign="center"
              maxW="350px"
            >
              <SubsectionHeading mt={0} mb={2} fontSize="1.1rem">
                {box.title}
              </SubsectionHeading>
              <Text mb={4} fontSize="0.9rem" lineHeight="1.4">
                {box.description}
              </Text>
              <Link
                href={box.link}
                target="_blank"
                rel="noopener noreferrer"
                display="inline-block"
                bg="var(--color-primary)"
                color="var(--color-light)"
                p="0.6rem 1.2rem"
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
                {box.linkText}
              </Link>
            </Box>
          ))}
        </Flex>

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
