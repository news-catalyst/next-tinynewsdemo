import MailchimpSubscribe from './MailchimpSubscribe';

export default function NewsletterBlock({ metadata, headline, wrap = true }) {
  const block = (
    <div className={`newsletter ${!wrap && 'block'}`}>
      <h4>{metadata.newsletterHed}</h4>
      <p>{metadata.newsletterDek}</p>
      <br />
      <MailchimpSubscribe articleTitle={headline} />
    </div>
  );

  return wrap ? <div className="block">{block}</div> : block;
}
