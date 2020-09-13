import { siteMetadata } from '../../lib/siteMetadata.js';
import MailchimpSubscribe from '../plugins/MailchimpSubscribe.js';
import Coral from '../plugins/Coral.js';

export default function ArticleFooter({ article, isAmp }) {
  return (
    <section className="section" key="plugins">
      <div className="align-content medium-margin-top">
        <div className="newsletter-subscribe">
          <h3 className="title is-3">Get our newsletter</h3>
          <p>Vital news from your community, every morning, in your inbox.</p>
          <br />
          <MailchimpSubscribe articleTitle={article.headline} />
        </div>
        <div className="comments">
          {isAmp ? (
            <div>Coral AMP</div>
          ) : (
            <Coral storyURL={`/articles/${article.id}`} />
          )}
        </div>
      </div>
    </section>
  );
}
