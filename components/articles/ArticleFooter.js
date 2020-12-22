import Link from 'next/link';
import ArticleFooterAuthor from './ArticleFooterAuthor';

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
          {article.authors.map((author) => (
            <ArticleFooterAuthor
              key={author.slug}
              author={author}
              isAmp={isAmp}
            />
          ))}
        </div>
        <div className="post__tags">
          {tagLinks && <div className="subtitle">Read more:</div>}
          <ul className="tags">{tagLinks}</ul>
        </div>
      </div>
    </div>
  );
}
