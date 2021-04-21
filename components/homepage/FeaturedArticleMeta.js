import Link from 'next/link';
import {
  renderDate,
  renderAuthors,
  hasuraLocaliseText,
} from '../../lib/utils.js';
import tw, { styled } from 'twin.macro';

const AssetDescriptor = tw.span`block leading-4 mb-2 font-bold`;
const AssetDescriptorLink = styled.a(({ big }) => [
  tw`text-black cursor-pointer`,
  big ? tw`text-sm` : tw`text-xs`,
]);

const AssetExcerpt = styled.p(({ big }) => [
  tw`leading-6 text-gray-700 mt-3`,
  big ? tw`text-lg` : tw`text-sm`,
]);

const AssetByline = styled.p(({ big }) => [
  tw`mt-3 flex flex-row flex-wrap items-baseline`,
  big ? tw`text-base` : tw`text-xs`,
]);

const AssetTitle = styled.h4(({ big }) => [
  tw`font-bold tracking-tight leading-6`,
  big ? tw`text-4xl` : tw`text-lg`,
]);

export default function FeaturedArticleMeta({ article, big }) {
  if (article === null || article === undefined || !article) {
    console.log('FeaturedArticleMeta missing article:', article);
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
          <Link href={`/${article.category.slug}`}>
            <AssetDescriptorLink>{categoryTitle}</AssetDescriptorLink>
          </Link>
        </AssetDescriptor>
      )}
      {article.category && (
        <AssetTitle big={big}>
          <Link href={`/articles/${article.category.slug}/${article.slug}`}>
            <a className="featured">{headline}</a>
          </Link>
        </AssetTitle>
      )}
      <AssetExcerpt big={big}>{searchDescription}</AssetExcerpt>
      <AssetByline big={big}>
        By&nbsp;{renderAuthors(article)}&nbsp;
        {firstPublishedOn && (
          <time>
            <span>{renderDate(firstPublishedOn, false)}</span>
          </time>
        )}
      </AssetByline>
    </>
  );
}
