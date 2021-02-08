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
  const AD_PLACEMENT_INDEX = 1;

  const renderArticle = function (article) {
    return (
      <ArticleLink
        key={article.id}
        article={article}
        amp={isAmp}
        locale={locale}
        showCategory={showCategory}
      />
    );
  };

  const renderAd = function (ad) {
    return (
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
    );
  };
  let adIndex = 0;

  const renderSections = typeof sections[0].title === 'string';

  const articleStream = articles.map((article, i) => {
    const streamArticle = renderArticle(article);

    if (i > 0 && i % AD_PLACEMENT_INDEX === 0 && adIndex < ads.length) {
      const ad = renderAd(ads[adIndex]);
      adIndex++;
      return (
        <>
          <li className="asset">{ad}</li>
          {streamArticle}
        </>
      );
    } else {
      return streamArticle;
    }
  });

  return (
    <section className="section section-layout__3">
      <div className="section__container">
        <div className="block">
          <h3 className="block__head">
            <div className="section__title">Topics We Cover</div>
          </h3>
          <ul>
            {renderSections &&
              sections.map((section) => (
                <li key={section.slug}>
                  <a href="#">{section.title}</a>
                </li>
              ))}
          </ul>
        </div>
        <div className="block">
          <h3 className="block__head">
            <div className="section__title">{title}</div>
          </h3>
          <ul className="block__list">{articleStream}</ul>
        </div>
        <NewsletterBlock metadata={metadata} headline={'Home'} />
      </div>
    </section>
  );
}
