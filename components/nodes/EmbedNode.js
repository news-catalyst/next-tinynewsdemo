import { head } from 'next/head';
import { TwitterTweetEmbed } from 'react-twitter-embed';
import ReactPlayer from 'react-player/lazy';

export default function EmbedNode({ node, amp }) {
  let el = null;
  const url = new URL(node.link);
  switch(url.hostname.replace('www.', '')) {
    case 'twitter.com':
      const tweetId = node.link.split('/').slice(-1)[0];
      el = amp ?
        (<amp-twitter layout="responsive" data-tweetid={tweetId} width="400" height="200"/>) :
        (<TwitterTweetEmbed tweetId={tweetId} />)
      break;
    case 'youtube.com':
      const videoId = url.searchParams.get("v");
      console.log(url.searchParams.get("v"))
      el = amp ?
        (<amp-youtube layout="responsive" data-videoid={videoId} width="800" height="400" />) :
        (<ReactPlayer url={node.link} />)
      break;
    default:
      el = (<p><a href={node.link}>{node.link} is not supported yet</a></p>)
      break;
  }

  return el;
}
