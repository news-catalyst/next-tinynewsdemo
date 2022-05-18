import React, { useState } from 'react';
import tw from 'twin.macro';
import FeaturedArticleMeta from './FeaturedArticleMeta.js';
import FeaturedArticleThumbnail from './FeaturedArticleThumbnail.js';
import ModalArticleSearch from '../tinycms/ModalArticleSearch';
import { useMediaQuery } from '../../lib/hooks/useMediaQuery.js';
import PromotionBlock from '../plugins/PromotionBlock';

const ChangeArticleButton = tw.button`hidden md:flex w-full md:w-auto px-4 py-2 text-right bg-blue-900 hover:bg-blue-500 text-white md:rounded`;
const SectionLayout = tw.section`flex mb-8`;
const SectionContainer = tw.div`flex flex-row flex-wrap md:grid mb-8 w-full md:grid-cols-packageLayoutTablet lg:grid-cols-packageLayoutDesktop px-5 max-w-7xl mx-auto`;
const LeftBlock = tw.div`w-full`;
const RightBlock = tw.div`w-full md:h-full flex lg:pl-8`;
const Asset = tw.div`md:items-start flex flex-col-reverse flex-nowrap md:flex-row md:content-start border-b border-gray-200 mb-4 md:mb-0 pb-4 md:pb-0 w-full md:border-b-0 pr-2`;
const AssetMetaContainer = tw.div`flex-1 relative w-full`;
const AssetThumbnailContainer = tw.div`md:max-w-1/2`;
const PromotionContainer = tw.div`md:border-l md:border-gray-200 md:ml-8 md:pl-8 w-full`;

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

export default function PartialLargeStoryPackageNewsletter(props) {
  const [isFeaturedModalActive, setFeaturedModal] = useState(false);
  const isDesktop = useMediaQuery(1024);
  const isTablet = useMediaQuery(768) && !isDesktop;
  const [locale, setLocale] = useState('en-US');

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
                Change Featured Article
              </ChangeArticleButton>
            </div>
          )}
        </LeftBlock>
        <RightBlock
          style={{
            gridArea: 'col-2',
          }}
        >
          <PromotionContainer>
            <PromotionBlock
              metadata={props.metadata}
              site={props.site}
              monkeypodLink={props.monkeypodLink}
              prefer="newsletter"
            />
          </PromotionContainer>
        </RightBlock>
      </SectionContainer>
    </SectionLayout>
  );
}
