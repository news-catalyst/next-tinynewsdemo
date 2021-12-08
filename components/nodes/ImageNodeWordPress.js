var url = require('url');
var path = require('path');

export default function ImageNodeWordPress({ node, translations, locale }) {
  const image = node.children.find((child) => child.imageUrl);

  if (!image) {
    return null;
  }

  let matchingTranslation = translations.find((t) => t.locale_code === locale);
  if (!matchingTranslation) {
    matchingTranslation = translations[0];
  }

  // console.log('first_published_at:', matchingTranslation.first_published_at);

  let parsedUrl = url.parse(image.imageUrl);
  let filename = path.basename(parsedUrl.pathname);

  let publishedDate = new Date(matchingTranslation.first_published_at);
  let year = publishedDate.getFullYear();
  let month = ('0' + (publishedDate.getMonth() + 1)).slice(-2);
  let wordpressImagePath = `/wp-content/uploads/${year}/${month}/${filename}`;

  // console.log(image.imageUrl, '->', wordpressImagePath);

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
