
import BookKursForm from '@/components/BookKursForm';
import HeroImage from '@/components/HeroImage';
import { getPageHero } from '@/sanity/lib/pageHero';
import PreloadHeroImage from '@/components/PreloadHeroImage';
import { PageContainer } from '@/components/PageContainer';
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Book Kurs",
    description: "Bestill førstehjelpskurs i Trondheim for din bedrift. TrAMS tilbyr skreddersydde kurs i HLR, akuttmedisin og førstehjelp. Book your first aid course in Trondheim today.",
    keywords: ["book førstehjelpskurs", "førstehjelpskurs trondheim", "bestill førstehjelp kurs", "HLR kurs bedrift", "akuttmedisin opplæring", "first aid course booking"],
    openGraph: {
        title: "Book Førstehjelpskurs Trondheim | TrAMS",
        description: "Bestill førstehjelpskurs i Trondheim for din bedrift. Skreddersydde kurs i HLR, akuttmedisin og førstehjelp.",
        url: "https://www.trams.no/forstehjelpskurs/book-kurs",
    },
};

export default async function BookKursPage() {
    const hero = await getPageHero('bookKurs');
    return (
        <>
            <PreloadHeroImage imageUrl="/assets/images/markor_2.jpg" />
            <HeroImage
                imageUrl="/assets/images/markor_2.jpg"
                heading={hero.heading}
                text={hero.text}
            />
            <PageContainer narrow>
                <BookKursForm />
            </PageContainer>
        </>
    );
}
