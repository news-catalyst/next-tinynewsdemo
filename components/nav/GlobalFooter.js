import tw from 'twin.macro';

const Footer = tw.footer`flex items-center justify-center bg-gray-200 h-40 text-xs uppercase`;

export default function GlobalFooter(props) {
  let title;
  let bylineLink;
  let byline;
  if (props.metadata) {
    title = props.metadata['footerTitle'];
    bylineLink = props.metadata['footerBylineLink'];
    byline = props.metadata['footerBylineName'];
  }
  return (
    <Footer>
      <div>
        <p>
          <strong>{title}</strong> by <a href={bylineLink}>{byline}</a>.
        </p>
      </div>
    </Footer>
  );
}
