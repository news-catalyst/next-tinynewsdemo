import React, { useEffect, useState } from 'react';
import tw from 'twin.macro';
import FeaturedArticleLink from './FeaturedArticleLink';
import ModalArticleSearch from '../tinycms/ModalArticleSearch';
import FeaturedSidebar from './FeaturedSidebar';

const ChangeArticleButton = tw.button`hidden md:flex w-full md:w-auto px-4 py-2 text-right bg-blue-900 hover:bg-blue-500 text-white md:rounded`;

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
              {props.featuredArticle && (
                <FeaturedArticleLink
                  locale={props.locale}
                  key={props.featuredArticle.id}
                  article={props.featuredArticle}
                  amp={props.isAmp}
                />
              )}
            </div>
            {props.editable && (
              <div>
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

                <ChangeArticleButton onClick={() => setFeaturedModal(true)}>
                  Change Main Featured Article
                </ChangeArticleButton>
              </div>
            )}
          </div>
          <div className="block">
            <div className="asset">
              {props.subFeaturedTopArticle && (
                <FeaturedArticleLink
                  key={props.subFeaturedTopArticle.id}
                  locale={props.locale}
                  article={props.subFeaturedTopArticle}
                  amp={props.isAmp}
                />
              )}
            </div>
            {props.editable && (
              <div>
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

                <ChangeArticleButton onClick={() => setTopModal(true)}>
                  Change Top Subfeatured Article
                </ChangeArticleButton>
              </div>
            )}
          </div>
          <div className="block">
            <div className="asset">
              {props.subFeaturedBottomArticle && (
                <FeaturedArticleLink
                  key={props.subFeaturedBottomArticle.id}
                  locale={props.locale}
                  article={props.subFeaturedBottomArticle}
                  amp={props.isAmp}
                />
              )}
            </div>
            {props.editable && (
              <div>
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

                <ChangeArticleButton onClick={() => setBottomModal(true)}>
                  Change Bottom Subfeatured Article
                </ChangeArticleButton>
              </div>
            )}
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
