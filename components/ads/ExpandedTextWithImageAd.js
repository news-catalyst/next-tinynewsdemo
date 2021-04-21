import React from 'react';
import Image from 'next/image';
import tw from 'twin.macro';
import AdPixel from './AdPixel.js';

const Asset = tw.li`border-b border-gray-200 items-start content-start flex flex-row flex-nowrap mb-6 pb-6`;
const AdWrapper = tw.div`lg:px-8 block`;
const AdBrand = tw.div``;
const AdBrandP = tw.p`text-sm text-gray-500 pt-1 mb-4 text-center`;
const MediaLeft = tw.div`flex lg:flex-row flex-col items-center flex-wrap`;
const AdImgContainer = tw.div`lg:w-1/3 relative w-full mb-4 lg:mb-0`;
const AdContent = tw.div`pl-6 flex-1`;
const AdHeader = tw.h3`text-lg font-bold tracking-tight leading-5 mb-2`;
const AdText = tw.div`text-sm`;

export default function ExpandedTextWithImageAd({ ad, isAmp }) {
  return (
    <Asset>
      <AdWrapper>
        <AdBrand>
          <AdBrandP>Advertisement from {ad.brand}</AdBrandP>
        </AdBrand>
        <MediaLeft>
          <AdImgContainer
            style={{
              maxWidth: '18.75rem',
            }}
          >
            {isAmp ? (
              <amp-img
                width={600}
                height={400}
                src={ad.image.url}
                alt={ad.image.alt}
                layout="responsive"
              />
            ) : (
              <Image
                src={ad.image.url}
                width={600}
                height={400}
                className="ad-img"
                alt={ad.image.alt}
                layout="responsive"
              />
            )}
          </AdImgContainer>
          <AdContent>
            <AdHeader>{ad.header}</AdHeader>
            <AdText dangerouslySetInnerHTML={{ __html: ad.body }} />
            {/* According to the whereby.us docs, the expanded body text can include multiple links, paragraphs */}
          </AdContent>
        </MediaLeft>
        <AdPixel pixel={ad.pixel} isAmp={isAmp} />
      </AdWrapper>
    </Asset>
  );
}
