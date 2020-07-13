export default function TextNode({ node }) {
  const processChild = function(child) {
    let text = (<span>{child.content} </span>);
    if (child.style.underline) {
      text = (<u>{text}</u>);
    }
    if (child.style.italic) {
      text = (<em>{text}</em>);
    }
    if (child.style.bold) {
      text = (<strong>{text}</strong>);
    }
    if (child.link) {
      text = (<a href={child.link}>{text}</a>);
    }

    return text;
  }

  return (
    <p>
      {node.children.map(child => processChild(child))}
    </p>
  );
}
