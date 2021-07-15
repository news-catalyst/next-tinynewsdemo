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

const DonationHed = tw.h4`text-2xl font-bold tracking-tight leading-5 mb-2`;
const DonationDek = tw.p`mb-6`;
const DonateLink = styled.a(({ textColor, backgroundColor }) => ({
  ...tw`py-2 px-4 font-bold`,
  backgroundColor: backgroundColor,
  color: textColor,
}));

export default function DonationBlock({ metadata }) {
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
      <DonationHed>{metadata.membershipHed}</DonationHed>
      <DonationDek>{metadata.membershipDek}</DonationDek>
      <Link href="/donate" passHref>
        <DonateLink
          textColor={backgroundColor}
          backgroundColor={textColor}
          onClick={trackClick}
          style={{
            minHeight: '2.375rem',
          }}
        >
          Donate
        </DonateLink>
      </Link>
    </DonationWrapper>
  );
}
