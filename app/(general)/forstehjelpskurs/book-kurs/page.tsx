
import BookKursForm from '@/components/BookKursForm';
import { SectionHeading } from '@/components/Typography';
import { Box, Container } from '@chakra-ui/react';
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
        <Box display="flex" flexDirection="column">
            <Box
                py={5}
                textAlign="center"
            >
                <Container maxW="800px">
                    <SectionHeading>Book Kurs med TrAMS</SectionHeading>
                </Container>
            </Box>
            <Container maxW="1200px" mx="auto" px={4} flex={1} pb={12}>
                <BookKursForm />
            </Container>
        </Box>
    );
}