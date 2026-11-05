
import BookKursForm from '@/components/BookKursForm';
import HeroImage from '@/components/HeroImage';
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

export default function BookKursPage() {
    return (
        <>
            <PreloadHeroImage imageUrl="/assets/images/markor_2.jpg" />
            <HeroImage
                imageUrl="/assets/images/markor_2.jpg"
                heading="Book kurs"
                text="Bestill førstehjelpskurs med TrAMS for din bedrift eller organisasjon."
            />
            <PageContainer narrow>
                <BookKursForm />
            </PageContainer>
        </>
    );
}
