import React from 'react';
import Image from 'next/image';
import tw from 'twin.macro';
import AdPixel from './AdPixel.js';

const Asset = tw.li`border-b border-gray-200 items-start content-start flex flex-row flex-nowrap mb-6 pb-6`;
const AdWrapper = tw.div`lg:px-8 block w-full`;
const AdBrand = tw.div``;
const AdBrandP = tw.p`text-sm text-gray-500 pt-1 mb-4 text-center`;
const MediaLeft = tw.div`items-center`;
const AdImgContainer = tw.div`relative w-full mb-4`;
const AdContent = tw.div``;
const AdHeader = tw.h3`text-xl font-bold tracking-tight leading-5 mb-2`;
const AdText = tw.div`text-sm`;
const AdCTA = tw.a`font-bold bg-black text-white inline-flex items-center rounded text-sm justify-center px-4`;

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
            <AdHeader>
              {ad.emoji} {ad.header}
            </AdHeader>
            <AdText
              className="dek"
              dangerouslySetInnerHTML={{ __html: ad.body }}
            />
            {/* According to the whereby.us docs, the expanded body text can include multiple links, paragraphs */}
            <AdCTA
              href={ad.url}
              style={{
                minHeight: '2.375rem',
              }}
            >
              {ad.call}
            </AdCTA>
          </AdContent>
        </MediaLeft>
        <AdPixel pixel={ad.pixel} isAmp={isAmp} />
      </AdWrapper>
      <style jsx global>{`
        .dek p {
          margin-bottom: 1rem;
          font-size: 1rem;
          line-height: 1.5;
        }
        .dek {
          margin-bottom: 1.25rem;
        }
      `}</style>
    </Asset>
  );
}
