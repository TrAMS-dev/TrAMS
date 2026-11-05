import { client } from "@/sanity/lib/client";
import { BOARD_MEMBERS_QUERY } from "@/sanity/lib/queries";
import { BoardMember } from "@/types/sanity.types";
import { Flex, Box, Image, Link, Stack, Button } from "@chakra-ui/react";
import BoardMemberSection from "@/components/BoardMemberSection";
import { PartnersSection } from "@/components/CooperationPartners";
import { ABOUT_PAGE_QUERY, COOPERATION_PARTNERS_QUERY } from "@/sanity/lib/queries";
import { CooperationPartners } from "@/types/sanity.types";
import HeroImage from "@/components/HeroImage";
import PreloadHeroImage from "@/components/PreloadHeroImage";
import { PageContainer } from "@/components/PageContainer";
import { ContentCard } from "@/components/ContentCard";
import { PrimaryLinkButton } from "@/components/PrimaryLinkButton";
import { SectionHeading, RichText } from "@/components/Typography";

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

    const aboutPage = await client.fetch(ABOUT_PAGE_QUERY);

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
                                <Box float="right" ml={4} mb={2}>
                                    <Image
                                        src="/assets/Logo.png"
                                        alt="TrAMS logo"
                                        width={100}
                                        height={100}
                                        className="max-w-[100px]"
                                    />
                                </Box>
                                <RichText value={aboutPage?.aboutText} mb={4} />
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
                        <SectionHeading mt={0} underlineColor="white">{aboutPage?.partnerCtaTitle}</SectionHeading>
                        <RichText value={aboutPage?.partnerCtaText} linkColor="var(--color-secondary)" mb={4} />
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