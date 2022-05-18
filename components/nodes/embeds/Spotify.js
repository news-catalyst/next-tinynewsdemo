export default function Spotify({ node, amp }) {
  const id = node.link.split('/').slice(-1);
  const el = amp ? (
    <div />
  ) : (
    <iframe
      src={'https://open.spotify.com/embed/track/' + id}
      width="300"
      height="380"
      frameBorder="0"
      allowtransparency="true"
      allow="encrypted-media"
    />
  );
  return el;
}
