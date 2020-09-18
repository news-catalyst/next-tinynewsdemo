import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { useAmp } from 'next/amp';
import { siteMetadata } from '../../lib/siteMetadata.js';
import Layout from '../Layout.js';
import FeaturedArticleLink from './FeaturedArticleLink.js';
import ArticleLink from './ArticleLink.js';
import GlobalNav from '../nav/GlobalNav.js';
import GlobalFooter from '../nav/GlobalFooter';
import FeaturedSidebar from './FeaturedSidebar';
import ModalArticleSearch from '../tinycms/ModalArticleSearch';

export default function BigFeaturedStory(props) {
  const [isModalActive, setModal] = useState(false);

  const [streamArticles, setStreamArticles] = useState(
    props.articles['stream']
  );

  const isAmp = useAmp();

  // I noticed that `streamArticles` were null or undefined on occasional page loads
  // using this hook seems to fix the load order issue; the useState calls could probably
  // default to `useState(null)` but I figured I'd leave them as-is.
  useEffect(() => {
    props.setFeaturedArticle(props.articles['featured']);
    setStreamArticles(props.articles['stream']);
  }, [props.articles]);

  const tagLinks = props.tags.map((tag) => (
    <Link key={tag.title} href={`/tags/${tag.slug}`}>
      <a className="panel-block is-active">{tag.title}</a>
    </Link>
  ));

  return (
    <div className="homepage">
      <Layout meta={siteMetadata}>
        <GlobalNav
          metadata={siteMetadata}
          tags={props.tags}
          sections={props.sections}
        />
        <div className="featured-article">
          <div className="columns">
            <div className="column is-two-thirds">
              {props.editable && props.featuredArticle && (
                <>
                  <ModalArticleSearch
                    apiUrl={props.apiUrl}
                    apiToken={props.apiToken}
                    isActive={isModalActive}
                    setModal={setModal}
                    setFeaturedArticle={props.setFeaturedArticle}
                  />

                  <button
                    className="button is-info"
                    onClick={() => setModal(true)}
                  >
                    Change Featured Article
                  </button>
                  <div id="featuredArticle">
                    {props.featuredArticle && (
                      <FeaturedArticleLink
                        key={props.featuredArticle.id}
                        article={props.featuredArticle}
                        amp={isAmp}
                      />
                    )}
                  </div>
                </>
              )}
              {!props.editable && props.featuredArticle && (
                <FeaturedArticleLink
                  key={props.featuredArticle.id}
                  article={props.featuredArticle}
                  amp={isAmp}
                />
              )}
            </div>
            <div className="column is-one-third">
              <FeaturedSidebar />
            </div>
          </div>
        </div>
        <section className="section">
          <div className="columns">
            <div className="column is-three-quarters">
              {streamArticles &&
                streamArticles.map((streamArticle) => (
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
      <GlobalFooter post_type="home" />
    </div>
  );
}
