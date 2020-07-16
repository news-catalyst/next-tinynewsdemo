import React from "react"
import _ from 'lodash'
import Link from 'next/link'
// import { parseISO, formatRelative } from 'date-fns'

export default function ArticleLink(props) {
  const mainImageNode = props.article.body.find(node => node.type === "mainImage");
  let mainImage = null;

  if (mainImageNode) {
    mainImage = mainImageNode.children[0];
  }

  // let parsedDate = parseISO(props.document.createdTime)
  return (
    <article>
      {mainImage &&
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
            )
            }
          </p>
        </div>
      }
        <div className="media-left">
          <h1 className="title">
            <Link className="featured" href="/articles/[id]/" as={`/articles/${props.article.id}`}>
              <a>{props.article.headline}</a>
            </Link>
          </h1>
          <p className="featured">{props.article.excerpt}</p>
          <p className="byline featured">{props.article.byline}</p>
          {/* | {formatRelative(parsedDate, new Date())} */}
        </div>
        <nav className="level is-mobile">
          <div className="level-left">
            <a className="level-item">
              <span className="icon is-small"><i className="fas fa-reply"></i></span>
            </a>
            <a className="level-item">
              <span className="icon is-small"><i className="fas fa-retweet"></i></span>
            </a>
            <a className="level-item">
              <span className="icon is-small"><i className="fas fa-heart"></i></span>
            </a>
          </div>
        </nav>
    </article>
  )
}
