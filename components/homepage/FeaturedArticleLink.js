import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { renderDate, renderAuthors } from '../../lib/utils.js';

export default function FeaturedArticleLink({ article, isAmp }) {
  let mainImage = null;
  let mainImageNode = null;

  if (article === null || article === undefined || !article) {
    console.log('FeaturedArticleLink missing article:', article);
  }
  const translation = article['article_translations'][0];

  try {
    if (typeof translation.content === 'string') {
      mainImageNode = JSON.parse(translation.content).find(
        (node) => node.type === 'mainImage'
      );
    } else {
      mainImageNode = translation.content.find(
        (node) => node.type === 'mainImage'
      );
    }
  } catch (err) {
    console.error(err, typeof translation.content);
  }

  try {
    if (mainImageNode) {
      mainImage = mainImageNode.children[0];
    }
  } catch (err) {
    console.error(err);
  }

  return (
    <>
      <div className="asset__meta-container">
        {article.category && (
          <span className="asset__descriptor">
            <Link href={`/${article.category.slug}`}>
              <a>{article.category['category_translations'][0].title}</a>
            </Link>
          </span>
        )}
        {article.category && (
          <h4 className="asset__title">
            <Link href={`/articles/${article.category.slug}/${article.slug}`}>
              <a className="featured">{translation.headline}</a>
            </Link>
          </h4>
        )}
        <div className="asset__excerpt">{translation.searchDescription}</div>
        <div className="asset__byline">
          By&nbsp;{renderAuthors(article)}&nbsp;
          <time>
            <span>{renderDate(translation.firstPublishedOn, false)}</span>
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
