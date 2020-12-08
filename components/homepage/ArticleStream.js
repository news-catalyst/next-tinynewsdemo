import MailchimpSubscribe from '../plugins/MailchimpSubscribe';
import ArticleLink from './ArticleLink';

export default function ArticleStream({ articles, sections, isAmp, title }) {
  console.log(sections);
  return (
    <section className="section section-layout__3">
      <div className="section__container">
        <div className="block">
          <h3 className="block__head">
            <div className="section__title">Topics We Cover</div>
          </h3>
          <ul>
            {sections.map((section) => (
              <li key={section.slug}>
                <a href="#">{section.title.values[0].value}</a>
              </li>
            ))}
          </ul>
        </div>
        <div className="block">
          <h3 className="block__head">
            <div className="section__title">{title}</div>
          </h3>
          <ul className="block__list">
            {articles &&
              articles.map((streamArticle) => (
                <ArticleLink
                  key={streamArticle.id}
                  article={streamArticle}
                  amp={isAmp}
                />
              ))}
          </ul>
        </div>
        <div className="block">
          <div className="newsletter">
            <h4>Get our newsletter</h4>
            <p>Vital news from your community, every morning, in your inbox.</p>
            <MailchimpSubscribe />
          </div>
        </div>
      </div>
    </section>
  );
}
