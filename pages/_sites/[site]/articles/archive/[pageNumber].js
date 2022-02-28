import { useRouter } from 'next/router';
import React, { useState } from 'react';
import tw, { styled } from 'twin.macro';
import Typography from '../../../../../components/common/Typography';
import Layout from '../../../../../components/Layout.js';
import {
  hasuraArticlesArchivePage,
  generateAllArticleArchivePages,
  getOrgSettings,
} from '../../../../../lib/articles.js';
import { getLatestVersion, booleanSetting } from '../../../../../lib/utils';
import { cachedContents } from '../../../../../lib/cached';
import { getArticleAds } from '../../../../../lib/ads.js';
import ArticleStream from '../../../../../components/homepage/ArticleStream';
import paginationStyles from '../../../../../styles/pagination.js';

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
}) {
  const [pageNumbers, setPageNumbers] = useState(range(totalPageCount, 1));
  const locale = 'en-US';

  let paginationLinks = [];

  if (currentPageNumber !== 1) {
    paginationLinks.push({
      name: 'previous',
      pageNum: currentPageNumber - 1,
      class: 'previous',
    });
  }

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
    <Layout meta={siteMetadata} sections={sections}>
      <ArticleStream
        sections={sections}
        articles={articles}
        title={`All Stories`}
        showCategory={true}
        isAmp={isAmp}
        metadata={siteMetadata}
        ads={expandedAds}
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
    limit: limit,
    offset: offset,
  });

  if (errors || !data) {
    return {
      notFound: true,
    };
  } else {
    articles = data.articles;
    sections = data.categories;

    totalArticleCount = data.articles_aggregate.aggregate.count;
    totalPageCount = Math.ceil(totalArticleCount / limit);

    for (var i = 0; i < sections.length; i++) {
      sections[i].title = getLatestVersion(
        sections[i].category_translations,
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
  let letterheadSetting = booleanSetting(
    settingsResult.data.settings,
    'LETTERHEAD_API_URL',
    false
  );
  if (letterheadSetting) {
    const allAds = (await cachedContents('ads', getArticleAds)) || [];
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
    },
  };
}