import _ from 'lodash';
import Link from 'next/link';
import { getHomepageData } from '../lib/homepage.js';
import { listAllArticles } from '../lib/articles.js';
import { listAllTags } from '../lib/articles.js';
import { listAllSections } from '../lib/articles.js';
import Layout from '../components/Layout.js';
import ArticleNav from '../components/nav/ArticleNav.js';
import FeaturedArticleLink from '../components/homepage/FeaturedArticleLink.js';
import ArticleLink from '../components/homepage/ArticleLink.js';
import ArticleFooter from '../components/nav/ArticleFooter.js';
// import HomepageSearchPanel from '../components/homepage/HomepageSearchPanel.js'
import { useAmp } from 'next/amp';
import { siteMetadata } from '../lib/siteMetadata.js';

import dynamic from 'next/dynamic';

const BigFeaturedStory = dynamic(() =>
  import(`../components/homepage/BigFeaturedStory`)
);
const LargePackageStoryLead = dynamic(() =>
  import(`../components/homepage/LargePackageStoryLead`)
);

export const config = { amp: 'hybrid' };

export default function Home({ hpData, articles, tags, sections }) {
  const isAmp = useAmp();

  console.log('hpdata:', hpData);
  return (
    <>
      {hpData.layoutComponent === 'BigFeaturedStory' && (
        <BigFeaturedStory articles={hpData.articles} />
      )}
      {hpData.layoutComponent === 'LargePackageStoryLead' && (
        <LargePackageStoryLead articles={hpData.articles} />
      )}
    </>
  );

  // let hpComponent = `<${hpData.layoutComponent} articles=${hpData.articles} />`;
  // console.log("HP component: ", hpComponent);

  siteMetadata.tags = tags;

  let featuredArticles = articles.slice(0, 1);
  let unfeaturedArticles = articles.slice(1);

  const tagLinks = tags.map((tag) => (
    <Link key={tag.title} href={`/tags/${tag.title}`}>
      <a className="panel-block is-active">{_.startCase(tag.title)}</a>
    </Link>
  ));

  return (
    <div className="homepage">
      <ArticleNav metadata={siteMetadata} tags={tags} sections={sections} />
      <Layout meta={siteMetadata}>
        <section className="hero is-dark is-bold">
          <div className="hero-body">
            <div className="container">
              <h1 className="title">{siteMetadata.homepageTitle}</h1>
              <h2 className="subtitle">{siteMetadata.homepageSubtitle}</h2>
            </div>
          </div>
        </section>
        <div className="featured-article">
          {featuredArticles.map((featuredArticle) => (
            <FeaturedArticleLink
              key={featuredArticle.id}
              article={featuredArticle}
              amp={isAmp}
            />
          ))}
        </div>
        <section className="section">
          <div className="columns">
            <div className="column is-four-fifths">
              {unfeaturedArticles.map((unfeaturedArticle) => (
                <ArticleLink
                  key={unfeaturedArticle.id}
                  article={unfeaturedArticle}
                  amp={isAmp}
                />
              ))}
            </div>
            <div className="column">
              {/* <HomepageSearchPanel metadata={siteMetadata} query={query} setQuery={setQuery} /> */}
              <nav className="panel">
                <p className="panel-heading">{siteMetadata.labels.topics}</p>
                {tagLinks}
              </nav>
            </div>
          </div>
        </section>
      </Layout>
      <ArticleFooter post_type="home" metadata={siteMetadata} />
    </div>
  );
}

export async function getStaticProps() {
  // to-do:
  //    get selected homepage layout / data
  const hpData = await getHomepageData();
  //    look up selected homepage articles
  //    render correct layout components (above)

  const articles = await listAllArticles();
  const tags = await listAllTags();
  const sections = await listAllSections();

  return {
    props: {
      hpData,
      articles,
      tags,
      sections,
    },
  };
}
