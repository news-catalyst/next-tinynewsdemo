import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import tw, { styled } from 'twin.macro';
import {
  renderDate,
  renderAuthors,
  hasuraLocaliseText,
} from '../../lib/utils.js';
import Typography from '../common/Typography';

const Asset = tw.li`border-b border-gray-200 items-start content-start flex flex-row flex-nowrap mb-6 pb-6`;
const AssetMetaContainer = tw.div`flex-1 w-full relative`;
const AssetDescriptor = tw.span`block leading-4 mb-2`;
const AssetDescriptorLink = styled.a(({ meta }) => ({
  ...tw`font-bold text-xs`,
  fontFamily: Typography[meta.theme].ArticleDescriptor,
}));
const AssetTitle = styled.h4(({ meta }) => ({
  ...tw`font-bold text-xl leading-5 tracking-tight`,
  fontFamily: Typography[meta.theme].ArticleTitle,
}));
const AssetByline = styled.div(({ meta }) => ({
  ...tw`text-xs mt-3 flex flex-row flex-wrap items-baseline`,
  fontFamily: Typography[meta.theme].ArticleMetaTop,
}));
const AssetTime = tw.time`text-gray-500 block mb-4`;
const AssetThumbnail = tw.figure`ml-5 order-2 w-1/3`;

export default function ArticleLink({
  article,
  isAmp,
  showCategory,
  metadata,
}) {
  let mainImage = null;
  let mainImageNode;

  let headline = hasuraLocaliseText(article.article_translations, 'headline');

  let categoryTitle;

  if (article.category && article.category.category_translations) {
    categoryTitle = hasuraLocaliseText(
      article.category.category_translations,
      'title'
    );
  }

  let articleContent = hasuraLocaliseText(
    article.article_translations,
    'content'
  );
  if (
    articleContent !== null &&
    articleContent !== undefined &&
    typeof articleContent !== 'string'
  ) {
    try {
      mainImageNode = articleContent.find((node) => node.type === 'mainImage');
    } catch (e) {
      console.log(
        article.id,
        headline,
        'error finding main image:',
        e,
        articleContent
      );
    }
  }

  if (mainImageNode) {
    mainImage = mainImageNode.children[0];
  }

  let firstPublishedAt;
  if (
    article.article_translations &&
    article.article_translations[0] &&
    article.article_translations[0].first_published_at !== null
  ) {
    firstPublishedAt = article.article_translations[0].first_published_at;
  }

  return (
    <Asset>
      <AssetMetaContainer>
        <AssetDescriptor meta={metadata}>
          {article.category && showCategory && (
            <Link key={categoryTitle} href={`/${article.category.slug}`}>
              <AssetDescriptorLink meta={metadata}>
                {categoryTitle}
              </AssetDescriptorLink>
            </Link>
          )}
        </AssetDescriptor>
        <AssetTitle meta={metadata}>
          {headline && (
            <Link
              href="/articles/[category]/[slug]"
              as={`/articles/${article.category.slug}/${article.slug}`}
            >
              <a>{headline}</a>
            </Link>
          )}
        </AssetTitle>
        <AssetByline meta={metadata}>
          By&nbsp;{renderAuthors(article)}&nbsp;
          <AssetTime>
            <span>{renderDate(firstPublishedAt, false)}</span>
          </AssetTime>
        </AssetByline>
      </AssetMetaContainer>
      {mainImage && (
        <AssetThumbnail>
          {isAmp ? (
            <amp-img
              width={mainImage.width}
              height={(mainImage.height / mainImage.width) * 400}
              src={mainImage.imageUrl}
              alt={mainImage.imageAlt}
              layout="responsive"
            />
          ) : (
            <Image
              src={mainImage.imageUrl}
              width={400}
              height={(mainImage.height / mainImage.width) * 400}
              alt={mainImage.imageAlt}
              className="image"
            />
          )}
        </AssetThumbnail>
      )}
    </Asset>
  );
}
