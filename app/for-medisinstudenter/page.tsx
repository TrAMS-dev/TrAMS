'use client';

import { useEffect, useState } from 'react';
import { Box, Flex, Link, Container, Text } from '@chakra-ui/react';
import Image from 'next/image';
import { HeroHeading, HeroText, PageHeading, SectionHeading, SubsectionHeading, BodyText, CenteredText, portableTextComponents } from '@/components/Typography';
import { COURSE_OFFERINGS_QUERY, COMMITTEES_QUERY } from '@/sanity/lib/queries';
import { urlFor } from '@/sanity/lib/image';
import { client } from '@/sanity/lib/client';
import { PortableText } from 'next-sanity';
import { CourseOffering, Committee } from '@/types/sanity.types';
export default function ForMedisinstudenter() {
  const [offers, setOffers] = useState<CourseOffering[]>([]);
  const [committees, setCommittees] = useState<Committee[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      client.fetch<CourseOffering[]>(COURSE_OFFERINGS_QUERY),
      client.fetch<Committee[]>(COMMITTEES_QUERY),
    ])
      .then(([courseOfferings, committeeData]) => {
        setOffers(courseOfferings);
        setCommittees(committeeData);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setLoading(false);
      });
  }, []);

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
        {loading ? (
          <Text textAlign="center" fontSize="1.2rem" color="gray.600" my={12}>
            Laster inn...
          </Text>
        ) : (
          <Flex
            gap={8}
            overflowX="auto"
            my={12}
            px={4}
            className="scroll-smooth"
            mb={16}
          >
            {offers.map((offer) => {
              const imageUrl = offer.image
                ? urlFor(offer.image).width(300).height(300).url()
                : null;

              return (
                <Box
                  key={offer._id}
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
                  {imageUrl && (
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
                        src={imageUrl}
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
                  )}
                  <SubsectionHeading m={4} mb={2} fontSize="1.4rem">
                    {offer.title}
                  </SubsectionHeading>
                  <Box flex={1} mx={4} mb={4} lineHeight="1.4" textAlign="left">
                    <PortableText value={offer.description} components={portableTextComponents} />
                  </Box>
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
              );
            })}
          </Flex>
        )}

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
            {committees.map((committee) => {
              const logoUrl = committee.logo
                ? urlFor(committee.logo).width(150).height(150).url()
                : null;

              return (
                <Box
                  key={committee._id}
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
                  {logoUrl && (
                    <Box display="flex" justifyContent="center" alignItems="center" width="100%" mb={4}>
                      <Image
                        src={logoUrl}
                        alt={committee.name}
                        width={150}
                        height={150}
                        style={{ display: 'block', margin: '0 auto' }}
                      />
                    </Box>
                  )}
                  <SubsectionHeading mb={2} fontSize="1.2rem">
                    {committee.name}
                  </SubsectionHeading>
                  {committee.email && (
                    <Text mb={4} fontSize="0.9rem">
                      <Link href={`mailto:${committee.email}`} color="black" textDecoration="underline">
                        {committee.email}
                      </Link>
                    </Text>
                  )}
                  <Link
                    href={`/for-medisinstudenter/${committee.slug.current}`}
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
              );
            })}
          </Flex>
        </Box>
      </Container>

    </>
  );
}
