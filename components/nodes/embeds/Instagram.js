import InstagramEmbed from 'react-instagram-embed';

const FB_APP_ID = '200171875317911';
const FB_CLIENT_TOKEN = 'c2953b8f7d46b6793b74c2e1ce6eda66';

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
