import InstagramEmbed from 'react-instagram-embed';

const FB_APP_ID = process.env.NEXT_PUBLIC_FB_APP_ID;
const FB_CLIENT_TOKEN = process.env.NEXT_PUBLIC_FB_CLIENT_TOKEN;

export default function Instagram({ node }) {
  return (
    <InstagramEmbed
      url={node.link}
      clientAccessToken={`${FB_APP_ID}|${FB_CLIENT_TOKEN}`}
      hideCaption={false}
      containerTagName="div"
    />
  );
}
