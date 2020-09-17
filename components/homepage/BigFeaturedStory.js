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

import { makeFeaturedArticle, publishLayout } from '../../lib/articles.js';

export default function BigFeaturedStory(props) {
  const [isModalActive, setModal] = useState(false);

  const [featuredArticle, setFeaturedArticle] = useState(
    props.articles['featured']
  );
  const [streamArticles, setStreamArticles] = useState(
    props.articles['stream']
  );

  const isAmp = useAmp();

  // TODO: change this function to "saveAndPublishLayoutData"
  // NOTE: this should be called after confirming
  // 1. save a new layout data record in webiny
  // 2. publish
  // 3. display success or error message
  async function featureArticle(articleSlug) {
    setSaving(true);
    console.log('featuring article with slug:', articleSlug);
    let newLayoutData = props.hpData;
    newLayoutData.articles['featured'] = articleSlug;
    console.log('newLayoutData:', newLayoutData);
    const results = await makeFeaturedArticle(
      props.apiUrl,
      props.apiToken,
      newLayoutData
    );
    console.log('results:', results);
    const publishResults = await publishLayout(
      props.apiUrl,
      props.apiToken,
      results.content.data.id
    );
    console.log('publishResults:', publishResults);

    setSaving(false);
    // force the page to rerender to display the new homepage
    location.reload();
  }

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
      <Layout meta={siteMetadata}>
        <GlobalNav
          metadata={siteMetadata}
          tags={props.tags}
          sections={props.sections}
        />
        <div className="featured-article">
          <div className="columns">
            <div className="column is-two-thirds">
              {props.editable && featuredArticle && (
                <>
                  <ModalArticleSearch
                    apiUrl={props.apiUrl}
                    apiToken={props.apiToken}
                    isActive={isModalActive}
                    setModal={setModal}
                    setFeaturedArticle={setFeaturedArticle}
                  />

                  <button onClick={() => setModal(true)}>
                    Change Featured Article
                  </button>
                  <div id="featuredArticle">
                    {featuredArticle && (
                      <FeaturedArticleLink
                        key={featuredArticle.id}
                        article={featuredArticle}
                        amp={isAmp}
                      />
                    )}
                  </div>
                </>
              )}
              {!props.editable && featuredArticle && (
                <FeaturedArticleLink
                  key={featuredArticle.id}
                  article={featuredArticle}
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
