import Link from 'next/link';
import tw, { styled } from 'twin.macro';
import Typography from '../common/Typography';

const SectionLayout = tw.section`bg-gray-100 pt-8 px-5 mb-16`;
const SectionContainer = tw.div`px-5 flex flex-row flex-wrap mx-auto w-full max-w-7xl`;
const Block = tw.div`w-full md:w-1/2 mb-8`;
const LeftBlock = tw(
  Block
)`border-b md:border-r md:border-b-0 pb-8 mb-8 md:pb-0 md:mb-0 border-gray-200 md:pr-4`;
const RightBlock = tw(Block)`md:pl-4`;
const BlockHeader = styled.h2(({ meta }) => ({
  ...tw`text-lg font-bold mb-5`,
  fontFamily: Typography[meta.theme].HomepagePromoBlockHeader,
}));
const BlockDek = styled.p(({ meta }) => ({
  ...tw`text-sm mb-3`,
  fontFamily: Typography[meta.theme].HomepagePromoBlockDek,
}));
const BlockCTA = styled.a(({ meta }) => ({
  ...tw`text-sm font-bold`,
  fontFamily: Typography[meta.theme].HomepagePromoBlockCTA,
}));
const DonateBlockCTA = tw(
  BlockCTA
)`inline-flex bg-black text-white items-center px-5`;

export default function HomepagePromoBar({ metadata }) {
  return (
    <SectionLayout>
      <SectionContainer>
        <LeftBlock>
          <BlockHeader meta={metadata}>{metadata.aboutHed}</BlockHeader>
          <BlockDek meta={metadata}>{metadata.aboutDek}</BlockDek>
          <Link href="/about">
            <BlockCTA meta={metadata}>{metadata.aboutCTA}</BlockCTA>
          </Link>
        </LeftBlock>
        <RightBlock>
          <BlockHeader meta={metadata}>{metadata.supportHed}</BlockHeader>
          <BlockDek meta={metadata}>{metadata.supportDek}</BlockDek>
          <DonateBlockCTA
            style={{
              minHeight: '2.375rem',
            }}
            meta={metadata}
          >
            {metadata.supportCTA}
          </DonateBlockCTA>
        </RightBlock>
      </SectionContainer>
    </SectionLayout>
  );
}
