import { Box } from '@chakra-ui/react';
import { PageContainer } from '@/components/PageContainer';
import { SectionHeading, RichText } from '@/components/Typography';
import LinkGrid from '@/components/LinkGrid';
import HeroImage from '@/components/HeroImage';
import PreloadHeroImage from '@/components/PreloadHeroImage';
import { client } from '@/sanity/lib/client';
import { INSTRUKTOR_PAGE_QUERY } from '@/sanity/lib/queries';

export const metadata = {
  title: "Instruktører",
  description: "Er du instruktør eller ønsker å bli det? Her finner du informasjon og ressurser for TrAMS-instruktører.",
};

export default async function Instruktorer() {
  const pageData = await client.fetch(INSTRUKTOR_PAGE_QUERY);

  return (
    <>
      <PreloadHeroImage imageUrl="/assets/images/gruppebilde_2.jpg" />
      <HeroImage
        imageUrl="/assets/images/gruppebilde_2.jpg"
        heading="For instruktører"
        text="Her finner du informasjon som er spesielt rettet mot instruktører."
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
