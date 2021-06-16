import { TwitterTweetEmbed } from 'react-twitter-embed';

export default function Twitter({ node, amp }) {
  const tweetId = node.link.split('/').slice(-1)[0];
  const el = amp ? (
    <amp-twitter
      layout="responsive"
      data-tweetid={tweetId}
      width="400"
      height="200"
    />
  ) : (
    <TwitterTweetEmbed tweetId={tweetId} />
  );
  return el;
}
