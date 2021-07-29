import React from 'react';
import Image from 'next/image';
import tw from 'twin.macro';

const AssetThumbnail = tw.div`overflow-hidden relative w-full mb-4 md:mb-0 md:ml-5 order-2 w-full`;

export default function FeaturedArticleThumbnail({ article, isAmp }) {
  let mainImage = {};
  let mainImageNode = null;

  const translation = article['article_translations'][0];

  mainImageNode = translation.main_image;

  try {
    if (mainImageNode) {
      mainImage = mainImageNode.children[0];
    }
  } catch (err) {
    console.error(err);
  }

  return (
    <AssetThumbnail>
      {isAmp ? (
        <amp-img
          width={1080}
          height={(mainImage.height / mainImage.width) * 1080}
          src={mainImage.imageUrl}
          alt={mainImage.imageAlt}
          layout="responsive"
        />
      ) : (
        <Image
          src={mainImage.imageUrl}
          width={1080}
          height={(mainImage.height / mainImage.width) * 1080}
          alt={mainImage.imageAlt}
          className="image"
        />
      )}
    </AssetThumbnail>
  );
}
