import React from 'react';
import Link from 'next/link';
import tw from 'twin.macro';
import Layout from '../../components/Layout.js';
import { cachedContents } from '../../lib/cached';
import { hasuraListNewsletters } from '../../lib/newsletters.js';
import { getArticleAds } from '../../lib/ads.js';
import {
  ArticleTitle,
  PostTextContainer,
  PostText,
} from '../../components/common/CommonStyles.js';
import { hasuraLocaliseText } from '../../lib/utils.js';
import { useAmp } from 'next/amp';

const SectionContainer = tw.div`flex flex-col flex-nowrap items-center px-5 mx-auto max-w-7xl w-full`;

export default function NewsletterIndexPage(props) {
  const isAmp = useAmp();

  const newsletterLinks = props.newsletters.map((newsletter, i) => {
    return (
      <li key={`newsletter-item-${i}`}>
        <Link href={`/newsletters/${newsletter.slug}`}>
          <a href={`/newsletters/${newsletter.slug}`}>{newsletter.headline}</a>
        </Link>
      </li>
    );
  });

  return (
    <Layout
      meta={props.siteMetadata}
      sections={props.sections}
      renderFooter={props.renderFooter}
    >
      <SectionContainer>
        <ArticleTitle meta={props.siteMetadata} tw="text-center">
          Newsletter Archive
        </ArticleTitle>
        <PostText>
          <PostTextContainer>
            <ul>{newsletterLinks}</ul>
          </PostTextContainer>
        </PostText>
      </SectionContainer>
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
    locale_code: locale,
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
      console.log('failed finding site metadata for ', locale, metadatas);
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
    },
  };
}
