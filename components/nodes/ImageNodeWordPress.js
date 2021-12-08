var url = require('url');
var path = require('path');

export default function ImageNodeWordPress({ node }) {
  const image = node.children.find((child) => child.imageUrl);

  if (!image) {
    return null;
  }

  let parsedUrl = url.parse(image.imageUrl);
  let filename = path.basename(parsedUrl.pathname);

  let now = new Date();
  let year = now.getFullYear();
  let month = now.getMonth();

  let wordpressImagePath = `/wp-content/uploads/${year}/${month}/${filename}`;

  const figure = (
    <figure key={wordpressImagePath}>
      <img
        src={wordpressImagePath}
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
