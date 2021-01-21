import { renderDate } from '../../lib/utils.js';

export default function PublishDate({ article }) {
  let firstPublishedOn = null;
  let lastPublishedOn = null;
  if (article.firstPublishedOn !== null) {
    firstPublishedOn = renderDate(article.firstPublishedOn);
  }

  if (article.lastPublishedOn !== null) {
    lastPublishedOn = renderDate(article.lastPublishedOn);
  }

  return (
    <>
      <time key="datelines">
        {firstPublishedOn !== null && <span>{firstPublishedOn}</span>}
        {lastPublishedOn !== null && (
          <span>
            <em>Updated</em>&nbsp;
            {lastPublishedOn}
          </span>
        )}
      </time>
    </>
  );
}
