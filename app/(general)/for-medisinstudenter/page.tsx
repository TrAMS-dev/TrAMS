import { Box, Link, Button } from '@chakra-ui/react';
import { PageContainer } from '@/components/PageContainer';
import { SectionHeading, CenteredText } from '@/components/Typography';
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
    client.fetch<{ membershipSignupUrl?: string | null }>(FOR_MEDISINSTUDENTER_PAGE_QUERY),
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
          <CenteredText>
            TrAMS er studentforeningen for medisinstudenter ved NTNU som er interesserte i akuttmedisin! Som medlem kan
            du blant annet delta på TrAMS-arrangementer forbeholdt medlemmer, du får gratis ferdighetskurs og muligheten
            til å delta på vår generalforsamling. Du kan også engasjere deg ytterligere i foreningen ved å bli instruktør
            eller bli med i foreningens komiteer.
            <br />
            <br />
            TrAMS-medlemskapet er et livstidsmedlemskap med kontingent på 250 kr. For å bli medlem må du være
            medisinstudent ved NTNU, tidligere medisinstudent ved NTNU, eller lege ved St. Olavs Hospital.
            <br />
            <br />
            Ønsker du å engasjere deg i akuttmedisin, lære nye ferdigheter og bli en del av et engasjert
            studentmiljø? <strong>Bli medlem i dag ved å klikke på knappen!</strong>
          </CenteredText>
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
        <CenteredText>
          TrAMS arrangerer en rekke kurs, foredrag, skillskvelder og annet moro i løpet av et semester. Klikk deg inn
          under for å lese mer om de ulike tilbudene. Noen tilbud er åpne for alle medisinstudenter, mens andre er kun
          for medlemmer. I tillegg kan du som medlem søke om å bli instruktør i TrAMS eller bli med i en av komiteene
          våre!
        </CenteredText>
        <CourseCards />

        {/* COMMITTEES SECTION */}
        <Box mt={16}>
          <SectionHeading>Komitéer</SectionHeading>
          <CenteredText mb={12}>
            Er du interessert i å fordype deg innenfor TrAMS? Som medlem i en av TrAMS sine komitéer kan du bli med å
            utvikle caser, nye kurs, eller innhold til skillskvelder. Som komitémedlem får involvere deg masse i TrAMS
            og du vil få lære mye om både fag og organisering. Det skal være gøy å være med i en komité og derfor legger
            man opp aktiviteten etter hva komiteen selv ønsker. Klikk inn på hver komité under for å lese mer om dem!
            <br />
            <br />
            Har du spørsmål om TrAMS sine komitéer, eller en idé om å stifte en ny komité? Ta kontakt med{' '}
            <Link href="mailto:komiteansvarlig@trams.no" color="var(--color-primary)" textDecoration="underline">
              komiteansvarlig@trams.no
            </Link>{' '}
            eller kontakt komitéen direkte.
          </CenteredText>
          <CommiteeCards />
        </Box>
      </PageContainer>

    </>
  );
}
