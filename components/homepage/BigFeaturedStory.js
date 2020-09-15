import React, { useEffect, useState } from 'react';
import FeaturedArticleLink from './FeaturedArticleLink.js';
import FeaturedSidebar from './FeaturedSidebar.js';

export default function BigFeaturedStory(props) {
  const [featuredArticle, setFeaturedArticle] = useState(
    props.articles['featured']
  );

  useEffect(() => {
    setFeaturedArticle(props.articles['featured']);
  }, [props.articles]);

  return (
    <>
      <div className="featured-article">
        <div className="columns">
          <div className="column is-two-thirds">
            {featuredArticle && (
              <FeaturedArticleLink
                key={featuredArticle.id}
                article={featuredArticle}
                amp={props.isAmp}
              />
            )}
          </div>
          <div className="column is-one-third">
            <FeaturedSidebar />
          </div>
        </div>
      </div>
    </>
  );
}
