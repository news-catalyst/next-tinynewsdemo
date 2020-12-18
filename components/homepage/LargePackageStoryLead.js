import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import FeaturedArticleLink from './FeaturedArticleLink';
import ArticleCard from './ArticleCard.js';
import ModalArticleSearch from '../tinycms/ModalArticleSearch';

export const config = { amp: 'hybrid' };

export default function LargePackageStoryLead(props) {
  const [isModalActive, setModal] = useState(false);
  const [isLeftModalActive, setLeftModal] = useState(false);
  const [isRightModalActive, setRightModal] = useState(false);
  const [isMiddleModalActive, setMiddleModal] = useState(false);

  useEffect(() => {
    props.setFeaturedArticle(props.articles['featured']);
    props.setSubFeaturedLeftArticle(props.articles['subfeatured-left']);
    props.setSubFeaturedRightArticle(props.articles['subfeatured-right']);
    props.setSubFeaturedMiddleArticle(props.articles['subfeatured-middle']);
  }, [props.articles]);

  return (
    <>
      <div className="featured-article">
        {props.editable && (
          <>
            <ModalArticleSearch
              apiUrl={props.apiUrl}
              apiToken={props.apiToken}
              isActive={isModalActive}
              setModal={setModal}
              featuredArticle={props.featuredArticle}
              setFeaturedArticle={props.setFeaturedArticle}
              key="featuredArticleModal"
            />

            <button className="button is-info" onClick={() => setModal(true)}>
              Change Featured Article
            </button>
          </>
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
      <section className="section">
        <div className="columns">
          <div className="column is-one-third">
            {props.editable && (
              <>
                <ModalArticleSearch
                  apiUrl={props.apiUrl}
                  apiToken={props.apiToken}
                  isActive={isLeftModalActive}
                  setModal={setLeftModal}
                  featuredArticle={props.subFeaturedLeftArticle}
                  setFeaturedArticle={props.setSubFeaturedLeftArticle}
                  key="featuredLeftArticleModal"
                />

                <button
                  className="button is-info"
                  onClick={() => setLeftModal(true)}
                >
                  Change Left Featured Article
                </button>
              </>
            )}
            {props.subFeaturedLeftArticle && (
              <ArticleCard
                key={props.subFeaturedLeftArticle.id}
                locale={props.locale}
                article={props.subFeaturedLeftArticle}
                amp={props.isAmp}
              />
            )}
          </div>
          <div className="column is-one-third">
            {props.editable && (
              <>
                <ModalArticleSearch
                  apiUrl={props.apiUrl}
                  apiToken={props.apiToken}
                  isActive={isMiddleModalActive}
                  setModal={setMiddleModal}
                  featuredArticle={props.subFeaturedMiddleArticle}
                  setFeaturedArticle={props.setSubFeaturedMiddleArticle}
                  key="featuredMiddleArticleModal"
                />

                <button
                  className="button is-info"
                  onClick={() => setMiddleModal(true)}
                >
                  Change Middle Featured Article
                </button>
              </>
            )}
            {props.subFeaturedMiddleArticle && (
              <ArticleCard
                key={props.subFeaturedMiddleArticle.id}
                locale={props.locale}
                article={props.subFeaturedMiddleArticle}
                amp={props.isAmp}
              />
            )}
          </div>
          <div className="column is-one-third">
            {props.editable && (
              <>
                <ModalArticleSearch
                  apiUrl={props.apiUrl}
                  apiToken={props.apiToken}
                  isActive={isRightModalActive}
                  setModal={setRightModal}
                  setFeaturedArticle={props.setSubFeaturedRightArticle}
                  key="featuredRightArticleModal"
                />

                <button
                  className="button is-info"
                  onClick={() => setRightModal(true)}
                >
                  Change Right Featured Article
                </button>
              </>
            )}
            {props.subFeaturedRightArticle && (
              <ArticleCard
                key={props.subFeaturedRightArticle.id}
                locale={props.locale}
                article={props.subFeaturedRightArticle}
                amp={props.isAmp}
              />
            )}
          </div>
        </div>
      </section>
    </>
  );
}
