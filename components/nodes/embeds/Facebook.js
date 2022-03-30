import { useEffect, useState } from 'react';
import Script from 'next/script';

export default function Facebook({ node }) {
  const [markup, setMarkup] = useState(null);

  useEffect(() => {
    if (node.html) {
      setMarkup(node.html);
    }
  }, []);

  return (
    <div>
      <Script
        src="https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v3.2"
        strategy="afterInteractive"
      />
      <div dangerouslySetInnerHTML={{ __html: markup }} />
    </div>
  );
}
