import Layout from '../../components/Layout.js';
import ArticleLink from '../../components/homepage/ArticleLink.js';
import {
  listAllArticlesByTag,
  listAllSections,
  listAllTagPaths,
  getTagBySlug,
} from '../../lib/articles.js';
import { cachedContents } from '../../lib/cached';
import { siteMetadata } from '../../lib/siteMetadata.js';
import GlobalNav from '../../components/nav/GlobalNav.js';
import GlobalFooter from '../../components/nav/GlobalFooter.js';
import { useAmp } from 'next/amp';

export default function TagPage(props) {
  const isAmp = useAmp();
  return (
    <Layout meta={siteMetadata}>
      <GlobalNav sections={props.sections} />
      <div className="container">
        <section className="section">
          <h1 className="title">Articles tagged with {props.tag.title}</h1>
          <div className="columns">
            <div className="column is-four-fifths">
              {props.articles.map((article) => (
                <ArticleLink key={article.id} article={article} amp={isAmp} />
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
