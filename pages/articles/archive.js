import { useRouter } from 'next/router';
import React, { useState } from 'react';
import tw from 'twin.macro';
import ReactPaginate from 'react-paginate';
import Layout from '../../components/Layout.js';
import { hasuraArticlesArchivePage } from '../../lib/articles.js';
import { hasuraLocaliseText } from '../../lib/utils';
import { cachedContents } from '../../lib/cached';
import { getArticleAds } from '../../lib/ads.js';
import { useAmp } from 'next/amp';
import ArticleStream from '../../components/homepage/ArticleStream';

const PaginationSection = tw.section`flex mb-8`;
const PaginationContainer = tw.div`md:grid md:grid-cols-packageLayoutTablet lg:grid-cols-packageLayoutDesktop flex flex-row flex-wrap grid-rows-1 w-full px-5 mx-auto max-w-7xl items-center justify-between border-t border-gray-200`;

export default function ArticlesArchivePage({
  apiUrl,
  apiToken,
  locale,
  sections,
  articles,
  totalCount,
  limit,
  siteMetadata,
  expandedAds,
}) {
  const [currentArticles, setCurrentArticles] = useState(articles);
  const [pageCount, setPageCount] = useState(Math.ceil(totalCount / limit));
  const [perPage, setPerPage] = useState(limit);
  // const [offset, setOffset] = useState(0);

  const router = useRouter();
  const isAmp = useAmp();
  // If the page is not yet generated, this will be displayed
  // initially until getStaticProps() finishes running
  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  const loadArticles = async (offset) => {
    console.log('loading articles with offset:', offset);
    const { errors, data } = await hasuraArticlesArchivePage({
      url: apiUrl,
      orgSlug: apiToken,
      localeCode: locale,
      limit: perPage,
      offset: offset,
    });

    if (errors || !data) {
      console.error('errors:', errors);
      return {
        notFound: true,
      };
    } else {
      console.log('data.articles:', data.articles);
      setCurrentArticles(data.articles);
    }
  };
  function handlePageClick(data) {
    console.log('data:', data);
    let selected = data.selected;
    let offset = Math.ceil(selected * perPage);

    loadArticles(offset);
  }

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
          />
        </PaginationContainer>
      </PaginationSection>
    </Layout>
  );
}

export async function getServerSideProps(context) {
  const apiUrl = process.env.HASURA_API_URL;
  const apiToken = process.env.ORG_SLUG;

  let articles = [];
  let sections = [];
  let siteMetadata;

  let locale = context.locale;
  let limit = context.query.limit || 10;
  let offset = context.query.offset || 0;

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
      apiUrl,
      apiToken,
      locale,
      sections,
      articles,
      totalCount,
      limit,
      siteMetadata,
      expandedAds,
    },
  };
}
