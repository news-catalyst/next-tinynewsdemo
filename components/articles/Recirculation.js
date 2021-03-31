import ArticleLink from '../homepage/ArticleLink';
import { hasuraLocaliseText } from '../../lib/utils.js';

export default function Recirculation({
  articles,
  isAmp,
  siteMetadata,
  section,
}) {
  if (articles === null || articles === undefined || articles.length <= 0) {
    return null;
  }
  const localisedSection = hasuraLocaliseText(
    section.category_translations,
    'title'
  );

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
                showCategory={false}
                isAmp={isAmp}
              />
            ))}
        </ul>
      </div>
    </section>
  );
}
