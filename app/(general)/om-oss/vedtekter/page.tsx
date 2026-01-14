import HeroImage from '@/components/HeroImage';
import VedtekterContent from '@/components/VedtekterContent';
import PreloadHeroImage from '@/components/PreloadHeroImage';

export const metadata = {
    title: "Vedtekter | TrAMS",
    description: "Les vedtektene for Trondheim Akuttmedisinske Studentforening (TrAMS).",
};

export default function VedtekterPage() {

    return (
        <>
            <PreloadHeroImage imageUrl="/assets/images/gruppebilde.jpg" />
            <HeroImage
                imageUrl="/assets/images/gruppebilde.jpg"
                heading="Vedtekter"
                text="her kan du lese om vedtektene til TrAMS"
            />
        <VedtekterContent />
        </>
    );
}
