import { Box } from '@chakra-ui/react';
import MediaGrid from '@/components/MediaGrid';
import HeroImage from '@/components/HeroImage';
import PreloadHeroImage from '@/components/PreloadHeroImage';

export const metadata = {
    title: "TrAMS i Media",
    description: "Se oversikt over medieomtale og nyhetsartikler om TrAMS og våre aktiviteter.",
};

export default function TramsIMedia() {

    return (
        <>
            <PreloadHeroImage imageUrl="/assets/images/gruppebilde_2.jpg" />
            {/* Hero Section */}
            <HeroImage
                imageUrl="/assets/images/gruppebilde_2.jpg"
                heading="TrAMS i media"
                text="Se hva vi har gjort og hvordan vi har blitt omtalt i media"
            />

            <MediaGrid />
        </>
    );
}
