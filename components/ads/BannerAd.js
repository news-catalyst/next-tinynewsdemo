import React from 'react';

export default function TextAd({ ad, isAmp }) {
  return (
    <section className="ad-container">
      <div className="ad-brand">
        <p>Advertisement from {ad.brand}</p>
      </div>
      <div>
        <a href={ad.url}>
          {isAmp ? (
            <amp-img
              width={300}
              height={300}
              src={ad.image.url}
              alt={ad.image.alt}
              layout="responsive"
            />
          ) : (
            <img src={ad.image.url} className="ad-banner" alt={ad.image.alt} />
          )}
        </a>
      </div>
    </section>
  );
}
