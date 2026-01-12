import { Box } from "@chakra-ui/react";
import EventCalendar from "@/components/EventCalendar";
import HeroImage from "@/components/HeroImage";
import { getHeroImageUrl } from "@/utils/supabase/storage";
import { createClient } from '@/utils/supabase/server';

export const metadata = {
    title: "Arrangementer | TrAMS",
    description: "Se oversikt over alle kommende arrangementer hos TrAMS - Trondheim Akuttmedisinske Studentforening.",
};

export default async function Arrangementer() {
    const supabase = await createClient();

    // Fetch events from Supabase
    const { data: events, error } = await supabase
        .from('Events')
        .select('*')
        .order('start_datetime', { ascending: true });

    if (error) {
        console.error('Error fetching events:', error);
    }

    console.log('Fetched events:', events);
    console.log('Number of events:', events?.length || 0);

    return (
        <>
            {/* HERO */}
            <HeroImage
                imageUrl={getHeroImageUrl("HLR.jpg")}
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
                <EventCalendar events={events || []} />
            </Box>
        </>
    );
}