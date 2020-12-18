import { useRouter } from 'next/router';
import Layout from '../components/Layout.js';
import { cachedContents } from '../lib/cached';
import { getSiteMetadataForLocale } from '../lib/site_metadata.js';
import {
  listAllLocales,
  listAllArticlesBySection,
  listAllSectionTitles,
  listAllSections,
  listAllTags,
} from '../lib/articles.js';
import { localiseText } from '../lib/utils.js';
import GlobalNav from '../components/nav/GlobalNav.js';
import GlobalFooter from '../components/nav/GlobalFooter.js';
import { useAmp } from 'next/amp';
import ArticleStream from '../components/homepage/ArticleStream';

export default function CategoryPage(props) {
  console.log('CategoryPage props:', props);
  console.log('CategoryPage metadata:', props.siteMetadata);

  const isAmp = useAmp();

  const router = useRouter();
  // If the page is not yet generated, this will be displayed
  // initially until getStaticProps() finishes running
  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  return (
    <Layout
      meta={props.siteMetadata}
      sections={props.sections}
      locale={props.currentLocale}
    >
      <ArticleStream
        articles={props.articles}
        sections={props.sections}
        isAmp={isAmp}
        title={props.title}
        locale={props.currentLocale}
      />
    </Layout>
  );
}

export async function getStaticPaths({ locales }) {
  const paths = await listAllSectionTitles(locales);
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

  const siteMetadata = await getSiteMetadataForLocale(currentLocale);
  console.log('CategoryPageProps siteMetadata:', siteMetadata);

  const articles = await listAllArticlesBySection(
    currentLocale,
    params.category
  );
  const sections = await listAllSections();
  // const sections = await cachedContents('sections', listAllSections);

  const tags = await cachedContents('tags', listAllTags);
  let title;

  for (var i = 0; i < sections.length; i++) {
    if (sections[i].slug == params.category) {
      if (sections[i].title && sections[i].title.values) {
        title = localiseText(currentLocale, sections[i].title);
        break;
      }
    }
  }
  return {
    props: {
      articles,
      currentLocale,
      tags,
      title,
      sections,
      siteMetadata,
    },
  };
}
