import React from 'react';
import Layout from '../../components/Layout.js';
import { cachedContents } from '../../lib/cached';
import { hasuraListNewsletters } from '../../lib/newsletters.js';
import { getArticleAds } from '../../lib/ads.js';
import ArticleStream from '../../components/homepage/ArticleStream';
import { hasuraLocalizeText } from '../../lib/utils.js';
import { useAmp } from 'next/amp';

export default function NewsletterIndexPage(props) {
  const isAmp = useAmp();

  return (
    <Layout
      meta={props.siteMetadata}
      sections={props.sections}
      renderFooter={props.renderFooter}
      locale={props.locale}
    >
      <ArticleStream
        locale={props.locale}
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

export async function getStaticProps({ locale, params }) {
  const apiUrl = process.env.HASURA_API_URL;
  const apiToken = process.env.ORG_SLUG;

  let newsletters = [];
  let sections = [];
  let tags = [];
  let siteMetadata;

  const { errors, data } = await hasuraListNewsletters({
    url: apiUrl,
    orgSlug: apiToken,
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
      sections[i].title = hasuraLocalizeText(
        locale,
        sections[i].category_translations,
        'title'
      );
    }

    for (var j = 0; j < tags.length; j++) {
      tags[j].title = hasuraLocalizeText(
        locale,
        tags[j].tag_translations,
        'title'
      );
    }

    let metadatas = data.site_metadatas;
    try {
      siteMetadata = metadatas[0].site_metadata_translations[0].data;
    } catch (err) {
      console.error('failed finding site metadata for ', locale, metadatas);
    }
  }

  let expandedAds = [];
  if (process.env.LETTERHEAD_API_URL) {
    const allAds = (await cachedContents('ads', getArticleAds)) || [];
    expandedAds = allAds.filter((ad) => ad.adTypeId === 166 && ad.status === 4);
  }

  return {
    props: {
      newsletters,
      tags,
      sections,
      siteMetadata,
      expandedAds,
      locale,
    },
  };
}
