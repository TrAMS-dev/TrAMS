import { ReactNode } from 'react';
import { BoardMember } from '@/types/sanity.types';
import HeroImage from '@/components/HeroImage';
import PreloadHeroImage from '@/components/PreloadHeroImage';
import { PageContainer } from '@/components/PageContainer';
import { ContentCard } from '@/components/ContentCard';
import BoardMemberProfile from '@/components/BoardMemberProfile';

const HERO_IMAGE = '/assets/images/gruppebilde.jpg';

interface BoardRoleViewProps {
  /** Name of the role, shown in the hero */
  heading: string;
  member: BoardMember;
  /** Description of the role */
  children: ReactNode;
}

/**
 * Shared layout for the pages describing each board role
 */
export default function BoardRoleView({ heading, member, children }: BoardRoleViewProps) {
  return (
    <>
      <PreloadHeroImage imageUrl={HERO_IMAGE} />
      <HeroImage imageUrl={HERO_IMAGE} heading={heading} />

      <PageContainer>
        <ContentCard mb={8}>{children}</ContentCard>
        <BoardMemberProfile member={member} />
      </PageContainer>
    </>
  );
}
