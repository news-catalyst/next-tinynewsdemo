import { findSetting, getOrgSettings } from '../../lib/settings';

export default async function handler(req, res) {
  console.log('API revalidate requested');
  const apiUrl = process.env.HASURA_API_URL;

  if (!req.query.site) {
    console.error('Missing required ?site=subdomain query string parameter');
    return res
      .status(401)
      .json({ message: 'Missing required ?site=subdomain query param' });
  }
  const site = req.query.site;

  if (!req.query.path) {
    console.error(
      'Missing required ?path=/to/revalidate query string parameter'
    );
    return res
      .status(401)
      .json({ message: 'Missing required ?path=/to/revalidate query param' });
  }

  const settingsResult = await getOrgSettings({
    url: apiUrl,
    site: site,
  });

  if (settingsResult.errors) {
    console.error('DocAPI revalidate settings error:', settingsResult.errors);
    throw settingsResult.errors;
  }

  const settings = settingsResult.data.settings;
  const apiToken = findSetting(settings, 'API_TOKEN');

  // Check for secret to confirm this is a valid request
  if (req.query.secret !== apiToken) {
    console.error('Invalid token');
    return res.status(401).json({ message: 'Invalid token' });
  }

  const pathToRevalidate = `${req.query.path}?site=${site}`;
  console.log('revalidating:', pathToRevalidate);

  try {
    await res.unstable_revalidate(pathToRevalidate);
    console.log('revalidation done:', pathToRevalidate);

    return res.json({ revalidated: true });
  } catch (err) {
    console.error('failed revalidating', pathToRevalidate, err);
    // If there was an error, Next.js will continue
    // to show the last successfully generated page
    return res.status(500).send('Error revalidating');
  }
}
