import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import {
  listAllLocales,
  hasuraGetArticleBySlug,
  hasuraListAllArticleSlugs,
  listAllSections,
  hasuraListAllArticlesBySection,
} from '../../../lib/articles.js';
import { getArticleAds } from '../../../lib/ads.js';
import { getSiteMetadataForLocale } from '../../../lib/site_metadata.js';
import { cachedContents } from '../../../lib/cached';
import Article from '../../../components/Article.js';

export const config = { amp: 'hybrid' };

export default function ArticlePage(props) {
  const router = useRouter();

  // If the page is not yet generated, this will be displayed
  // initially until getStaticProps() finishes running
  // See: https://nextjs.org/docs/basic-features/data-fetching#the-fallback-key-required
  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  useEffect(() => {
    if (!props.article) {
      router.push('/404');
    }
  }, [props.article]);

  // trying to fix build errors...
  if (!props.article) {
    return (
      <>
        <h1>404 Page Not Found</h1>
      </>
    );
  }
  return <Article {...props} />;
}

export async function getStaticPaths() {
  const { errors, data } = await hasuraListAllArticleSlugs();
  if (errors) {
    throw errors;
  }

  let paths = [];
  for (const article of data.articles) {
    for (const locale of article.article_translations) {
      paths.push({
        params: {
          category: article.category.slug,
          slug: article.slug,
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
  const localeMappings = await cachedContents('locales', listAllLocales);

  const currentLocale = localeMappings.find(
    (localeMap) => localeMap.code === locale
  );

  const apiUrl = process.env.HASURA_API_URL;
  const apiToken = process.env.ORG_SLUG;

  let article = {};
  const { errors, data } = await hasuraGetArticleBySlug({
    url: apiUrl,
    orgSlug: apiToken,
    slug: params.slug,
    localeCode: currentLocale.code,
  });
  if (errors || !data) {
    return {
      notFound: true,
    };
    // throw errors;
  } else {
    article = data.articles[0];
  }

  const sections = await cachedContents('sections', listAllSections);
  const allAds = await cachedContents('ads', getArticleAds);
  const ads = allAds.filter((ad) => ad.adTypeId === 164);

  let sectionArticles = null;

  if (article) {
    const { errors, data } = await hasuraListAllArticlesBySection({
      url: apiUrl,
      orgSlug: apiToken,
      categorySlug: params.category,
      localeCode: currentLocale.code,
    });

    if (errors || !data) {
      return {
        notFound: true,
      };
      // throw errors;
    } else {
      sectionArticles = data.articles;
    }
    sectionArticles = sectionArticles.filter((a) => a.slug !== article.slug);
  }

  const siteMetadata = await getSiteMetadataForLocale(currentLocale);

  return {
    props: {
      article,
      currentLocale,
      sections,
      ads,
      siteMetadata,
      sectionArticles,
    },
    // Re-generate the post at most once per second
    // if a request comes in
    revalidate: 1,
  };
}
