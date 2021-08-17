import { Paragraph, Anchor } from '../common/CommonStyles';

export default function NewsletterLinkNode({ node }) {
  let text = (
    <Anchor key={node.attributes.link} href={node.attributes.link}>
      {node.insert}
    </Anchor>
  );
  return <Paragraph>{text}</Paragraph>;
}
