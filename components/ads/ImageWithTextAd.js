import React from 'react';

export default function ImageWithTextAd({ ad, isAmp }) {
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
            <p>{ad.body}</p>
            <a className="button" href={ad.url}>
              {ad.call}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
