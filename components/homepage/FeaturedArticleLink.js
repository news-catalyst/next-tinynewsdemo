import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { renderDate, renderAuthors } from '../../lib/utils.js';

export default function FeaturedArticleLink({ article, isAmp }) {
  let mainImage = null;
  let mainImageNode = null;

  let headline =
    article.headline && article.headline.values
      ? article.headline.values[0].value
      : article.headline;
  let searchDescription =
    article.searchDescription && article.searchDescription.values
      ? article.searchDescription.values[0].value
      : article.searchDescription;

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
          By&nbsp;{renderAuthors(article)}
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
