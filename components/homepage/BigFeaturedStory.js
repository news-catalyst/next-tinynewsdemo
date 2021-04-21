import React, { useState } from 'react';
import tw from 'twin.macro';
import FeaturedArticleMeta from './FeaturedArticleMeta.js';
import FeaturedArticleThumbnail from './FeaturedArticleThumbnail.js';
import ModalArticleSearch from '../tinycms/ModalArticleSearch';

const SectionLayout = tw.section`flex mb-8`;
const SectionContainer = tw.div`px-5 max-w-7xl mx-auto flex flex-row flex-wrap w-full`;
const Block = tw.div`flex w-full`;
const Asset = tw.div`flex md:flex-row flex-col-reverse`;
const AssetMetaContainer = tw.div`relative w-full`;
const AssetThumbnailContainer = tw.div``;

const ChangeArticleButton = tw.button`hidden md:flex w-full md:w-auto px-4 py-2 text-right bg-blue-900 hover:bg-blue-500 text-white md:rounded`;

export default function BigFeaturedStory(props) {
  const [isModalActive, setModal] = useState(false);

  const featuredArticleMarkup = (
    <>
      <AssetMetaContainer
        style={{
          flex: '1 1 0',
        }}
      >
        <FeaturedArticleMeta
          key={props.featuredArticle.slug}
          article={props.featuredArticle}
          big={true}
        />
      </AssetMetaContainer>
      <AssetThumbnailContainer
        style={{
          flex: '2 1 0',
        }}
      >
        <FeaturedArticleThumbnail
          article={props.featuredArticle}
          isAmp={props.isAmp}
        />
      </AssetThumbnailContainer>
    </>
  );

  return (
    <SectionLayout>
      <SectionContainer>
        <Block>
          <Asset>
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
                  {props.featuredArticle && featuredArticleMarkup}
                </div>
                <ChangeArticleButton
                  onClick={() => setModal(true)}
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                  }}
                >
                  Change Featured Article
                </ChangeArticleButton>
              </div>
            )}
            {!props.editable && props.featuredArticle && featuredArticleMarkup}
          </Asset>
        </Block>
      </SectionContainer>
    </SectionLayout>
  );
}
