import { Box, Container, Link, Button, SimpleGrid } from '@chakra-ui/react';
import { PortableText } from 'next-sanity';
import { client } from '@/sanity/lib/client';
import { AkuttCalling } from '@/types/sanity.types';
import { AKUTTKALLING_QUERY } from '@/sanity/lib/queries';
import { portableTextComponents, HeroHeading } from '@/components/Typography';
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
            <Container maxW="80%" py={12}>
                <Box textAlign="center">
                    Ingen informasjon tilgjengelig.
                </Box>
            </Container>
        );
    }

    return (
        <>
            <PreloadHeroImage imageUrl="/assets/images/ambulanse.png" />
            <HeroImage
                imageUrl="/assets/images/ambulanse.png"
                heading={<HeroHeading fontSize={{ base: "2rem", md: "2.5rem" }}>{data.title.toUpperCase()}</HeroHeading>}
                showDecorativeBar={true}
            />
            <Container maxW="80%" py={12}>
                <Box
                    textAlign="center"
                >


                    {data.link && (
                        <Box mb={10}>
                            <Link
                                href={data.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                _hover={{ textDecoration: 'none' }}
                            >
                                <Button
                                    bg="var(--color-primary)"
                                    color="white"
                                    _hover={{
                                        bg: 'var(--color-secondary)',
                                        color: 'black',
                                        transform: 'scale(1.02)'
                                    }}
                                    size="lg"
                                    px={8}
                                    h="56px"
                                    fontSize="1.1rem"
                                    borderRadius="md"
                                    transition="all 0.2s"
                                >
                                    Gå til skjema
                                </Button>
                            </Link>
                        </Box>
                    )}
                    <Box className="portable-text" mx="auto" mb={8} textAlign="left">
                        {data.content && <PortableText value={data.content} components={portableTextComponents} />}
                    </Box>



                    {data.gallery && data.gallery.length > 0 && (
                        <SimpleGrid columns={{ base: 1, lg: 2 }} gap={4}>
                            {data.gallery.map((image: SanityImageSource, index: number) => (
                                <Box key={index} display="flex" justifyContent="center" alignItems="center" height="500px" overflow="hidden">
                                    <Image
                                        src={urlFor(image).url()}
                                        alt={`Akuttcalling bilde ${index + 1}`}
                                        width={500}
                                        height={500}
                                        objectFit="contain"
                                    />
                                </Box>
                            ))}
                        </SimpleGrid>
                    )}
                </Box>
            </Container >
        </>
    );
}
