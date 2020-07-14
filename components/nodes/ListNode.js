export default function ListNode({ node }) {
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

    return (<li>{text}</li>);
  }

  if (node.listType === "NUMBER") {
    return (
      <ol>
        {node.children.map(child => processChild(child))}
      </ol>
    )
  } else {
    return (
      <ul>
        {node.children.map(child => processChild(child))}
      </ul>
    )
  }
}
