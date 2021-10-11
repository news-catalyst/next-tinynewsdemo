import tw from 'twin.macro';
import { Blockquote, Paragraph, Anchor } from '../common/CommonStyles';

export default function BlockquoteNode({ node, metadata }) {
  const processChild = function (child, nextChild) {
    let text = (
      <span key={child.index ? child.index : child.content}>
        {child.content}
      </span>
    );

    if (child.link) {
      text = (
        <Anchor meta={metadata} key={child.link} href={child.link}>
          {text}
        </Anchor>
      );
    }

    return text;
  };

  const children = node.children.map((child, i) =>
    processChild(child, node.children[i + 1])
  );

  let quotedContent = (
    <Blockquote meta={metadata}>
      <p tw="text-lg leading-relaxed">{children}</p>
    </Blockquote>
  );

  return quotedContent;
}
