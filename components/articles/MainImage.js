import Image from 'next/image';
import { IMAGE_DIMENSIONS_DATE } from '../../lib/utils';

export default function MainImage({ articleContent, isAmp, updatedAt }) {
  const mainImageNode = articleContent.find(
    (node) => node.type === 'mainImage'
  );
  let mainImage = null;

  if (mainImageNode) {
    mainImage = mainImageNode.children[0];
  }

  if (!mainImage || !mainImage.imageUrl) {
    console.error('Missing image src:', mainImageNode);
    return null;
  }

  let constrainedImageWidth = 1080;

  console.log(updatedAt);
  // if we can trust that the image width is correct, then handle smaller images
  if (Date.parse(updatedAt) > IMAGE_DIMENSIONS_DATE && mainImage.width < 1080) {
    constrainedImageWidth = mainImage.width;
  }

  return (
    <>
      {mainImage && isAmp && (
        <amp-img
          width={constrainedImageWidth}
          height={(mainImage.height / mainImage.width) * constrainedImageWidth}
          src={mainImage.imageUrl}
          alt={mainImage.imageAlt}
          layout="responsive"
        />
      )}

      {mainImage && !isAmp && (
        <Image
          src={mainImage.imageUrl}
          width={constrainedImageWidth}
          height={(mainImage.height / mainImage.width) * constrainedImageWidth}
          alt={mainImage.imageAlt}
          className="image"
          priority={true}
        />
      )}
    </>
  );
}
