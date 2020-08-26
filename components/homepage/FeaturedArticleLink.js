import React from 'react';
import Link from 'next/link';
import { parseISO } from 'date-fns';

export default function FeaturedArticleLink(props) {
  // console.log('FeaturedArticleLink props.article:', props.article);

  let mainImage = null;
  let mainImageNode = null;

  if (props.article && props.article.content) {
    mainImageNode = props.article.content.find(
      (node) => node.type === 'mainImage'
    );

    if (mainImageNode) {
      mainImage = mainImageNode.children[0];
    }
  }

  var Dateline = require('dateline');
  let parsedDate = parseISO(props.article.firstPublishedOn);
  let firstPublishedOn =
    Dateline(parsedDate).getAPDate() +
    ' at ' +
    Dateline(parsedDate).getAPTime();
  return (
    <article>
      {mainImage && (
        <div className="media">
          <p className="image featured-img">
            {props.amp ? (
              <amp-img
                width={mainImage.width}
                height={mainImage.height}
                src={mainImage.imageUrl}
                alt={mainImage.imageAlt}
                layout="responsive"
              />
            ) : (
              <img src={mainImage.imageUrl} />
            )}
          </p>
        </div>
      )}
      <div className="media-left">
        <h1 className="title">
          <Link
            href="/articles/[category]/[slug]"
            as={`/articles/${props.article.category.slug}/${props.article.slug}`}
          >
            <a className="featured">{props.article.headline}</a>
          </Link>
        </h1>
        <p className="featured">{props.article.excerpt}</p>
        <p className="featured">{props.article.byline}</p>
        {props.article.firstPublishedOn && <p>{firstPublishedOn}</p>}
      </div>
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
    </article>
  );
}
