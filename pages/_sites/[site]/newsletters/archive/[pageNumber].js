import React from 'react';
import Layout from '../../../../../components/Layout.js';
import { cachedContents } from '../../../../../lib/cached';
import {
  hasuraListNewsletters,
  generateAllNewsletterArchivePaths,
  NEWSLETTER_ARCHIVE_PAGINATION_SIZE,
} from '../../../../../lib/newsletters.js';
import { getArticleAds } from '../../../../../lib/ads.js';
import ArticleStream from '../../../../../components/homepage/ArticleStream';
import { generateAllDomainPaths } from '../../../../../lib/settings';
import {
  booleanSetting,
  findSetting,
  getOrgSettings,
} from '../../../../../lib/settings.js';
import tw, { styled } from 'twin.macro';
import Typography from '../../../../../components/common/Typography';
import paginationStyles from '../../../../../styles/pagination.js';

const PaginationSection = tw.section`flex mb-8`;
const PaginationContainer = styled.div(({ meta }) => ({
  ...tw`md:grid md:grid-cols-packageLayoutTablet lg:grid-cols-packageLayoutDesktop flex flex-row flex-wrap grid-rows-1 w-full px-5 mx-auto max-w-7xl items-center justify-between`,
  fontFamily: Typography[meta?.theme || 'styleone'].ArticleMetaTop,
}));

export default function NewsletterIndexPage(props) {
  const isAmp = false;
  let pages = Array.from({ length: props.totalPageCount }, (_, i) => i + 1);

  return (
    <Layout
      meta={props.siteMetadata}
      sections={props.sections}
      renderFooter={props.renderFooter}
      site={props.site}
      monkeypodLink={props.monkeypodLink}
      bannerAds={props.bannerAds}
    >
      <ArticleStream
        sections={props.sections}
        articles={props.newsletters}
        title={'Newsletters Archive'}
        showCategory={false}
        isAmp={isAmp}
        metadata={props.siteMetadata}
        ads={props.expandedAds}
        monkeypodLink={props.monkeypodLink}
      />
      <PaginationSection>
        <PaginationContainer meta={props.siteMetadata}>
          <ul className="pagination" data-testid="pages">
            {props.currentPage > 1 && (
              <li>
                <a href={`/newsletters/archive/${props.currentPage - 1}`}>
                  previous
                </a>
              </li>
            )}
            {pages.map((page) => (
              <li
                key={`nl-link-${page}`}
                className={page === props.currentPage ? 'active' : ''}
              >
                <a href={`/newsletters/archive/${page}`}>{page.toString()}</a>
              </li>
            ))}
            {props.currentPage < props.totalPageCount && (
              <li>
                <a href={`/newsletters/archive/${props.currentPage + 1}`}>
                  next
                </a>
              </li>
            )}
          </ul>
        </PaginationContainer>
      </PaginationSection>

      <style jsx global>
        {paginationStyles}
      </style>
    </Layout>
  );
}

export async function getStaticPaths() {
  const apiUrl = process.env.HASURA_API_URL;
  const adminSecret = process.env.HASURA_ADMIN_SECRET;

  const mappedPaths = await generateAllNewsletterArchivePaths({
    url: apiUrl,
    adminSecret: adminSecret,
  });

  return {
    paths: mappedPaths,
    fallback: true,
  };
}

export async function getStaticProps(context) {
  const apiUrl = process.env.HASURA_API_URL;
  const site = context.params.site;
  const locale = 'en-US';
  const currentPage = Number(context.params?.pageNumber) || 1;
  const offset = (currentPage - 1) * NEWSLETTER_ARCHIVE_PAGINATION_SIZE;

  const settingsResult = await getOrgSettings({
    url: apiUrl,
    site: site,
  });

  if (settingsResult.errors) {
    throw settingsResult.errors;
  }

  let newsletters = [];
  let sections = [];
  let siteMetadata;
  let totalPageCount = 0;

  const { errors, data } = await hasuraListNewsletters({
    url: apiUrl,
    site: site,
    localeCode: 'en-US',
    limit: NEWSLETTER_ARCHIVE_PAGINATION_SIZE,
    offset: offset,
  });

  if (errors || !data) {
    console.error(errors);
    return {
      notFound: true,
    };
  } else {
    newsletters = data.newsletter_editions;
    totalPageCount = Math.ceil(
      data.newsletter_editions_aggregate.aggregate.count /
        NEWSLETTER_ARCHIVE_PAGINATION_SIZE
    );
    sections = data.categories;

    for (var i = 0; i < sections.length; i++) {
      if (
        sections[i] &&
        sections[i].category_translations &&
        sections[i].category_translations[0] &&
        sections[i].category_translations[0].title
      ) {
        sections[i].title = sections[i].category_translations[0].title;
      }
    }

    let metadatas = data.site_metadatas;
    try {
      siteMetadata = metadatas[0].site_metadata_translations[0].data;
    } catch (err) {
      console.error('failed finding site metadata for ', locale, metadatas);
    }
  }

  const settings = settingsResult.data.settings;
  const monkeypodLink = findSetting(settings, 'NEXT_PUBLIC_MONKEYPOD_URL');

  let expandedAds = [];
  let bannerAds = [];
  let letterheadSetting = booleanSetting(settings, 'LETTERHEAD_API_URL', false);
  if (letterheadSetting) {
    let letterheadParams = {
      url: findSetting(settings, 'LETTERHEAD_API_URL'),
      apiKey: findSetting(settings, 'LETTERHEAD_API_KEY'),
    };
    const allAds =
      (await cachedContents('ads', letterheadParams, getArticleAds)) || [];
    expandedAds = allAds.filter((ad) => {
      return (
        parseInt(ad.adTypeId) === parseInt(siteMetadata.expandedImageID) &&
        ad.status === 4
      );
    });
    bannerAds = allAds.filter((ad) => {
      return (
        parseInt(ad.adTypeId) === parseInt(siteMetadata.bannerAdID) &&
        ad.status === 4
      );
    });
  }

  return {
    props: {
      newsletters,
      sections,
      siteMetadata,
      expandedAds,
      site,
      monkeypodLink,
      bannerAds,
      totalPageCount,
      currentPage,
    },
  };
}
