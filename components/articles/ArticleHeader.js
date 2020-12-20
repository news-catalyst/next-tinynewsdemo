import Link from 'next/link';
import React, { useEffect } from 'react';
import PublishDate from './PublishDate.js';
import { localiseText } from '../../lib/utils.js';

export default function ArticleHeader({ article, locale }) {
  let categoryTitle;
  let headline;

  if (article && article.category) {
    categoryTitle = localiseText(locale, article.category.title);
    headline = localiseText(locale, article.headline);
  }

  if (!article) {
    return null;
  }

  return (
    <section key="title">
      <div className="hero-body">
        <div className={article.cover ? 'container head-margin' : 'container'}>
          <h2 className="subtitle">
            {categoryTitle && (
              <Link key={categoryTitle} href={`/${article.category.slug}`}>
                {categoryTitle}
              </Link>
            )}
          </h2>
          {headline && <h1 className="title is-size-1">{headline}</h1>}
          <PublishDate article={article} />
        </div>
      </div>
    </section>
  );
}
