import { useEffect, useState } from 'react';

const FB_APP_ID = process.env.NEXT_PUBLIC_FB_APP_ID;
const FB_CLIENT_TOKEN = process.env.NEXT_PUBLIC_FB_CLIENT_TOKEN;
const FB_SDK_URL = 'https://connect.facebook.net/en_US/sdk.js';

export default function Facebook({ node }) {
  const [fbContent, setFbContent] = useState(null);

  function injectScript() {
    const script = document.createElement('script');
    script.id = 'load-facebook-sdk';
    script.src = FB_SDK_URL;
    script.async = true;
    console.log('appending', script, 'to the body of the page');
    const body = document.body;
    body.appendChild(script);
  }

  useEffect(() => {
    if (!document.getElementById('load-facebook-sdk')) {
      injectScript();
    }
    let fbApiUrl;
    if (/\/videos/.test(node.link)) {
      fbApiUrl =
        'https://graph.facebook.com/v12.0/oembed_video?url=' + node.link;
    } else if (/\/posts/.test(node.link)) {
      fbApiUrl =
        'https://graph.facebook.com/v12.0/oembed_post?url=' + node.link;
    } else {
      fbApiUrl =
        'https://graph.facebook.com/v12.0/oembed_page?url=' + node.link;
    }

    const fbAccessToken = `${FB_APP_ID}|${FB_CLIENT_TOKEN}`;
    console.log(
      'FB tokens (app, client, combo):',
      FB_APP_ID,
      FB_CLIENT_TOKEN,
      fbAccessToken
    );
    fetch(fbApiUrl, {
      headers: {
        Authorization: `Bearer ${fbAccessToken}`,
        'Content-Type': 'application/json',
      },
      method: 'GET',
    })
      .then((res) => res.json())
      .then((result) => {
        console.log('result:', result);
        setFbContent(result.html);
      });
  }, [node.link]);
  return (
    <div>
      <div dangerouslySetInnerHTML={{ __html: fbContent }} />
    </div>
  );
}
