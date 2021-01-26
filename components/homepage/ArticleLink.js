import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { localiseText, renderDate, renderAuthors } from '../../lib/utils.js';

export default function ArticleLink({ locale, article, isAmp, showCategory }) {
  let mainImage = null;
  let mainImageNode;

  let headline = localiseText(locale, article.headline);

  let categoryTitle;

  if (article.category && article.category.title) {
    categoryTitle = localiseText(locale, article.category.title);
  }

  if (typeof categoryTitle !== 'string') {
    console.log(
      'category title is not a string:',
      categoryTitle,
      typeof categoryTitle
    );
  }
  if (typeof headline !== 'string') {
    console.log('headline is not a string:', headline, typeof headline);
  }

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
    <li className="asset">
      <div className="asset__meta-container">
        <span className="asset__descriptor">
          {article.category && showCategory && (
            <Link key={categoryTitle} href={`/${article.category.slug}`}>
              <a>{categoryTitle}</a>
            </Link>
          )}
        </span>
        <h4 className="asset__title">
          {article.headline && (
            <Link
              href="/articles/[category]/[slug]"
              as={`/articles/${article.category.slug}/${article.slug}`}
            >
              <a>{headline}</a>
            </Link>
          )}
        </h4>
        <div className="asset__byline">
          By&nbsp;{renderAuthors(article)}&nbsp;
          <time>
            <span>{renderDate(article.firstPublishedOn, false)}</span>
          </time>
        </div>
      </div>
      {mainImage && (
        <figure className="asset__thumbnail">
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
        </figure>
      )}
    </li>
  );
}
