import { siteMetadata } from '../../lib/siteMetadata.js';

export default function GlobalFooter() {
  return (
    <footer className="tbd">
      <div className="section__container">
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
