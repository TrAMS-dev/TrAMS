import { client } from "@/sanity/lib/client";
import { BOARD_MEMBERS_QUERY } from "@/sanity/lib/queries";
import { BoardMember } from "@/types/sanity.types";
import { Flex, Box, Image, Link, Stack, Link as ChakraLink, Button } from "@chakra-ui/react";
import BoardMemberSection from "@/components/BoardMemberSection";
import { PartnersSection } from "@/components/CooperationPartners";
import { COOPERATION_PARTNERS_QUERY } from "@/sanity/lib/queries";
import { CooperationPartners } from "@/types/sanity.types";
import HeroImage from "@/components/HeroImage";
import PreloadHeroImage from "@/components/PreloadHeroImage";
import { PageContainer } from "@/components/PageContainer";
import { ContentCard } from "@/components/ContentCard";
import { PrimaryLinkButton } from "@/components/PrimaryLinkButton";
import { SectionHeading, BodyText } from "@/components/Typography";

import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Om Oss",
    description: "TrAMS er en ideell studentorganisasjon som tilbyr førstehjelpskurs i Trondheim. Vi fremmer akuttmedisin og livreddende ferdigheter blant medisinstudenter og lekfolk.",
    keywords: ["TrAMS", "trondheim akuttmedisinske studentforening", "akuttmedisin", "medisinstudenter NTNU", "førstehjelpskurs trondheim"],
    openGraph: {
        title: "Om TrAMS - Trondheim Akuttmedisinske Studentforening",
        description: "TrAMS er en ideell studentorganisasjon som tilbyr førstehjelpskurs i Trondheim og fremmer akuttmedisin.",
        url: "https://www.trams.no/om-oss",
        images: [{ url: "/assets/images/gruppebilde.jpg", width: 1200, height: 630, alt: "TrAMS styret" }],
    },
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
            <PreloadHeroImage imageUrl="/assets/images/gruppebilde.jpg" />
            <HeroImage
                imageUrl="/assets/images/gruppebilde.jpg"
                heading="TrAMS"
                text="Trondheim Akuttmedisinske Studentforening"
            />

            <PageContainer id='about'>
                <Stack gap={16}>
                    <ContentCard id="om-oss">
                        <SectionHeading mt={0}>
                            Trondheim Akuttmedisinske Studentforening
                        </SectionHeading>
                        <Flex flexWrap="wrap" gap={4} align="flex-start">
                            <Box flex="1 1 300px">
                                <BodyText>
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
                                </BodyText>
                                <BodyText>
                                    Vi legger vekt på faglig kompetanse innen akuttmedisin for både kommende leger og lekfolk. Vårt mål er
                                    å skape trygghet rundt håndtering av akuttmedisinske situasjoner ved å fremme interesse, engasjement
                                    og styrke kunnskapen gjennom kvalitetssikrede kurs og ferdighetstrening.
                                </BodyText>
                                <BodyText>
                                    Foreningen deltar aktivt i det norske og skandinaviske studentmiljøet innen akuttmedisin gjennom NAMS
                                    - Norsk Akuttmedisinsk Studentforum.
                                </BodyText>
                                <PrimaryLinkButton href="/om-oss/vedtekter">Vedtekter</PrimaryLinkButton>
                            </Box>
                        </Flex>
                    </ContentCard>

                    {/* Cooperation partners */}

                    <PartnersSection data={cooperationPartners} />

                    {/* Join us section */}
                    <Box
                        borderRadius="lg"
                        textAlign="center"
                        p={{ base: 6, md: 8 }}
                        bg="var(--color-primary)"
                        color="white"
                    >
                        <SectionHeading mt={0} underlineColor="white">Bli med på laget som samarbeidspartner</SectionHeading>
                        <BodyText>
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
                        </BodyText>
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
                </Stack>
            </PageContainer>
        </>
    )
}