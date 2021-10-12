import tw, { styled } from 'twin.macro';
import NewsletterSubscribe from './NewsletterSubscribe';
import Colors from '../common/Colors';
import Typography from '../common/Typography';
import { determineTextColor } from '../../lib/utils';
import { useEffect, useState } from 'react';

const NewsletterWrapper = styled.div(({ textColor, backgroundColor }) => ({
  ...tw`bg-gray-200 mb-8 pt-7 px-4 pb-8 md:sticky md:top-10`,
  backgroundColor: backgroundColor,
  color: textColor,
}));

const NewsletterHed = styled.h4(({ meta }) => ({
  ...tw`text-2xl font-bold tracking-tight leading-5 mb-2`,
  fontFamily: Typography[meta.theme || 'styleone'].PromotionBlockHed,
}));
const NewsletterDek = styled.div(({ meta }) => ({
  ...tw`mb-6`,
  fontFamily: Typography[meta.theme || 'styleone'].PromotionBlockDek,
}));

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
      <NewsletterHed meta={metadata}>{metadata.newsletterHed}</NewsletterHed>
      <NewsletterDek
        meta={metadata}
        dangerouslySetInnerHTML={{ __html: metadata.newsletterDek }}
      />
      <br />
      <NewsletterSubscribe metadata={metadata} articleTitle={headline} />
    </NewsletterWrapper>
  );
}
