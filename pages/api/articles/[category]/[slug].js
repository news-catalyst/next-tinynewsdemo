import { hasuraArticlePage } from '../../../../lib/articles.js';
import {
  hasuraLocalizeText,
  renderBodyWordPress,
} from '../../../../lib/utils.js';
import ReactDOMServer from 'react-dom/server';

export default async function Handler(req, res) {
  const apiUrl = process.env.HASURA_API_URL;
  const apiToken = process.env.ORG_SLUG;

  let localeCode = req.query.locale;

  // Check the secret and next parameters
  // This secret should only be known to this API route and the CMS
  if (req.query.secret !== process.env.PREVIEW_TOKEN || !req.query.slug) {
    return res.status(401).json({ message: 'Invalid token' });
  }

  let article = {};

  let siteMetadata;
  const { errors, data } = await hasuraArticlePage({
    url: apiUrl,
    orgSlug: apiToken,
    categorySlug: req.query.category,
    slug: req.query.slug,
  });

  if (
    errors ||
    !data ||
    !data.article_slug_versions ||
    data.article_slug_versions.length === 0
  ) {
    return res.status(500).json({ message: 'Error looking up article' });
  } else {
    article = data.article_slug_versions[0].article;

    siteMetadata = hasuraLocalizeText(
      localeCode,
      data.site_metadatas[0].site_metadata_translations,
      'data'
    );

    let mainImageNode;
    let mainImage = null;
    let localisedContent = hasuraLocalizeText(
      localeCode,
      article.article_translations,
      'content'
    );
    try {
      mainImageNode = localisedContent.find(
        (node) => node.type === 'mainImage'
      );

      if (mainImageNode) {
        mainImage = mainImageNode.children[0];
        siteMetadata['coverImage'] = mainImage.imageUrl;
      }
    } catch (err) {
      console.error('error finding main image: ', err);
    }

    let body = renderBodyWordPress(
      localeCode,
      article.article_translations,
      false,
      false,
      siteMetadata,
      false
    );

    let articleContent = ReactDOMServer.renderToStaticMarkup(body);

    res.status(200).json({
      content: articleContent,
    });
  }
}
