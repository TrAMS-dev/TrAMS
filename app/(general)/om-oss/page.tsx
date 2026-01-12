import { client } from "@/sanity/lib/client";
import { BOARD_MEMBERS_QUERY } from "@/sanity/lib/queries";
import { BoardMember } from "@/types/sanity.types";
import { Container, Flex, Box, Heading, Text, Image, Link, HStack, Link as ChakraLink, Button } from "@chakra-ui/react";
import BoardMemberSection from "@/components/BoardMemberSection";
import { PartnersSection } from "@/components/CooperationPartners";
import { COOPERATION_PARTNERS_QUERY } from "@/sanity/lib/queries";
import { CooperationPartners } from "@/types/sanity.types";
import HeroImage from "@/components/HeroImage";
import { getHeroImageUrl } from "@/utils/supabase/storage";

export const metadata = {
    title: "Om Oss | TrAMS",
    description: "Lær mer om TrAMS - Trondheim Akuttmedisinske Studentforening, vårt styre, samarbeidspartnere og historie.",
};

export default async function OmOss() {

    let boardMembers: BoardMember[] = [];

    try {
        boardMembers = await client.fetch<BoardMember[]>(BOARD_MEMBERS_QUERY);
    } catch (error) {
        console.error('Error fetching board members:', error);
    }

    let cooperationPartners: CooperationPartners | null = null;
    try {
        cooperationPartners = await client.fetch<CooperationPartners>(COOPERATION_PARTNERS_QUERY);
    } catch (error) {
        console.error('Error fetching cooperation partners:', error);
    }

    return (
        <>
            <HeroImage
                imageUrl={getHeroImageUrl("gruppebilde_fly.jpg")}
                heading="TrAMS"
                text="Trondheim Akuttmedisinske Studentforening"
            />

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
                                            src="/assets/Logo.png"
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
                                    href="/om-oss/vedtekter"
                                    display="block"
                                    w="100%"
                                >
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

                <PartnersSection data={cooperationPartners} />

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
                    <Link href="/om-oss/trams-i-media" alignItems="center">
                        <Button
                            bg="var(--color-secondary)"
                            color="black"
                            mt={4}
                            _hover={{ bg: 'var(--color-alternate)' }}
                            whiteSpace="normal"
                            h="auto"
                            py={4}
                            px={6}
                            w="100%"
                        >
                            Ønsker du å vite mer om hva vi har gjort? Trykk for å se oss i media
                        </Button>
                    </Link>
                </Box>
                <BoardMemberSection />
            </Container>
        </>
    )
}