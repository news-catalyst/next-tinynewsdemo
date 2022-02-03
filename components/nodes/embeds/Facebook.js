import { useEffect, useState } from 'react';
import Script from 'next/script';

export default function Facebook({ node }) {
  const [markup, setMarkup] = useState(null);

  useEffect(() => {
    if (node.html) {
      setMarkup(node.html);
      // console.log('Set markup to the node.html:', node.html);
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
