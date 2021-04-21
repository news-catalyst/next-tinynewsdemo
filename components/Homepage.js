import React, { useState } from 'react';
import dynamic from 'next/dynamic';

const BigFeaturedStory = dynamic(() => import(`./homepage/BigFeaturedStory`));
const LargePackageStoryLead = dynamic(() =>
  import(`./homepage/LargePackageStoryLead`)
);
import HomepagePromoBar from './homepage/HomepagePromoBar';

import Layout from './Layout';
import ArticleStream from './homepage/ArticleStream';
import Placeholder from './homepage/Placeholder';

export default function Homepage({
  selectedLayout,
  featured,
  topFeatured,
  bottomFeatured,
  streamArticles,
  sections,
  locale,
  siteMetadata,
  expandedAds,
}) {
  const [featuredArticle, setFeaturedArticle] = useState(featured);
  const [subFeaturedTopArticle, setSubFeaturedTopArticle] = useState(
    topFeatured
  );
  const [subFeaturedBottomArticle, setSubFeaturedBottomArticle] = useState(
    bottomFeatured
  );
  const [mostRecentArticles, setMostRecentArticles] = useState(streamArticles);

  return (
    <div className="homepage">
      <Layout meta={siteMetadata} sections={sections} locale={locale}>
        {!selectedLayout && <Placeholder />}
        {selectedLayout.name === 'Big Featured Story' && (
          <BigFeaturedStory
            sections={sections}
            featuredArticle={featuredArticle}
            setFeaturedArticle={setFeaturedArticle}
            isAmp={false}
            metadata={siteMetadata}
          />
        )}
        {selectedLayout.name === 'Large Package Story Lead' && (
          <LargePackageStoryLead
            locale={locale}
            featuredArticle={featuredArticle}
            setFeaturedArticle={setFeaturedArticle}
            subFeaturedTopArticle={subFeaturedTopArticle}
            setSubFeaturedTopArticle={setSubFeaturedTopArticle}
            subFeaturedBottomArticle={subFeaturedBottomArticle}
            setSubFeaturedBottomArticle={setSubFeaturedBottomArticle}
            sections={sections}
            isAmp={false}
            metadata={siteMetadata}
          />
        )}
        <HomepagePromoBar metadata={siteMetadata} />
        <ArticleStream
          articles={mostRecentArticles}
          sections={sections}
          showCategory={true}
          isAmp={false}
          title={'Recent Stories'}
          metadata={siteMetadata}
          ads={expandedAds}
        />
      </Layout>
    </div>
  );
}
