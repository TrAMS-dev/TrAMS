import { Box } from '@chakra-ui/react';
import MediaGrid from '@/components/MediaGrid';
import HeroImage from '@/components/HeroImage';
import { getPageHero } from '@/sanity/lib/pageHero';
import PreloadHeroImage from '@/components/PreloadHeroImage';

export const metadata = {
    title: "TrAMS i Media",
    description: "Se oversikt over medieomtale og nyhetsartikler om TrAMS og våre aktiviteter.",
};

export default async function TramsIMedia() {
    const hero = await getPageHero('tramsIMedia');

    return (
        <>
            <PreloadHeroImage imageUrl="/assets/images/gruppebilde_2.jpg" />
            {/* Hero Section */}
            <HeroImage
                imageUrl="/assets/images/gruppebilde_2.jpg"
                heading={hero.heading}
                text={hero.text}
            />

            <MediaGrid />
        </>
    );
}
