import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { localiseText, renderDate, renderAuthors } from '../../lib/utils.js';

export default function FeaturedArticleLink({ locale, article, isAmp }) {
  let mainImage = null;
  let mainImageNode = null;

  if (article === null || article === undefined || !article) {
    console.log('FeaturedArticleLink missing article:', article);
  }

  let headline = localiseText(locale, article.headline);
  let searchDescription = localiseText(locale, article.searchDescription);

  let categoryTitle;

  if (article.category && article.category.title) {
    categoryTitle = localiseText(locale, article.category.title);
  }

  if (article && article.content) {
    mainImageNode = article.content.find((node) => node.type === 'mainImage');

    if (mainImageNode) {
      mainImage = mainImageNode.children[0];
    }
  }

  return (
    <>
      <div className="asset__meta-container">
        {article.category && (
          <span className="asset__descriptor">
            <Link href="/[slug]" as={article.category.slug}>
              <a>{article.category.title.values[0].value}</a>
            </Link>
          </span>
        )}
        &nbsp;
        {article.category && (
          <h4 className="asset__title">
            <Link
              href="/articles/[category]/[slug]"
              as={`/articles/${article.category.slug}/${article.slug}`}
            >
              <a className="featured">{headline}</a>
            </Link>
          </h4>
        )}
        <div className="asset__excerpt">{searchDescription}</div>
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
              width={1080}
              height={630}
              alt={mainImage.imageAlt}
              className="image"
            />
          )}
        </figure>
      )}
    </>
  );
}
