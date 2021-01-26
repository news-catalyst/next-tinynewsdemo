import MailchimpSubscribe from './MailchimpSubscribe';

export default function NewsletterBlock({ metadata, headline }) {
  return (
    <div className="block">
      <div className="newsletter">
        <h4>{metadata.newsletterHed}</h4>
        <p>{metadata.newsletterDek}</p>
        <br />
        <MailchimpSubscribe articleTitle={headline} />
      </div>
    </div>
  );
}
