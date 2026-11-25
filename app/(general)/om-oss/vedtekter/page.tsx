import HeroImage from '@/components/HeroImage';
import { getPageHero } from '@/sanity/lib/pageHero';
import VedtekterContent from '@/components/VedtekterContent';
import PreloadHeroImage from '@/components/PreloadHeroImage';

export const metadata = {
    title: "Vedtekter",
    description: "Les vedtektene for Trondheim Akuttmedisinske Studentforening (TrAMS).",
};

export default async function VedtekterPage() {
    const hero = await getPageHero('vedtekter');

    return (
        <>
            <PreloadHeroImage imageUrl="/assets/images/gruppebilde.jpg" />
            <HeroImage
                imageUrl="/assets/images/gruppebilde.jpg"
                heading={hero.heading}
                text={hero.text}
            />
        <VedtekterContent />
        </>
    );
}
