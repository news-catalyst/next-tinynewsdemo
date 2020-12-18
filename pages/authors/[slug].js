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
import GlobalNav from '../../components/nav/GlobalNav.js';
import GlobalFooter from '../../components/nav/GlobalFooter.js';
import { useAmp } from 'next/amp';

export default function AuthorPage(props) {
  const isAmp = useAmp();
  return (
    <Layout meta={props.siteMetadata} locale={props.currentLocale}>
      <GlobalNav metadata={props.siteMetadata} sections={props.sections} />
      <div className="container">
        <section className="section">
          <h1 className="title">Articles by {props.author.name}</h1>
          <div className="columns">
            <div className="column is-four-fifths">
              {props.articles.map((article) => (
                <ArticleLink
                  key={article.id}
                  article={article}
                  locale={props.currentLocale}
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
  console.log('siteMetadata:', siteMetadata);

  return {
    props: {
      articles,
      currentLocale,
      author,
      sections,
      siteMetadata,
    },
  };
}
