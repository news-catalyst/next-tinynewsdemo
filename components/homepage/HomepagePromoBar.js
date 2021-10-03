import Link from 'next/link';
import tw, { styled } from 'twin.macro';
import Typography from '../common/Typography';
import Colors from '../common/Colors';
import { determineTextColor } from '../../lib/utils';

const SectionLayout = styled.section(({ meta }) => ({
  ...tw`pt-8 px-5 mb-16`,
  backgroundColor:
    meta.color === 'custom'
      ? meta.secondaryColor
      : Colors[meta.color || 'colorone'].HomepagePromoBackground,
  color:
    meta.color === 'custom'
      ? determineTextColor(meta.secondaryColor)
      : Colors[meta.color || 'colorone'].HomepagePromoText,
}));

const SectionContainer = tw.div`px-5 flex flex-row flex-wrap mx-auto w-full max-w-7xl`;
const Block = styled.div(() => ({
  ...tw`w-full md:w-1/2 mb-8`,
  padding: '0 calc(100% / 6 * 0.25)',
}));
const LeftBlock = tw(
  Block
)`border-b md:border-r md:border-b-0 pb-8 mb-8 md:pb-0 border-gray-200 md:pr-4 md:pl-0`;
const RightBlock = tw(Block)`pr-0`;
const BlockHeader = styled.h2(({ meta }) => ({
  ...tw`text-xl font-bold mb-5`,
  fontFamily: Typography[meta.theme || 'styleone'].HomepagePromoBlockHeader,
}));
const BlockDek = styled.p(({ meta }) => ({
  ...tw`text-base mb-3`,
  fontFamily: Typography[meta.theme || 'styleone'].HomepagePromoBlockDek,
}));
const BlockCTA = styled.a(({ meta }) => ({
  ...tw`text-base font-bold cursor-pointer hover:underline`,
  fontFamily: Typography[meta.theme || 'styleone'].HomepagePromoBlockCTA,
  color:
    meta.color === 'custom'
      ? meta.primaryColor
      : Colors[meta.color ? meta.color : 'colorone'].CTABackground,
}));
const DonateBlockCTA = styled.a(({ meta }) => ({
  ...tw`inline-flex text-base font-bold cursor-pointer items-center px-5 hover:underline`,
  fontFamily: Typography[meta.theme || 'styleone'].HomepagePromoBlockCTA,
  color:
    meta.color === 'custom'
      ? determineTextColor(meta.primaryColor)
      : Colors[meta.color || 'colorone'].CTAText,
  backgroundColor:
    meta.color === 'custom'
      ? meta.primaryColor
      : Colors[meta.color || 'colorone'].CTABackground,
}));

export default function HomepagePromoBar({ metadata }) {
  return (
    <SectionLayout meta={metadata}>
      <SectionContainer>
        <LeftBlock>
          <BlockHeader meta={metadata}>{metadata.aboutHed}</BlockHeader>
          <BlockDek meta={metadata}>{metadata.aboutDek}</BlockDek>
          <Link href="/about" passHref>
            <BlockCTA meta={metadata}>{metadata.aboutCTA}</BlockCTA>
          </Link>
        </LeftBlock>
        <RightBlock>
          <BlockHeader meta={metadata}>{metadata.supportHed}</BlockHeader>
          <BlockDek meta={metadata}>{metadata.supportDek}</BlockDek>
          <Link href="/donate" passHref>
            <DonateBlockCTA
              style={{
                minHeight: '2.375rem',
              }}
              meta={metadata}
            >
              {metadata.supportCTA}
            </DonateBlockCTA>
          </Link>
        </RightBlock>
      </SectionContainer>
    </SectionLayout>
  );
}
