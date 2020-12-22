import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { localiseText, renderDate, renderAuthors } from '../../lib/utils.js';

export default function ArticleLink({ locale, article, isAmp }) {
  let mainImage = null;
  let mainImageNode;

  let headline = localiseText(locale, article.headline);

  console.log('locale:', locale, 'article.headline:', article.headline);
  console.log('search description:', article.searchDescription);
  let searchDescription = localiseText(locale, article.searchDescription);

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
          {article.category && (
            <Link
              key={article.category.title.values[0].value}
              href={`/${article.category.slug}`}
            >
              <a>{article.category.title.values[0].value}</a>
            </Link>
          )}
        </span>
        <h4 className="asset__title">
          {article.category && (
            <Link
              href="/articles/[category]/[slug]"
              as={`/articles/${article.category.slug}/${article.slug}`}
            >
              <a>{article.headline.values[0].value}</a>
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
