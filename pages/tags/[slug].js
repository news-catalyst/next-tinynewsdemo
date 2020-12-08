import Layout from '../../components/Layout.js';
import {
  listAllArticlesByTag,
  listAllSections,
  listAllTagPaths,
  getTagBySlug,
} from '../../lib/articles.js';
import { cachedContents } from '../../lib/cached';
import { siteMetadata } from '../../lib/siteMetadata.js';
import { useAmp } from 'next/amp';
import ArticleStream from '../../components/homepage/ArticleStream';

export default function TagPage({ articles, tag, sections }) {
  const isAmp = useAmp();
  let tagTitle = tag.title.values[0].value;
  return (
    <Layout meta={siteMetadata} sections={sections}>
      <ArticleStream
        articles={articles}
        sections={sections}
        isAmp={isAmp}
        title={tagTitle}
      />
    </Layout>
  );
}

export async function getStaticPaths() {
  const paths = await listAllTagPaths();
  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const articles = await listAllArticlesByTag(params.slug);
  const sections = await cachedContents('sections', listAllSections);
  const tag = await getTagBySlug(params.slug);
  return {
    props: {
      articles,
      tag,
      sections,
    },
  };
}
