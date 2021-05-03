import tw, { styled } from 'twin.macro';
import MailchimpSubscribe from './MailchimpSubscribe';
import Colors from '../common/Colors';
import { determineTextColor } from '../../lib/utils';
import { useEffect, useState } from 'react';

const NewsletterWrapper = styled.div(({ textColor, backgroundColor }) => ({
  ...tw`bg-gray-200 mb-8 pt-7 px-4 pb-8 md:sticky md:top-10`,
  backgroundColor: backgroundColor,
  color: textColor,
}));

const NewsletterHed = tw.h4`text-2xl font-bold tracking-tight leading-5 mb-2`;
const NewsletterDek = tw.p`mb-6`;

export default function NewsletterBlock({ metadata, headline }) {
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
    <NewsletterWrapper textColor={textColor} backgroundColor={backgroundColor}>
      <NewsletterHed>{metadata.newsletterHed}</NewsletterHed>
      <NewsletterDek>{metadata.newsletterDek}</NewsletterDek>
      <br />
      <MailchimpSubscribe metadata={metadata} articleTitle={headline} />
    </NewsletterWrapper>
  );
}
