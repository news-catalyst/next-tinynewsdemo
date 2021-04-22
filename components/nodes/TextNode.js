import tw from 'twin.macro';

const Paragraph = tw.p`text-lg mb-5 leading-relaxed`;
const H2 = tw.h2`font-bold text-2xl leading-tight mt-10 mb-4`;
const H3 = tw.h3`font-bold text-xl leading-tight mt-10 mb-4`;
const Anchor = tw.a`text-black cursor-pointer border-b border-blue-500`;

export default function TextNode({ node }) {
  const processChild = function (child, nextChild) {
    let supportedPunctuation = [',', '.', '?', '!', ';', ':'];
    let delimiterSpaceChar = ' ';
    // if this is a link and the next node/child starts with one of the punctuation marks above, don't add a space
    if (
      child.link &&
      nextChild &&
      supportedPunctuation.includes(nextChild.content[0])
    ) {
      delimiterSpaceChar = '';
    }

    let text = (
      <span key={child.index ? child.index : child.content}>
        {child.content}
        {delimiterSpaceChar}
      </span>
    );

    if (child.style) {
      if (child.style.underline && !child.link) {
        text = <u key={`${child.index}-u-${text}`}>{text}</u>;
      }
      if (child.style.italic) {
        text = <em key={`${child.index}-em-${text}`}>{text}</em>;
      }
      if (child.style.bold) {
        text = <strong key={`${child.index}-strong-${text}`}>{text}</strong>;
      }
    }

    if (child.link) {
      text = (
        <Anchor key={child.link} href={child.link}>
          {text}
        </Anchor>
      );
    }

    return text;
  };

  const children = node.children.map((child, i) =>
    processChild(child, node.children[i + 1])
  );
  let wrapper = null;

  if (node.style == 'TITLE') {
    wrapper = <h1>{children}</h1>;
  } else if (node.style == 'SUBTITLE') {
    wrapper = <H2>{children}</H2>;
  } else if (node.style == 'HEADING_1') {
    wrapper = <h1>{children}</h1>;
  } else if (node.style == 'HEADING_2') {
    wrapper = <H2>{children}</H2>;
  } else if (node.style == 'HEADING_3') {
    wrapper = <H3>{children}</H3>;
  } else if (node.style == 'NORMAL_TEXT') {
    wrapper = <Paragraph>{children}</Paragraph>;
  } else {
    wrapper = <>{children}</>;
  }

  return wrapper;
}
