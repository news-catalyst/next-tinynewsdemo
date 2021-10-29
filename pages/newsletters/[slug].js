import { useRouter } from 'next/router';
import React from 'react';
import tw from 'twin.macro';
import Layout from '../../components/Layout.js';
import { cachedContents } from '../../lib/cached';
import {
  hasuraGetNewsletter,
  hasuraListNewsletters,
} from '../../lib/newsletters.js';
import { getArticleAds } from '../../lib/ads.js';
import {
  ArticleTitle,
  PostTextContainer,
  PostText,
} from '../../components/common/CommonStyles.js';
import ArticleFooter from '../../components/articles/ArticleFooter';
import NewsletterBlock from '../../components/plugins/NewsletterBlock';
import {
  hasuraLocaliseText,
  renderNewsletterContent,
} from '../../lib/utils.js';
import { useAmp } from 'next/amp';

const SectionContainer = tw.div`flex flex-col flex-nowrap items-center px-5 mx-auto max-w-7xl w-full`;
const BlockWrapper = tw.div`w-full`;

export default function NewsletterEditionPage(props) {
  const isAmp = useAmp();
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
      locale={props.locale}
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
            locale={props.locale}
          />
        </PostText>
        <NewsletterBlock metadata={props.siteMetadata} />
      </SectionContainer>
    </Layout>
  );
}

export async function getStaticPaths({ locales }) {
  const apiUrl = process.env.HASURA_API_URL;
  const apiToken = process.env.ORG_SLUG;

  let paths = [];
  const { errors, data } = await hasuraListNewsletters({
    url: apiUrl,
    orgSlug: apiToken,
    locale_code: locales.first,
  });

  if (errors || !data) {
    return {
      paths,
      fallback: true,
    };
  }

  const siteLocales = process.env.LOCALES.split(',');

  for (const newsletter of data.newsletter_editions) {
    for (const locale of siteLocales) {
      paths.push({
        params: {
          slug: newsletter.slug,
        },
        locale: locale.locale_code,
      });
    }
  }

  return {
    paths,
    fallback: true,
  };
}

export async function getStaticProps({ locale, params }) {
  const apiUrl = process.env.HASURA_API_URL;
  const apiToken = process.env.ORG_SLUG;

  let newsletter;
  let sections = [];
  let tags = [];
  let siteMetadata;

  const { errors, data } = await hasuraGetNewsletter({
    url: apiUrl,
    orgSlug: apiToken,
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
      sections[i].title = hasuraLocaliseText(
        sections[i].category_translations,
        'title'
      );
    }

    for (var j = 0; j < tags.length; j++) {
      tags[j].title = hasuraLocaliseText(tags[j].tag_translations, 'title');
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

  let renderFooter = true;
  if (process.env.ORG_SLUG === 'tiny-news-curriculum') {
    renderFooter = false; // turns off the global footer for the curriculum site
  }

  return {
    props: {
      newsletter,
      tags,
      sections,
      siteMetadata,
      expandedAds,
      renderFooter,
      locale,
    },
  };
}
