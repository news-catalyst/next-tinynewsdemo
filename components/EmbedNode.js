import Embed from 'react-embed';

export default function EmbedNode({ node }) {
  return (
    <Embed url={node.link} />
  )
}
