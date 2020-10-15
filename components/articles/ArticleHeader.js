import Link from 'next/link';
import PublishDate from './PublishDate.js';

export default function ArticleHeader({ article }) {
  let categoryTitle, headline;
  if (
    article.category &&
    article.category.title &&
    article.category.title.values &&
    article.category.title.values[0] &&
    article.category.title.values[0].value
  ) {
    categoryTitle = article.category.title.values[0].value;
  }
  if (
    article.headline &&
    article.headline.values &&
    article.headline.values[0] &&
    article.headline.values[0].value
  ) {
    headline = article.headline.values[0].value;
  }

  return (
    <section key="title">
      <div className="hero-body">
        <div className={article.cover ? 'container head-margin' : 'container'}>
          <h2 className="subtitle">
            <Link key={categoryTitle} href={`/${article.category.slug}`}>
              {categoryTitle}
            </Link>
          </h2>
          <h1 className="title is-size-1">{headline}</h1>
          <PublishDate article={article} />
        </div>
      </div>
    </section>
  );
}
