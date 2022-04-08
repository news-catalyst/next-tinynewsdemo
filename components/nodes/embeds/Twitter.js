import TweetEmbed from 'react-tweet-embed';

export default function Twitter({ node, amp }) {
  const tweetId = node.link.split('/').slice(-1)[0].split('?')[0];
  const el = amp ? (
    <amp-twitter
      layout="responsive"
      data-tweetid={tweetId}
      width="400"
      height="200"
    />
  ) : (
    <TweetEmbed tweetId={tweetId} />
  );
  return el;
}
