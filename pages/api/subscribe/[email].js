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
  };

  const { email } = req.query;

  const response = await fetch(subscribeApiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      channelSubscriberStatus: channelSubscriberStatusValues['Subscribed'],
      email: email,
      sendOptin: true,
    }),
  });

  // not sure what the response looks like yet as I'm only getting a 500 error page as html currently
  const responseData = await response.json();
  console.log('letterhead response:', responseData);

  if (responseData.error) {
    return res.status(500).json({ message: responseData.error });
  }
  return res.status(200).json({ message: responseData });
}
