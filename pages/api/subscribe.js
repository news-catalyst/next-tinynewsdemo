export default async function Handler(req, res) {
  const apiUrl = process.env.LETTERHEAD_API_URL;
  const apiKey = process.env.LETTERHEAD_API_KEY;
  const channelSlug = process.env.LETTERHEAD_CHANNEL_SLUG;
  const subscribeApiUrl = apiUrl + 'channels/' + channelSlug + '/subscribers';
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
        Authorization: `Bearer ${apiKey}`,
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
