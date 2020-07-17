import TextNode from './TextNode.js';

export default function ListNode({ node }) {
  if (node.listType === 'NUMBER') {
    return (
      <ol>
        {node.items.map((item) => (
          <li key={item.index}>
            <TextNode node={item} />
          </li>
        ))}
      </ol>
    );
  } else {
    return (
      <ul>
        {node.items.map((item) => (
          <li key={item.index}>
            <TextNode node={item} />
          </li>
        ))}
      </ul>
    );
  }
}
