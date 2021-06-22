export default function Spotify({ node, amp }) {
  const el = amp ? (
    <div />
  ) : (
    <iframe
      src={node.link}
      width="300"
      height="380"
      frameBorder="0"
      allowtransparency="true"
      allow="encrypted-media"
    />
  );
  return el;
}
