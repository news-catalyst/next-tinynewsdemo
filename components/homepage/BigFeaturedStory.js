import React, { useEffect, useState } from 'react';
import FeaturedArticleLink from './FeaturedArticleLink.js';
import FeaturedSidebar from './FeaturedSidebar';
import ModalArticleSearch from '../tinycms/ModalArticleSearch';

export default function BigFeaturedStory(props) {
  const [isModalActive, setModal] = useState(false);

  useEffect(() => {
    //   console.log("setting featured article to", props.articles['featured'])
    //   props.setFeaturedArticle(props.articles['featured']);
    console.log('featuredArticle is now', props.featuredArticle);
  }, [props.articles, props.featuredArticle]);

  return (
    <>
      <section className="section section-layout__1">
        <div className="section__container">
          <div className="block">
            <div className="asset">
              {props.editable && (
                <>
                  <ModalArticleSearch
                    apiUrl={props.apiUrl}
                    apiToken={props.apiToken}
                    isActive={isModalActive}
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
                        key={props.articles['featured'].id}
                        article={props.featuredArticle}
                        amp={props.isAmp}
                      />
                    )}
                  </div>
                </>
              )}
              {!props.editable && props.articles['featured'] && (
                <FeaturedArticleLink
                  key={props.articles['featured'].id}
                  article={props.articles['featured']}
                  amp={props.isAmp}
                />
              )}
            </div>
          </div>
        </div>
      </section>
      <section className="section section-layout__2">
        <div className="section__container">
          <FeaturedSidebar />
        </div>
      </section>
    </>
  );
}
