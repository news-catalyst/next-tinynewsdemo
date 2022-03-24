import React from 'react';
import Layout from '../../../../components/Layout.js';
import { cachedContents } from '../../../../lib/cached';
import { hasuraListNewsletters } from '../../../../lib/newsletters.js';
import { getArticleAds } from '../../../../lib/ads.js';
import ArticleStream from '../../../../components/homepage/ArticleStream';
import { generateAllDomainPaths } from '../../../../lib/settings';
import {
  booleanSetting,
  findSetting,
  getOrgSettings,
} from '../../../../lib/settings.js';

export default function NewsletterIndexPage(props) {
  const isAmp = false;

  return (
    <Layout
      meta={props.siteMetadata}
      sections={props.sections}
      renderFooter={props.renderFooter}
    >
      <ArticleStream
        sections={props.sections}
        articles={props.newsletters}
        title={'Newsletters Archive'}
        showCategory={false}
        isAmp={isAmp}
        metadata={props.siteMetadata}
        ads={props.expandedAds}
      />
    </Layout>
  );
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

export async function getStaticProps({ params }) {
  const apiUrl = process.env.HASURA_API_URL;
  const site = params.site;
  const locale = 'en-US';

  const settingsResult = await getOrgSettings({
    url: apiUrl,
    site: site,
  });

  if (settingsResult.errors) {
    throw settingsResult.errors;
  }

  let newsletters = [];
  let sections = [];
  let tags = [];
  let siteMetadata;

  const { errors, data } = await hasuraListNewsletters({
    url: apiUrl,
    site: site,
    localeCode: 'en-US',
  });

  if (errors || !data) {
    console.error(errors);
    return {
      notFound: true,
    };
  } else {
    newsletters = data.newsletter_editions;
    sections = data.categories;
    tags = data.tags;

    sections = data.categories;

    for (var i = 0; i < sections.length; i++) {
      sections[i].title = sections[i].category_translations[0].title;
    }

    for (var j = 0; j < tags.length; j++) {
      tags[j].title = tags[j].tag_translations[0].title;
    }

    let metadatas = data.site_metadatas;
    try {
      siteMetadata = metadatas[0].site_metadata_translations[0].data;
    } catch (err) {
      console.error('failed finding site metadata for ', locale, metadatas);
    }
  }

  const settings = settingsResult.data.settings;
  let expandedAds = [];
  let letterheadSetting = booleanSetting(settings, 'LETTERHEAD_API_URL', false);
  if (letterheadSetting) {
    let letterheadParams = {
      url: findSetting(settings, 'LETTERHEAD_API_URL'),
      apiKey: findSetting(settings, 'LETTERHEAD_API_KEY'),
    };
    const allAds =
      (await cachedContents('ads', letterheadParams, getArticleAds)) || [];
    expandedAds = allAds.filter((ad) => ad.adTypeId === 166 && ad.status === 4);
  }

  return {
    props: {
      newsletters,
      tags,
      sections,
      siteMetadata,
      expandedAds,
    },
  };
}
