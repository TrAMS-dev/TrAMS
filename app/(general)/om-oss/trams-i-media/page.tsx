import { Box } from '@chakra-ui/react';
import MediaGrid from '@/components/MediaGrid';
import HeroImage from '@/components/HeroImage';
import { getHeroImageUrl } from '@/utils/supabase/storage';

export const metadata = {
    title: "TrAMS i Media | TrAMS",
    description: "Se oversikt over medieomtale og nyhetsartikler om TrAMS og våre aktiviteter.",
};

export default function TramsIMedia() {

    return (
        <>
            {/* Hero Section */}
            <HeroImage
                imageUrl={getHeroImageUrl("gruppebilde.jpg")}
                heading="TrAMS i media"
                text="Se hva vi har gjort og hvordan vi har blitt omtalt i media"
            />

            <MediaGrid />
        </>
    );
}
