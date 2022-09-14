export default function GoogleForm({ node, amp }) {
  const id = node.link.split('/')[6];

  const el = amp ? (
    <div />
  ) : (
    <iframe
      src={
        'https://docs.google.com/forms/d/e/' + id + '/viewform?embedded=true'
      }
      width="100%"
      height="640px"
      frameBorder="0"
      marginHeight="0"
      marginWidth="0"
    />
  );

  //check that node and node.link arent falsy/undefined log error and don't return anything
  //check node/link.split also

  if (!node.link || !node || !node.link.split('/')) {
    console.log('The node.link or node is empty');
  } else {
    return el;
  }
}
