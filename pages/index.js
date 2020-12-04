import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { getHomepageData } from '../lib/homepage.js';
import { useAmp } from 'next/amp';
import { useRouter } from 'next/router';
import { cachedContents } from '../lib/cached';
import {
  listAllLocales,
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
  sections,
  currentLocale,
}) {
  // const router = useRouter();
  // const { locale, locales, defaultLocale } = router;

  const [featuredArticle, setFeaturedArticle] = useState(
    hpArticles['featured']
  );
  const [subFeaturedLeftArticle, setSubFeaturedLeftArticle] = useState(
    hpArticles['subfeatured-left']
  );
  const [subFeaturedRightArticle, setSubFeaturedRightArticle] = useState(
    hpArticles['subfeatured-right']
  );
  const [subFeaturedMiddleArticle, setSubFeaturedMiddleArticle] = useState(
    hpArticles['subfeatured-middle']
  );
  const isAmp = useAmp();

  const featuredArticleIds = Object.values(hpArticles).map(
    (article) => article.id
  );
  const mostRecentArticles = streamArticles.filter(
    (streamArticle) => !featuredArticleIds.includes(streamArticle.id)
  );

  console.log('current locale:', currentLocale);

  return (
    <div className="homepage">
      <Layout meta={siteMetadata}>
        <GlobalNav metadata={siteMetadata} sections={sections} />
        <div className="container">
          {hpData.layoutComponent === 'BigFeaturedStory' && (
            <BigFeaturedStory
              locale={currentLocale}
              articles={hpArticles}
              sections={sections}
              featuredArticle={featuredArticle}
              setFeaturedArticle={setFeaturedArticle}
              isAmp={isAmp}
            />
          )}
          {hpData.layoutComponent === 'LargePackageStoryLead' && (
            <LargePackageStoryLead
              locale={currentLocale}
              articles={hpArticles}
              featuredArticle={featuredArticle}
              setFeaturedArticle={setFeaturedArticle}
              subFeaturedLeftArticle={subFeaturedLeftArticle}
              setSubFeaturedLeftArticle={setSubFeaturedLeftArticle}
              subFeaturedRightArticle={subFeaturedRightArticle}
              setSubFeaturedRightArticle={setSubFeaturedRightArticle}
              subFeaturedMiddleArticle={subFeaturedMiddleArticle}
              setSubFeaturedMiddleArticle={setSubFeaturedMiddleArticle}
              sections={sections}
              isAmp={isAmp}
            />
          )}
          <section className="section">
            <div className="columns">
              <div className="column is-11 is-offset-1">
                {mostRecentArticles &&
                  mostRecentArticles.map((streamArticle) => (
                    <ArticleLink
                      key={streamArticle.id}
                      article={streamArticle}
                      amp={isAmp}
                    />
                  ))}
              </div>
            </div>
          </section>
        </div>
        <GlobalFooter post_type="home" />
      </Layout>
    </div>
  );
}

export async function getStaticProps({ locale }) {
  const localeMappings = await cachedContents('locales', listAllLocales);

  const currentLocale = localeMappings.find(
    (localeMap) => localeMap.code === locale
  );
  console.log('currentLocale is:', currentLocale);
  // TODO: if we can't find the selected locale fallback to the default? or just error?

  //    get selected homepage layout and featured article IDs
  const hpData = await getHomepageData();
  //    look up featured homepage articles
  const hpArticles = await getHomepageArticles(currentLocale, hpData);
  // const hpArticles = { "featured": ""}

  const streamArticles = await listMostRecentArticles();

  const sections = await cachedContents('sections', listAllSections);

  return {
    props: {
      hpData,
      hpArticles,
      streamArticles,
      sections,
      currentLocale,
    },
    revalidate: 1,
  };
}
