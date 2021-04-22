import React from 'react';
import Image from 'next/image';
import tw from 'twin.macro';
import AdPixel from './AdPixel.js';

const AdWrapper = tw.div`px-8 border-b border-t border-gray-200 my-8 pt-2 pb-6`;
const AdBrandP = tw.div`text-gray-500 text-sm pt-1 mb-4 text-center`;
const ContentWrapper = tw.div`flex flex-row flex-wrap items-center`;
const AdImgContainer = tw.div`w-1/3 overflow-hidden relative`;
const AdContentContainer = tw.div`pl-6 flex-1`;
const AdHeader = tw.h3`text-xl font-bold leading-tight mb-2`;
const AdParagraph = tw.p`text-sm leading-relaxed mb-5`;
const AdCTA = tw.a`font-bold bg-black text-white inline-flex items-center rounded text-sm justify-center px-4`;

export default function ImageWithTextAd({ ad, isAmp }) {
  return (
    <AdWrapper>
      <div className="ad-container">
        <div className="ad-brand">
          <AdBrandP>Advertisement from {ad.brand}</AdBrandP>
        </div>
        <ContentWrapper>
          <AdImgContainer>
            {isAmp ? (
              <amp-img
                width={300}
                height={300}
                src={ad.image.url}
                alt={ad.image.alt}
                layout="responsive"
              />
            ) : (
              <Image
                src={ad.image.url}
                height={300}
                width={300}
                className="ad-img"
                alt={ad.image.alt}
              />
            )}
          </AdImgContainer>
          <AdContentContainer>
            <AdHeader>{ad.header}</AdHeader>
            <AdParagraph>{ad.body}</AdParagraph>
            <AdCTA
              href={ad.url}
              style={{
                minHeight: '2.375rem',
              }}
            >
              {ad.call}
            </AdCTA>
          </AdContentContainer>
        </ContentWrapper>
      </div>
      <AdPixel pixel={ad.pixel} isAmp={isAmp} />
    </AdWrapper>
  );
}
