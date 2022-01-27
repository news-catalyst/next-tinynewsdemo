export default function GoogleForm({ node, amp }) {
  const el = amp ? (
    <div />
  ) : (
    <iframe
      src={node.link}
      width="640"
      height="640"
      frameBorder="0"
      marginheight="0"
      marginwidth="0"
    />
  );
  return el;
}
