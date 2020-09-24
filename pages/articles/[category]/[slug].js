import {
  getArticleBySlug,
  listAllArticleSlugs,
  listAllSections,
  listAllTags,
} from '../../../lib/articles.js';
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

export async function getStaticProps({ params }) {
  const article = await getArticleBySlug(params.slug);
  const tags = await cachedContents('tags', listAllTags);
  const sections = await cachedContents('sections', listAllSections);

  return {
    props: {
      article,
      sections,
      tags,
    },
    // Re-generate the post at most once per second
    // if a request comes in
    revalidate: 1,
  };
}
