import Link from 'next/link';

export default function Tags({ article }) {
  let tagLinks;
  if (article.tags) {
    tagLinks = article.tags.map((tag, index) => (
      <Link href={`/tags/${tag.slug}`} key={`${tag.slug}-${index}`}>
        <a className="is-link tag">{tag.title.values[0].value}</a>
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
