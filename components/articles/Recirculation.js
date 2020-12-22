import ArticleLink from '../homepage/ArticleLink';
import { localiseText } from '../../lib/utils.js';

export default function Recirculation({
  articles,
  isAmp,
  locale,
  siteMetadata,
  section,
}) {
  const localisedSection = localiseText(locale, section.title);

  return (
    <section className="section post__recirculation">
      <div className="section__container">
        <h3 className="section__title">
          More in {localisedSection} from {siteMetadata.shortName}
        </h3>
        <ul className="block__list">
          {articles &&
            articles.map((streamArticle) => (
              <ArticleLink
                key={streamArticle.id}
                article={streamArticle}
                amp={isAmp}
                locale={locale}
              />
            ))}
        </ul>
      </div>
    </section>
  );
}
