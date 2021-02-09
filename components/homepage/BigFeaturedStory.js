import React, { useEffect, useState } from 'react';
import FeaturedArticleLink from './FeaturedArticleLink.js';
import FeaturedSidebar from './FeaturedSidebar';
import ModalArticleSearch from '../tinycms/ModalArticleSearch';

export default function BigFeaturedStory(props) {
  const [isModalActive, setModal] = useState(false);

  return (
    <>
      <section className="section section-layout__4">
        <div className="section__container">
          <div className="block">
            <div className="asset">
              {props.editable && (
                <div style={{ position: 'relative' }}>
                  <ModalArticleSearch
                    apiUrl={props.apiUrl}
                    apiToken={props.apiToken}
                    isActive={isModalActive}
                    setModal={setModal}
                    featuredArticle={props.featuredArticle}
                    setFeaturedArticle={props.setFeaturedArticle}
                    locale={props.locale}
                  />
                  <div id="featuredArticle">
                    {props.featuredArticle && (
                      <FeaturedArticleLink
                        key={props.featuredArticle.slug}
                        article={props.featuredArticle}
                        amp={props.isAmp}
                      />
                    )}
                  </div>
                  <button
                    className="button is-info"
                    onClick={() => setModal(true)}
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                    }}
                  >
                    Change Featured Article
                  </button>
                </div>
              )}
              {!props.editable && props.featuredArticle && (
                <FeaturedArticleLink
                  key={props.featuredArticle.slug}
                  article={props.featuredArticle}
                  amp={props.isAmp}
                />
              )}
            </div>
          </div>
        </div>
      </section>
      <section className="section section-layout__2">
        <div className="section__container">
          <FeaturedSidebar metadata={props.metadata} />
        </div>
      </section>
    </>
  );
}
