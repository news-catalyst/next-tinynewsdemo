import { useEffect, useState } from 'react';

const FB_APP_ID = process.env.NEXT_PUBLIC_FB_APP_ID;
const FB_CLIENT_TOKEN = process.env.NEXT_PUBLIC_FB_CLIENT_TOKEN;
const FB_SDK_URL = 'https://connect.facebook.net/en_US/sdk.js';

export default function Facebook({ node }) {
  const [fbReady, setFbReady] = useState(false);
  const [fbContent, setFbContent] = useState(null);
  const [someRando, setSomeRando] = useState(null);
  async function injectScript() {
    const script = document.createElement('script');
    script.id = 'load-facebook-sdk';
    script.src = FB_SDK_URL;
    script.async = true;
    script.defer = true;
    console.log('appending', script, 'to the body of the page');
    const body = document.body;
    body.appendChild(script);
  }

  async function initFacebook() {
    console.log('initializing facebook');
    window.FB.init({
      appId: FB_APP_ID,
      status: true,
      xfbml: true,
      version: 'v12.0',
    });
  }

  const checkFacebookSdk = () => {
    return new Promise((resolve, reject) => {
      self.timer = window.setTimeout(() => {
        if (window.FB) {
          clearTimeout(self.timer);
          console.log('* found window.FB, clearing timeout and resolving!');

          setFbReady(true);
          resolve(1);
        } else {
          console.log(':( no window.FB, waiting 20ms then retrying', self);
          setFbReady(false);
          checkFacebookSdk(self);
        }
      }, 20);
    });
  };

  async function loadEmbed(link) {
    console.log('loadEmbed:', link);
    let fbApiUrl;
    if (/\/videos/.test(link)) {
      fbApiUrl = 'https://graph.facebook.com/v12.0/oembed_video?url=' + link;
    } else if (/\/posts/.test(node.link)) {
      fbApiUrl = 'https://graph.facebook.com/v12.0/oembed_post?url=' + link;
    } else {
      fbApiUrl = 'https://graph.facebook.com/v12.0/oembed_page?url=' + link;
    }

    const fbAccessToken = `${FB_APP_ID}|${FB_CLIENT_TOKEN}`;

    const res = await fetch(fbApiUrl, {
      headers: {
        Authorization: `Bearer ${fbAccessToken}`,
        'Content-Type': 'application/json',
      },
      method: 'GET',
    });
    console.log('result from fetch:', res);

    const data = await res.json();
    console.log('setting fbContent html:', data.html);
    setFbContent(data.html);
  }

  useEffect(() => {
    if (window.FB && fbReady) {
      async function loadAndParseEmbed() {
        console.log(
          'useEffect window.FB found, loading embed for',
          node.link,
          '...'
        );
        await initFacebook();
        await loadEmbed(node.link);
        window.FB.XFBML.parse();
      }
      loadAndParseEmbed();
    } else {
      if (!document.getElementById('load-facebook-sdk')) {
        injectScript();
      }

      checkFacebookSdk();
    }
  }, [node.link, fbReady]);

  return (
    <div>
      <div dangerouslySetInnerHTML={{ __html: fbContent }} />
    </div>
  );
}
