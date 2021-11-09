import Link from 'next/link';
import Image from 'next/image';
import React from 'react';
import tw, { styled } from 'twin.macro';
import PublishDate from './PublishDate.js';
import MainImage from './MainImage.js';
import { hasuraLocalizeText, renderAuthors } from '../../lib/utils.js';
import { ArticleTitle } from '../common/CommonStyles.js';
import Typography from '../common/Typography';
import ReadInOtherLanguage from './ReadInOtherLanguage.js';

const SectionContainer = tw.div`flex mx-auto max-w-5xl px-4 flex-col flex-nowrap`;
const ArticleDescriptor = styled.span(({ meta }) => ({
  ...tw`w-full mb-2 text-sm font-bold hover:underline`,
  fontFamily: Typography[meta.theme].ArticleDescriptor,
}));
const ArticleDek = styled.p(({ meta }) => ({
  ...tw`text-xl lg:text-2xl leading-tight mb-3`,
  fontFamily: Typography[meta.theme].ArticleDek,
}));
const ArticleFeaturedMedia = tw.div`flex flex-col flex-nowrap items-center w-full`;
const FeaturedMediaFigure = tw.figure`flex flex-row flex-wrap mb-5 pb-3 w-full border-b border-gray-200`;
const FeaturedMediaWrapper = tw.div`w-full`;
const FeaturedMediaCaption = tw.figcaption`text-sm text-gray-700 pt-1 inline-block`;
const ArticleMetaTop = styled.div(({ meta }) => ({
  ...tw`flex flex-row flex-wrap lg:flex-nowrap justify-between w-full`,
  fontFamily: Typography[meta.theme].ArticleMetaTop,
}));
const ArticleByline = tw.div`border-b border-gray-200 mb-1 pb-5 w-full flex flex-row flex-wrap lg:border-b-0`;
const ArticleAuthor = tw.div`flex flex-row flex-nowrap items-center`;
const ArticleAuthorAvatar = tw.div`overflow-hidden relative w-full rounded-full h-12 w-12 mr-2`;
const ArticleAuthorMeta = tw.div`text-base`;
const ArticleShareTop = tw.div`inline-flex flex-row flex-nowrap items-center`;
const ArticleShareWrapper = tw.ul`inline-flex flex-row flex-nowrap items-center`;
const ShareItem = tw.li`mr-2`;
const ShareButton = tw.span`bg-no-repeat bg-center border-gray-200 border inline-flex flex items-center justify-center w-10 h-10 pl-6 overflow-hidden rounded-full leading-none text-sm`;

