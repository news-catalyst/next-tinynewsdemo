import { useEffect, useState } from 'react'

export default function TikTokEmbed({ node }) {
    const [video, setVideo] = useState(null);
    useEffect(() => {
        fetch("https://www.tiktok.com/oembed?url=" + node.link)
            .then(res => res.json())
            .then(
                (result) => {
                    setVideo(result.html);
                },
                // Note: it's important to handle errors here
                // instead of a catch() block so that we don't swallow
                // exceptions from actual bugs in components.
            )
      }, [])
    const el = (
      <div>
        <script async="" src="https://www.tiktok.com/embed.js" />
        <div dangerouslySetInnerHTML={{ __html: video }} />
      </div>
    );
    return el;
  }
  