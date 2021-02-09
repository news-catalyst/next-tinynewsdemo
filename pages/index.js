import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { hasuraHomepage } from '../lib/homepage.js';
import { cachedContents } from '../lib/cached';
import { hasuraGetArticleBySlug } from '../lib/articles.js';
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

  let slugs = [];

  useEffect(() => {
    slugs.push(featuredArticle.slug);
    if (subFeaturedTopArticle) {
      slugs.push(subFeaturedTopArticle.slug);
    }
    if (subFeaturedBottomArticle) {
      slugs.push(subFeaturedBottomArticle.slug);
    }

    // filter out any articles from the stream that are already featured using the list of IDs from right above
    setMostRecentArticles(
      streamArticles.filter(
        (streamArticle) => !slugs.includes(streamArticle.slug)
      )
    );
  }, [hpData]);

  return (
    <div className="homepage">
      <Layout meta={siteMetadata} sections={sections} locale={currentLocale}>
        {!hpData && <Placeholder />}
        {hpData['homepage_layout_schema']['name'] === 'Big Featured Story' && (
          <BigFeaturedStory
            sections={sections}
            featuredArticle={featuredArticle}
            setFeaturedArticle={setFeaturedArticle}
            isAmp={false}
            metadata={siteMetadata}
          />
        )}
        {hpData['homepage_layout_schema']['name'] ===
          'Large Package Story Lead' && (
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

  //    get selected homepage layout and featured article IDs
  const { errors, data } = await hasuraHomepage({
    url: apiUrl,
    orgSlug: apiToken,
    localeCode: locale,
  });

  let featured = null;
  let topFeatured = null;
  let bottomFeatured = null;
  let sections = [];
  let streamArticles = [];
  let siteMetadata = null;
  let layoutData = null;

  if (errors || !data) {
    return {
      notFound: true,
    };
    // throw errors;
  } else {
    layoutData = data['homepage_layout_datas'][0]['data'];
    let featuredArticleSlug = layoutData['featured'];
    featured = await hasuraGetArticleBySlug({
      url: apiUrl,
      orgSlug: apiToken,
      localeCode: locale,
      slug: featuredArticleSlug,
    });
    featured = featured.data.articles[0];
    let topFeatured = null;
    let bottomFeatured = null;

    sections = data.categories;
    for (var i = 0; i < sections.length; i++) {
      sections[i].title = hasuraLocaliseText(
        sections[i].category_translations,
        'title'
      );
    }

    if (layoutData['subfeatured-top']) {
      topFeatured = await hasuraGetArticleBySlug({
        url: apiUrl,
        orgSlug: apiToken,
        localeCode: locale,
        slug: layoutData['subfeatured-top'],
      });
      topFeatured = topFeatured.data.articles[0];
    }
    if (layoutData['subfeatured-bottom']) {
      bottomFeatured = await hasuraGetArticleBySlug({
        url: apiUrl,
        orgSlug: apiToken,
        localeCode: locale,
        slug: layoutData['subfeatured-bottom'],
      });
      bottomFeatured = bottomFeatured.data.articles[0];
    }

    streamArticles = data.articles;
    let metadatas = data.site_metadatas;
    try {
      siteMetadata = metadatas[0].site_metadata_translations[0].data;
    } catch (err) {
      console.log('failed finding site metadata for ', locale, metadatas);
    }
  }

  const allAds = await cachedContents('ads', getArticleAds);
  const expandedAds = allAds.filter((ad) => ad.adTypeId === 166);

  return {
    props: {
      hpData: data['homepage_layout_datas'][0],
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
