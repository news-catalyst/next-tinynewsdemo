import React from 'react';
import Link from 'next/link';
import { renderAuthors, renderDate } from '../../lib/utils.js';

export default function ArticleCard({ article, isAmp }) {
  let mainImage = null;
  const mainImageNode = article.content.find(
    (node) => node.type === 'mainImage'
  );
  if (mainImageNode) {
    mainImage = mainImageNode.children[0];
  }
  return (
    <div className="card">
      {mainImage && (
        <div className="card-image">
          <figure className="image is-4by3">
            {isAmp ? (
              <amp-img
                width={mainImage.width}
                height={mainImage.height}
                src={mainImage.imageUrl}
                alt={mainImage.imageAlt}
                layout="responsive"
              />
            ) : (
              <img
                src={mainImage.imageUrl}
                alt={mainImage.imageAlt}
                width={mainImage.width}
                height={mainImage.height}
              />
            )}
          </figure>
        </div>
      )}
      <div className="card-content">
        <div className="content" style={{ padding: '5px' }}>
          <h1 className="title">
            <Link
              href="/articles/[category]/[slug]"
              as={`/articles/${article.category.slug}/${article.slug}`}
            >
              <a>{article.headline.values[0].value}</a>
            </Link>
          </h1>
          <p>{renderAuthors(article)}</p>
          <p>{renderDate(article.firstPublishedOn, false)}</p>
        </div>
      </div>
      <footer className="card-footer">
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
      </footer>
    </div>
  );
}
