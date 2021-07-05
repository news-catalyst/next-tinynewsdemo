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
        <p>
          <a href="./about">About</a> | <a href="./donate">Donate</a> |{' '}
          <a href="https://store.tryletterhead.com/catalyst-test">
            Advertising
          </a>
        </p>
        <p>Copyright {props.metadata.shortName}</p>
        <p>
          This project is part of the
          <a href="tinynewsco.org">Tiny News Collective</a>.
        </p>
      </div>
    </Footer>
  );
}
