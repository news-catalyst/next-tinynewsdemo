export default function Spotify({ node, amp }) {
  const subNodes = node.link.split('/');
  const id = subNodes.slice(-1);
  const epTrack = subNodes[3];
  const el = amp ? (
    <div />
  ) : (
    <iframe
      src={'https://open.spotify.com/embed/' + epTrack + '/' + id}
      width="300"
      height="380"
      frameBorder="0"
      allowtransparency="true"
      allow="encrypted-media"
    />
  );
  return el;
}
