import Link from 'next/link';
import tw from 'twin.macro';

const SectionLayout = tw.section`bg-gray-100 pt-8 px-5 mb-16`;
const SectionContainer = tw.div`px-5 flex flex-row flex-wrap mx-auto w-full max-w-7xl`;
const Block = tw.div`w-full md:w-1/2 mb-8`;
const LeftBlock = tw(
  Block
)`border-b md:border-r md:border-b-0 pb-8 mb-8 md:pb-0 md:mb-0 border-gray-200 md:pr-4`;
const RightBlock = tw(Block)`md:pl-4`;
const BlockHeader = tw.h2`text-lg font-bold mb-5`;
const BlockDek = tw.p`text-sm mb-3`;
const BlockCTA = tw.a`text-sm font-bold`;
const DonateBlockCTA = tw(
  BlockCTA
)`inline-flex bg-black text-white items-center px-5`;

export default function HomepagePromoBar({ metadata }) {
  return (
    <SectionLayout>
      <SectionContainer>
        <LeftBlock>
          <BlockHeader>{metadata.aboutHed}</BlockHeader>
          <BlockDek>{metadata.aboutDek}</BlockDek>
          <Link href="/about">
            <BlockCTA>{metadata.aboutCTA}</BlockCTA>
          </Link>
        </LeftBlock>
        <RightBlock>
          <BlockHeader>{metadata.supportHed}</BlockHeader>
          <BlockDek>{metadata.supportDek}</BlockDek>
          <DonateBlockCTA
            style={{
              minHeight: '2.375rem',
            }}
          >
            {metadata.supportCTA}
          </DonateBlockCTA>
        </RightBlock>
      </SectionContainer>
    </SectionLayout>
  );
}
