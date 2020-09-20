import React from 'react';

export default function ExpandedTextWithImageAd({ ad, isAmp }) {
  return (
    <section className="text-ad-container">
      <div className="ad-container">
        <div className="ad-brand">
          <p>Advertisement from {ad.brand}</p>
        </div>
        <div className="media">
          <div className="media-left ad-img-container">
            {isAmp ? (
              <amp-img
                width={300}
                height={300}
                src={ad.image.url}
                alt={ad.image.alt}
                layout="responsive"
              />
            ) : (
              <img src={ad.image.url} className="ad-img" alt={ad.image.alt} />
            )}
          </div>
          <div className="media-content ad-text-container">
            <h3>{ad.header}</h3>
            <div>{ad.body}</div>{' '}
            {/* According to the whereby.us docs, the expanded body text can include multiple links, paragraphs */}
          </div>
        </div>
      </div>
    </section>
  );
}
