import { Box, Link, Button } from '@chakra-ui/react';
import { PageContainer } from '@/components/PageContainer';
import { SectionHeading, RichText } from '@/components/Typography';
import CommiteeCards from '@/components/CommiteeCards';
import CourseCards from '@/components/CourseCards';
import HeroImage from '@/components/HeroImage';
import PreloadHeroImage from '@/components/PreloadHeroImage';
import LatestEventCards from '@/components/LatestEventCards';
import { createClient } from '@/utils/supabase/server';
import { client } from '@/sanity/lib/client';
import { FOR_MEDISINSTUDENTER_PAGE_QUERY } from '@/sanity/lib/queries';

import type { Metadata } from "next";

const FALLBACK_MEMBERSHIP_SIGNUP_URL = 'https://forms.gle/GDLsAZTeVvTKmCqw9';

export const metadata: Metadata = {
  title: "For Medisinstudenter",
  description: "Bli medlem i TrAMS - Trondheims akuttmedisinske studentforening. Lær akuttmedisin, delta på HLR-kurs og bli instruktør. For medical students interested in emergency medicine in Trondheim.",
  keywords: ["akuttmedisin", "medisinstudenter trondheim", "NTNU medisin", "akuttmedisinsk studentforening", "HLR instruktør", "emergency medicine students"],
  openGraph: {
    title: "For Medisinstudenter - Akuttmedisin og Medlemskap | TrAMS",
    description: "Bli medlem i TrAMS - Trondheims akuttmedisinske studentforening. Lær akuttmedisin og delta på kurs.",
    url: "https://www.trams.no/for-medisinstudenter",
    images: [{ url: "/assets/images/cbrn.jpg", width: 1200, height: 630, alt: "TrAMS for medisinstudenter" }],
  },
};

export default async function ForMedisinstudenter() {
  const supabase = await createClient();
  const [{ data: events, error }, pageData] = await Promise.all([
    supabase.from('Events').select('*'),
    client.fetch(FOR_MEDISINSTUDENTER_PAGE_QUERY),
  ]);
  const membershipSignupUrl =
    pageData?.membershipSignupUrl?.trim() || FALLBACK_MEMBERSHIP_SIGNUP_URL;
  if (error) {
    console.error('Error fetching events:', error);
  }

  return (
    <>
      <PreloadHeroImage imageUrl="/assets/images/cbrn.jpg" />
      {/* HERO */}
      <HeroImage
        imageUrl="/assets/images/cbrn.jpg"
        heading="For Medisinstudenter"
        text="Her kan du lese mer om medlemskap i TrAMS, våre kurs og aktiviteter som er spesielt rettet mot medisinstudenter."
      />

      {/* UPCOMING EVENTS */}
      <PageContainer>
        <SectionHeading mt={0}>Kommende arrangementer</SectionHeading>
        <LatestEventCards events={events ?? []} />
        <Box textAlign="center" mt={6}>
          <Link href="/arrangementer" color="var(--color-primary)" textDecoration="underline">
            Se alle arrangementer
          </Link>
        </Box>

        {/* MEMBERSHIP SECTION */}
        <Box mt={16}>
          <SectionHeading>Bli medlem!</SectionHeading>
          <RichText value={pageData?.membershipText} centered />
          <Box textAlign="center" mt={6}>
            <Link href={membershipSignupUrl} target="_blank" rel="noopener noreferrer" _hover={{ textDecoration: 'none' }}>
              <Button
                bg="var(--color-primary)"
                color="white"
                px={8}
                _hover={{ bg: 'var(--color-secondary)', color: 'black' }}
              >
                Bli medlem!
              </Button>
            </Link>
          </Box>
        </Box>

        {/* OUR OFFERS */}
        <SectionHeading mt={16}>Våre tilbud</SectionHeading>
        <RichText value={pageData?.offersText} centered />
        <CourseCards />

        {/* COMMITTEES SECTION */}
        <Box mt={16}>
          <SectionHeading>Komitéer</SectionHeading>
          <RichText value={pageData?.committeesText} centered mb={12} />
          <CommiteeCards />
        </Box>
      </PageContainer>

    </>
  );
}
