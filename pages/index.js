import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { getHomepageData } from '../lib/homepage.js';
import { useAmp } from 'next/amp';
import { useRouter } from 'next/router';
import { cachedContents } from '../lib/cached';
import {
  listAllSections,
  listMostRecentArticles,
  getHomepageArticles,
} from '../lib/articles.js';
import Layout from '../components/Layout';
import { siteMetadata } from '../lib/siteMetadata.js';
import ArticleStream from '../components/homepage/ArticleStream';

const BigFeaturedStory = dynamic(() =>
  import(`../components/homepage/BigFeaturedStory`)
);
const LargePackageStoryLead = dynamic(() =>
  import(`../components/homepage/LargePackageStoryLead`)
);

export default function Home({ hpData, hpArticles, streamArticles, sections }) {
  const [featuredArticle, setFeaturedArticle] = useState(
    hpArticles['featured']
  );
  const [subFeaturedLeftArticle, setSubFeaturedLeftArticle] = useState(
    hpArticles['subfeatured-left']
  );
  const [subFeaturedRightArticle, setSubFeaturedRightArticle] = useState(
    hpArticles['subfeatured-right']
  );
  const [subFeaturedMiddleArticle, setSubFeaturedMiddleArticle] = useState(
    hpArticles['subfeatured-middle']
  );
  const isAmp = useAmp();

  const featuredArticleIds = Object.values(hpArticles).map(
    (article) => article.id
  );
  const mostRecentArticles = streamArticles.filter(
    (streamArticle) => !featuredArticleIds.includes(streamArticle.id)
  );

  const router = useRouter();
  const { locale, locales, defaultLocale } = router;

  console.log('current locale:', locale);
  console.log('default locale:', defaultLocale);
  console.log('locales:', JSON.stringify(locales));

  return (
    <div className="homepage">
      <Layout meta={siteMetadata} sections={sections}>
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
        <ArticleStream
          articles={mostRecentArticles}
          sections={sections}
          isAmp={isAmp}
          title="The Latest"
        />
      </Layout>
    </div>
  );
}

export async function getStaticProps() {
  //    get selected homepage layout / data
  const hpData = await getHomepageData();
  //    look up selected homepage articles
  const hpArticles = await getHomepageArticles(hpData);
  // const hpArticles = { "featured": ""}

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
