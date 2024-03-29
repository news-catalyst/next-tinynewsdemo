import tw from 'twin.macro';
import Twitter from './embeds/Twitter';
import Youtube from './embeds/Youtube';
import TikTokEmbed from './embeds/TikTok';
import Facebook from './embeds/Facebook';
import Instagram from './embeds/Instagram';
import Spotify from './embeds/Spotify';
import ApplePodcasts from './embeds/ApplePodcasts';
import Vimeo from './embeds/Vimeo';
import Twitch from './embeds/Twitch';
import GoogleForm from './embeds/GoogleForm';
import Airtable from './embeds/Airtable';

const EmbedWrapper = tw.div`mb-5 max-w-full w-full`;

export default function EmbedNode({ node, amp }) {
  /* eslint-disable no-case-declarations */
  let el = null;
  if (!node.link) {
    console.error('Error rendering embed due to missing link:', node);
    return null;
  }

  let url;
  try {
    url = new URL(node.link);
  } catch (e) {
    console.error(
      `Error rendering embed due to invalid URL '${
        node.link
      }': ${JSON.stringify(e)}`
    );
    return null;
  }

  switch (url.hostname.replace('www.', '')) {
    case 'twitter.com':
      el = <Twitter node={node} amp={amp} />;
      break;
    case 'youtube.com':
      el = <Youtube node={node} amp={amp} url={url} />;
      break;
    case 'youtu.be':
      el = <Youtube node={node} amp={amp} url={url} />;
      break;
    case 'tiktok.com':
      el = <TikTokEmbed node={node} amp={amp} />;
      break;
    case 'facebook.com':
      el = <Facebook node={node} amp={amp} />;
      break;
    case 'instagram.com':
      if (url.pathname.match(/^\/reel/)) {
        el = <Facebook node={node} amp={amp} />;
      } else {
        el = <Instagram node={node} amp={amp} />;
      }
      break;
    case 'open.spotify.com':
      el = <Spotify node={node} amp={amp} />;
      break;
    case 'podcasts.apple.com':
      el = <ApplePodcasts node={node} amp={amp} />;
      break;
    case 'vimeo.com':
      el = <Vimeo node={node} amp={amp} url={url} />;
      break;
    case 'twitch.tv':
      el = <Twitch node={node} amp={amp} url={url} />;
      break;
    case 'forms.gle':
      el = <GoogleForm node={node} amp={amp} />;
      break;
    case 'docs.google.com':
      if (url.pathname.match(/^\/forms/)) {
        el = <GoogleForm node={node} amp={amp} />;
      }
      break;
    case 'airtable.com':
      el = <Airtable node={node} amp={amp} />;
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
