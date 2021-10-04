import Image from 'next/image';

export default function MainImage({ articleContent, isAmp }) {
  const mainImageNode = articleContent.find(
    (node) => node.type === 'mainImage'
  );
  let mainImage = null;

  if (mainImageNode) {
    mainImage = mainImageNode.children[0];
  }

  return (
    <>
      {mainImage && isAmp && (
        <amp-img
          width={1080}
          height={(mainImage.height / mainImage.width) * 1080}
          src={mainImage.imageUrl}
          alt={mainImage.imageAlt}
          layout="responsive"
        />
      )}

      {mainImage && !isAmp && (
        <Image
          src={mainImage.imageUrl}
          width={1080}
          height={(mainImage.height / mainImage.width) * 1080}
          alt={mainImage.imageAlt}
          className="image"
          priority={true}
        />
      )}
    </>
  );
}
