import ReactPlayer from 'react-player/lazy';

export default function Vimeo({ node, amp, url }) {
  const videoId = url.searchParams.get('v');
  const el = amp ? (
    <amp-vimeo
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
