import { useEffect, useState } from 'react';
import Script from 'next/script';

const FB_SDK_URL = 'https://connect.facebook.net/en_US/sdk.js';

export default function Facebook({ node }) {
  const [markup, setMarkup] = useState(null);

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

  const checkFacebookSdk = () => {
    return new Promise((resolve) => {
      self.timer = window.setTimeout(() => {
        if (window.FB) {
          clearTimeout(self.timer);
          console.log('* found window.FB, clearing timeout and resolving!');
          resolve(1);
        } else {
          console.log(':( no window.FB, waiting 20ms then retrying', self);
          checkFacebookSdk(self);
        }
      }, 20);
    });
  };

  useEffect(() => {
    // async function loadFB() {
    //   if (!document.getElementById('load-facebook-sdk')) {
    //     await injectScript();
    //   }

    //   await checkFacebookSdk();
    // }

    // loadFB();

    if (node.html) {
      setMarkup(node.html);
      console.log('Set markup to the node.html:', node.html);
    } else {
      console.error('No markup found for the facebook embed...', node);
    }
  }, [node.link]);

  return (
    <div>
      <Script
        src="https://connect.facebook.net/en_US/sdk.js"
        strategy="lazyOnload"
      />
      <div dangerouslySetInnerHTML={{ __html: markup }} />
    </div>
  );
}
