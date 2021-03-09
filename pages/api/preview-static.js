import { hasuraGetPage } from '../../lib/articles.js';

export default async (req, res) => {
  // Check the secret and next parameters
  // This secret should only be known to this API route and the CMS
  if (req.query.secret !== process.env.PREVIEW_TOKEN || !req.query.slug) {
    return res.status(401).json({ message: 'Invalid token' });
  }

  const apiUrl = process.env.HASURA_API_URL;
  const apiToken = process.env.ORG_SLUG;

  let localeCode = req.query.locale;

  const { errors, data } = await hasuraGetPage({
    url: apiUrl,
    orgSlug: apiToken,
    slug: req.query.slug,
    localeCode: localeCode,
  });
  if (errors || !data) {
    return res.status(401).json({ message: 'Invalid slug' });
  }

  // Enable Preview Mode by setting the cookies
  res.setPreviewData({});

  let nextPath;
  if (localeCode) {
    nextPath = '/' + localeCode;
  }
  if (req.query.slug === 'about') {
    nextPath += '/preview/' + req.query.slug;
  } else {
    nextPath += '/preview/static/' + req.query.slug;
  }

  res.redirect(nextPath);
};
