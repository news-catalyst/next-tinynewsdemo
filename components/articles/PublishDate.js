import { renderDate } from '../../lib/utils.js';
import tw, { styled } from 'twin.macro';
import Typography from '../common/Typography';

const ArticlePublishDate = styled.time(({ meta }) => ({
  ...tw`text-sm text-gray-500 block mb-4 text-left w-full`,
  fontFamily: Typography[meta.theme].PublishDate,
}));

export default function PublishDate({ article, meta }) {
  let firstPublishedOn = null;
  let lastPublishedOn = null;
  if (
    article.article_translations &&
    article.article_translations[0] &&
    article.article_translations[0].first_published_at !== null
  ) {
    firstPublishedOn = renderDate(
      article.article_translations[0].first_published_at
    );
  }

  if (
    article.article_translations &&
    article.article_translations[0] &&
    article.article_translations[0].last_published_at !== null &&
    article.article_translations[0].last_published_at !==
      article.article_translations[0].first_published_at
  ) {
    lastPublishedOn = renderDate(
      article.article_translations[0].last_published_at
    );
  }

  // prefer official published data if it's present - useful on preview page, mainly,
  // when the current translation ID might not be equal to the last published translation ID
  if (
    article.published_article_translations &&
    article.published_article_translations[0] &&
    article.published_article_translations[0].article_translation
  ) {
    firstPublishedOn = renderDate(
      article.published_article_translations[0].article_translation
        .first_published_at
    );
    lastPublishedOn = renderDate(
      article.published_article_translations[0].article_translation
        .last_published_at
    );
  }
  return (
    <>
      <ArticlePublishDate meta={meta}>
        {firstPublishedOn !== null && <span>{firstPublishedOn}</span>}
        {lastPublishedOn !== null && (
          <span>
            &nbsp;—&nbsp;<em>Updated</em>&nbsp;
            {lastPublishedOn}
          </span>
        )}
      </ArticlePublishDate>
    </>
  );
}
