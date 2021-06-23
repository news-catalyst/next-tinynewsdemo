import { useEffect, useState } from 'react';
import tw, { styled } from 'twin.macro';
import Advertise from '../nav/Advertise.js';
import Colors from '../common/Colors';
import { determineTextColor } from '../../lib/utils';

const AdPromotionWrapper = styled.div(({ textColor, backgroundColor }) => ({
  ...tw`bg-gray-200 mb-8 pt-7 px-4 pb-8 md:top-10`,
  backgroundColor: backgroundColor,
  color: textColor,
}));

const AdPromotionHed = tw.h4`text-2xl font-bold tracking-tight leading-5 mb-2`;
const AdPromotionDek = tw.p`mb-6`;

export default function AdPromotionBlock({ metadata }) {
  const [textColor, setTextColor] = useState(null);
  const [backgroundColor, setBackgroundColor] = useState(null);

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
    <AdPromotionWrapper textColor={textColor} backgroundColor={backgroundColor}>
      <AdPromotionHed>Advertise with us</AdPromotionHed>
      <AdPromotionDek>Click here to contact us.</AdPromotionDek>
      <Advertise metadata={metadata} label="Advertise" />
    </AdPromotionWrapper>
  );
}
