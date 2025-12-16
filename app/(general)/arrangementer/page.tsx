import { Box } from "@chakra-ui/react";
import Calendar from "@/components/Calendar";
import { HeroHeading, HeroText } from '@/components/Typography';

export const metadata = {
    title: "Arrangementer | TrAMS",
    description: "Se oversikt over alle kommende arrangementer hos TrAMS - Trondheim Akuttmedisinske Studentforening.",
};

export default function Arrangementer() {

    return (
        <>
            {/* HERO */}
            <Box
                position="relative"
                h="25vh"
                bgImage="url('https://i.imgur.com/oc9gbos.png')"
                backgroundPosition="center"
                backgroundSize="cover"
                backgroundRepeat="no-repeat"
                color="var(--color-light)"
                display="flex"
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
                textAlign="center"
                p={{ base: "1.5rem 1rem", md: "3rem 1rem" }}
                boxShadow="0 10px 20px rgba(0,0,0,0.3)"
            >
                <Box position="absolute" inset={0} bg="rgba(0,0,0,0.6)" zIndex={1} />
                <Box position="relative" zIndex={2} maxW="800px">
                    <HeroHeading>Arrangementer</HeroHeading>
                    <HeroText>
                        Her kan du se alle våre arrangementer for å se hva som er planlagt.
                    </HeroText>
                </Box>
            </Box>

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
                <Calendar />
            </Box>
        </>
    );
}