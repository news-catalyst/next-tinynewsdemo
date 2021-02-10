import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { hasuraStreamArticles } from '../lib/homepage.js';
import { cachedContents } from '../lib/cached';
import { hasuraGetHomepageEditor } from '../lib/articles.js';
import { getArticleAds } from '../lib/ads.js';
import { hasuraLocaliseText } from '../lib/utils.js';
import Layout from '../components/Layout';
import ArticleStream from '../components/homepage/ArticleStream';
import Placeholder from '../components/homepage/Placeholder';
import homepageStyles from '../styles/homepage.js';

const BigFeaturedStory = dynamic(() =>
  import(`../components/homepage/BigFeaturedStory`)
);
const LargePackageStoryLead = dynamic(() =>
  import(`../components/homepage/LargePackageStoryLead`)
);

export default function Home({
  selectedLayout,
  featured,
  topFeatured,
  bottomFeatured,
  streamArticles,
  sections,
  locale,
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
  const [mostRecentArticles, setMostRecentArticles] = useState(streamArticles);

  return (
    <div className="homepage">
      <Layout meta={siteMetadata} sections={sections} locale={locale}>
        {!selectedLayout && <Placeholder />}
        {selectedLayout.name === 'Big Featured Story' && (
          <BigFeaturedStory
            sections={sections}
            featuredArticle={featuredArticle}
            setFeaturedArticle={setFeaturedArticle}
            isAmp={false}
            metadata={siteMetadata}
          />
        )}
        {selectedLayout.name === 'Large Package Story Lead' && (
          <LargePackageStoryLead
            locale={locale}
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
  const apiUrl = process.env.HASURA_API_URL;
  const apiToken = process.env.ORG_SLUG;

  const { errors, data } = await hasuraGetHomepageEditor({
    url: apiUrl,
    orgSlug: apiToken,
    localeCode: locale,
  });
  if (errors || !data) {
    console.error('error getting homepage data:', errors);
    throw errors;
  }

  const hpData = data.homepage_layout_datas[0];
  let selectedLayout = hpData.homepage_layout_schema;

  let ids = [];
  let featured = hpData.first_article;
  ids.push(featured.id);
  let topFeatured = hpData.second_article;
  if (topFeatured) {
    ids.push(topFeatured.id);
  }
  let bottomFeatured = hpData.third_article;
  if (bottomFeatured) {
    ids.push(bottomFeatured.id);
  }
  console.log('ids:', ids);

  const { streamErrors, streamData } = await hasuraStreamArticles({
    url: apiUrl,
    orgSlug: apiToken,
    localeCode: locale,
    ids: ids,
  });
  let streamArticles = [];
  if (streamErrors || !streamData) {
    console.error('error getting stream articles:', streamErrors, streamData);
  } else {
    streamArticles = streamData.articles;
  }
  console.log('streamArticles:', streamArticles);

  const tags = data.tags;
  for (var i = 0; i < tags.length; i++) {
    tags[i].title = hasuraLocaliseText(tags[i].tag_translations, 'title');
  }

  const sections = data.categories;
  for (var i = 0; i < sections.length; i++) {
    sections[i].title = hasuraLocaliseText(
      sections[i].category_translations,
      'title'
    );
  }

  let siteMetadata;
  let metadatas = data.site_metadatas;
  try {
    siteMetadata = metadatas[0].site_metadata_translations[0].data;
  } catch (err) {
    console.log('failed finding site metadata for ', locale, metadatas);
  }

  const allAds = await cachedContents('ads', getArticleAds);
  const expandedAds = allAds.filter((ad) => ad.adTypeId === 166);

  return {
    props: {
      selectedLayout,
      featured,
      topFeatured,
      bottomFeatured,
      streamArticles,
      sections,
      locale,
      siteMetadata,
      expandedAds,
    },
    revalidate: 1,
  };
}
