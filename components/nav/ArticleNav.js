import React from 'react';
import _ from 'lodash';
import Link from 'next/link';

export default function ArticleNav(props) {
  // let tagLinks
  let sectionLinks;

  if (props.sections) {
    sectionLinks = props.sections.slice(0, 4).map((section) => (
      <Link
        key={`navbar-${_.kebabCase(section.label)}`}
        href={section.link}
        as={section.link}
      >
        <a className="navbar-item">{_.startCase(section.label)}</a>
      </Link>
    ));
  }

  // if (props.tags) {
  //   tagLinks = props.tags.slice(0, 4).map((tag) => (
  //     <Link key={`navbar-${tag}`} href={`/topics/${tag}`} as={`/topics/${tag}`}>
  //       <a className="navbar-item">{_.startCase(tag)}</a>
  //     </Link>
  //   ))
  // }
  return (
    <nav
      className="navbar is-spaced nav-border"
      role="navigation"
      aria-label="main navigation"
    >
      <div className="navbar-brand">
        <a className="navbar-item" href="/">
          {props.metadata.shortName}
        </a>

        <a
          role="button"
          className="navbar-burger burger"
          aria-label="menu"
          aria-expanded="false"
          data-target="navbarBasicExample"
          href="/"
        >
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </a>
      </div>

      <div className="navbar-menu">
        <div className="navbar-start">
          {sectionLinks}

          <a className="navbar-item" href="/topics">
            {props.metadata.nav.topics}
          </a>
        </div>

        <div className="navbar-end">
          <div className="navbar-item">
            <div className="buttons">
              <a className="button logout" href="/tinycms">
                {props.metadata.nav.cms}
              </a>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
