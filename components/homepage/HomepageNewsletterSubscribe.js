import MailchimpSubscribe from '../plugins/MailchimpSubscribe.js';

export default function HomepageNewsletterSubscribe() {
  return (
    <div className="sidebar">
      <h3 className="title is-3">Get our newsletter</h3>
      <p>Vital news from your community, every morning, in your inbox.</p>
      <br />
      <MailchimpSubscribe articleTitle="homepage" />
      <hr />
      <h3 className="title is-3">Who we are</h3>
      <p>
        We’re journalists for Oaklyn. We amplify community voices, share
        information resources, and investigate systems, not just symptoms.
      </p>
      <br />
      <p>
        <a className="button" href="/about">
          Learn more
        </a>
      </p>
      <hr />
      <h3 className="title is-3">Support our work</h3>
      <p>
        The Oaklyn Observer exists based on the support of our readers. Chip in
        today to help us continue serving Oaklyn with quality journalism.
      </p>
      <br />
      <p>
        <a className="button" href="/donate">
          Donate
        </a>
      </p>
    </div>
  );
}
