import EventCalendar from "@/components/EventCalendar";
import HeroImage from "@/components/HeroImage";
import { getPageHero } from '@/sanity/lib/pageHero';
import PreloadHeroImage from "@/components/PreloadHeroImage";
import { PageContainer } from "@/components/PageContainer";
import { createClient } from '@/utils/supabase/server';

export const metadata = {
    title: "Arrangementer",
    description: "Se oversikt over alle kommende arrangementer hos TrAMS - Trondheim Akuttmedisinske Studentforening.",
};

export default async function Arrangementer() {
    const supabase = await createClient();
    const hero = await getPageHero('arrangementer');

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
                heading={hero.heading}
                text={hero.text}
            />

            <PageContainer>
                <EventCalendar events={events || []} />
            </PageContainer>
        </>
    );
}