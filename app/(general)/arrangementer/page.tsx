import { Box } from "@chakra-ui/react";
import Calendar from "@/components/Calendar";
import HeroImage from "@/components/HeroImage";
import PreloadHeroImage from "@/components/PreloadHeroImage";

export const metadata = {
    title: "Arrangementer | TrAMS",
    description: "Se oversikt over alle kommende arrangementer hos TrAMS - Trondheim Akuttmedisinske Studentforening.",
};

export default function Arrangementer() {

    return (
        <>
            <PreloadHeroImage imageUrl="/assets/images/kirurgi.jpg" />
            {/* HERO */}
            <HeroImage
                imageUrl="/assets/images/kirurgi.jpg"
                heading="Arrangementer"
                text="Her kan du se alle våre arrangementer for å se hva som er planlagt."
            />

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