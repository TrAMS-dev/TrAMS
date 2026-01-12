import { Container, Heading, Box } from "@chakra-ui/react";
import EarilerMembersSection from "@/components/EarilerMembersSection";


export const metadata = {
    title: "Tidligere Styrer | TrAMS",
    description: "Oversikt over tidligere styremedlemmer og styrer i TrAMS gjennom årene.",
};

export default function TidligereStyrerPage() {


    return (
        <Container maxW="1200px" py={12}>
            <Heading as="h1" textAlign="center" mb={15} fontSize="2.5rem">
                Tidligere styrer
                <Box display="block" w="100px" h="4px" bg="var(--color-primary)" mx="auto" mt={4} borderRadius="2px" />
            </Heading>
            <EarilerMembersSection />
        </Container>
    );
}
