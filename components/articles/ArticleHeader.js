import Link from 'next/link';
import PublishDate from './PublishDate.js';
import MainImage from './MainImage.js';
import { renderAuthors } from '../../lib/utils.js';

export default function ArticleHeader({ article, isAmp }) {
  let categoryTitle, headline;
  if (
    article.category &&
    article.category.title &&
    article.category.title.values &&
    article.category.title.values[0] &&
    article.category.title.values[0].value
  ) {
    categoryTitle = article.category.title.values[0].value;
  }
  if (
    article.headline &&
    article.headline.values &&
    article.headline.values[0] &&
    article.headline.values[0].value
  ) {
    headline = article.headline.values[0].value;
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
        <div className="post__dek">
          {article.searchDescription.values[0].value}
        </div>
        <PublishDate article={article} />
        <div className="section post__featured-media">
          <figure>
            <div className="media">
              <div className="content">
                <MainImage article={article} isAmp={isAmp} />
              </div>
            </div>
            <span className="media-credit">Getty Images</span>
            <figcaption className="media-caption">Caption</figcaption>
          </figure>
        </div>
        <div className="post__meta post__meta--top">
          <div className="post__byline">
            <div className="post__author">
              <div className="post__author-avatar">
                <figure>
                  <a className="content" href="#">
                    <img src="4ab3c1806d4d17cc6670d111a4bbd8d7.jpg" />
                  </a>
                </figure>
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
                <a>
                  <span className="share__button facebook">
                    <span>share to facebook</span>
                  </span>
                </a>
              </li>
              <li>
                <a>
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
