import Image from 'next/image';
import tw from 'twin.macro';
import { IMAGE_DIMENSIONS_DATE } from '../../lib/utils';

const Figure = tw.figure`my-4`;
const Figcaption = tw.figcaption`text-gray-500 text-sm pt-1`;

export default function ImageNode({ node, amp, updatedAt }) {
  const image = node.children.find((child) => child.imageUrl);

  if (!image) {
    return null;
  }
  if (!image.imageUrl) {
    console.error('Error rendering image due to missing link:', node, image);
    return null;
  }
  let constrainedImageWidth = 710;

  // if we can trust that the image width is correct, then handle smaller images
  if (Date.parse(updatedAt) > IMAGE_DIMENSIONS_DATE && image.width < 710) {
    constrainedImageWidth = image.width;
  }

  const figure = amp ? (
    <amp-img
      width={constrainedImageWidth}
      height={(image.height / image.width) * constrainedImageWidth}
      src={image.imageUrl}
      alt={image.imageAlt}
      layout="responsive"
    />
  ) : (
    <Figure key={image.imageUrl}>
      <Image
        src={image.imageUrl}
        alt={image.imageAlt}
        width={constrainedImageWidth}
        height={(image.height / image.width) * constrainedImageWidth}
      />
      <Figcaption>{image.imageAlt}</Figcaption>
    </Figure>
  );

  if (node.link) {
    return <a href={node.link}>{figure}</a>;
  } else {
    return figure;
  }
}
