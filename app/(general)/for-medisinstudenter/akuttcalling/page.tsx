import { Box, SimpleGrid } from '@chakra-ui/react';
import { PageContainer } from '@/components/PageContainer';
import { ContentCard } from '@/components/ContentCard';
import { PrimaryLinkButton } from '@/components/PrimaryLinkButton';
import { PortableText } from 'next-sanity';
import { client } from '@/sanity/lib/client';
import { AkuttCalling } from '@/types/sanity.types';
import { AKUTTKALLING_QUERY } from '@/sanity/lib/queries';
import { portableTextComponents, BodyText } from '@/components/Typography';
import { urlFor } from '@/sanity/lib/image';
import Image from 'next/image';
import { SanityImageSource } from "@sanity/image-url/lib/types/types";
import HeroImage from '@/components/HeroImage';
import PreloadHeroImage from '@/components/PreloadHeroImage';


import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Akuttcalling",
    description: "Akuttcalling er TrAMS sin hospiteringsordning for medisinstudenter interessert i akuttmedisin. Få praktisk erfaring med ambulansetjenesten i Trondheim.",
    keywords: ["akuttcalling", "akuttmedisin", "hospitering ambulanse", "medisinstudent praksis", "ambulansetjeneste trondheim"],
    openGraph: {
        title: "Akuttcalling - Akuttmedisinsk Hospiteringsordning | TrAMS",
        description: "Akuttcalling er TrAMS sin hospiteringsordning for medisinstudenter interessert i akuttmedisin.",
        url: "https://www.trams.no/for-medisinstudenter/akuttcalling",
        images: [{ url: "/assets/images/ambulanse.png", width: 1200, height: 630, alt: "Akuttcalling - TrAMS" }],
    },
};

export default async function AkuttCallingPage() {


    const data = await client.fetch<AkuttCalling>(AKUTTKALLING_QUERY);

    if (!data) {
        return (
            <PageContainer>
                <ContentCard>
                    <BodyText mb={0} textAlign="center">Ingen informasjon tilgjengelig.</BodyText>
                </ContentCard>
            </PageContainer>
        );
    }

    return (
        <>
            <PreloadHeroImage imageUrl="/assets/images/ambulanse.png" />
            <HeroImage
                imageUrl="/assets/images/ambulanse.png"
                heading={data.title}
            />
            <PageContainer>
                <ContentCard>
                    {data.link && (
                        <PrimaryLinkButton href={data.link} external mt={0} mb={8}>
                            Gå til skjema
                        </PrimaryLinkButton>
                    )}
                    {data.content && <PortableText value={data.content} components={portableTextComponents} />}
                </ContentCard>

                {data.gallery && data.gallery.length > 0 && (
                    <SimpleGrid columns={{ base: 1, lg: 2 }} gap={8} mt={16}>
                        {data.gallery.map((image: SanityImageSource, index: number) => (
                            <Box key={index} position="relative" h={{ base: '300px', md: '400px' }} borderRadius="lg" overflow="hidden">
                                <Image
                                    src={urlFor(image).url()}
                                    alt={`Akuttcalling bilde ${index + 1}`}
                                    fill
                                    style={{ objectFit: 'cover' }}
                                />
                            </Box>
                        ))}
                    </SimpleGrid>
                )}
            </PageContainer>
        </>
    );
}
