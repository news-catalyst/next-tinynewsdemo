import Layout from '../../components/Layout.js';
import {
  listAllLocales,
  hasuraListAllArticlesForAuthor,
  listAllSections,
  hasuraListAllAuthorPaths,
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
  const apiUrl = process.env.HASURA_API_URL;
  const apiToken = process.env.ORG_SLUG;

  let paths = [];
  let authors = [];
  const { errors, data } = await hasuraListAllAuthorPaths({
    url: apiUrl,
    orgSlug: apiToken,
  });

  if (errors || !data) {
    console.log('error generating static paths for author page:', errors);
    return {
      paths,
      fallback: true,
    };
  } else {
    authors = data.authors;
  }

  for (const locale of locales) {
    authors.map((author) => {
      paths.push({
        params: {
          slug: author.slug,
        },
        locale,
      });
    });
  }

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

  const { err, getAuthorData } = await hasuraGetAuthorBySlug({
    url: apiUrl,
    orgSlug: apiToken,
    authorSlug: params.slug,
    localeCode: currentLocale.code,
  });
  let author = {};
  if (err || !getAuthorData) {
    console.log('error getting author by slug:', err, getAuthorData);
    return {
      notFound: true,
    };
  } else {
    author = getAuthorData.authors;
  }

  let articles = [];
  const { errors, data } = await hasuraListAllArticlesForAuthor({
    url: apiUrl,
    orgSlug: apiToken,
    authorSlug: params.slug,
    localeCode: currentLocale.code,
  });

  if (errors || !data) {
    console.log('error listing all articles for author:', errors);
    return {
      notFound: true,
    };
    // throw errors;
  } else {
    articles = data.articles;
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
