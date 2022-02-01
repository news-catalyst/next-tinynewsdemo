import { useEffect, useState } from 'react';

const FB_APP_ID = process.env.NEXT_PUBLIC_FB_APP_ID;
const FB_CLIENT_TOKEN = process.env.NEXT_PUBLIC_FB_CLIENT_TOKEN;

export default function Facebook({ node }) {
  const [fbPost, setFbPost] = useState(null);

  useEffect(() => {
    const fbApiUrl =
      'https://graph.facebook.com/v12.0/oembed_post?url=' + node.link;
    const fbAccessToken = `${FB_APP_ID}|${FB_CLIENT_TOKEN}`;
    fetch(fbApiUrl, {
      headers: {
        Authorization: `Bearer ${fbAccessToken}`,
        'Content-Type': 'application/json',
      },
      method: 'GET',
    })
      .then((res) => res.json())
      .then((result) => {
        // console.log('result:', result);
        setFbPost(result.html);
      });
  }, [node.link]);
  return (
    <div>
      <script
        async=""
        src="https://connect.facebook.net/en_US/sdk.js#xfbml=1&amp;version=v12.0"
      />
      <div dangerouslySetInnerHTML={{ __html: fbPost }} />
    </div>
  );
}
