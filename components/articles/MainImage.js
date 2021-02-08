import Image from 'next/image';
import { hasuraLocaliseText } from '../../lib/utils';

export default function MainImage({ article, isAmp }) {
  let articleContent = hasuraLocaliseText(
    article.article_translations,
    'content'
  );

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
