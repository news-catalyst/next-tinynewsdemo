import React from 'react';
import Image from 'next/image';
import AdPixel from './AdPixel.js';

export default function ExpandedTextWithImageAd({ ad, isAmp }) {
  return (
    <div className="ad-wrapper">
      <div className="ad-container">
        <div className="ad-brand">
          <p>Advertisement from {ad.brand}</p>
        </div>
        <div className="media-left">
          <div className="media ad-img-container">
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
          </div>
          <div className="media-content ad-text-container">
            <h3>{ad.header}</h3>
            <div dangerouslySetInnerHTML={{ __html: ad.body }} />
            {/* According to the whereby.us docs, the expanded body text can include multiple links, paragraphs */}
          </div>
        </div>
      </div>
      <AdPixel pixel={ad.pixel} />
    </div>
  );
}
