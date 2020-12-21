import Link from 'next/link';
import { renderAuthors } from '../../lib/utils.js';

export default function ArticleFooter({ article, isAmp }) {
  let tagLinks;
  if (article.tags) {
    tagLinks = article.tags.map((tag) => (
      <li key={tag.slug}>
        <Link href={`/tags/${tag.slug}`}>
          <a className="is-link tag">{tag.title.values[0].value}</a>
        </Link>
      </li>
    ));
  }

  return (
    <div className="section post__meta post__meta--bottom">
      <div className="section__container">
        <div className="post__byline">
          <div className="post__author">
            <div className="post__author-avatar">
              <figure>
                <a className="content" href="#">
                  {isAmp ? (
                    <amp-img
                      width={41}
                      height={41}
                      src="4ab3c1806d4d17cc6670d111a4bbd8d7.jpg"
                      alt="author"
                      layout="responsive"
                    />
                  ) : (
                    <img src="4ab3c1806d4d17cc6670d111a4bbd8d7.jpg" />
                  )}
                </a>
              </figure>
            </div>
            <div className="post__author-meta">By {renderAuthors(article)}</div>
          </div>
        </div>
        <div className="post__tags">
          {tagLinks && <div className="subtitle">Read more:</div>}
          <ul className="tags">{tagLinks}</ul>
        </div>
      </div>
    </div>
  );
}
