'use client'

import { Container, Flex, Box, Heading, Text, Image, Link, HStack, Link as ChakraLink, Button } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { client } from "@/sanity/lib/client";
import { BoardMember } from "@/types/sanity.types";
import { BOARD_MEMBERS_QUERY } from "@/sanity/lib/queries";
import BoardMemberCard from '@/components/BoardMemberCard';
import { PartnersSection } from '@/components/CooperationPartners';

export default function OmOss() {
    const [boardMembers, setBoardMembers] = useState<BoardMember[]>([]);

    useEffect(() => {
        client
            .fetch<BoardMember[]>(BOARD_MEMBERS_QUERY)
            .then((data) => {
                setBoardMembers(data);
            })
            .catch((error) => {
                console.error('Error fetching board members:', error);
            });
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
                    <Heading as="h1" fontSize={{ base: '2rem', md: '2.5rem' }} mb={4} fontWeight={700}>
                        TrAMS
                    </Heading>
                    <Text fontSize={{ base: '1rem', md: '1.2rem' }} lineHeight="1.5">
                        Trondheim Akuttmedisinske Studentforening
                    </Text>
                </Box>
            </Box>

            <Container maxW={{ base: "95%", md: "60%" }} p={0} id='about'>
                <Flex flexDirection="column" align="flex-start" gap={{ base: 4, md: 8 }} maxW="1200px" mx="auto" my={{ base: 4, md: 8 }} bg="var(--color-altBg)" p={{ base: 4, md: 4 }} borderRadius="8px">
                    <Box
                        id="om-oss"
                        flex="1 1 auto"
                        minW="300px"
                        bg="white"
                        borderRadius="8px"
                        p={{ base: 4, md: 4 }}
                        boxShadow="0 0 10px rgba(0,0,0,0.1)"
                    >
                        <Heading
                            as="h2"
                            textAlign="center"
                            mb={4}
                            position="relative"
                            color="black"
                            pb={2}
                            fontSize="1.8rem"
                        >
                            Trondheim Akuttmedisinske Studentforening
                            <Box display="block" w="80px" h="4px" bg="var(--color-primary)" mx="auto" mt={2} borderRadius="2px" />
                        </Heading>
                        <Flex flexWrap="wrap" gap={4} align="flex-start">
                            <Box flex="1 1 300px">
                                <Text mb={4}>
                                    <Box as="span" float="right" ml={4}>
                                        <Image
                                            src="https://imgur.com/jZBTHbd.png"
                                            alt="TrAMS logo"
                                            width={100}
                                            height={100}
                                            className="max-w-[100px]"
                                        />
                                    </Box>
                                    Trondheim akuttmedisinske studentforening (TrAMS), stiftet 7. mai 2009, er en ideell organisasjon av og
                                    for medisinstudenter i Trondheim, basert på frivillighet.
                                </Text>
                                <Text mb={4}>
                                    Vi legger vekt på faglig kompetanse innen akuttmedisin for både kommende leger og lekfolk. Vårt mål er
                                    å skape trygghet rundt håndtering av akuttmedisinske situasjoner ved å fremme interesse, engasjement
                                    og styrke kunnskapen gjennom kvalitetssikrede kurs og ferdighetstrening.
                                </Text>
                                <Text mb={4}>
                                    Foreningen deltar aktivt i det norske og skandinaviske studentmiljøet innen akuttmedisin gjennom NAMS
                                    - Norsk Akuttmedisinsk Studentforum.
                                </Text>
                                <Link
                                    href="/om-oss/vedtekter">
                                    <Button
                                        bg="var(--color-primary)"
                                        color="white"
                                        mt={4}
                                        _hover={{ boxShadow: '0 0 25px rgba(0,0,0,0.3)' }}
                                        w="100%"
                                    >
                                        Vedtekter
                                    </Button>
                                </Link>
                            </Box>
                        </Flex>
                    </Box>

                </Flex>

                {/* Cooperation partners */}
                <Box textAlign="center" mb={{ base: 4, md: 8 }}>
                    <Heading
                        as="h2"
                        position="relative"
                        color="black"
                        pb={2}
                        mb={4}
                        fontSize="2rem"
                    >
                        Samarbeidspartnere og søsterforeninger
                        <Box display="block" w="120px" h="4px" bg="var(--color-primary)" mx="auto" mt={2} borderRadius="2px" />
                    </Heading>
                    <PartnersSection />
                </Box>

                {/* Join us section */}
                <Box
                    my={{ base: 4, md: 8 }}
                    mx="auto"
                    borderRadius="25px"
                    textAlign="center"
                    p={{ base: 4, md: 8 }}
                    bg="var(--color-primary)"
                    color="white"
                    maxW="1200px"
                >
                    <Heading as="h2" mb={4} fontSize="2rem">Bli med på laget som samarbeidspartner</Heading>
                    <Text mb={4} lineHeight="1.6">
                        Vi er alltid på jakt etter støtte eller nye samarbeidspartnere. Kjenner du noen som er interessert i å bli
                        bedre kjent med oss?
                        <br />
                        <br />
                        I Trondheim har foreningen en solid plassering i studentmiljøet. Vi samarbeider tett med Fakultet for
                        medisin og helsevitenskap ved NTNU om å gjennomføre kurs for nye studenter i basal akuttmedisin. I tillegg
                        samarbeider vi med bl.a. anestesiavdelingen ved St. Olavs hospital om å tilby det som på studiet kalles
                        frivillig uketjeneste, en lærerik hospiteringsordning. Leger ved luftambulansen i Trondheim har også stilt
                        opp for å holde foredrag o.l. for studenter ved flere anledninger. Vi har gjennomført arrangementer der vi
                        har koordinert øvelser sammen med Redningstjenesten 330 skvadron, Redningsselskapet, Trøndelag brann- og
                        redningstjeneste, Trøndelag politidistrikt. Sist, men ikke minst, har Sør-Trøndelag ambulansetjeneste vært
                        en kjempemessig støttespiller for oss.
                        <br />
                        <br />
                        Vi ønsker å takke alle som bidrar til å hjelpe oss i arbeidet for å fremme interesse og kunnskap rundt
                        akuttmedisin! Ønsker du å støtte arbeidet vårt? Ta kontakt med{' '}
                        <ChakraLink href="mailto:sponsoransvarlig@trams.no" color="var(--color-secondary)" textDecoration="underline">
                            sponsoransvarlig@trams.no
                        </ChakraLink>
                        .
                    </Text>
                    <Link href="/trams-i-media">
                        <Button
                            bg="var(--color-secondary)"
                            color="black"
                            mt={4}
                            _hover={{ bg: 'var(--color-alternate)' }}
                            whiteSpace="normal"
                        >
                            Ønsker du å vite mer om hva vi har gjort? Trykk for å se oss i media
                        </Button>
                    </Link>
                </Box>

                {/* Styret-section */}
                <Box bg="white" borderRadius="8px" mb={{ base: 4, md: 8 }} p={{ base: 4, md: 8 }} id="BoardMembers">
                    <Heading
                        as="h2"
                        textAlign="center"
                        color="black"
                        fontWeight={700}
                        position="relative"
                        pb={2}
                        fontSize="2rem"
                    >
                        Styret i TrAMS
                        <Box display="block" w="120px" h="4px" bg="var(--color-primary)" mx="auto" mt={2} borderRadius="2px" />
                    </Heading>
                    <HStack
                        gap={8}
                        overflowX="auto"
                        pb={8}
                        pt={8}
                        style={{ scrollSnapType: 'x mandatory' }}
                    >
                        {boardMembers.map((member) => (
                            <BoardMemberCard key={member._id} member={member} href={`/styret/${member.role?.toLowerCase() || ''}`} />
                        ))}
                    </HStack>
                    <Box textAlign="center" mb={6}>
                        <Link href="/styret/tidligere-styrer">
                            <Text as="span" color="var(--color-primary)" _hover={{ textDecoration: 'underline' }} cursor="pointer">
                                Se tidligere styrer
                            </Text>
                        </Link>
                    </Box>
                </Box>
            </Container>
        </>
    )
}