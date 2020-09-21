import React, { useEffect, useState } from 'react';
import FeaturedArticleLink from './FeaturedArticleLink.js';
import FeaturedSidebar from './FeaturedSidebar';
import ModalArticleSearch from '../tinycms/ModalArticleSearch';

export default function BigFeaturedStory(props) {
  const [isModalActive, setModal] = useState(false);

  useEffect(() => {
    props.setFeaturedArticle(props.articles['featured']);
  }, [props.articles]);

  return (
    <div className="homepage">
      <div className="featured-article">
        <div className="columns">
          <div className="column is-two-thirds">
            {props.editable && props.featuredArticle && (
              <>
                <ModalArticleSearch
                  apiUrl={props.apiUrl}
                  apiToken={props.apiToken}
                  isActive={isModalActive}
                  setModal={setModal}
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
                      article={props.featuredArticle}
                      amp={props.isAmp}
                    />
                  )}
                </div>
              </>
            )}
            {!props.editable && props.featuredArticle && (
              <FeaturedArticleLink
                key={props.featuredArticle.id}
                article={props.featuredArticle}
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
