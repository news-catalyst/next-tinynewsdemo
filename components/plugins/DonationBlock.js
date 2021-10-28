import { useEffect, useState } from 'react';
import Link from 'next/link';
import tw, { styled } from 'twin.macro';
import { useAnalytics } from '../../lib/hooks/useAnalytics.js';
import Donate from '../nav/Donate.js';
import Colors from '../common/Colors';
import Typography from '../common/Typography';
import { determineTextColor } from '../../lib/utils';

const DonationWrapper = styled.div(({ textColor, backgroundColor }) => ({
  ...tw`bg-gray-200 mb-8 pt-7 px-4 pb-8 md:sticky md:top-10`,
  backgroundColor: backgroundColor,
  color: textColor,
}));

const DonationHed = styled.h4(({ meta }) => ({
  ...tw`text-2xl font-bold tracking-tight leading-5 mb-2`,
  fontFamily: Typography[meta.theme || 'styleone'].PromotionBlockHed,
}));
const DonationDek = styled.div(({ meta }) => ({
  ...tw`mb-6`,
  fontFamily: Typography[meta.theme || 'styleone'].PromotionBlockDek,
}));
const DonateLink = styled.a(
  ({ textColor, backgroundColor, meta, tinycms }) => ({
    ...tw`py-2 px-4 font-bold cursor-pointer hover:underline`,
    backgroundColor: backgroundColor,
    pointerEvents: tinycms ? 'none' : '',
    color: textColor,
    fontFamily: Typography[meta.theme || 'styleone'].PromotionBlockCTA,
  })
);

export default function DonationBlock({ metadata, tinycms }) {
  const [textColor, setTextColor] = useState(null);
  const [backgroundColor, setBackgroundColor] = useState(null);
  const { trackEvent } = useAnalytics();

  const trackClick = () => {
    trackEvent({
      action: 'Clicked',
      category: 'Donate',
      label: 'Promotion Block',
      non_interaction: false,
    });
  };

  useEffect(() => {
    let bgc;
    let tc;
    if (metadata.color === 'custom') {
      bgc = metadata.primaryColor;
      tc = determineTextColor(metadata.primaryColor);
    } else if (Colors[metadata.color]) {
      tc = Colors[metadata.color].PromoBlockText;
      bgc = Colors[metadata.color].PromoBlockBackground;
    }
    setBackgroundColor(bgc);
    setTextColor(tc);
  }, [metadata]);

  return (
    <DonationWrapper textColor={textColor} backgroundColor={backgroundColor}>
      <DonationHed meta={metadata}>{metadata.membershipHed}</DonationHed>
      <DonationDek
        meta={metadata}
        dangerouslySetInnerHTML={{ __html: metadata.membershipDek }}
      />
      <Link href="/donate" passHref>
        <DonateLink
          textColor={backgroundColor}
          backgroundColor={textColor}
          meta={metadata}
          onClick={trackClick}
          tinycms={tinycms}
          style={{
            minHeight: '2.375rem',
          }}
        >
          {metadata.membershipCTA}
        </DonateLink>
      </Link>
    </DonationWrapper>
  );
}
