import React from 'react';
import Link from 'next/link';

export default function GlobalNav({ metadata, sections }) {
  let sectionLinks;

  if (sections && typeof sections[0].title === 'string') {
    sectionLinks = sections.slice(0, 4).map((section) => (
      <Link key={`navbar-${section.slug}`} href={`/${section.slug}`}>
        <a>{section.title}</a>
      </Link>
    ));
  }

  let title;
  if (metadata) {
    title = metadata['homepageTitle'];
  }

  return (
    <header className="site__header">
      <div className="section__container">
        <Link href="/">
          <a>
            <h1 className="site__logo">{title}</h1>
          </a>
        </Link>
        <nav>{sectionLinks}</nav>
        <button className="site__cta">{metadata.supportCTA}</button>
      </div>
    </header>
  );
}
