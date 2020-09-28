import _ from 'lodash';
import Layout from '../components/Layout.js';
import ArticleLink from '../components/homepage/ArticleLink.js';
import { cachedContents } from '../lib/cached';
import {
  listAllArticlesBySection,
  listAllSectionTitles,
  listAllSections,
  listAllTags,
} from '../lib/articles.js';
import { siteMetadata } from '../lib/siteMetadata.js';
import GlobalNav from '../components/nav/GlobalNav.js';
import GlobalFooter from '../components/nav/GlobalFooter.js';
import { useAmp } from 'next/amp';

export default function CategoryPage({ articles, title, sections, tags }) {
  const isAmp = useAmp();
  siteMetadata.tags = tags;
  return (
    <Layout meta={siteMetadata}>
      <GlobalNav sections={sections} />
      <div className="container">
        <section className="section">
          <h1 className="title">{title}</h1>
          <div className="columns">
            <div className="column is-four-fifths">
              {articles.map((article) => (
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
  const paths = await listAllSectionTitles();
  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const articles = await listAllArticlesBySection(params.category);
  const sections = await cachedContents('sections', listAllSections);
  const tags = await cachedContents('tags', listAllTags);
  let title;

  for (var i = 0; i < sections.length; i++) {
    if (sections[i].slug == params.category) {
      title = sections[i].title;
      break;
    }
  }
  return {
    props: {
      articles,
      title,
      tags,
      sections,
    },
  };
}
