import { Box, Link } from '@chakra-ui/react';
import { PageContainer } from '@/components/PageContainer';
import { SectionHeading, CenteredText } from '@/components/Typography';
import LinkGrid from '@/components/LinkGrid';
import HeroImage from '@/components/HeroImage';
import { HeroHeading } from '@/components/Typography';
import PreloadHeroImage from '@/components/PreloadHeroImage';

export const metadata = {
  title: "Instruktører",
  description: "Er du instruktør eller ønsker å bli det? Her finner du informasjon og ressurser for TrAMS-instruktører.",
};

export default function Instruktorer() {

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
          <CenteredText>
            Som instruktør får du muligheten til å lære bort akuttmedisin på både eksterne og interne kurs. I tillegg
            blir man prioritert på noen av TrAMS sine antallsbegrensede arrangementer. Som instruktør får man ta del i
            et sosialt og hyggelig instruktørmiljø!
          </CenteredText>
          <CenteredText>
            For å kunne søke om å bli instruktør må du være{' '}
            <Link href="/for-medisinstudenter" color="var(--color-primary)" textDecoration="underline">
              medlem
            </Link>{' '}
            i TrAMS. Opptaket er søknadsbasert. Likevel kan engasjement i foreningen utover det som fremgår av
            søknaden, tas i betraktning.
          </CenteredText>
          <CenteredText>TrAMS tar opp nye eksterne instruktører høsten 2025.</CenteredText>
          <CenteredText>
            Eventuelle spørsmål sendes til{' '}
            <Link href="mailto:instruktoransvarlig@trams.no" color="var(--color-primary)" textDecoration="underline">
              instruktoransvarlig@trams.no
            </Link>
            .
          </CenteredText>
        </Box>

        <Box mt={16}>
          <SectionHeading mt={0}>
            Ferdighetsinstruktør
          </SectionHeading>
          <CenteredText>
            Gjennom året utdanner TrAMS instruktører som holder kurs for andre medisinstudenter i perifer venekanylering
            (PVK), sutur og ultralyd, blant annet. På eldre kull vil man også få muligheten til å være instruktør på
            akuttmedisinkursene TrAMS arrangerer på studiet i samarbeid med NTNU og St. Olavs hospital.
            <br />
            <br />
            De gangene vi tar opp instruktører til internundervisning vil det komme informasjon om dette på mail.
          </CenteredText>
        </Box>
      </PageContainer>
    </>
  );
}
