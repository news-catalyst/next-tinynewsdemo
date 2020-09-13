import { siteMetadata } from '../../lib/siteMetadata.js';

export default function GlobalFooter() {
  return (
    <footer className="footer">
      <div className="content has-text-centered">
        <p>
          <strong>{siteMetadata.footerTitle}</strong> by{' '}
          <a href={siteMetadata.footerBylineLink}>
            {siteMetadata.footerBylineName}
          </a>
          .
        </p>
      </div>
    </footer>
  );
}
