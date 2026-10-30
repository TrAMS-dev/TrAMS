import { Box } from '@chakra-ui/react';
import { PageContainer } from '@/components/PageContainer';
import { ContentCard } from '@/components/ContentCard';
import { PrimaryLinkButton } from '@/components/PrimaryLinkButton';
import { PortableText } from 'next-sanity';
import { client } from '@/sanity/lib/client';
import { MarkorPage } from '@/types/sanity.types';
import { MARKOR_PAGE_QUERY } from '@/sanity/lib/queries';
import { portableTextComponents, BodyText } from '@/components/Typography';
import Gallery from '@/components/Gallery';
import HeroImage from '@/components/HeroImage';
import PreloadHeroImage from '@/components/PreloadHeroImage';


export const metadata = {
    title: "Markører",
    description: "Bli med som markør for TrAMS og bidra til realistisk ferdighetstrening for medisinstudenter.",
};

export default async function MarkorerPage() {


    const data = await client.fetch<MarkorPage>(MARKOR_PAGE_QUERY);

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
            <PreloadHeroImage imageUrl="/assets/images/markor.jpg" />
            <HeroImage
                imageUrl="/assets/images/markor.jpg"
                heading={data.title}
            />
            <PageContainer>
                <ContentCard>
                    {data.content && <PortableText value={data.content} components={portableTextComponents} />}
                    {data.link && (
                        <PrimaryLinkButton href={data.link} external>
                            Gå til skjema
                        </PrimaryLinkButton>
                    )}
                </ContentCard>

                {data.gallery && (
                    <Box mt={16}>
                        <Gallery images={data.gallery} />
                    </Box>
                )}
            </PageContainer>
        </>
    );
}
