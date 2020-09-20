import React from 'react';
import Link from 'next/link';
import { renderDate, renderAuthors } from '../../lib/utils.js';

export default function ArticleLink({ article, isAmp }) {
  let mainImage = null;

  const mainImageNode = article.content.find(
    (node) => node.type === 'mainImage'
  );

  if (mainImageNode) {
    mainImage = mainImageNode.children[0];
  }

  return (
    <article className="media">
      {mainImage && (
        <figure className="media-left">
          <p className="image article-link-img">
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
        </figure>
      )}
      <div className="media-content small-margin-left">
        <div className="content">
          <h1 className="title">
            <Link
              href="/articles/[category]/[slug]"
              as={`/articles/${article.category.slug}/${article.slug}`}
            >
              <a>{article.headline}</a>
            </Link>
          </h1>
          <p>{renderAuthors(article)}</p>
          <p>{renderDate(article.firstPublishedOn, false)}</p>
          <p>{article.searchDescription}</p>
        </div>
        <nav className="level is-mobile">
          <div className="level-left">
            <a className="level-item">
              <span className="icon is-small">
                <i className="fas fa-reply"></i>
              </span>
            </a>
            <a className="level-item">
              <span className="icon is-small">
                <i className="fas fa-retweet"></i>
              </span>
            </a>
            <a className="level-item">
              <span className="icon is-small">
                <i className="fas fa-heart"></i>
              </span>
            </a>
          </div>
        </nav>
      </div>
    </article>
  );
}
