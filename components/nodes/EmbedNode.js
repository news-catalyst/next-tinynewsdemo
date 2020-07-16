import { TwitterTweetEmbed } from 'react-twitter-embed';
import ReactPlayer from 'react-player/lazy';

const reactPlayerHosts = [
  'youtube.com',
  'vimeo.com',
  'soundcloud.com',
  'twitch.tv'
];

export default function EmbedNode({ node }) {
  let el = null;
  const url = new URL(node.link);
  switch(url.hostname.replace('www.', '')) {
    case 'twitter.com':
      el = (<TwitterTweetEmbed tweetId={node.link.split('/').slice(-1)[0]} />)
      break;
    case 'youtube.com':
      el = (<ReactPlayer url={node.link} />)
      break;
    default:
      el = (<p><a href={node.link}>{node.link} is not supported yet</a></p>)
  }

  return el;
}
