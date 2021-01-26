import NewsletterBlock from '../plugins/NewsletterBlock';
import ArticleLink from './ArticleLink';
import ExpandedTextWithImageAd from '../ads/ExpandedTextWithImageAd';

export default function ArticleStream({
  articles,
  sections,
  showCategory,
  isAmp,
  title,
  locale,
  metadata,
  ads,
}) {
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
              articles.map((streamArticle, i) => {
                if (i > 0 && i % 1 === 0) {
                  const articleLink = (
                    <ArticleLink
                      key={streamArticle.id}
                      article={streamArticle}
                      amp={isAmp}
                      locale={locale}
                      showCategory={showCategory}
                    />
                  );
                  const ad = ads[0];
                  return (
                    <>
                      <li className="asset">
                        <ExpandedTextWithImageAd
                          ad={{
                            brand: ad.promoterDisplayName,
                            image: {
                              url: ad.promoterImage,
                              alt: ad.promoterImageAlternativeText,
                            },
                            header: ad.heading,
                            body: ad.content,
                            call: ad.callToAction,
                            url: ad.callToActionUrl,
                          }}
                          isAmp={isAmp}
                        />
                      </li>
                      {articleLink}
                    </>
                  );
                } else {
                  return (
                    <ArticleLink
                      key={streamArticle.id}
                      article={streamArticle}
                      amp={isAmp}
                      locale={locale}
                      showCategory={showCategory}
                    />
                  );
                }
              })}
          </ul>
        </div>
        <NewsletterBlock metadata={metadata} headline={'Home'} />
      </div>
    </section>
  );
}
