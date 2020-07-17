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

    if (node.style == "TITLE") {
      text = (<h1>{text}</h1>);
    }
     else if (node.style == "SUBTITLE") {
      text = (<h2>{text}</h2>);
    }
    else if (node.style == "HEADING_1") {
      text = (<h1>{text}</h1>);
    }
    else if (node.style == "HEADING_2") {
      text = (<h2>{text}</h2>);
    }
    else if (node.style == "HEADING_3") {
      text = (<h3>{text}</h3>);
    }
    else if (node.style == "NORMAL_TEXT"){
      text = (<p>{text}</p>);
    }

    return text;
  }

  return (
    <p>
      {node.children.map(child => processChild(child))}
    </p>
  );
}
