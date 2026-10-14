import EventCalendar from "@/components/EventCalendar";
import HeroImage from "@/components/HeroImage";
import PreloadHeroImage from "@/components/PreloadHeroImage";
import { PageContainer } from "@/components/PageContainer";
import { createClient } from '@/utils/supabase/server';

export const metadata = {
    title: "Arrangementer",
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
            <PreloadHeroImage imageUrl="/assets/images/kirurgi.jpg" />
            {/* HERO */}
            <HeroImage
                imageUrl="/assets/images/kirurgi.jpg"
                heading="Arrangementer"
                text="Her kan du se alle våre arrangementer for å se hva som er planlagt."
            />

            <PageContainer>
                <EventCalendar events={events || []} />
            </PageContainer>
        </>
    );
}