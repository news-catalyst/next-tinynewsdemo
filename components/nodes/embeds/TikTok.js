import { useEffect, useState } from 'react';

export default function TikTokEmbed({ node, amp }) {
  const [video, setVideo] = useState(null);
  useEffect(() => {
    if (amp) return;

    fetch('https://www.tiktok.com/oembed?url=' + node.link)
      .then((res) => res.json())
      .then(
        (result) => {
          setVideo(result.html);
        }
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
      );
  }, [amp, node.link]);
  const el = amp ? (
    <div />
  ) : (
    <div>
      <script async="" src="https://www.tiktok.com/embed.js" />
      <div dangerouslySetInnerHTML={{ __html: video }} />
    </div>
  );
  return el;
}
