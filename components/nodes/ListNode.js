import tw from 'twin.macro';
import TextNode from './TextNode.js';

const UnorderedList = tw.ul`mb-4 list-outside list-disc`;
const OrderedList = tw.ol`mb-4 list-outside list-decimal`;
const ListItem = tw.li`mb-1 pl-2 ml-2 text-lg`;

export default function ListNode({ node, metadata }) {
  let items = [];
  node.items.map(function (item) {
    if (item.nestingLevel === 1) {
      items.push(
        <ListItem key={item.index} style={{ listStyle: 'none' }}>
          <UnorderedList>
            <ListItem>
              <TextNode metadata={metadata} node={item} />
            </ListItem>
          </UnorderedList>
        </ListItem>
      );
    } else if (item.nestingLevel === 2) {
      items.push(
        <ListItem key={item.index} style={{ listStyle: 'none' }}>
          <UnorderedList>
            <ListItem style={{ listStyle: 'none' }}>
              <UnorderedList>
                <ListItem>
                  <TextNode metadata={metadata} node={item} />
                </ListItem>
              </UnorderedList>
            </ListItem>
          </UnorderedList>
        </ListItem>
      );
    } else if (item.nestingLevel === 3) {
      items.push(
        <ListItem key={item.index} style={{ listStyle: 'none' }}>
          <UnorderedList>
            <ListItem style={{ listStyle: 'none' }}>
              <UnorderedList>
                <ListItem style={{ listStyle: 'none' }}>
                  <UnorderedList>
                    <ListItem>
                      <TextNode metadata={metadata} node={item} />
                    </ListItem>
                  </UnorderedList>
                </ListItem>
              </UnorderedList>
            </ListItem>
          </UnorderedList>
        </ListItem>
      );
    } else {
      items.push(
        <ListItem key={item.index}>
          <TextNode metadata={metadata} node={item} />
        </ListItem>
      );
    }
  });

  if (node.listType === 'NUMBER') {
    return <OrderedList>{items}</OrderedList>;
  } else {
    return <UnorderedList>{items}</UnorderedList>;
  }
}
