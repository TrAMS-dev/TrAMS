import { PageContainer } from "@/components/PageContainer";
import EarilerMembersSection from "@/components/EarilerMembersSection";
import HeroImage from "@/components/HeroImage";
import PreloadHeroImage from "@/components/PreloadHeroImage";


export const metadata = {
    title: "Tidligere Styrer",
    description: "Oversikt over tidligere styremedlemmer og styrer i TrAMS gjennom årene.",
};

export default function TidligereStyrerPage() {


    return (
        <>
            <PreloadHeroImage imageUrl="/assets/images/gruppebilde.jpg" />
            <HeroImage
                imageUrl="/assets/images/gruppebilde.jpg"
                heading="Tidligere styrer"
                text="Oversikt over tidligere styremedlemmer i TrAMS gjennom årene"
            />
            <PageContainer>
                <EarilerMembersSection />
            </PageContainer>
        </>
    );
}