export default function ArticleHeader({
  article,
  isAmp,
  metadata,
  mainImage,
  locale,
  locales,
  publishedLocales,
}) {
  if (!article) {
    return null;
  }

  let categoryTitle;
  let headline;
  let postUrl;
  let searchDescription;
  let articleContent;

  if (article && article.category) {
    categoryTitle = hasuraLocalizeText(
      locale,
      article.category.category_translations,
      'title'
    );

    headline = hasuraLocalizeText(
      locale,
      article.article_translations,
      'headline'
    );
    postUrl = new URL(
      `/articles/${article.category.slug}/${article.slug}`,
      metadata.siteUrl
    );
    searchDescription = hasuraLocalizeText(
      locale,
      article.article_translations,
      'search_description'
    );

    articleContent = hasuraLocalizeText(
      locale,
      article.article_translations,
      'content'
    );
  }

  let authorPhoto;
  if (article && article.author_articles && article.author_articles[0]) {
    authorPhoto = article.author_articles[0].author.photoUrl;
  }

  // this block of code builds an array of locales the article is available in
  // by comparing the list of all site locales with the list of published translations
  // ex: site locales [en, es]; this article published in [en, es]; current locale is english;
  // 'ReadInOtherLanguage' component should show "Read in Spanish" link
  // (logic around current locale is in the component itself)
  let readLocales = [];
  let currentLocale = locale;
  if (locales.length > 1) {
    locales.forEach((siteLocale) => {
      publishedLocales.forEach((articleLocale) => {
        if (siteLocale.locale.code === articleLocale.locale_code) {
          readLocales.push(siteLocale);
        }
      });
    });
  }

  return (
    <section key="title" className="section post__header">
      <SectionContainer>
        <ArticleDescriptor meta={metadata}>
          <Link
            key={categoryTitle}
            href={`/categories/${article.category.slug}`}
          >
            <a>{categoryTitle}</a>
          </Link>
        </ArticleDescriptor>
        <ArticleTitle meta={metadata}>{headline}</ArticleTitle>
        <ArticleDek meta={metadata}>{searchDescription}</ArticleDek>
        <PublishDate article={article} meta={metadata} />
        {readLocales.length > 1 && (
          <ReadInOtherLanguage
            locales={readLocales}
            currentLocale={currentLocale}
          />
        )}
        <ArticleFeaturedMedia>
          <FeaturedMediaFigure>
            <FeaturedMediaWrapper>
              {mainImage && (
                <MainImage articleContent={articleContent} isAmp={isAmp} />
              )}
            </FeaturedMediaWrapper>
            <FeaturedMediaCaption>
              {mainImage ? mainImage.imageAlt : null}
            </FeaturedMediaCaption>
          </FeaturedMediaFigure>
        </ArticleFeaturedMedia>
        <ArticleMetaTop meta={metadata}>
          <ArticleByline>
            <ArticleAuthor>
              <ArticleAuthorAvatar>
                {authorPhoto && (
                  <figure>
                    <a className="content" href="#">
                      {isAmp ? (
                        <amp-img
                          width={82}
                          height={82}
                          src={authorPhoto}
                          alt="author"
                          layout="responsive"
                        />
                      ) : (
                        <Image
                          src={authorPhoto}
                          width={82}
                          height={82}
                          alt="author"
                        />
                      )}
                    </a>
                  </figure>
                )}
              </ArticleAuthorAvatar>
              <ArticleAuthorMeta>By {renderAuthors(article)}</ArticleAuthorMeta>
            </ArticleAuthor>
          </ArticleByline>
          <ArticleShareTop>
            <ArticleShareWrapper>
              <ShareItem>
                <a
                  href={`https://facebook.com/sharer.php?display=page&u=${postUrl}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <ShareButton
                    style={{
                      backgroundImage:
                        "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 8 17' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M7.688 5.82l-.384 2.713H5.196v7.75H2.033v-7.75H.5V5.82h1.533V4.076c0-1.259.575-3.293 3.259-3.293h2.396v2.615H5.962c-.287 0-.67.097-.67.775V5.82h2.396' fill='%233B5998' fill-rule='nonzero'%3E%3C/path%3E%3C/svg%3E\")",
                      backgroundSize: 'auto 1.0625rem',
                    }}
                  />
                </a>
              </ShareItem>
              <ShareItem>
                <a
                  href={`https://twitter.com/intent/tweet?text=${postUrl}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <ShareButton
                    style={{
                      backgroundImage:
                        "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 17 14' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M14.725 4.111v.402c0 4.32-3.28 9.242-9.143 9.242-1.888 0-3.578-.502-4.97-1.507h.796c1.49 0 2.981-.502 4.074-1.406-1.39 0-2.583-1.005-3.08-2.31.198 0 .397.1.596.1.298 0 .596 0 .894-.1C2.402 8.23 1.31 6.923 1.31 5.316c.397.2.894.402 1.49.402-.894-.603-1.49-1.608-1.49-2.713 0-.603.198-1.205.397-1.708a8.943 8.943 0 0 0 6.758 3.416c-.1-.2-.1-.502-.1-.703 0-1.808 1.491-3.315 3.28-3.315.894 0 1.789.401 2.385 1.004.696-.1 1.49-.402 2.087-.803-.199.803-.795 1.406-1.391 1.808.695-.1 1.292-.302 1.888-.502-.696.904-1.292 1.506-1.888 1.908' fill='%234099FF' fill-rule='nonzero'%3E%3C/path%3E%3C/svg%3E\")",
                      backgroundSize: 'auto 0.9375rem',
                    }}
                  />
                </a>
              </ShareItem>
            </ArticleShareWrapper>
          </ArticleShareTop>
        </ArticleMetaTop>
      </SectionContainer>
    </section>
  );
}
