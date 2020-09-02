import _ from 'lodash';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
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

  // I noticed that `streamArticles` were null or undefined on occasional page loads
  // using this hook seems to fix the load order issue; the useState calls could probably
  // default to `useState(null)` but I figured I'd leave them as-is.
  useEffect(() => {
    setFeaturedArticle(props.articles['featured']);
    setStreamArticles(props.articles['stream']);
  }, [props.articles]);

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
