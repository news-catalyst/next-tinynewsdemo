import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { getHomepageData } from '../lib/homepage.js';
import { cachedContents } from '../lib/cached';
import {
  listAllLocales,
  listAllSections,
  listMostRecentArticles,
  getArticleBySlugNoLocale,
} from '../lib/articles.js';
import { getArticleAds } from '../lib/ads.js';
import Layout from '../components/Layout';
import ArticleStream from '../components/homepage/ArticleStream';
import { getSiteMetadataForLocale } from '../lib/site_metadata.js';
import Placeholder from '../components/homepage/Placeholder';
import homepageStyles from '../styles/homepage.js';

const BigFeaturedStory = dynamic(() =>
  import(`../components/homepage/BigFeaturedStory`)
);
const LargePackageStoryLead = dynamic(() =>
  import(`../components/homepage/LargePackageStoryLead`)
);

export default function Home({
  hpData,
  featured,
  topFeatured,
  bottomFeatured,
  streamArticles,
  sections,
  currentLocale,
  siteMetadata,
  expandedAds,
}) {
  const [featuredArticle, setFeaturedArticle] = useState(featured);
  const [subFeaturedTopArticle, setSubFeaturedTopArticle] = useState(
    topFeatured
  );
  const [subFeaturedBottomArticle, setSubFeaturedBottomArticle] = useState(
    bottomFeatured
  );
  const [mostRecentArticles, setMostRecentArticles] = useState([]);

  let ids = [];

  useEffect(() => {
    ids.push(featuredArticle.id);
    if (subFeaturedTopArticle) {
      ids.push(subFeaturedTopArticle.id);
    }
    if (subFeaturedBottomArticle) {
      ids.push(subFeaturedBottomArticle.id);
    }

    // filter out any articles from the stream that are already featured using the list of IDs from right above
    setMostRecentArticles(
      streamArticles.filter((streamArticle) => !ids.includes(streamArticle.id))
    );
  }, [hpData]);

  return (
    <div className="homepage">
      <Layout meta={siteMetadata} sections={sections} locale={currentLocale}>
        {!hpData && <Placeholder />}
        {hpData.layoutComponent === 'BigFeaturedStory' && (
          <BigFeaturedStory
            locale={currentLocale}
            sections={sections}
            featuredArticle={featuredArticle}
            setFeaturedArticle={setFeaturedArticle}
            isAmp={false}
            metadata={siteMetadata}
          />
        )}
        {hpData.layoutComponent === 'LargePackageStoryLead' && (
          <LargePackageStoryLead
            locale={currentLocale}
            featuredArticle={featuredArticle}
            setFeaturedArticle={setFeaturedArticle}
            subFeaturedTopArticle={subFeaturedTopArticle}
            setSubFeaturedTopArticle={setSubFeaturedTopArticle}
            subFeaturedBottomArticle={subFeaturedBottomArticle}
            setSubFeaturedBottomArticle={setSubFeaturedBottomArticle}
            sections={sections}
            isAmp={false}
            metadata={siteMetadata}
          />
        )}
        <ArticleStream
          articles={mostRecentArticles}
          sections={sections}
          showCategory={true}
          isAmp={false}
          title={siteMetadata.homepageArticleStreamHed}
          locale={currentLocale}
          metadata={siteMetadata}
          ads={expandedAds}
        />
      </Layout>
      <style jsx global>
        {homepageStyles}
      </style>
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

  let featuredArticleSlug = hpData.articles['featured'];
  let featured = await getArticleBySlugNoLocale(featuredArticleSlug);
  let topFeatured = null;
  let bottomFeatured = null;

  if (hpData.articles['subfeatured-top']) {
    topFeatured = await getArticleBySlugNoLocale(
      hpData.articles['subfeatured-top']
    );
  }
  if (hpData.articles['subfeatured-bottom']) {
    bottomFeatured = await getArticleBySlugNoLocale(
      hpData.articles['subfeatured-bottom']
    );
  }

  const streamArticles = await listMostRecentArticles(currentLocale);

  const sections = await cachedContents('sections', listAllSections);

  const siteMetadata = await getSiteMetadataForLocale(currentLocale);

  const allAds = await cachedContents('ads', getArticleAds);
  const expandedAds = allAds.filter((ad) => ad.adTypeId === 166);

  return {
    props: {
      hpData,
      featured,
      topFeatured,
      bottomFeatured,
      streamArticles,
      sections,
      currentLocale,
      siteMetadata,
      expandedAds,
    },
    revalidate: 1,
  };
}
