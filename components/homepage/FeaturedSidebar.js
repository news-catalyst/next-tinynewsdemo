import MailchimpSubscribe from '../plugins/MailchimpSubscribe.js';

export default function FeaturedSidebar() {
  return (
    <>
      <div className="block">
        <h2>Who we are</h2>
        <p>
          We’re journalists for Oaklyn. We amplify community voices, share
          information resources, and investigate systems, not just symptoms.
        </p>
        <a className="block__cta" href="/about">
          Learn more
        </a>
      </div>
      <div className="block">
        <h2>Support our work</h2>
        <p>
          The Oaklyn Observer exists based on the support of our readers. Chip
          in today to help us continue serving Oaklyn with quality journalism.
        </p>
        <a className="block__cta" href="/donate">
          Donate
        </a>
      </div>
    </>
  );
}
