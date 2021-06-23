import Image from 'next/image';

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
            <Image
              src={ad.image.url}
              className="ad-banner"
              alt={ad.image.alt}
              width={300}
              height={300}
            />
          )}
        </a>
      </div>
    </section>
  );
}
