import { Paragraph } from '../common/CommonStyles';

export default function NewsletterTextNode({ node }) {
  let text = node.insert;

  return <Paragraph>{text}</Paragraph>;
}
