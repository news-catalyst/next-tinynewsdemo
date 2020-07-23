export default function TextNode({ node }) {
  const processChild = function (child) {
    let text = <span>{child.content} </span>;

    if (child.style) {
      if (child.style.underline) {
        text = <u>{text}</u>;
      }
      if (child.style.italic) {
        text = <em>{text}</em>;
      }
      if (child.style.bold) {
        text = <strong>{text}</strong>;
      }
    }

    if (child.link) {
      text = <a href={child.link}>{text}</a>;
    }

    return text;
  };

  const children = node.children.map((child) => processChild(child));
  let wrapper = null;

  if (node.style == 'TITLE') {
    wrapper = <h1>{children}</h1>;
  } else if (node.style == 'SUBTITLE') {
    wrapper = <h2>{children}</h2>;
  } else if (node.style == 'HEADING_1') {
    wrapper = <h1>{children}</h1>;
  } else if (node.style == 'HEADING_2') {
    wrapper = <h2>{children}</h2>;
  } else if (node.style == 'HEADING_3') {
    wrapper = <h3>{children}</h3>;
  } else if (node.style == 'NORMAL_TEXT') {
    wrapper = <p>{children}</p>;
  } else {
    wrapper = <>{children}</>;
  }

  return wrapper;
}
