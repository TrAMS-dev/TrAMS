import { PageContainer } from "@/components/PageContainer";
import EarilerMembersSection from "@/components/EarilerMembersSection";
import HeroImage from "@/components/HeroImage";
import { getPageHero } from '@/sanity/lib/pageHero';
import PreloadHeroImage from "@/components/PreloadHeroImage";


export const metadata = {
    title: "Tidligere Styrer",
    description: "Oversikt over tidligere styremedlemmer og styrer i TrAMS gjennom årene.",
};

export default async function TidligereStyrerPage() {
    const hero = await getPageHero('tidligereStyrer');


    return (
        <>
            <PreloadHeroImage imageUrl="/assets/images/gruppebilde.jpg" />
            <HeroImage
                imageUrl="/assets/images/gruppebilde.jpg"
                heading={hero.heading}
                text={hero.text}
            />
            <PageContainer>
                <EarilerMembersSection />
            </PageContainer>
        </>
    );
}
