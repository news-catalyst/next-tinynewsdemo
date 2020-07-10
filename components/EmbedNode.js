import Embed from 'react-embed';

export default function EmbedNode({ node }) {
  console.log("processing embed")
  return (
    <Embed url={node.link} />
  )
}
