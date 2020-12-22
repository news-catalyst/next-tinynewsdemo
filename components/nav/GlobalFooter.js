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
    <footer className="tbd">
      <div className="section__container">
        <p>
          <strong>{title}</strong> by <a href={bylineLink}>{byline}</a>.
        </p>
      </div>
    </footer>
  );
}
