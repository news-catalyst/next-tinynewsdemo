import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { getHomepageData } from '../lib/homepage.js';
import { useAmp } from 'next/amp';
import { cachedContents } from '../lib/cached';
import {
  listAllSections,
  listMostRecentArticles,
  getHomepageArticles,
} from '../lib/articles.js';
import Layout from '../components/Layout';
import { siteMetadata } from '../lib/siteMetadata.js';
import GlobalNav from '../components/nav/GlobalNav';
import GlobalFooter from '../components/nav/GlobalFooter';
import ArticleLink from '../components/homepage/ArticleLink';

const BigFeaturedStory = dynamic(() =>
  import(`../components/homepage/BigFeaturedStory`)
);
const LargePackageStoryLead = dynamic(() =>
  import(`../components/homepage/LargePackageStoryLead`)
);

export default function Home({ hpData, hpArticles, streamArticles, sections }) {
  const [featuredArticle, setFeaturedArticle] = useState(null);
  const [subFeaturedLeftArticle, setSubFeaturedLeftArticle] = useState(null);
  const [subFeaturedRightArticle, setSubFeaturedRightArticle] = useState(null);
  const [subFeaturedMiddleArticle, setSubFeaturedMiddleArticle] = useState(
    null
  );
  const isAmp = useAmp();

  const featuredArticleIds = Object.values(hpArticles).map(
    (article) => article.id
  );
  const mostRecentArticles = streamArticles.filter(
    (streamArticle) => !featuredArticleIds.includes(streamArticle.id)
  );

  return (
    <div className="homepage">
      <Layout meta={siteMetadata}>
        <GlobalNav metadata={siteMetadata} sections={sections} />
        <div className="container">
          {hpData.layoutComponent === 'BigFeaturedStory' && (
            <BigFeaturedStory
              articles={hpArticles}
              sections={sections}
              featuredArticle={featuredArticle}
              setFeaturedArticle={setFeaturedArticle}
              isAmp={isAmp}
            />
          )}
          {hpData.layoutComponent === 'LargePackageStoryLead' && (
            <LargePackageStoryLead
              articles={hpArticles}
              featuredArticle={featuredArticle}
              setFeaturedArticle={setFeaturedArticle}
              subFeaturedLeftArticle={subFeaturedLeftArticle}
              setSubFeaturedLeftArticle={setSubFeaturedLeftArticle}
              subFeaturedRightArticle={subFeaturedRightArticle}
              setSubFeaturedRightArticle={setSubFeaturedRightArticle}
              subFeaturedMiddleArticle={subFeaturedMiddleArticle}
              setSubFeaturedMiddleArticle={setSubFeaturedMiddleArticle}
              sections={sections}
              isAmp={isAmp}
            />
          )}
          <section className="section">
            <div className="columns">
              <div className="column is-11 is-offset-1">
                {mostRecentArticles &&
                  mostRecentArticles.map((streamArticle) => (
                    <ArticleLink
                      key={streamArticle.id}
                      article={streamArticle}
                      amp={isAmp}
                    />
                  ))}
              </div>
            </div>
          </section>
        </div>
        <GlobalFooter post_type="home" />
      </Layout>
    </div>
  );
}

export async function getStaticProps() {
  //    get selected homepage layout / data
  const hpData = await getHomepageData();
  //    look up selected homepage articles
  const hpArticles = await getHomepageArticles(hpData);

  const streamArticles = await listMostRecentArticles();

  const sections = await cachedContents('sections', listAllSections);

  return {
    props: {
      hpData,
      hpArticles,
      streamArticles,
      sections,
    },
    revalidate: 1,
  };
}
