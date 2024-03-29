import React, { useState } from 'react';
import tw from 'twin.macro';
import FeaturedArticleMeta from './FeaturedArticleMeta.js';
import FeaturedArticleThumbnail from './FeaturedArticleThumbnail.js';
import ModalArticleSearch from '../tinycms/ModalArticleSearch';
import { useMediaQuery } from '../../lib/hooks/useMediaQuery.js';

const ChangeArticleButton = tw.button`hidden md:flex w-full md:w-auto px-4 py-2 text-right bg-blue-900 hover:bg-blue-500 text-white md:rounded`;
const SectionLayout = tw.section`flex mb-8`;
const SectionContainer = tw.div`flex flex-row flex-wrap md:grid mb-8 w-full md:grid-cols-packageLayoutTablet lg:grid-cols-packageLayoutDesktop px-5 max-w-7xl mx-auto`;
const LeftBlock = tw.div`w-full`;
const RightBlock = tw.div`w-full md:h-full flex lg:pl-8`;
const Asset = tw.div`md:items-start flex flex-col-reverse flex-nowrap md:flex-row md:content-start border-b border-gray-200 mb-4 md:mb-0 pb-4 md:pb-0 w-full md:border-b-0 pr-2`;
const RightTopAsset = tw(
  Asset
)`lg:border-l border-gray-200 lg:pl-4 lg:border-b pb-4`;
const RightBottomAsset = tw(
  Asset
)`lg:border-l border-gray-200 lg:pl-4 lg:pt-4 border-b-0`;
const AssetMetaContainer = tw.div`flex-1 relative w-full`;
const AssetThumbnailContainer = tw.div`md:max-w-1/2`;

const gridStyles = {
  desktop: {
    gridTemplateAreas: "'col-1 col-2' 'col-1 col-3'",
    gridTemplateRows: 'auto',
  },
  tablet: {
    gridTemplateAreas: "'col-1 col-1' 'col-2 col-3'",
    gridTemplateRows: 'auto',
  },
};

export default function LargePackageStoryLead(props) {
  const [isFeaturedModalActive, setFeaturedModal] = useState(false);
  const [isTopModalActive, setTopModal] = useState(false);
  const [isBottomModalActive, setBottomModal] = useState(false);
  const [locale, setLocale] = useState('en-US');

  const isDesktop = useMediaQuery(1024);
  const isTablet = useMediaQuery(768) && !isDesktop;

  let grid = null;

  if (isTablet) {
    grid = gridStyles.tablet;
  }

  if (isDesktop) {
    grid = gridStyles.desktop;
  }

  return (
    <SectionLayout>
      <SectionContainer style={grid}>
        <LeftBlock
          style={{
            gridArea: 'col-1',
          }}
        >
          <Asset
            style={
              isTablet
                ? {
                    borderBottom: '0.0625rem solid #e7e5e4',
                    marginBottom: '1.25rem',
                    paddingBottom: '1.25rem',
                  }
                : {}
            }
          >
            {props.featuredArticle && (
              <>
                <AssetMetaContainer>
                  <FeaturedArticleMeta
                    key={props.featuredArticle.slug}
                    article={props.featuredArticle}
                    big={isDesktop}
                    metadata={props.metadata}
                    locale={'en-US'}
                  />
                </AssetMetaContainer>
                <AssetThumbnailContainer>
                  <FeaturedArticleThumbnail
                    article={props.featuredArticle}
                    isAmp={props.isAmp}
                  />
                </AssetThumbnailContainer>
              </>
            )}
          </Asset>
          {props.editable && (
            <div>
              <ModalArticleSearch
                apiUrl={props.apiUrl}
                site={props.site}
                isActive={isFeaturedModalActive}
                setModal={setFeaturedModal}
                featuredArticle={props.featuredArticle}
                setFeaturedArticle={props.setFeaturedArticle}
                key="featuredArticleModal"
                locale={locale}
              />

              <ChangeArticleButton onClick={() => setFeaturedModal(true)}>
                Change Main Featured Article
              </ChangeArticleButton>
            </div>
          )}
        </LeftBlock>
        <RightBlock
          style={{
            gridArea: 'col-2',
          }}
        >
          <RightTopAsset>
            {props.subFeaturedTopArticle && (
              <AssetMetaContainer>
                <FeaturedArticleMeta
                  key={props.subFeaturedTopArticle.slug}
                  article={props.subFeaturedTopArticle}
                  metadata={props.metadata}
                  locale={locale}
                />
              </AssetMetaContainer>
            )}
          </RightTopAsset>
          {props.editable && (
            <div>
              <ModalArticleSearch
                apiUrl={props.apiUrl}
                site={props.site}
                isActive={isTopModalActive}
                setModal={setTopModal}
                featuredArticle={props.subFeaturedTopArticle}
                setFeaturedArticle={props.setSubFeaturedTopArticle}
                key="featuredTopArticleModal"
                locale={locale}
              />

              <ChangeArticleButton onClick={() => setTopModal(true)}>
                Change Top Subfeatured Article
              </ChangeArticleButton>
            </div>
          )}
        </RightBlock>
        <RightBlock
          style={{
            gridArea: 'col-3',
          }}
        >
          <RightBottomAsset>
            {props.subFeaturedBottomArticle && (
              <AssetMetaContainer>
                <FeaturedArticleMeta
                  key={props.subFeaturedBottomArticle.slug}
                  article={props.subFeaturedBottomArticle}
                  metadata={props.metadata}
                  locale={locale}
                />
              </AssetMetaContainer>
            )}
          </RightBottomAsset>
          {props.editable && (
            <div>
              <ModalArticleSearch
                apiUrl={props.apiUrl}
                site={props.site}
                isActive={isBottomModalActive}
                setModal={setBottomModal}
                featuredArticle={props.subFeaturedBottomArticle}
                setFeaturedArticle={props.setSubFeaturedBottomArticle}
                key="featuredBottomArticleModal"
                locale={locale}
              />

              <ChangeArticleButton onClick={() => setBottomModal(true)}>
                Change Bottom Subfeatured Article
              </ChangeArticleButton>
            </div>
          )}
        </RightBlock>
      </SectionContainer>
    </SectionLayout>
  );
}
