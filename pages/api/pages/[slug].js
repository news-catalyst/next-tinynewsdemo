import { hasuraGetPage } from '../../../lib/articles.js';
import { renderBodyWordPress } from '../../../lib/utils.js';
import ReactDOMServer from 'react-dom/server';

export default async function Handler(req, res) {
  const apiUrl = process.env.HASURA_API_URL;
  const apiToken = process.env.ORG_SLUG; // TODO Vercel Platforms

  // Check the secret and next parameters
  // This secret should only be known to this API route and the CMS
  if (req.query.secret !== process.env.PREVIEW_TOKEN || !req.query.slug) {
    return res.status(401).json({ message: 'Invalid token' });
  }

  let page = {};

  let siteMetadata;
  const { errors, data } = await hasuraGetPage({
    url: apiUrl,
    orgSlug: apiToken,
    slug: req.query.slug,
  });

  if (
    errors ||
    !data ||
    !data.page_slug_versions ||
    data.page_slug_versions.length === 0
  ) {
    return res.status(500).json({ message: 'Error looking up page' });
  } else {
    page = data.page_slug_versions[0].page;

    siteMetadata = data.site_metadatas[0].site_metadata_translations[0].data;

    let body = renderBodyWordPress(
      'en-US',
      page.page_translations,
      false,
      false,
      siteMetadata,
      false
    );

    let pageContent = ReactDOMServer.renderToStaticMarkup(body);

    res.status(200).json({
      content: pageContent,
    });
  }
}
