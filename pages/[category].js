import _ from 'lodash';
import { useRouter } from 'next/router';
import Layout from '../components/Layout.js';
import ArticleLink from '../components/homepage/ArticleLink.js';
import { cachedContents } from '../lib/cached';
import {
  listAllLocales,
  listAllArticlesBySection,
  listAllSectionTitles,
  listAllSections,
  listAllTags,
} from '../lib/articles.js';
import { localiseText } from '../lib/utils.js';
import { siteMetadata } from '../lib/siteMetadata.js';
import GlobalNav from '../components/nav/GlobalNav.js';
import GlobalFooter from '../components/nav/GlobalFooter.js';
import { useAmp } from 'next/amp';

export default function CategoryPage({
  currentLocale,
  articles,
  title,
  sections,
  tags,
}) {
  const isAmp = useAmp();
  siteMetadata.tags = tags;

  const router = useRouter();
  // If the page is not yet generated, this will be displayed
  // initially until getStaticProps() finishes running
  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  return (
    <Layout meta={siteMetadata}>
      <GlobalNav sections={sections} />
      <div className="container">
        <section className="section">
          <h1 className="title">{title}</h1>
          <div className="columns">
            <div className="column is-four-fifths">
              {articles.map((article) => (
                <ArticleLink
                  key={article.id}
                  locale={currentLocale}
                  article={article}
                  amp={isAmp}
                />
              ))}
            </div>
          </div>
        </section>
      </div>
      <GlobalFooter />
    </Layout>
  );
}

export async function getStaticPaths() {
  const paths = await listAllSectionTitles();
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
      currentLocale,
      articles,
      title,
      tags,
      sections,
    },
  };
}
