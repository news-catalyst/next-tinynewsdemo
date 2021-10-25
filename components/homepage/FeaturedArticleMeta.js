import Link from 'next/link';
import {
  renderDate,
  renderAuthors,
  hasuraLocaliseText,
} from '../../lib/utils.js';
import tw, { styled } from 'twin.macro';
import Typography from '../common/Typography';

const fontSizes = {
  xs: '0.75rem',
  sm: '0.875rem',
  base: '1rem',
  lg: '1.125rem',
  fourxl: '2.25rem',
};

const lineHeights = {
  xs: '1rem',
  sm: '1.25rem',
  base: '1.5rem',
  lg: '1.75rem',
  fourxl: '2.5rem',
};

const AssetDescriptor = tw.h5`block leading-4 mb-2 font-bold`;
const AssetDescriptorLink = styled.a(({ big, meta }) => ({
  ...tw`cursor-pointer hover:underline`,
  fontSize: big ? fontSizes['sm'] : fontSizes['xs'],
  lineHeight: big ? lineHeights['sm'] : lineHeights['xs'],
  fontFamily: Typography[meta.theme].ArticleDescriptor,
}));

const AssetExcerpt = styled.p(({ big, meta }) => ({
  ...tw`leading-6 text-gray-700 mt-3`,
  fontSize: big ? fontSizes['lg'] : fontSizes['sm'],
  lineHeight: big ? lineHeights['lg'] : lineHeights['sm'],
  fontFamily: Typography[meta.theme].ArticleDek,
}));

const AssetByline = styled.p(({ big, meta }) => ({
  ...tw`mt-3 flex flex-row flex-wrap items-baseline`,
  fontSize: big ? fontSizes['base'] : fontSizes['xs'],
  lineHeight: big ? lineHeights['base'] : lineHeights['xs'],
  fontFamily: Typography[meta.theme].ArticleMetaTop,
}));

const AssetTitle = styled.h4(({ big, meta }) => ({
  ...tw`font-bold tracking-tight leading-6 hover:underline`,
  fontSize: big ? fontSizes['fourxl'] : fontSizes['lg'],
  lineHeight: big ? lineHeights['fourxl'] : lineHeights['lg'],
  fontFamily: Typography[meta.theme].ArticleTitle,
}));

export default function FeaturedArticleMeta({ article, big, metadata }) {
  if (article === null || article === undefined || !article) {
    console.error('FeaturedArticleMeta missing article:', article);
  }

  let categoryTitle = hasuraLocaliseText(
    article.category.category_translations,
    'title'
  );
  let headline = hasuraLocaliseText(article.article_translations, 'headline');
  let searchDescription = hasuraLocaliseText(
    article.article_translations,
    'search_description'
  );

  let siteTimeZone;
  if (metadata.timeZone) {
    siteTimeZone = metadata.timeZone;
  } else {
    siteTimeZone = 'US/Eastern';
  }
  let firstPublishedOn;

  const translation = article['article_translations'][0];
  try {
    if (translation) {
      firstPublishedOn = translation.first_published_on;
    }
  } catch (err) {
    console.error(err, translation);
  }

  return (
    <>
      {article.category && (
        <AssetDescriptor>
          <Link href={`/categories/${article.category.slug}`} passHref>
            <AssetDescriptorLink big={big} meta={metadata}>
              {categoryTitle}
            </AssetDescriptorLink>
          </Link>
        </AssetDescriptor>
      )}
      {article.category && (
        <AssetTitle big={big} meta={metadata}>
          <Link href={`/articles/${article.category.slug}/${article.slug}`}>
            <a className="featured">{headline}</a>
          </Link>
        </AssetTitle>
      )}
      <AssetExcerpt big={big} meta={metadata}>
        {searchDescription}
      </AssetExcerpt>
      <AssetByline big={big} meta={metadata}>
        By&nbsp;{renderAuthors(article)}&nbsp;
        {firstPublishedOn && (
          <time>
            <span>{renderDate(firstPublishedOn, siteTimeZone, false)}</span>
          </time>
        )}
      </AssetByline>
    </>
  );
}
