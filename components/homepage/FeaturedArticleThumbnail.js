import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import tw from 'twin.macro';

const AssetThumbnail = tw.div`overflow-hidden relative w-full mb-4 md:mb-0 md:ml-5 order-2 w-full cursor-pointer`;
const Figure = tw.figure``;
const Figcaption = tw.figcaption`text-gray-500 text-xs pt-1 text-right`;

export default function FeaturedArticleThumbnail({ article, isAmp }) {
  let mainImage = {};
  let mainImageNode = null;

  const translation = article['article_translations'][0];
  try {
    mainImageNode = translation.main_image;
    if (mainImageNode && Object.keys(mainImageNode).length > 0) {
      mainImage = mainImageNode.children[0];
    }
  } catch (err) {
    console.error(err);
  }

  if (!mainImage.imageUrl) {
    return <div />;
  }

  return (
    <Link href={`/articles/${article.category.slug}/${article.slug}`} passHref>
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
          <Figure key={mainImage.imageUrl}>
            <Image
              src={mainImage.imageUrl}
              width={1080}
              height={(mainImage.height / mainImage.width) * 1080}
              alt={mainImage.imageAlt}
              className="image"
              priority={true}
            />
            <Figcaption>{mainImage.imageAlt}</Figcaption>
          </Figure>
        )}
      </AssetThumbnail>
    </Link>
  );
}
