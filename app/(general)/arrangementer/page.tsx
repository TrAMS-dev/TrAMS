import { Box } from "@chakra-ui/react";
import ClientCalendar from "@/components/ClientCalendar";

export default function Arrangementer() {
    return (
        <Box
            w="full"
            bg="white"
            borderRadius="8px"
            p={{ base: 4, md: 4 }}
            display="flex"
            flexDirection="column"
            gap={4}
            boxShadow="0 0 10px rgba(0,0,0,0.1)"
        >
            <ClientCalendar />
        </Box>
    );
}