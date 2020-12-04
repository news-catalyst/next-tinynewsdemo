import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { localiseText, renderDate, renderAuthors } from '../../lib/utils.js';

export default function FeaturedArticleLink({ locale, article, isAmp }) {
  let mainImage = null;
  let mainImageNode = null;

  let headline = localiseText(locale, article.headline);
  let searchDescription = localiseText(locale, article.searchDescription);
  let categoryTitle = localiseText(locale, article.category.title);

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
              <Image
                src={mainImage.imageUrl}
                width={1080}
                height={630}
                alt={mainImage.imageAlt}
                className="image"
              />
            )}
          </p>
        </div>
      )}
      <div className="article-tease">
        <div className="content">
          <h6 className="is-6">
            {article.category && (
              <span className="category">
                <Link href="/[slug]" as={article.category.slug}>
                  <a>{categoryTitle}</a>
                </Link>
              </span>
            )}
            &nbsp;
            <span className="pub-date">
              {renderDate(article.firstPublishedOn, false)}
            </span>
          </h6>
          {article.category && (
            <h2 className="is-2 article-title">
              <Link
                href="/articles/[category]/[slug]"
                as={`/articles/${article.category.slug}/${article.slug}`}
              >
                <a className="featured">{headline}</a>
              </Link>
            </h2>
          )}
          {!article.category && (
            <h2 className="is-2 article-title">{headline}</h2>
          )}
          <p>
            <span>By</span>&nbsp;{renderAuthors(article)}
          </p>
          <p>{searchDescription}</p>
        </div>
      </div>
    </article>
  );
}
