import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { getHomepageData } from '../lib/homepage.js';
import { useAmp } from 'next/amp';
import {
  listAllTags,
  listAllSections,
  listMostRecentArticles,
  getHomepageArticles,
} from '../lib/articles.js';
import Layout from '../components/Layout';
import { siteMetadata } from '../lib/siteMetadata.js';
import GlobalNav from '../components/nav/GlobalNav';
import GlobalFooter from '../components/nav/GlobalFooter';
import ArticleLink from '../components/homepage/ArticleLink';

const BigFeaturedStory = dynamic(() =>
  import(`../components/homepage/BigFeaturedStory`)
);
const LargePackageStoryLead = dynamic(() =>
  import(`../components/homepage/LargePackageStoryLead`)
);

export default function Home({
  hpData,
  hpArticles,
  streamArticles,
  tags,
  sections,
}) {
  const [featuredArticle, setFeaturedArticle] = useState(null);
  const isAmp = useAmp();
  const tagLinks = tags.map((tag) => (
    <Link key={tag.title} href={`/tags/${tag.slug}`}>
      <a className="panel-block is-active">{tag.title}</a>
    </Link>
  ));

  const featuredArticleIds = Object.values(hpArticles).map(
    (article) => article.id
  );
  console.log(featuredArticleIds);
  const mostRecentArticles = streamArticles.filter(
    (streamArticle) => !featuredArticleIds.includes(streamArticle.id)
  );
  console.log('streamArticles:', mostRecentArticles);

  return (
    <div className="homepage">
      <Layout meta={siteMetadata}>
        <GlobalNav metadata={siteMetadata} tags={tags} sections={sections} />
        {hpData.layoutComponent === 'BigFeaturedStory' && (
          <BigFeaturedStory
            articles={hpArticles}
            tags={tags}
            sections={sections}
            featuredArticle={featuredArticle}
            setFeaturedArticle={setFeaturedArticle}
            isAmp={isAmp}
          />
        )}
        {hpData.layoutComponent === 'LargePackageStoryLead' && (
          <LargePackageStoryLead
            articles={hpArticles}
            tags={tags}
            sections={sections}
            isAmp={isAmp}
          />
        )}
        <section className="section">
          <div className="columns">
            <div className="column is-three-quarters">
              {mostRecentArticles &&
                mostRecentArticles.map((streamArticle) => (
                  <ArticleLink
                    key={streamArticle.id}
                    article={streamArticle}
                    amp={isAmp}
                  />
                ))}
            </div>
            <div className="column">
              <nav className="panel">
                <p className="panel-heading">{siteMetadata.labels.topics}</p>
                {tagLinks}
              </nav>
            </div>
          </div>
        </section>
        <GlobalFooter post_type="home" />
      </Layout>
    </div>
  );
}

export async function getStaticProps() {
  //    get selected homepage layout / data
  const hpData = await getHomepageData();
  //    look up selected homepage articles
  const hpArticles = await getHomepageArticles(hpData.articles);

  const streamArticles = await listMostRecentArticles();

  const tags = await listAllTags();
  const sections = await listAllSections();

  return {
    props: {
      hpData,
      hpArticles,
      streamArticles,
      tags,
      sections,
    },
  };
}
