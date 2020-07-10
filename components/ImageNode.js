export default function ImageNode({ node }) {
  const image = node.children[0];

  const figure = (
    <figure className="image">
      <img src={image.imageUrl} alt={image.imageAlt} />
      <figcaption>{image.imageAlt}</figcaption>
    </figure>
  );

  if (node.link) {
    return (
      <a href={node.link}>
        {figure}
      </a>
    );
  } else {
    return figure;
  }
}
