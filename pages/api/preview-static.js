import { hasuraGetPage } from '../../lib/articles.js';

export default async function Handler(req, res) {
  // Check the secret and next parameters
  // This secret should only be known to this API route and the CMS
  if (req.query.secret !== process.env.PREVIEW_TOKEN || !req.query.slug) {
    return res.status(401).json({ message: 'Invalid token' });
  }

  const apiUrl = process.env.HASURA_API_URL;
  const apiToken = process.env.ORG_SLUG; // TODO Vercel Platforms

  const localeCode = 'en-US';

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
  if (['about', 'staff', 'thank-you', 'donate'].includes(req.query.slug)) {
    nextPath += '/preview/' + req.query.slug;
  } else {
    nextPath += '/preview/static/' + req.query.slug;
  }

  res.redirect(nextPath);
}
