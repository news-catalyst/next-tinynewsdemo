import { useRouter } from 'next/router';
import React, { useState } from 'react';
import tw, { styled } from 'twin.macro';
import Typography from '../../../../../components/common/Typography';
import Layout from '../../../../../components/Layout.js';
import {
  hasuraArticlesArchivePage,
  generateAllArticleArchivePages,
} from '../../../../../lib/articles.js';
import {
  booleanSetting,
  findSetting,
  getOrgSettings,
} from '../../../../../lib/settings.js';
import { cachedContents } from '../../../../../lib/cached';
import { getArticleAds } from '../../../../../lib/ads.js';
import ArticleStream from '../../../../../components/homepage/ArticleStream';
import paginationStyles from '../../../../../styles/pagination.js';
import { NextSeo } from 'next-seo';

const PaginationSection = tw.section`flex mb-8`;
const PaginationContainer = styled.div(({ meta }) => ({
  ...tw`md:grid md:grid-cols-packageLayoutTablet lg:grid-cols-packageLayoutDesktop flex flex-row flex-wrap grid-rows-1 w-full px-5 mx-auto max-w-7xl items-center justify-between`,
  fontFamily: Typography[meta.theme || 'styleone'].ArticleMetaTop,
}));

export default function ArticlesArchivePage({
  sections,
  articles,
  totalPageCount,
  currentPageNumber,
  siteMetadata,
  expandedAds,
  monkeypodLink,
  site,
}) {
  const [pageNumbers, setPageNumbers] = useState(range(totalPageCount, 1));

  let paginationLinks = [];

  if (currentPageNumber !== 1) {
    paginationLinks.push({
      name: 'previous',
      pageNum: currentPageNumber - 1,
      class: 'previous',
    });
  }

  // console.log(articles);

  pageNumbers.forEach((pageNumber) => {
    let pageLink = {
      name: pageNumber,
      pageNum: pageNumber,
    };
    if (pageNumber === currentPageNumber) {
      pageLink['class'] = 'active';
    }
    paginationLinks.push(pageLink);
  });

  if (currentPageNumber !== totalPageCount) {
    paginationLinks.push({
      name: 'next',
      pageNum: currentPageNumber + 1,
      class: 'next',
    });
  }

  const router = useRouter();
  const isAmp = false;
  // If the page is not yet generated, this will be displayed
  // initially until getStaticProps() finishes running
  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  return (
    <Layout
      meta={siteMetadata}
      sections={sections}
      monkeypodLink={monkeypodLink}
      site={site}
    >
      <ArticleStream
        sections={sections}
        articles={articles}
        title={`All Stories`}
        showCategory={true}
        isAmp={isAmp}
        metadata={siteMetadata}
        ads={expandedAds}
        monkeypodLink={monkeypodLink}
      />
      <PaginationSection>
        <PaginationContainer meta={siteMetadata}>
          <ul className="pagination">
            {paginationLinks.map((pageLink) => (
              <li key={`page-link-${pageLink.name}`} className={pageLink.class}>
                <a href={`/articles/archive/${pageLink.pageNum}`}>
                  {pageLink.name}
                </a>
              </li>
            ))}
          </ul>
        </PaginationContainer>
      </PaginationSection>

      <style jsx global>
        {paginationStyles}
      </style>

      <NextSeo
        title={`Article Archive page ${currentPageNumber} | ${siteMetadata.searchTitle}`}
        description={siteMetadata.searchDescription}
        canonical={`${siteMetadata.siteUrl}/articles/archive/${currentPageNumber}`}
        openGraph={{
          title: `Article Archive page ${currentPageNumber} | ${siteMetadata.searchTitle}`,
          description:
            siteMetadata.facebookDescription || siteMetadata.searchDescription,
          url: `${siteMetadata.siteUrl}/articles/archive/${currentPageNumber}`,
          images: [
            {
              url: siteMetadata.defaultSocialImage,
              width: siteMetadata.defaultSocialImageWidth,
              height: siteMetadata.defaultSocialImageHeight,
            },
          ],
        }}
      />
    </Layout>
  );
}

function range(size, startAt = 0) {
  return [...Array(size).keys()].map((i) => i + startAt);
}
export async function getStaticPaths() {
  const apiUrl = process.env.HASURA_API_URL;
  const adminSecret = process.env.HASURA_ADMIN_SECRET;

  const paths = await generateAllArticleArchivePages({
    url: apiUrl,
    adminSecret: adminSecret,
    urlParams: {},
  });

  return {
    paths,
    fallback: true,
  };
}

export async function getStaticProps(context) {
  const apiUrl = process.env.HASURA_API_URL;
  const site = context.params.site;
  const locale = 'en-US';

  const settingsResult = await getOrgSettings({
    url: apiUrl,
    site: site,
  });

  if (settingsResult.errors) {
    throw settingsResult.errors;
  }

  let articles = [];
  let sections = [];
  let siteMetadata;

  let currentPageNumber = parseInt(context.params.pageNumber);
  let limit = 10;
  let offset = (currentPageNumber - 1) * limit;

  let totalArticleCount = 0;
  let totalPageCount = 1;

  const { errors, data } = await hasuraArticlesArchivePage({
    url: apiUrl,
    site: site,
    limit: limit,
    offset: offset,
    localeCode: 'en-US',
  });

  if (errors || !data) {
    console.error(errors);
    return {
      notFound: true,
    };
  } else {
    articles = data.articles;
    sections = data.categories;

    totalArticleCount = data.articles_aggregate.aggregate.count;
    totalPageCount = Math.ceil(totalArticleCount / limit);

    for (var i = 0; i < sections.length; i++) {
      sections[i].title = sections[i].category_translations[0].title;
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
      sections,
      articles,
      totalPageCount,
      currentPageNumber,
      siteMetadata,
      expandedAds,
      monkeypodLink,
      site,
    },
  };
}
