import Layout from '../../components/Layout.js';
import {
  listAllLocales,
  listAllArticlesByTag,
  listAllSections,
  listAllTagPaths,
  getTagBySlug,
} from '../../lib/articles.js';
import { getSiteMetadataForLocale } from '../../lib/site_metadata.js';
import { cachedContents } from '../../lib/cached';
import { localiseText } from '../../lib/utils.js';
import { useAmp } from 'next/amp';
import ArticleStream from '../../components/homepage/ArticleStream';

export default function TagPage({
  articles,
  tag,
  sections,
  currentLocale,
  siteMetadata,
}) {
  const isAmp = useAmp();
  let tagTitle = localiseText(currentLocale, tag.title);
  return (
    <Layout meta={siteMetadata} sections={sections} locale={currentLocale}>
      <ArticleStream
        articles={articles}
        sections={sections}
        showCategory={true}
        isAmp={isAmp}
        title={`Articles tagged with ${tagTitle}`}
        locale={currentLocale}
      />
    </Layout>
  );
}

export async function getStaticPaths({ locales }) {
  const paths = await listAllTagPaths(locales);
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

  const siteMetadata = await getSiteMetadataForLocale(currentLocale);
  console.log('siteMetadata:', siteMetadata);

  const articles = await listAllArticlesByTag(currentLocale, params.slug);
  const sections = await cachedContents('sections', listAllSections);
  const tag = await getTagBySlug(params.slug);
  return {
    props: {
      currentLocale,
      articles,
      tag,
      sections,
      siteMetadata,
    },
  };
}
