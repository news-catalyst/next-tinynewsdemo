import Link from 'next/link';
import PublishDate from './PublishDate.js';

export default function ArticleHeader({ article }) {
  return (
    <section className="hero is-bold" key="title">
      <div className="hero-body">
        <div className={article.cover ? 'container head-margin' : 'container'}>
          <h2 className="subtitle">
            <Link
              key={article.category.title}
              href={`/${article.category.slug}`}
            >
              {article.category.title}
            </Link>
          </h2>
          <h1 className="title is-size-1">{article.headline}</h1>
          <PublishDate article={article} />
        </div>
      </div>
    </section>
  );
}
