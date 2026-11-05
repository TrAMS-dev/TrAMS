'use client';

import { Box, Link as ChakraLink } from '@chakra-ui/react';
import { PageContainer } from '@/components/PageContainer';
import { ContentCard } from '@/components/ContentCard';
import { PrimaryLinkButton } from '@/components/PrimaryLinkButton';
import Image from 'next/image';
import { urlFor } from '@/sanity/lib/image';
import { PortableText } from 'next-sanity';
import { portableTextComponents, SectionHeading, BodyText } from '@/components/Typography';
import { Committee } from '@/types/sanity.types';
import HeroImage from '@/components/HeroImage';

export default function CommitteeView({ committee }: { committee: Committee | null }) {
    if (!committee) {
        return (
            <PageContainer>
                <ContentCard textAlign="center">
                    <SectionHeading as="h1" mt={0}>Komité ikke funnet</SectionHeading>
                    <BodyText>Vi kunne ikke finne denne komiteen.</BodyText>
                    <PrimaryLinkButton href="/for-medisinstudenter">
                        Gå tilbake til oversikten
                    </PrimaryLinkButton>
                </ContentCard>
            </PageContainer>
        );
    }

    const headerImageUrl = committee.headerImage
        ? urlFor(committee.headerImage).width(1920).height(600).url()
        : "/assets/images/kirurgi.jpg";

    const committeeImageUrl = committee.committeeImage
        ? urlFor(committee.committeeImage).width(1200).height(800).url()
        : null;

    return (
        <>
            {/* Hero Section */}
            <HeroImage
                imageUrl={headerImageUrl}
                heading={committee.name}
            />

            {/* Content Section */}
            <PageContainer>
                <ContentCard>
                    {/* Description */}
                    <PortableText value={committee.description} components={portableTextComponents} />

                    {/* Contact Info */}
                    {committee.email && (
                        <BodyText mb={0}>
                            Kontakt:{' '}
                            <ChakraLink
                                href={`mailto:${committee.email}`}
                                color="var(--color-primary)"
                                textDecoration="underline"
                            >
                                {committee.email}
                            </ChakraLink>
                        </BodyText>
                    )}
                </ContentCard>

                {/* Committee Image */}
                {committeeImageUrl && (
                    <Box mt={16} borderRadius="lg" overflow="hidden">
                        <Image
                            src={committeeImageUrl}
                            alt={`${committee.name} medlemmer`}
                            width={1200}
                            height={800}
                            style={{ width: '100%', height: 'auto' }}
                        />
                    </Box>
                )}
            </PageContainer>
        </>
    );
}
