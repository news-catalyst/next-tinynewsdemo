import _ from 'lodash';
import Link from 'next/link';
import React, { useState } from 'react';
import { useAmp } from 'next/amp';
import { siteMetadata } from '../../lib/siteMetadata.js';
import Layout from '../Layout.js';
import ArticleNav from '../nav/ArticleNav.js';
import FeaturedArticleLink from './FeaturedArticleLink.js';
import ArticleLink from './ArticleLink.js';
import ArticleFooter from '../nav/ArticleFooter.js';

export default function BigFeaturedStory(props) {
  const [featuredArticle, setFeaturedArticle] = useState(
    props.articles['featured']
  );
  const [streamArticles, setStreamArticles] = useState(
    props.articles['stream']
  );

  const isAmp = useAmp();

  const tagLinks = props.tags.map((tag) => (
    <Link key={tag.title} href={`/tags/${tag.slug}`}>
      <a className="panel-block is-active">{tag.title}</a>
    </Link>
  ));

  return (
    <div className="homepage">
      <ArticleNav
        metadata={siteMetadata}
        tags={props.tags}
        sections={props.sections}
      />
      <Layout meta={siteMetadata}>
        <section className="hero is-dark is-bold">
          <div className="hero-body">
            <div className="container">
              <h1 className="title">{siteMetadata.homepageTitle}</h1>
              <h2 className="subtitle">{siteMetadata.homepageSubtitle}</h2>
            </div>
          </div>
        </section>
        <div className="featured-article">
          {featuredArticle && (
            <FeaturedArticleLink
              key={featuredArticle.id}
              article={featuredArticle}
              amp={isAmp}
            />
          )}
        </div>
        <section className="section">
          <div className="columns">
            <div className="column is-four-fifths">
              {streamArticles.map((streamArticle) => (
                <ArticleLink
                  key={streamArticle.id}
                  article={streamArticle}
                  amp={isAmp}
                />
              ))}
            </div>
            <div className="column">
              <nav className="panel">
                <p className="panel-heading">{siteMetadata.labels.topics}</p>
                {tagLinks}
              </nav>
            </div>
          </div>
        </section>
      </Layout>
      <ArticleFooter post_type="home" metadata={siteMetadata} />
    </div>
  );
}
