export default function Spotify({ node }) {
 return (<iframe src={node.link} width="300" height="380" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>);
}