import HeroImage from '@/components/HeroImage';
import VedtekterContent from '@/components/VedtekterContent';

export const metadata = {
    title: "Vedtekter | TrAMS",
    description: "Les vedtektene for Trondheim Akuttmedisinske Studentforening (TrAMS).",
};

export default function VedtekterPage() {

    return (
        <>
            <HeroImage
                imageUrl="/assets/images/gruppebilde.jpg"
                heading="Vedtekter"
                text="her kan du lese om vedtektene til TrAMS"
            />
        <VedtekterContent />
        </>
    );
}
