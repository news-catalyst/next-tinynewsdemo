import tw from 'twin.macro';
import { Blockquote, Paragraph, Anchor } from '../common/CommonStyles';

export default function BlockquoteNode({ node, metadata }) {
  const processChild = function (child, nextChild) {
    let supportedPunctuation = [',', '.', '?', '!', ';', ':', '"', '“', '”'];
    // omit the comma here, we want to add a space after a trailing comma
    let supportedTrailingPunctuation = ['.', '?', '!', ';', ':', '"', '“', '”'];
    let delimiterSpaceChar = ' ';
    // if the next node/child starts with one of the punctuation marks above, don't add a space
    if (
      (nextChild &&
        nextChild.content &&
        nextChild.content[0] &&
        supportedPunctuation.includes(nextChild.content[0])) ||
      (child &&
        child.content &&
        child.content.slice(-1) &&
        supportedTrailingPunctuation.includes(child.content.slice(-1)))
    ) {
      delimiterSpaceChar = '';
    }

    let text = (
      <span key={child.index ? child.index : child.content}>
        {child.content}
        {delimiterSpaceChar}
      </span>
    );

    if (child.link) {
      text = (
        <>
          {delimiterSpaceChar}
          <Anchor meta={metadata} key={child.link} href={child.link}>
            {text}
          </Anchor>
          {delimiterSpaceChar}
        </>
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
