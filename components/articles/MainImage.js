import Image from 'next/image';

export default function MainImage({ article, isAmp }) {
  const mainImageNode = article.content.find(
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
          width={mainImage.width}
          height={mainImage.height}
          src={mainImage.imageUrl}
          alt={mainImage.imageAlt}
          layout="responsive"
        />
      )}

      {mainImage && !isAmp && (
        <Image
          src={mainImage.imageUrl}
          width={1080}
          height={630}
          alt={mainImage.imageAlt}
          className="image"
        />
      )}
    </>
  );
}
