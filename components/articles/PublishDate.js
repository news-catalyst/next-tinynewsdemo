import { renderAuthors, renderDate } from '../../lib/utils.js';

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
      <h2 className="subtitle" key="byline">
        By {renderAuthors(article)}
      </h2>
      <h2 className="subtitle" key="datelines">
        {firstPublishedOn !== null && `Published ${firstPublishedOn}`}
        {lastPublishedOn !== null && ` | Last updated: ${lastPublishedOn}`}
      </h2>
    </>
  );
}
