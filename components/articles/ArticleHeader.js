import Link from 'next/link';
import React, { useEffect } from 'react';
import PublishDate from './PublishDate.js';
import MainImage from './MainImage.js';
import { hasuraLocaliseText, renderAuthors } from '../../lib/utils.js';

export default function ArticleHeader({ article, locale, isAmp, metadata }) {
  if (!article) {
    return null;
  }

  let categoryTitle;
  let headline;
  let postUrl;
  let searchDescription;

  if (article && article.category) {
    categoryTitle = hasuraLocaliseText(
      article.category.category_translations,
      'title'
    );
    headline = hasuraLocaliseText(article.article_translations, 'headline');
    postUrl = `${metadata.siteUrl}${article.category.slug}/${article.slug}`;
    searchDescription = hasuraLocaliseText(
      article.article_translations,
      'search_description'
    );
  }

  let authorPhoto;
  if (article && article.author_articles) {
    authorPhoto = article.author_articles[0].author.photoUrl;
  }

  let mainImageNode;
  let mainImage = null;
  let localisedContent = hasuraLocaliseText(
    article.article_translations,
    'content'
  );
  if (localisedContent !== undefined && localisedContent !== null) {
    try {
      mainImageNode = localisedContent.find(
        (node) => node.type === 'mainImage'
      );

      if (mainImageNode) {
        mainImage = mainImageNode.children[0];
      }
    } catch (err) {
      console.log('error finding main image in header: ', err);
    }
  }

  return (
    <section key="title" className="section post__header">
      <div className="section__container">
        <div className="post__descriptor">
          <Link key={categoryTitle} href={`/${article.category.slug}`}>
            {categoryTitle}
          </Link>
        </div>
        <div className="post__title">{headline}</div>
        <div className="post__dek">{searchDescription}</div>
        <PublishDate article={article} />
        <div className="section post__featured-media">
          <figure>
            <div className="media">
              <div className="content">
                {mainImage && <MainImage article={article} isAmp={isAmp} />}
              </div>
            </div>
            <figcaption className="media-caption">
              {mainImage ? mainImage.imageAlt : null}
            </figcaption>
          </figure>
        </div>
        <div className="post__meta post__meta--top">
          <div className="post__byline">
            <div className="post__author">
              <div className="post__author-avatar">
                {authorPhoto && (
                  <figure>
                    <a className="content" href="#">
                      {isAmp ? (
                        <amp-img
                          width={41}
                          height={41}
                          src={authorPhoto}
                          alt="author"
                          layout="responsive"
                        />
                      ) : (
                        <img src={authorPhoto} />
                      )}
                    </a>
                  </figure>
                )}
              </div>
              <div className="post__author-meta">
                By {renderAuthors(article)}
              </div>
            </div>
          </div>
          <div className="post__comment-counter">
            <span className="count">52</span>
            <span className="label">Comments</span>
          </div>
          <div className="post__share top">
            <ul className="post__share share__list">
              <li>
                <a
                  href={`https://facebook.com/sharer.php?display=page&u=${postUrl}`}
                  target="_blank"
                >
                  <span className="share__button facebook">
                    <span>share to facebook</span>
                  </span>
                </a>
              </li>
              <li>
                <a
                  href={`https://twitter.com/intent/tweet?text=${postUrl}`}
                  target="_blank"
                >
                  <span className="share__button twitter">
                    <span>share to twitter</span>
                  </span>
                </a>
              </li>
              <li>
                <a>
                  <span className="share__button more">
                    <span>more</span>
                  </span>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
