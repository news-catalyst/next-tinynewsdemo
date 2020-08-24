import React from 'react';
import Link from 'next/link';
import { parseISO } from 'date-fns';

export default function ArticleCard(props) {
  let mainImage = null;
  let parsedContent = [];
  try {
    if (typeof props.article.content === 'string') {
      parsedContent = JSON.parse(props.article.content);
    } else if (typeof props.article.content !== 'undefined') {
      // assuming it was parsed elsewhere? confusing.
      parsedContent = props.article.content;
    }
  } catch (e) {
    console.log('error parsing JSON: ', e);
  }

  const mainImageNode = parsedContent.find((node) => node.type === 'mainImage');

  var Dateline = require('dateline');
  let parsedDate = parseISO(props.article.firstPublishedOn);
  let firstPublishedOn =
    Dateline(parsedDate).getAPDate() +
    ' at ' +
    Dateline(parsedDate).getAPTime();

  if (mainImageNode) {
    mainImage = mainImageNode.children[0];
  }
  return (
    <div className="card">
      {mainImage && (
        <div className="card-image">
          <figure className="image is-4by3">
            {props.amp ? (
              <amp-img
                width={mainImage.width}
                height={mainImage.height}
                src={mainImage.imageUrl}
                alt={mainImage.imageAlt}
                layout="responsive"
              />
            ) : (
              <img
                src={mainImage.imageUrl}
                alt={mainImage.imageAlt}
                width={mainImage.width}
                height={mainImage.height}
              />
            )}
          </figure>
        </div>
      )}
      <div className="card-content">
        <div className="content" style={{ padding: '5px' }}>
          <h1 className="title">
            <Link
              href="/articles/[category]/[slug]"
              as={`/articles/${props.article.category.slug}/${props.article.slug}`}
            >
              <a>{props.article.headline}</a>
            </Link>
          </h1>
          <p>{props.article.excerpt}</p>
          <p>{props.article.byline}</p>
          {props.article.firstPublishedOn && <p>{firstPublishedOn}</p>}
        </div>
      </div>
      <footer className="card-footer">
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
      </footer>
    </div>
  );
}
