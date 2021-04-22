import tw from 'twin.macro';
import { TwitterTweetEmbed } from 'react-twitter-embed';
import ReactPlayer from 'react-player/lazy';

const EmbedWrapper = tw.div`mb-5 max-w-full w-full`;

export default function EmbedNode({ node, amp }) {
  /* eslint-disable no-case-declarations */
  let el = null;
  const url = new URL(node.link);
  switch (url.hostname.replace('www.', '')) {
    case 'twitter.com':
      const tweetId = node.link.split('/').slice(-1)[0];
      el = amp ? (
        <amp-twitter
          layout="responsive"
          data-tweetid={tweetId}
          width="400"
          height="200"
        />
      ) : (
        <TwitterTweetEmbed tweetId={tweetId} />
      );
      break;
    case 'youtube.com':
      const videoId = url.searchParams.get('v');
      el = amp ? (
        <amp-youtube
          layout="responsive"
          data-videoid={videoId}
          width="800"
          height="400"
        />
      ) : (
        <div
          style={{
            position: 'relative',
            paddingTop: '56.25%',
          }}
        >
          <ReactPlayer
            url={node.link}
            width="100%"
            height="100%"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
            }}
          />
        </div>
      );
      break;
    default:
      el = (
        <p>
          <a href={node.link}>{node.link} is not supported yet</a>
        </p>
      );
      break;
  }

  /* eslint-enable no-case-declarations */
  return <EmbedWrapper>{el}</EmbedWrapper>;
}
