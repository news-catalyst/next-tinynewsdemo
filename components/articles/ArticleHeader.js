import Link from 'next/link';
import PublishDate from './PublishDate.js';
import { localiseText } from '../../lib/utils.js';

export default function ArticleHeader({ article, locale }) {
  let categoryTitle = localiseText(locale, article.category.title);
  let headline = localiseText(locale, article.headline);

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
