import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import tw, { styled } from 'twin.macro';
import {
  renderDate,
  renderAuthors,
  getLatestVersion,
} from '../../lib/utils.js';
import Typography from '../common/Typography';

const Asset = tw.li`border-b border-gray-200 items-start content-start flex flex-row flex-nowrap mb-6 pb-6`;
const AssetMetaContainer = tw.div`flex-1 w-full relative`;
const AssetDescriptor = tw.span`block leading-4 mb-2`;
const AssetDescriptorLink = styled.a(({ meta }) => ({
  ...tw`font-bold text-xs hover:underline`,
  fontFamily: Typography[meta.theme].ArticleDescriptor,
}));
const AssetTitle = styled.h4(({ meta }) => ({
  ...tw`font-bold text-xl leading-5 tracking-tight hover:underline`,
  fontFamily: Typography[meta.theme].ArticleTitle,
}));
const AssetDek = tw.p`mt-2`;
const AssetByline = styled.div(({ meta }) => ({
  ...tw`text-xs mt-3 flex flex-row flex-wrap items-baseline`,
  fontFamily: Typography[meta.theme].ArticleMetaTop,
}));
const AssetTime = tw.time`text-gray-500 block mb-4`;
const ImageLink = tw.a`ml-5 order-2 w-1/3 cursor-pointer`;
const AssetThumbnail = tw.figure``;

export default function ArticleLink({
  article,
  isAmp,
  showCategory,
  metadata,
}) {
  const locale = 'en-US';

  let mainImage = null;
  let mainImageNode;
  let mainImageContent;

  let headline;
  let dek;
  if (article.article_translations) {
    headline = getLatestVersion(article.article_translations, 'headline');
    dek = getLatestVersion(article.article_translations, 'search_description');
    // console.log(headline, locale, article.article_translations);
    mainImageContent = getLatestVersion(
      article.article_translations,
      'main_image'
    );
  } else if (article.newsletter_published_at) {
    headline = article.headline;
  }

  let categoryTitle;
  let categoryHref;
  let linkHref;
  let linkAs;

  if (article.category && article.category.category_translations) {
    categoryTitle = getLatestVersion(
      article.category.category_translations,
      'title'
    );
    categoryHref = `/categories/${article.category.slug}`;
    linkHref = '/articles/[category]/[slug]';
    linkAs = `/articles/${article.category.slug}/${article.slug}`;
  } else if (article.newsletter_published_at) {
    linkHref = '/newsletters/[slug]';
    linkAs = `/newsletters/${article.slug}`;
  }

  if (
    mainImageContent !== null &&
    mainImageContent !== undefined &&
    typeof mainImageContent !== 'string'
  ) {
    try {
      mainImageNode = mainImageContent;
    } catch (e) {
      console.error(article.id, headline, 'error finding main image:', e);
    }
  }

  if (mainImageNode && Object.keys(mainImageNode).length > 0) {
    mainImage = mainImageNode.children[0];
  }

  let siteTimeZone;
  if (metadata.timeZone) {
    siteTimeZone = metadata.timeZone;
  } else {
    siteTimeZone = 'US/Eastern';
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
            <Link key={categoryTitle} href={categoryHref} passHref>
              <AssetDescriptorLink meta={metadata}>
                {categoryTitle}
              </AssetDescriptorLink>
            </Link>
          )}
        </AssetDescriptor>
        <AssetTitle meta={metadata}>
          {headline && (
            <Link href={linkHref} as={linkAs}>
              <a>{headline}</a>
            </Link>
          )}
        </AssetTitle>
        <AssetDek>{dek}</AssetDek>
        <AssetByline meta={metadata}>
          {article.author_articles && (
            <>By&nbsp;{renderAuthors(article)}&nbsp;</>
          )}
          <AssetTime>
            <span>{renderDate(firstPublishedAt, siteTimeZone, false)}</span>
          </AssetTime>
        </AssetByline>
      </AssetMetaContainer>
      {mainImage && (
        <Link
          key={`article-link-${article.category.slug}-${article.slug}`}
          href={`/articles/${article.category.slug}/${article.slug}`}
          passHref
        >
          <ImageLink>
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
          </ImageLink>
        </Link>
      )}
    </Asset>
  );
}
