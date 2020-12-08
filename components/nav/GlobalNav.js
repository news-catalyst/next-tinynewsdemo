import React from 'react';
import Link from 'next/link';
import { siteMetadata } from '../../lib/siteMetadata.js';

export default function GlobalNav({ sections }) {
  let sectionLinks;

  if (sections) {
    sectionLinks = sections.slice(0, 4).map((section) => (
      <Link key={`navbar-${section.slug}`} href={`/${section.slug}`}>
        <a>{section.title.values[0].value}</a>
      </Link>
    ));
  }

  return (
    <header className="site__header">
      <div className="section__container">
        <h1 className="site__logo">{siteMetadata.homepageTitle}</h1>
        <nav>{sectionLinks}</nav>
        <button className="site__cta">Donate</button>
      </div>
    </header>
  );
}
