import tw from 'twin.macro';
import Twitter from './embeds/Twitter';
import Youtube from './embeds/Youtube';

const EmbedWrapper = tw.div`mb-5 max-w-full w-full`;

export default function EmbedNode({ node, amp }) {
  /* eslint-disable no-case-declarations */
  let el = null;
  const url = new URL(node.link);
  switch (url.hostname.replace('www.', '')) {
    case 'twitter.com':
      el = <Twitter node={node} amp={amp} />;
      break;
    case 'youtube.com':
      el = <Youtube node={node} amp={amp} url={url} />;
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
