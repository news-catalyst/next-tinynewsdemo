import { useRouter } from 'next/router';
import React, { useState } from 'react';
import tw from 'twin.macro';
import ReactPaginate from 'react-paginate';
import Layout from '../../../components/Layout.js';
import {
  hasuraArticlesArchivePage,
  hasuraListArticleArchivePages,
} from '../../../lib/articles.js';
import { hasuraLocaliseText } from '../../../lib/utils';
import { cachedContents } from '../../../lib/cached';
import { getArticleAds } from '../../../lib/ads.js';
import { useAmp } from 'next/amp';
import ArticleStream from '../../../components/homepage/ArticleStream';
import paginationStyles from '../../../styles/pagination.js';

const PaginationSection = tw.section`flex mb-8`;
const PaginationContainer = tw.div`md:grid md:grid-cols-packageLayoutTablet lg:grid-cols-packageLayoutDesktop flex flex-row flex-wrap grid-rows-1 w-full px-5 mx-auto max-w-7xl items-center justify-between`;

export default function ArticlesArchivePage({
  sections,
  articles,
  totalCount,
  limit,
  pageNumber,
  siteMetadata,
  expandedAds,
}) {
  const [currentArticles, setCurrentArticles] = useState(articles);
  const [pageCount, setPageCount] = useState(Math.ceil(totalCount / limit));
  // const [perPage, setPerPage] = useState(limit);
  // const [offset, setOffset] = useState(0);

  const router = useRouter();
  const isAmp = useAmp();
  // If the page is not yet generated, this will be displayed
  // initially until getStaticProps() finishes running
  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  function handlePageClick(data) {
    let selected = data.selected;
    router.push({
      pathname: router.pathname,
      query: {
        pageNumber: selected,
      },
    });
  }
  console.log('pageNumber', pageNumber, typeof pageNumber);
  return (
    <Layout meta={siteMetadata} sections={sections}>
      <ArticleStream
        sections={sections}
        articles={currentArticles}
        title={`Articles Archive`}
        showCategory={true}
        isAmp={isAmp}
        metadata={siteMetadata}
        ads={expandedAds}
      />
      <PaginationSection>
        <PaginationContainer>
          <ReactPaginate
            previousLabel={'previous'}
            nextLabel={'next'}
            breakLabel={'...'}
            breakClassName={'break-me'}
            pageCount={pageCount}
            marginPagesDisplayed={2}
            pageRangeDisplayed={5}
            onPageChange={handlePageClick}
            containerClassName={'pagination'}
            activeClassName={'active'}
            forcePage={pageNumber}
          />
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
  const { errors, data } = await hasuraListArticleArchivePages();
  if (errors) {
    throw errors;
  }

  let limit = 10;
  let totalCount = data.articles_aggregate.aggregate.count;
  let pageCount = Math.ceil(totalCount / limit);

  let pageNumbers = range(pageCount, 1);
  let paths = [];
  for (const pageNum of pageNumbers) {
    paths.push({
      params: {
        pageNumber: pageNum.toString(),
      },
    });
  }

  console.log(paths);
  return {
    paths,
    fallback: true,
  };
}

export async function getStaticProps(context) {
  const apiUrl = process.env.HASURA_API_URL;
  const apiToken = process.env.ORG_SLUG;

  console.log('context:', context);

  let articles = [];
  let sections = [];
  let siteMetadata;

  let locale = context.locale;
  let pageNumber = parseInt(context.params.pageNumber);
  let limit = 10;
  let offset = (pageNumber - 1) * limit;

  let totalCount = 0;

  const { errors, data } = await hasuraArticlesArchivePage({
    url: apiUrl,
    orgSlug: apiToken,
    localeCode: locale,
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

    totalCount = data.articles_aggregate.aggregate.count;

    for (var i = 0; i < sections.length; i++) {
      sections[i].title = hasuraLocaliseText(
        sections[i].category_translations,
        'title'
      );
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
      sections,
      articles,
      totalCount,
      limit,
      pageNumber,
      siteMetadata,
      expandedAds,
    },
  };
}
