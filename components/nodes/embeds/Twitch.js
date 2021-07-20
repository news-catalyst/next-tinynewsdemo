import ReactPlayer from 'react-player/lazy';

export default function Twitch({ node, amp }) {
  const el = amp ? (
    <div />
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
        controls="true"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
        }}
      />
    </div>
  );
  return el;
}
