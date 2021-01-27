import React, { useEffect, useState } from 'react';
import FeaturedArticleLink from './FeaturedArticleLink';
import ModalArticleSearch from '../tinycms/ModalArticleSearch';
import FeaturedSidebar from './FeaturedSidebar';

export default function LargePackageStoryLead(props) {
  const [isFeaturedModalActive, setFeaturedModal] = useState(false);
  const [isTopModalActive, setTopModal] = useState(false);
  const [isBottomModalActive, setBottomModal] = useState(false);

  return (
    <>
      <section className="section section-layout__1">
        <div className="section__container">
          <div className="block">
            <div className="asset">
              {props.editable && (
                <div style={{ position: 'relative' }}>
                  <ModalArticleSearch
                    apiUrl={props.apiUrl}
                    apiToken={props.apiToken}
                    isActive={isFeaturedModalActive}
                    setModal={setFeaturedModal}
                    featuredArticle={props.featuredArticle}
                    setFeaturedArticle={props.setFeaturedArticle}
                    key="featuredArticleModal"
                    locale={props.locale}
                  />

                  <button
                    className="button is-info"
                    onClick={() => setFeaturedModal(true)}
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                    }}
                  >
                    Change Main Featured Article
                  </button>
                </div>
              )}
              {props.featuredArticle && (
                <FeaturedArticleLink
                  locale={props.locale}
                  key={props.featuredArticle.id}
                  article={props.featuredArticle}
                  amp={props.isAmp}
                />
              )}
            </div>
          </div>
          <div className="block">
            <div className="asset">
              {props.editable && (
                <div style={{ position: 'relative' }}>
                  <ModalArticleSearch
                    apiUrl={props.apiUrl}
                    apiToken={props.apiToken}
                    isActive={isTopModalActive}
                    setModal={setTopModal}
                    featuredArticle={props.subFeaturedTopArticle}
                    setFeaturedArticle={props.setSubFeaturedTopArticle}
                    key="featuredTopArticleModal"
                    locale={props.locale}
                  />

                  <button
                    className="button is-info"
                    onClick={() => setTopModal(true)}
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                    }}
                  >
                    Change Top Subfeatured Article
                  </button>
                </div>
              )}
              {props.subFeaturedTopArticle && (
                <FeaturedArticleLink
                  key={props.subFeaturedTopArticle.id}
                  locale={props.locale}
                  article={props.subFeaturedTopArticle}
                  amp={props.isAmp}
                />
              )}
            </div>
          </div>
          <div className="block">
            <div className="asset">
              {props.editable && (
                <div style={{ position: 'relative' }}>
                  <ModalArticleSearch
                    apiUrl={props.apiUrl}
                    apiToken={props.apiToken}
                    isActive={isBottomModalActive}
                    setModal={setBottomModal}
                    featuredArticle={props.subFeaturedBottomArticle}
                    setFeaturedArticle={props.setSubFeaturedBottomArticle}
                    key="featuredBottomArticleModal"
                    locale={props.locale}
                  />

                  <button
                    className="button is-info"
                    onClick={() => setBottomModal(true)}
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                    }}
                  >
                    Change Bottom Subfeatured Article
                  </button>
                </div>
              )}
              {props.subFeaturedBottomArticle && (
                <FeaturedArticleLink
                  key={props.subFeaturedBottomArticle.id}
                  locale={props.locale}
                  article={props.subFeaturedBottomArticle}
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
