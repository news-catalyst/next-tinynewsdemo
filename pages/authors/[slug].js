import Layout from '../../components/Layout.js';
import ArticleLink from '../../components/homepage/ArticleLink.js';
import {
  listAllArticlesByAuthor,
  listAllSections,
  listAllAuthorPaths,
  getAuthorBySlug,
} from '../../lib/articles.js';
import { cachedContents } from '../../lib/cached';
import { siteMetadata } from '../../lib/siteMetadata.js';
import { useAmp } from 'next/amp';
import ArticleStream from '../../components/homepage/ArticleStream';

export default function AuthorPage({ sections, articles, author }) {
  const isAmp = useAmp();
  return (
    <Layout meta={siteMetadata} sections={sections}>
      <ArticleStream
        sections={sections}
        articles={articles}
        title={`Stories by ${author.name}`}
        isAmp={isAmp}
      />
    </Layout>
  );
}

export async function getStaticPaths() {
  const paths = await listAllAuthorPaths();
  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const articles = await listAllArticlesByAuthor(params.slug);
  const sections = await cachedContents('sections', listAllSections);
  const author = await getAuthorBySlug(params.slug);
  return {
    props: {
      articles,
      author,
      sections,
    },
  };
}
