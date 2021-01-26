import Layout from '../../components/Layout.js';
import ArticleLink from '../../components/homepage/ArticleLink.js';
import {
  listAllLocales,
  listAllArticlesByAuthor,
  listAllSections,
  listAllAuthorPaths,
  getAuthorBySlug,
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
  const localeMappings = await cachedContents('locales', listAllLocales);

  const currentLocale = localeMappings.find(
    (localeMap) => localeMap.code === locale
  );
  const articles = await listAllArticlesByAuthor(locale, params.slug);
  const sections = await cachedContents('sections', listAllSections);
  const author = await getAuthorBySlug(params.slug);

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
