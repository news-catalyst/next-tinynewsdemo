import _ from 'lodash';
import Link from 'next/link';
import React, { useState } from 'react';
import { useAmp } from 'next/amp';
import { siteMetadata } from '../../lib/siteMetadata.js';
import Layout from '../Layout.js';
import ArticleNav from '../nav/ArticleNav.js';
import FeaturedArticleLink from './FeaturedArticleLink.js';
import ArticleCard from './ArticleCard.js';
import ArticleFooter from '../nav/ArticleFooter.js';

export const config = { amp: 'hybrid' };

export default function LargePackageStoryLead(props) {
  const isAmp = useAmp();

  const [featuredArticle, setFeaturedArticle] = useState(
    props.articles['featured']
  );

  const [subfeaturedLeftArticle, setSubFeaturedLeftArticle] = useState(
    props.articles['subfeatured-left']
  );
  const [subfeaturedMiddleArticle, setSubFeaturedMiddleArticle] = useState(
    props.articles['subfeatured-middle']
  );
  const [subfeaturedRightArticle, setSubFeaturedRightArticle] = useState(
    props.articles['subfeatured-right']
  );

  const tagLinks = props.tags.map((tag) => (
    <Link key={tag.title} href={`/tags/${tag.title}`}>
      <a className="panel-block is-active">{_.startCase(tag.title)}</a>
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
            <div className="column is-one-third">
              {subfeaturedLeftArticle && (
                <ArticleCard
                  key={subfeaturedLeftArticle.id}
                  article={subfeaturedLeftArticle}
                  amp={isAmp}
                />
              )}
            </div>
            <div className="column is-one-third">
              {subfeaturedMiddleArticle && (
                <ArticleCard
                  key={subfeaturedMiddleArticle.id}
                  article={subfeaturedMiddleArticle}
                  amp={isAmp}
                />
              )}
            </div>
            <div className="column is-one-third">
              {subfeaturedRightArticle && (
                <ArticleCard
                  key={subfeaturedRightArticle.id}
                  article={subfeaturedRightArticle}
                  amp={isAmp}
                />
              )}
            </div>
          </div>
        </section>
      </Layout>
      <ArticleFooter post_type="home" metadata={siteMetadata} />
    </div>
  );
}
