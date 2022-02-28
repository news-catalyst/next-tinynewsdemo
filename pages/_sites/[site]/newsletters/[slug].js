import { useRouter } from 'next/router';
import React from 'react';
import tw from 'twin.macro';
import Layout from '../../../../components/Layout.js';
import { cachedContents } from '../../../../lib/cached';
import { hasuraGetNewsletter } from '../../../../lib/newsletters.js';
import {
  generateAllNewsletterPagePaths,
  getOrgSettings,
} from '../../../../lib/articles.js';
import { getArticleAds } from '../../../../lib/ads.js';
import {
  ArticleTitle,
  PostTextContainer,
  PostText,
} from '../../../../components/common/CommonStyles.js';
import ArticleFooter from '../../../../components/articles/ArticleFooter';
import NewsletterBlock from '../../../../components/plugins/NewsletterBlock';
import {
  booleanSetting,
  getLatestVersion,
  renderNewsletterContent,
} from '../../../../lib/utils.js';

const SectionContainer = tw.div`flex flex-col flex-nowrap items-center px-5 mx-auto max-w-7xl w-full`;
const BlockWrapper = tw.div`w-full`;

export default function NewsletterEditionPage(props) {
  // const isAmp = useAmp();
  const isAmp = false;
  const router = useRouter();

  // If the page is not yet generated, this will be displayed
  // initially until getStaticProps() finishes running
  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  let body;

  if (props.newsletter) {
    body = renderNewsletterContent(
      props.newsletter.content,
      [],
      isAmp,
      props.siteMetadata
    );
  }

  return (
    <Layout
      meta={props.siteMetadata}
      sections={props.sections}
      renderFooter={props.renderFooter}
    >
      <SectionContainer>
        <ArticleTitle meta={props.siteMetadata} tw="text-center">
          {props.newsletter.headline}
        </ArticleTitle>
        <PostText>
          <PostTextContainer>{body}</PostTextContainer>
          <ArticleFooter
            article={props.newsletter}
            isAmp={isAmp}
            metadata={props.siteMetadata}
          />
        </PostText>
        <NewsletterBlock metadata={props.siteMetadata} />
      </SectionContainer>
    </Layout>
  );
}

export async function getStaticPaths() {
  const apiUrl = process.env.HASURA_API_URL;
  const adminSecret = process.env.HASURA_ADMIN_SECRET;

  const paths = await generateAllNewsletterPagePaths({
    url: apiUrl,
    adminSecret: adminSecret,
    urlParams: {},
  });

  return {
    paths,
    fallback: true,
  };
}

export async function getStaticProps({ params }) {
  const apiUrl = process.env.HASURA_API_URL;
  const site = params.site;
  const locale = 'en-US';

  const settingsResult = await getOrgSettings({
    url: apiUrl,
  });

  if (settingsResult.errors) {
    throw settingsResult.errors;
  }

  let settings = settingsResult.data.settings;

  let newsletter;
  let sections = [];
  let tags = [];
  let siteMetadata;

  const { errors, data } = await hasuraGetNewsletter({
    url: apiUrl,
    site: site,
    slug: params.slug,
  });

  if (errors || !data) {
    console.error('error getting newsletter:', errors);
    return {
      notFound: true,
    };
  } else {
    newsletter = data.newsletter_editions[0];
    sections = data.categories;
    tags = data.tags;

    for (var i = 0; i < sections.length; i++) {
      sections[i].title = getLatestVersion(
        sections[i].category_translations,
        'title'
      );
    }

    for (var j = 0; j < tags.length; j++) {
      tags[j].title = getLatestVersion(tags[j].tag_translations, 'title');
    }

    let metadatas = data.site_metadatas;
    try {
      siteMetadata = metadatas[0].site_metadata_translations[0].data;
    } catch (err) {
      console.error('failed finding site metadata for ', locale, metadatas);
    }
  }

  let expandedAds = [];
  let letterheadSetting = booleanSetting(settings, 'LETTERHEAD_API_URL', false);
  if (letterheadSetting) {
    const allAds = (await cachedContents('ads', getArticleAds)) || [];
    expandedAds = allAds.filter((ad) => ad.adTypeId === 166 && ad.status === 4);
  }

  let renderFooter = booleanSetting(settings, 'RENDER_FOOTER', true);

  return {
    props: {
      newsletter,
      tags,
      sections,
      siteMetadata,
      expandedAds,
      renderFooter,
      settings,
    },
  };
}
