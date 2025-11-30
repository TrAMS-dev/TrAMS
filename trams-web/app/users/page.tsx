import { Box, Heading, Text } from '@chakra-ui/react';

export default function UsersPage() {
    return (
        <Box maxW="1200px" mx="auto" py={{ base: 4, md: 8 }} px={{ base: 4, md: 4 }}>
            <Heading as="h1" mb={4}>Brukere</Heading>
            <Text>Her kommer oversikt over brukere.</Text>
        </Box>
    );
}
