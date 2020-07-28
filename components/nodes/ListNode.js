// import ListItemNode from './ListItemNode.js';
import TextNode from './TextNode.js';

export default function ListNode({ node }) {
  let items = [];
  node.items.map(function (item) {
    if (item.nestingLevel === 1) {
      items.push(
        <li key={item.index} style={{ listStyle: 'none' }}>
          <ul>
            <li>
              <TextNode node={item} />
            </li>
          </ul>
        </li>
      );
    } else if (item.nestingLevel === 2) {
      items.push(
        <li key={item.index} style={{ listStyle: 'none' }}>
          <ul>
            <li style={{ listStyle: 'none' }}>
              <ul>
                <li>
                  <TextNode node={item} />
                </li>
              </ul>
            </li>
          </ul>
        </li>
      );
    } else {
      items.push(
        <li key={item.index}>
          <TextNode node={item} />
        </li>
      );
    }
  });

  if (node.listType === 'NUMBER') {
    return <ol>{items}</ol>;
  } else {
    return <ul>{items}</ul>;
  }
}
