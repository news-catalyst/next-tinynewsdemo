import _ from 'lodash';
import React, { useState } from 'react';
import { useAmp } from 'next/amp';
import FeaturedArticleLink from './FeaturedArticleLink.js';
import ArticleCard from './ArticleCard.js';

export const config = { amp: 'hybrid' };

export default function LargePackageStoryLead(props) {
  const isAmp = useAmp();

  const [featuredArticle, setFeaturedArticle] = useState(
    props.articles['featured']
  );

  const [subfeaturedLeftArticle, setSubFeaturedLeftArticle] = useState(
    props.articles['subfeatured-left']
  );
  const [subfeaturedMiddleArticle, setSubFeaturedMiddleArticle] = useState(
    props.articles['subfeatured-middle']
  );
  const [subfeaturedRightArticle, setSubFeaturedRightArticle] = useState(
    props.articles['subfeatured-right']
  );

  return (
    <>
      <div className="featured-article">
        {featuredArticle && (
          <FeaturedArticleLink
            key={featuredArticle.id}
            article={featuredArticle}
            amp={isAmp}
          />
        )}
      </div>
      <section className="section">
        <div className="columns">
          <div className="column is-one-third">
            {subfeaturedLeftArticle && (
              <ArticleCard
                key={subfeaturedLeftArticle.id}
                article={subfeaturedLeftArticle}
                amp={isAmp}
              />
            )}
          </div>
          <div className="column is-one-third">
            {subfeaturedMiddleArticle && (
              <ArticleCard
                key={subfeaturedMiddleArticle.id}
                article={subfeaturedMiddleArticle}
                amp={isAmp}
              />
            )}
          </div>
          <div className="column is-one-third">
            {subfeaturedRightArticle && (
              <ArticleCard
                key={subfeaturedRightArticle.id}
                article={subfeaturedRightArticle}
                amp={isAmp}
              />
            )}
          </div>
        </div>
      </section>
    </>
  );
}
