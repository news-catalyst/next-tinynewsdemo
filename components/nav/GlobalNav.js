import React from 'react';
import Link from 'next/link';

export default function GlobalNav({ metadata, sections }) {
  let sectionLinks;

  if (sections) {
    sectionLinks = sections.slice(0, 4).map((section) => (
      <Link key={`navbar-${section.slug}`} href={`/${section.slug}`}>
        <a className="navbar-item">{section.title.values[0].value}</a>
      </Link>
    ));
  }

  let title;
  if (metadata) {
    title = metadata['homepageTitle'];
  }

  return (
    <section className="hero is-bold">
      <div className="hero-body">
        <div className="container">
          <Link key="navbar-home" href="/" as="/">
            <a>
              <h1 className="title is-1 has-text-centered">{title}</h1>
            </a>
          </Link>
          <nav
            className="navbar"
            role="navigation"
            aria-label="main navigation"
          >
            <div className="navbar-brand">
              <div className="navbar-start">{sectionLinks}</div>
            </div>
          </nav>
        </div>
      </div>
    </section>
  );
}
