import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import tw from 'twin.macro';
import {
  renderDate,
  renderAuthors,
  hasuraLocaliseText,
} from '../../lib/utils.js';

const Asset = tw.li`border-b border-gray-200 items-start content-start flex flex-row flex-nowrap mb-6 pb-6`;
const AssetMetaContainer = tw.div`flex-1 w-full relative`;
const AssetDescriptor = tw.span`block leading-4 mb-2`;
const AssetDescriptorLink = tw.a`font-bold text-xs text-black`;
const AssetTitle = tw.h4`font-bold text-xl leading-5 tracking-tight`;
const AssetByline = tw.div`text-xs mt-3 flex flex-row flex-wrap items-baseline`;
const AssetTime = tw.time`text-gray-500 block mb-4`;
const AssetThumbnail = tw.figure`ml-5 order-2 w-1/3`;

export default function ArticleLink({ article, isAmp, showCategory }) {
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
        <AssetDescriptor>
          {article.category && showCategory && (
            <Link key={categoryTitle} href={`/${article.category.slug}`}>
              <AssetDescriptorLink>{categoryTitle}</AssetDescriptorLink>
            </Link>
          )}
        </AssetDescriptor>
        <AssetTitle>
          {headline && (
            <Link
              href="/articles/[category]/[slug]"
              as={`/articles/${article.category.slug}/${article.slug}`}
            >
              <a>{headline}</a>
            </Link>
          )}
        </AssetTitle>
        <AssetByline>
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
