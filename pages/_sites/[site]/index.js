import React from 'react';
import { hasuraStreamArticles } from '../../../lib/homepage.js';
import { cachedContents } from '../../../lib/cached';
import {
  hasuraGetHomepageEditor,
  generateAllDomainPaths,
  getOrgSettings,
} from '../../../lib/articles.js';
import { getArticleAds } from '../../../lib/ads.js';
import { booleanSetting, hasuraLocalizeText } from '../../../lib/utils.js';
import Homepage from '../../../components/Homepage';
import LandingPage from '../../../components/LandingPage';
import CurriculumHomepage from '../../../components/curriculum/CurriculumHomepage';

export default function Home(props) {
  if (props.siteMetadata.shortName === 'Tiny News Collective Curriculum') {
    return <CurriculumHomepage {...props} />;
  }

  // console.log('streamArticles:', props.streamArticles);
  const component =
    props.siteMetadata.landingPage === 'on' || !props.selectedLayout ? (
      <LandingPage {...props} />
    ) : (
      <Homepage {...props} />
    );

  return component;
}

export async function getStaticPaths() {
  const apiUrl = process.env.HASURA_API_URL;
  const adminSecret = process.env.HASURA_ADMIN_SECRET;

  const mappedPaths = await generateAllDomainPaths({
    url: apiUrl,
    adminSecret: adminSecret,
    urlParams: {},
  });

  return {
    paths: mappedPaths,
    fallback: true,
  };
}

export async function getStaticProps(context) {
  const locale = context.locale;
  const site = context.params.site;

  if (!site) {
    console.error('getStaticProps is missing the required site param!');
    throw new Error('Missing required site param');
  }

  const apiUrl = process.env.HASURA_API_URL;

  const settingsResult = await getOrgSettings({
    url: apiUrl,
    site: site,
  });

  if (settingsResult.errors) {
    console.error('Settings error:', settingsResult.errors);
    throw settingsResult.errors;
  }

  const { errors, data } = await hasuraGetHomepageEditor({
    url: apiUrl,
    site: site,
    localeCode: locale,
  });
  if (errors || !data) {
    console.error('error getting homepage data:', errors);
    throw errors;
  }

  let siteMetadata;
  let metadatas = data.site_metadatas;
  try {
    siteMetadata = metadatas[0].site_metadata_translations[0].data;
  } catch (err) {
    console.error('failed finding site metadata for ', locale, metadatas);
  }

  let pages = data.pages;

  if (siteMetadata && siteMetadata.landingPage === 'on') {
    return {
      props: {
        locale,
        siteMetadata,
        pages,
      },
      revalidate: 1,
    };
  }

  const hpData = data.homepage_layout_datas[0];

  let ids = [];
  let selectedLayout = null;
  let featured = null;
  let topFeatured = null;
  let bottomFeatured = null;

  if (hpData) {
    selectedLayout = hpData.homepage_layout_schema;
    featured = hpData.first_article;
    ids.push(featured.id);
    topFeatured = hpData.second_article;
    if (topFeatured) {
      ids.push(topFeatured.id);
    }
    bottomFeatured = hpData.third_article;
    if (bottomFeatured) {
      ids.push(bottomFeatured.id);
    }
  }

  const streamResult = await hasuraStreamArticles({
    url: apiUrl,
    site: site,
    ids: ids,
    limit: process.env.ORG_SLUG === 'tiny-news-curriculum' ? 20 : 10,
  });
  let streamArticles = [];
  if (streamResult.errors || !streamResult.data) {
    console.error(
      'error getting stream articles:',
      streamResult.errors,
      streamResult.data
    );
  } else {
    streamArticles = streamResult.data.articles;
  }

  const tags = data.tags;
  for (var i = 0; i < tags.length; i++) {
    tags[i].title = hasuraLocalizeText(
      locale,
      tags[i].tag_translations,
      'title'
    );
  }

  const sections = data.categories;
  for (var j = 0; j < sections.length; j++) {
    sections[j].title = hasuraLocalizeText(
      locale,
      sections[j].category_translations,
      'title'
    );
  }

  let settings = settingsResult.data.settings;
  let expandedAds = [];
  let letterheadSetting = booleanSetting(settings, 'LETTERHEAD_API_URL', false);
  if (letterheadSetting) {
    const allAds = (await cachedContents('ads', getArticleAds)) || [];
    expandedAds = allAds.filter((ad) => ad.adTypeId === 166 && ad.status === 4);
  }

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
      settings,
    },
    revalidate: 1,
  };
}
