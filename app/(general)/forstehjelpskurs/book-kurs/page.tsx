
import BookKursForm from '@/components/BookKursForm';
import { SectionHeading } from '@/components/Typography';
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
        <PageContainer>
            <SectionHeading mt={0}>Book Kurs med TrAMS</SectionHeading>
            <BookKursForm />
        </PageContainer>
    );
}
