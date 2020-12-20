import React, { useEffect, useState } from 'react';
import FeaturedArticleLink from './FeaturedArticleLink.js';
import FeaturedSidebar from './FeaturedSidebar';
import ModalArticleSearch from '../tinycms/ModalArticleSearch';

export default function BigFeaturedStory(props) {
  const [isModalActive, setModal] = useState(false);

  useEffect(() => {
    console.log('BigFeaturedStory useEffect props:', props);
    // props.setFeaturedArticle(props.articles['featured']);
  }, [props.articles, props.featuredArticle]);

  return (
    <div className="homepage">
      <div className="featured-article">
        <div className="columns">
          <div className="column is-two-thirds">
            {props.editable && (
              <>
                <ModalArticleSearch
                  apiUrl={props.apiUrl}
                  apiToken={props.apiToken}
                  isActive={isModalActive}
                  locale={props.locale}
                  setModal={setModal}
                  featuredArticle={props.featuredArticle}
                  setFeaturedArticle={props.setFeaturedArticle}
                />

                <button
                  className="button is-info"
                  onClick={() => setModal(true)}
                >
                  Change Featured Article
                </button>
                <div id="featuredArticle">
                  {props.featuredArticle && (
                    <FeaturedArticleLink
                      key={props.featuredArticle.id}
                      locale={props.locale}
                      article={props.featuredArticle}
                      amp={props.isAmp}
                    />
                  )}
                  {!props.featuredArticle && <h1>MISSING FEATURED ARTICLE</h1>}
                </div>
              </>
            )}
            {!props.editable && props.articles['featured'] && (
              <FeaturedArticleLink
                key={props.articles['featured'].id}
                locale={props.locale}
                article={props.articles['featured']}
                amp={props.isAmp}
              />
            )}
          </div>
          <div className="column is-one-third">
            <FeaturedSidebar />
          </div>
        </div>
      </div>
    </div>
  );
}
