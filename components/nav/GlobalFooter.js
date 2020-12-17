export default function GlobalFooter(props) {
  return (
    <footer className="footer">
      <div className="content has-text-centered">
        <p>
          <strong>{props.metadata['footerTitle']}</strong> by{' '}
          <a href={props.metadata['footerBylineLink']}>
            {props.metadata['footerBylineName']}
          </a>
          .
        </p>
      </div>
    </footer>
  );
}
