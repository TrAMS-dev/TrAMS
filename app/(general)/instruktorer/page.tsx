import { Box } from '@chakra-ui/react';
import { PageContainer } from '@/components/PageContainer';
import { SectionHeading, RichText } from '@/components/Typography';
import LinkGrid from '@/components/LinkGrid';
import HeroImage from '@/components/HeroImage';
import { getPageHero } from '@/sanity/lib/pageHero';
import PreloadHeroImage from '@/components/PreloadHeroImage';
import { client } from '@/sanity/lib/client';
import { INSTRUKTOR_PAGE_QUERY } from '@/sanity/lib/queries';

export const metadata = {
  title: "Instruktører",
  description: "Er du instruktør eller ønsker å bli det? Her finner du informasjon og ressurser for TrAMS-instruktører.",
};

export default async function Instruktorer() {
  const [pageData, hero] = await Promise.all([
    client.fetch(INSTRUKTOR_PAGE_QUERY),
    getPageHero('instruktorer'),
  ]);

  return (
    <>
      <PreloadHeroImage imageUrl="/assets/images/gruppebilde_2.jpg" />
      <HeroImage
        imageUrl="/assets/images/gruppebilde_2.jpg"
        heading={hero.heading}
        text={hero.text}
      />

      <PageContainer>
        <LinkGrid />

        <Box mt={16}>
          <SectionHeading mt={0}>
            Bli instruktør!
          </SectionHeading>
          <RichText value={pageData?.becomeInstructorText} centered />
        </Box>

        <Box mt={16}>
          <SectionHeading mt={0}>
            Ferdighetsinstruktør
          </SectionHeading>
          <RichText value={pageData?.skillInstructorText} centered />
        </Box>
      </PageContainer>
    </>
  );
}
