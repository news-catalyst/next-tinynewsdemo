import Layout from '../../components/Layout.js';
import ArticleLink from '../../components/homepage/ArticleLink.js';
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
import GlobalNav from '../../components/nav/GlobalNav.js';
import GlobalFooter from '../../components/nav/GlobalFooter.js';
import { useAmp } from 'next/amp';

export default function TagPage(props) {
  const isAmp = useAmp();
  console.log('props.tag', props.tag);
  let tagTitle = localiseText(props.currentLocale, props.tag.title);
  return (
    <Layout meta={props.siteMetadata} locale={props.currentLocale}>
      <GlobalNav metadata={props.siteMetadata} sections={props.sections} />
      <div className="container">
        <section className="section">
          <h1 className="title">Articles tagged with {tagTitle}</h1>
          <div className="columns">
            <div className="column is-four-fifths">
              {props.articles.map((article) => (
                <ArticleLink
                  key={article.id}
                  locale={props.currentLocale}
                  article={article}
                  amp={isAmp}
                />
              ))}
            </div>
          </div>
        </section>
      </div>
      <GlobalFooter metadata={props.siteMetadata} />
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
