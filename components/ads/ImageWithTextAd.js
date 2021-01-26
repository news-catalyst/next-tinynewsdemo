import React from 'react';
import Image from 'next/image';

export default function ImageWithTextAd({ ad, isAmp }) {
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
          </div>
          <div className="media-content ad-text-container">
            <h3>{ad.header}</h3>
            <p>{ad.body}</p>
            <a className="button" href={ad.url}>
              {ad.call}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
