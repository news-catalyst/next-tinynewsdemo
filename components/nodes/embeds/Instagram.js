import { useEffect, useState } from 'react'

export default function Instagram({ node }) {
    const [video, setVideo] = useState(null);
    useEffect(() => {
        fetch("https://graph.facebook.com/v11.0/instagram_oembed?url=" + node.link)
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
        <div dangerouslySetInnerHTML={{ __html: video }} />
      </div>
    );
    return el;
  }
  