import ReactPlayer from 'react-player/lazy';

export default function Youtube({ node, amp, url }) {
  let videoId = null;

  // video IDs
  if (url.hostname.includes('youtu.be')) {
    videoId = url.pathname.split('/')[1];
  } else {
    videoId = url.searchParams.get('v');
  }
  const el = amp ? (
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
        controls={true}
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
