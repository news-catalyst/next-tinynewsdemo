import DefaultErrorPage from 'next/error';
import {
  listAllLocales,
  getArticleBySlug,
  listAllArticleSlugs,
  listAllSections,
  listAllTags,
} from '../../../lib/articles.js';
import { getArticleAds } from '../../../lib/ads.js';
import { cachedContents } from '../../../lib/cached';
import Article from '../../../components/Article.js';

export default function PreviewArticle(props) {
  if (!props.article) {
    return (
      <div>
        <DefaultErrorPage statusCode={404} />
      </div>
    );
  }

  return <Article {...props} />;
}

export async function getStaticPaths({ locales }) {
  const paths = await listAllArticleSlugs(locales);
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

  const article = await getArticleBySlug(
    currentLocale,
    params.slug,
    process.env.CONTENT_DELIVERY_API_URL
  );
  const sections = await cachedContents('sections', listAllSections);
  const tags = await cachedContents('tags', listAllTags);
  const allAds = await cachedContents('ads', getArticleAds);
  const ads = allAds.filter((ad) => ad.adTypeId === 164);
  return {
    props: {
      ads,
      article,
      currentLocale,
      sections,
      tags,
    },
  };
}
