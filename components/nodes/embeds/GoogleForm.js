export default function GoogleForm({ node, amp }) {
  const el = amp ? (
    <div />
  ) : (
    <iframe
      src={node.link}
      width="640"
      height="640"
      frameBorder="0"
      marginHeight="0"
      marginWidth="0"
    />
  );
  return el;
}
