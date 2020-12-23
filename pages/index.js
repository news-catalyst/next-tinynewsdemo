import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { getHomepageData } from '../lib/homepage.js';
import { useAmp } from 'next/amp';
import { cachedContents } from '../lib/cached';
import {
  listAllLocales,
  listAllSections,
  listMostRecentArticles,
  getHomepageArticles,
} from '../lib/articles.js';
import Layout from '../components/Layout';
import ArticleStream from '../components/homepage/ArticleStream';
import { getSiteMetadataForLocale } from '../lib/site_metadata.js';
import Placeholder from '../components/homepage/Placeholder';

const BigFeaturedStory = dynamic(() =>
  import(`../components/homepage/BigFeaturedStory`)
);
const LargePackageStoryLead = dynamic(() =>
  import(`../components/homepage/LargePackageStoryLead`)
);

export default function Home({
  hpData,
  hpArticles,
  streamArticles,
  sections,
  currentLocale,
  siteMetadata,
}) {
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
  const [mostRecentArticles, setMostRecentArticles] = useState([]);
  const [metadata, setMetadata] = useState(siteMetadata);

  const isAmp = useAmp();

  let featuredArticleIds = [];
  useEffect(() => {
    console.log('hpArticles:', hpArticles);
    for (const [key, article] of Object.entries(hpArticles)) {
      console.log(key, article);
      // replace any missing featured articles with the next top article from the stream
      if (article === null) {
        hpArticles[key] = streamArticles.shift();
      }
    }

    // build a quick list of homepage featured article ids to ensure they do not appear again in the stream
    featuredArticleIds = Object.values(hpArticles).map((article) => {
      return article.id;
    });

    // filter out any articles from the stream that are already featured using the list of IDs from right above
    setMostRecentArticles(
      streamArticles.filter(
        (streamArticle) => !featuredArticleIds.includes(streamArticle.id)
      )
    );
  }, [hpArticles, streamArticles]);

  return (
    <div className="homepage">
      <Layout meta={metadata} sections={sections} locale={currentLocale}>
        {!hpData && <Placeholder />}
        {hpData.layoutComponent === 'BigFeaturedStory' && (
          <BigFeaturedStory
            articles={hpArticles}
            locale={currentLocale}
            sections={sections}
            featuredArticle={featuredArticle}
            setFeaturedArticle={setFeaturedArticle}
            isAmp={isAmp}
          />
        )}
        {hpData.layoutComponent === 'LargePackageStoryLead' && (
          <LargePackageStoryLead
            locale={currentLocale}
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
          locale={currentLocale}
        />
      </Layout>
    </div>
  );
}

export async function getStaticProps({ locale }) {
  const localeMappings = await cachedContents('locales', listAllLocales);

  const currentLocale = localeMappings.find(
    (localeMap) => localeMap.code === locale
  );
  //    get selected homepage layout and featured article IDs
  const hpData = await getHomepageData();
  console.log('hpData:', hpData);

  //    look up featured homepage articles
  const hpArticles = await getHomepageArticles(currentLocale, hpData);

  const streamArticles = await listMostRecentArticles(currentLocale);

  const sections = await cachedContents('sections', listAllSections);

  const siteMetadata = await getSiteMetadataForLocale(currentLocale);

  return {
    props: {
      hpData,
      hpArticles,
      streamArticles,
      sections,
      currentLocale,
      siteMetadata,
    },
    revalidate: 1,
  };
}
