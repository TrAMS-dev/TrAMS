
import BookKursForm from '@/components/BookKursForm';
import { SectionHeading } from '@/components/Typography';
import { Box, Container } from '@chakra-ui/react';
export const metadata = {
    title: "Book Kurs | TrAMS",
    description: "Bestill kurs i førstehjelp i Trondheim fra TrAMS for din bedrift eller organisasjon.",
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