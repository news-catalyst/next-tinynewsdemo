import {
  listAllLocales,
  getArticleBySlug,
  listAllArticleSlugs,
  listAllSections,
  listAllTags,
} from '../../../lib/articles.js';
import { getArticleAds } from '../../../lib/ads.js';
import { cachedContents } from '../../../lib/cached';
import { useRouter } from 'next/router';
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

  return <Article {...props} />;
}

export async function getStaticPaths() {
  const paths = await listAllArticleSlugs();
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
  // console.log("article page article:", article);

  const tags = await cachedContents('tags', listAllTags);
  const sections = await cachedContents('sections', listAllSections);
  const allAds = await cachedContents('ads', getArticleAds);
  const ads = allAds.filter((ad) => ad.adTypeId === 164);

  return {
    props: {
      currentLocale,
      article,
      sections,
      tags,
      ads,
    },
    // Re-generate the post at most once per second
    // if a request comes in
    revalidate: 1,
  };
}
