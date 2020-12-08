import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { localiseText, renderDate, renderAuthors } from '../../lib/utils.js';

export default function ArticleLink({ locale, article, isAmp }) {
  let mainImage = null;
  let mainImageNode;

  let headline = localiseText(locale, article.headline);
  let searchDescription = localiseText(locale, article.searchDescription);
  let categoryTitle = localiseText(locale, article.category.title);

  if (article.content !== null && article.content !== undefined) {
    try {
      mainImageNode = article.content.find((node) => node.type === 'mainImage');
    } catch (e) {
      console.log('error finding main image:', e, article.content);
    }
  }

  if (mainImageNode) {
    mainImage = mainImageNode.children[0];
  }

  return (
    <div className="stream-article">
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
                <Image
                  src={mainImage.imageUrl}
                  width={400}
                  height={234}
                  alt={mainImage.imageAlt}
                  className="image"
                />
              )}
            </p>
          </figure>
        )}
        <div className="media-content small-margin-left article-tease">
          <div className="content">
            <h6 className="is-6">
              {article.category && (
                <span className="category">
                  <Link key={categoryTitle} href={`/${article.category.slug}`}>
                    <a>{categoryTitle}</a>
                  </Link>
                </span>
              )}
              &nbsp;
              <span className="pub-date">
                {renderDate(article.firstPublishedOn, false)}
              </span>
            </h6>
            <h2 className="is-2 article-title">
              {article.category && (
                <Link
                  href="/articles/[category]/[slug]"
                  as={`/articles/${article.category.slug}/${article.slug}`}
                >
                  <a>{headline}</a>
                </Link>
              )}
              {!article.category && headline}
            </h2>
            <p>
              <span>By</span>&nbsp;{renderAuthors(article)}
            </p>
            <p>{searchDescription}</p>
          </div>
        </div>
      </article>
    </div>
  );
}
