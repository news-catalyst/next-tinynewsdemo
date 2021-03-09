import Image from 'next/image';

export default function ImageNode({ node, amp }) {
  const image = node.children[0];

  const figure = amp ? (
    <amp-img
      width={image.width}
      height={image.height}
      src={image.imageUrl}
      alt={image.imageAlt}
      layout="responsive"
    />
  ) : (
    <figure className="image" key="image.imageUrl">
      <Image
        src={image.imageUrl}
        alt={image.imageAlt}
        width={710}
        height={(image.height / image.width) * 710}
      />
      <figcaption>{image.imageAlt}</figcaption>
    </figure>
  );

  if (node.link) {
    return <a href={node.link}>{figure}</a>;
  } else {
    return figure;
  }
}
