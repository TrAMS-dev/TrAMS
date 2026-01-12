import { Box, Heading, Text } from '@chakra-ui/react';
import MediaGrid from '@/components/MediaGrid';

export const metadata = {
    title: "TrAMS i Media | TrAMS",
    description: "Se oversikt over medieomtale og nyhetsartikler om TrAMS og våre aktiviteter.",
};

export default function TramsIMedia() {

    return (
        <>
            {/* Hero Section */}
            <Box
                position="relative"
                h="25vh"
                bgImage="url('https://i.imgur.com/rKhkGGT.jpg')"
                backgroundPosition="center"
                backgroundSize="cover"
                backgroundRepeat="no-repeat"
                color="var(--color-light)"
                display="flex"
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
                textAlign="center"
                p="3rem 1rem"
                boxShadow="0 10px 20px rgba(0,0,0,0.3)"
            >
                <Box position="absolute" inset={0} bg="rgba(0,0,0,0.6)" zIndex={1} />
                <Box position="relative" zIndex={2} maxW="800px">
                    <Heading as="h1" fontSize={{ base: '2rem', md: '2.5rem' }} mb={4} fontWeight={700}>
                        TrAMS i media
                    </Heading>
                    <Text fontSize={{ base: '1rem', md: '1.2rem' }} lineHeight="1.5">
                        Se hva vi har gjort og hvordan vi har blitt omtalt i media
                    </Text>
                </Box>
            </Box>

            <MediaGrid />
        </>
    );
}
