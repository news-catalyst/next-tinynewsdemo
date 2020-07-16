import React from "react"
import _ from 'lodash'
import Link from 'next/link'
//import { parseISO, formatRelative } from 'date-fns'

export default function ArticleLink(props) {
  // let parsedDate = parseISO(props.document.createdTime)
  return (
    <article className="media">
      {props.article.cover &&
        <figure className="media-left">
          <p className="image article-link-img">
            {props.amp ? (
              <amp-img
                width={props.article.cover.image.width}
                height={props.article.cover.image.height}
                src={props.article.cover.image.imageUrl}
                alt={props.article.cover.image.imageAlt}
                layout="responsive"
              />
            ) : (
              <img src={props.article.cover.image} />
            )
            }
          </p>
        </figure>
      }
      <div className="media-content small-margin-left">
        <div className="content">
          <h1 className="title">
            <Link href="/articles/[id]/" as={`/articles/${props.article.id}`}>
              <a>{props.article.headline}</a>
            </Link>
          </h1>
          <p>{props.article.excerpt}</p>
          <p className="byline">{props.article.byline}</p>
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
      </div>
    </article>
  )
}
