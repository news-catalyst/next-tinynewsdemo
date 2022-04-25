export default function Airtable({ node, amp }) {
  //this is to add the 'embed' before the id since that's how airtable set it up
  const partial_src = node.link.slice(0, 21);
  const id = node.link.split('/').slice(3);

  const el = amp ? (
    <div />
  ) : (
    <iframe
      src={partial_src + 'embed/' + id}
      width="100%"
      height="553"
      frameBorder="0"
      marginHeight="0"
      onmousewheel=""
      marginWidth="0"
    />
  );

  return el;
}
