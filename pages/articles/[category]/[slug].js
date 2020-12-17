import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import {
  listAllLocales,
  getArticleBySlug,
  listAllArticleSlugs,
  listAllSections,
  listAllTags,
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
    console.log('router is fallback', router.pathname);
    return <div>Loading...</div>;
  }

  useEffect(() => {
    if (!props.article) {
      router.push('/404');
    }
  }, [props.article]);

  // trying to fix build errors...
  if (!props.article) {
    console.log('ArticlePage no article prop found:', router.pathname);
    return (
      <>
        <h1>404 Page Not Found</h1>
      </>
    );
  }
  return <Article {...props} />;
}

export async function getStaticPaths({ locales }) {
  const paths = await listAllArticleSlugs(locales);
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
  // console.log("article page currentLocale:", currentLocale);

  const article = await getArticleBySlug(currentLocale, params.slug);

  if (article === null) {
    console.log('failed finding article for:', currentLocale.code, params.slug);
  }
  const tags = await cachedContents('tags', listAllTags);
  const sections = await cachedContents('sections', listAllSections);
  const allAds = await cachedContents('ads', getArticleAds);
  const ads = allAds.filter((ad) => ad.adTypeId === 164);

  const siteMetadata = await getSiteMetadataForLocale(currentLocale);
  console.log('siteMetadata:', siteMetadata);

  return {
    props: {
      article,
      currentLocale,
      sections,
      tags,
      ads,
      siteMetadata,
    },
    // Re-generate the post at most once per second
    // if a request comes in
    revalidate: 1,
  };
}
