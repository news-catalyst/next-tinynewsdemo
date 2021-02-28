import { hasuraGetPage } from '../../lib/articles.js';

export default async (req, res) => {
  // Check the secret and next parameters
  // This secret should only be known to this API route and the CMS
  if (req.query.secret !== process.env.PREVIEW_TOKEN || !req.query.slug) {
    return res.status(401).json({ message: 'Invalid token' });
  }

  if (req.query.slug === 'about') {
    const apiUrl = process.env.HASURA_API_URL;
    const apiToken = process.env.ORG_SLUG;

    let localeCode = req.query.locale;

    const { errors, data } = await hasuraGetPage({
      url: apiUrl,
      orgSlug: apiToken,
      slug: 'about',
      localeCode: localeCode,
    });
    if (errors || !data) {
      return res.status(401).json({ message: 'Invalid slug' });
    }
  }

  // Enable Preview Mode by setting the cookies
  res.setPreviewData({});

  const nextPath = '/' + req.query.slug;

  // this approach to the redirect does work
  res.writeHead(301, {
    Location: nextPath,
  });
  res.end();
};
