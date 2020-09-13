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
      <div className="media-left">
        <h1 className="title">
          <Link
            href="/articles/[category]/[slug]"
            as={`/articles/${article.category.slug}/${article.slug}`}
          >
            <a className="featured">{article.headline}</a>
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
    </article>
  );
}
