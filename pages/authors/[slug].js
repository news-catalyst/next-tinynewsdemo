import Layout from '../../components/Layout.js';
import {
  listAllLocales,
  hasuraListAllArticlesForAuthor,
  listAllSections,
  listAllAuthorPaths,
  hasuraGetAuthorBySlug,
} from '../../lib/articles.js';
import { getSiteMetadataForLocale } from '../../lib/site_metadata.js';
import { cachedContents } from '../../lib/cached';
import { getArticleAds } from '../../lib/ads.js';
import { useAmp } from 'next/amp';
import ArticleStream from '../../components/homepage/ArticleStream';

export default function AuthorPage({
  sections,
  articles,
  author,
  siteMetadata,
  currentLocale,
  expandedAds,
}) {
  const isAmp = useAmp();
  return (
    <Layout meta={siteMetadata} sections={sections} locale={currentLocale}>
      <ArticleStream
        sections={sections}
        articles={articles}
        title={`Stories by ${author.name}`}
        showCategory={true}
        isAmp={isAmp}
        locale={currentLocale}
        metadata={siteMetadata}
        ads={expandedAds}
      />
    </Layout>
  );
}

export async function getStaticPaths({ locales }) {
  const paths = await listAllAuthorPaths(locales);
  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ locale, params }) {
  const apiUrl = process.env.HASURA_API_URL;
  const apiToken = process.env.ORG_SLUG;

  const localeMappings = await cachedContents('locales', listAllLocales);

  const currentLocale = localeMappings.find(
    (localeMap) => localeMap.code === locale
  );

  let articles = [];
  const { errors, data } = await hasuraListAllArticlesForAuthor({
    url: apiUrl,
    orgSlug: apiToken,
    authorSlug: params.slug,
    localeCode: currentLocale.code,
  });

  if (errors || !data) {
    return {
      notFound: true,
    };
    // throw errors;
  } else {
    articles = data.articles;
  }
  const { authorErrors, authorData } = await hasuraGetAuthorBySlug({
    url: apiUrl,
    orgSlug: apiToken,
    authorSlug: params.slug,
    localeCode: currentLocale.code,
  });
  let author = {};
  if (authorErrors || !authorData) {
    return {
      notFound: true,
    };
  } else {
    author = data.author;
  }

  const sections = await cachedContents('sections', listAllSections);

  const siteMetadata = await getSiteMetadataForLocale(currentLocale);
  const allAds = await cachedContents('ads', getArticleAds);
  const expandedAds = allAds.filter((ad) => ad.adTypeId === 166);

  return {
    props: {
      articles,
      currentLocale,
      author,
      sections,
      siteMetadata,
      expandedAds,
    },
  };
}
