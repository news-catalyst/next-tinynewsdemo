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
    <figure className="image">
      <img src={image.imageUrl} alt={image.imageAlt} />
      <figcaption>{image.imageAlt}</figcaption>
    </figure>
  );

  if (node.link) {
    return <a href={node.link}>{figure}</a>;
  } else {
    return figure;
  }
}
