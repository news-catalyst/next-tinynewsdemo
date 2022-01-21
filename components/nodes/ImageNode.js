import Image from 'next/image';
import tw from 'twin.macro';

const Figure = tw.figure`my-4`;
const Figcaption = tw.figcaption`text-gray-500 text-sm pt-1`;

export default function ImageNode({ node, amp }) {
  const image = node.children.find((child) => child.imageUrl);

  if (!image) {
    return null;
  }
  if (!image.imageUrl) {
    console.error('IMAGE MISSING SRC:', node, image);
    return null;
  }
  const figure = amp ? (
    <amp-img
      width={710}
      height={(image.height / image.width) * 710}
      src={image.imageUrl}
      alt={image.imageAlt}
      layout="responsive"
    />
  ) : (
    <Figure key={image.imageUrl}>
      <Image
        src={image.imageUrl}
        alt={image.imageAlt}
        width={710}
        height={(image.height / image.width) * 710}
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
