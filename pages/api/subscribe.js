import { getOrgSettings } from '../../lib/articles';
import { findSetting } from '../../lib/utils.js';

export default async function Handler(req, res) {
  const apiUrl = process.env.HASURA_API_URL;
  const site = req.query.site;

  const settingsResult = await getOrgSettings({
    url: apiUrl,
    site: site,
  });

  if (settingsResult.errors) {
    console.error('Subscribe API - settings error:', settingsResult.errors);
    throw settingsResult.errors;
  }

  const settings = settingsResult.data.settings;
  const letterheadApiUrl = findSetting(settings, 'LETTERHEAD_API_URL');
  const letterheadApiKey = findSetting(settings, 'LETTERHEAD_API_KEY');
  const letterheadChannelSlug = findSetting(
    settings,
    'LETTERHEAD_CHANNEL_SLUG'
  );
  const subscribeApiUrl =
    letterheadApiUrl + 'channels/' + letterheadChannelSlug + '/subscribers';

  // values from https://github.com/news-catalyst/next-tinynewsdemo/issues/718
  const channelSubscriberStatusValues = {
    'Not Subscribed': 0,
    Subscribed: 1,
    Unsubscribed: 2,
    'Needs Verification': 4,
  };

  const { email, name } = JSON.parse(req.body);

  try {
    const response = await fetch(subscribeApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${letterheadApiKey}`,
      },
      body: JSON.stringify({
        channelSubscriberStatus:
          channelSubscriberStatusValues['Needs Verification'],
        email: email,
        name: name,
        optin: true,
      }),
    });

    const data = await response.json();

    return res.status(200).json({ message: data });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}
