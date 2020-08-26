import {
  getArticleBySlug,
  listAllArticleSlugs,
  listAllSections,
  listAllTags,
} from '../../../lib/articles.js';
import Article from '../../../components/Article.js';

export default function PreviewArticle(props) {
  return <Article {...props} />;
}

export async function getStaticPaths() {
  const paths = await listAllArticleSlugs();
  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const article = await getArticleBySlug(
    params.slug,
    process.env.PREVIEW_API_URL
  );
  const sections = await listAllSections();
  const tags = await listAllTags();
  return {
    props: {
      article,
      sections,
      tags,
    },
  };
}
