import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  renderDate,
  renderAuthors,
  hasuraLocaliseText,
} from '../../lib/utils.js';

export default function ArticleLink({ article, isAmp, showCategory }) {
  let mainImage = null;
  let mainImageNode;

  let headline = hasuraLocaliseText(article.article_translations, 'headline');

  let categoryTitle;

  if (article.category && article.category.category_translations) {
    categoryTitle = hasuraLocaliseText(
      article.category.category_translations,
      'title'
    );
  }

  let articleContent = hasuraLocaliseText(
    article.article_translations,
    'content'
  );
  if (
    articleContent !== null &&
    articleContent !== undefined &&
    typeof articleContent !== 'string'
  ) {
    try {
      mainImageNode = articleContent.find((node) => node.type === 'mainImage');
    } catch (e) {
      console.log(
        article.id,
        headline,
        'error finding main image:',
        e,
        articleContent
      );
    }
  }

  if (mainImageNode) {
    mainImage = mainImageNode.children[0];
  }

  let firstPublishedAt;
  if (
    article.article_translations &&
    article.article_translations[0] &&
    article.article_translations[0].first_published_at !== null
  ) {
    firstPublishedAt = article.article_translations[0].first_published_at;
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
          {headline && (
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
            <span>{renderDate(firstPublishedAt, false)}</span>
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
