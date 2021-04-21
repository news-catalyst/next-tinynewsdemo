import tw from 'twin.macro';
import MailchimpSubscribe from './MailchimpSubscribe';

const NewsletterWrapper = tw.div`bg-gray-200 mb-8 pt-7 px-4 pb-8 md:sticky md:top-10`;
const NewsletterHed = tw.h4`text-2xl font-bold tracking-tight leading-5 mb-2`;
const NewsletterDek = tw.p`mb-6`;

export default function NewsletterBlock({ metadata, headline }) {
  return (
    <NewsletterWrapper>
      <NewsletterHed>{metadata.newsletterHed}</NewsletterHed>
      <NewsletterDek>{metadata.newsletterDek}</NewsletterDek>
      <br />
      <MailchimpSubscribe articleTitle={headline} />
    </NewsletterWrapper>
  );
}
