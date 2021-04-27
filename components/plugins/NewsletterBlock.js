import tw, { styled } from 'twin.macro';
import MailchimpSubscribe from './MailchimpSubscribe';
import Colors from '../common/Colors';
import { determineTextColor } from '../../lib/utils';

const NewsletterWrapper = styled.div(({ meta }) => ({
  ...tw`bg-gray-200 mb-8 pt-7 px-4 pb-8 md:sticky md:top-10`,
  backgroundColor:
    meta.color === 'custom'
      ? meta.primaryColor
      : Colors[meta.color].PromoBlockBackground,
  color:
    meta.color === 'custom'
      ? determineTextColor(meta.primaryColor)
      : Colors[meta.color].PromoBlockText,
}));

const NewsletterHed = tw.h4`text-2xl font-bold tracking-tight leading-5 mb-2`;
const NewsletterDek = tw.p`mb-6`;

export default function NewsletterBlock({ metadata, headline }) {
  return (
    <NewsletterWrapper meta={metadata}>
      <NewsletterHed>{metadata.newsletterHed}</NewsletterHed>
      <NewsletterDek>{metadata.newsletterDek}</NewsletterDek>
      <br />
      <MailchimpSubscribe metadata={metadata} articleTitle={headline} />
    </NewsletterWrapper>
  );
}
