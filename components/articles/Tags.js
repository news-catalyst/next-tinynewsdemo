import Link from 'next/link';
import { localiseText } from '../../lib/utils.js';

export default function Tags({ article, locale }) {
  let tagLinks;
  if (article.tags) {
    tagLinks = article.tags.map((tag, index) => (
      <Link href={`/tags/${tag.slug}`} key={`${tag.slug}-${index}`}>
        <a className="is-link tag">{localiseText(locale, tag.title)}</a>
      </Link>
    ));
  }
  return (
    <aside>
      <section className="section" key="sidebar">
        <div className="align-content">
          {tagLinks && <p className="subtitle">Tags</p>}
          <div className="tags">{tagLinks}</div>
        </div>
      </section>
    </aside>
  );
}
