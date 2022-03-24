import { hasuraGetPage } from '../../lib/pages.js';
import { findSetting, getOrgSettings } from '../../lib/settings.js';

export default async function Handler(req, res) {
  const settingsResult = await getOrgSettings({
    url: apiUrl,
    site: site,
  });

  if (settingsResult.errors) {
    console.error('DocAPI preview Settings error:', settingsResult.errors);
    throw settingsResult.errors;
  }

  const settings = settingsResult.data.settings;
  const previewToken = findSetting(settings, 'PREVIEW_TOKEN');

  // Check the secret and next parameters
  // This secret should only be known to this API route and the CMS
  if (req.query.secret !== previewToken || !req.query.slug) {
    return res.status(401).json({ message: 'Invalid token' });
  }

  const apiUrl = process.env.HASURA_API_URL;
  const site = req.query.site;

  const localeCode = 'en-US';

  const { errors, data } = await hasuraGetPage({
    url: apiUrl,
    site: site,
    slug: req.query.slug,
    localeCode: localeCode,
  });
  if (errors || !data) {
    return res.status(401).json({ message: 'Invalid slug' });
  }

  // Enable Preview Mode by setting the cookies
  res.setPreviewData({});

  let redirectPath = '';

  if (['about', 'staff', 'thank-you', 'donate'].includes(req.query.slug)) {
    redirectPath += '/preview/' + req.query.slug;
  } else {
    redirectPath += '/preview/static/' + req.query.slug;
  }

  console.log('redirectPath:', redirectPath);
  res.redirect(redirectPath);
}
