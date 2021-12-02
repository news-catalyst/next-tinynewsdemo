import tw from 'twin.macro';
import { Paragraph, H1, H2, H3, Anchor } from '../common/CommonStyles';

export default function TextNode({ node, metadata }) {
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
        {child.link ? '' : delimiterSpaceChar}
      </span>
    );

    if (
      child &&
      child.content &&
      child.content.trim().length === 0 &&
      nextChild &&
      nextChild.content &&
      nextChild.content.trim().length !== 0
    ) {
      text = <br />;
    }

    if (child.style) {
      if (child.style.underline && !child.link) {
        text = (
          <>
            {delimiterSpaceChar}
            <u key={`${child.index}-u-${text}`}>{text}</u>
            {delimiterSpaceChar}
          </>
        );
      }
      if (child.style.italic) {
        text = (
          <>
            <em key={`${child.index}-em-${text}`}>{text}</em>
            {delimiterSpaceChar}
          </>
        );
      }
      if (child.style.bold) {
        text = (
          <>
            <strong key={`${child.index}-strong-${text}`}>{text}</strong>
            {delimiterSpaceChar}
          </>
        );
      }
    } else {
      text = (
        <>
          {text}
          {child.link ? '' : delimiterSpaceChar}
        </>
      );
    }

    if (child.link) {
      text = (
        <>
          {delimiterSpaceChar}
          <Anchor key={child.link} href={child.link} meta={metadata}>
            {text}
          </Anchor>
          {delimiterSpaceChar}
        </>
      );
    }

    return text;
  };

  const children = node.children.map((child, i) => {
    if (child.content !== 'FORMAT START' && child.content !== 'FORMAT END') {
      return processChild(child, node.children[i + 1]);
    }
  });
  let wrapper = null;

  if (node.style == 'TITLE') {
    wrapper = <H1>{children}</H1>;
  } else if (node.style == 'SUBTITLE') {
    wrapper = <H2>{children}</H2>;
  } else if (node.style == 'HEADING_1') {
    wrapper = <H1>{children}</H1>;
  } else if (node.style == 'HEADING_2') {
    wrapper = <H2>{children}</H2>;
  } else if (node.style == 'HEADING_3') {
    wrapper = <H3>{children}</H3>;
  } else if (node.style == 'NORMAL_TEXT') {
    wrapper = <Paragraph>{children}</Paragraph>;
  } else if (node.style == 'FORMATTED_TEXT') {
    // console.log('FORMATTED_TEXT node:', node);
    wrapper = <pre>{children}</pre>;
  } else {
    wrapper = <>{children}</>;
  }

  return wrapper;
}
