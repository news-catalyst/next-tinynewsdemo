import React from 'react';
import Link from 'next/link';
import { renderDate, renderAuthors } from '../../lib/utils.js';

export default function FeaturedArticleLink({ article, isAmp }) {
  let mainImage = null;
  let mainImageNode = null;

  if (article && article.content) {
    mainImageNode = article.content.find((node) => node.type === 'mainImage');

    if (mainImageNode) {
      mainImage = mainImageNode.children[0];
    }
  }

  return (
    <article>
      {mainImage && (
        <div className="media">
          <p className="image featured-img">
            {isAmp ? (
              <amp-img
                width={mainImage.width}
                height={mainImage.height}
                src={mainImage.imageUrl}
                alt={mainImage.imageAlt}
                layout="responsive"
              />
            ) : (
              <img src={mainImage.imageUrl} />
            )}
          </p>
        </div>
      )}
      <div className="article-tease">
        <div className="content">
          <h6 className="is-6">
            <span className="category">
              <Link href="/[slug]" as={article.category.slug}>
                <a>{article.category.title}</a>
              </Link>
            </span>
            &nbsp;
            <span className="pub-date">
              {renderDate(article.firstPublishedOn, false)}
            </span>
          </h6>
          <h2 className="is-2 article-title">
            <Link
              href="/articles/[category]/[slug]"
              as={`/articles/${article.category.slug}/${article.slug}`}
            >
              <a className="featured">{article.headline}</a>
            </Link>
          </h2>
          <p>
            <span>By</span>&nbsp;{renderAuthors(article)}
          </p>
          <p>{article.searchDescription}</p>
        </div>
      </div>
    </article>
  );
}
