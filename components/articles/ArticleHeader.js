import Link from 'next/link';
import Image from 'next/image';
import React from 'react';
import tw, { styled } from 'twin.macro';
import PublishDate from './PublishDate.js';
import MainImage from './MainImage.js';
import { hasuraLocaliseText, renderAuthors } from '../../lib/utils.js';
import { ArticleTitle } from '../common/CommonStyles.js';
import Typography from '../common/Typography';

const SectionContainer = tw.div`flex mx-auto max-w-5xl px-4 flex-col flex-nowrap`;
const ArticleDescriptor = styled.span(({ meta }) => ({
  ...tw`w-full mb-2 text-sm font-bold`,
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
const ArticleCommentCounter = tw.div`bg-no-repeat h-11 pl-6 inline-flex items-center`;
const CommentCounterNumber = tw.span`font-bold leading-none`;
const CommentCounterLabel = tw.span`leading-none ml-1`;
const ArticleShareTop = tw.div`inline-flex flex-row flex-nowrap items-center`;
const ArticleShareWrapper = tw.ul`inline-flex flex-row flex-nowrap items-center`;
const ShareItem = tw.li`mr-2`;
const ShareButton = tw.span`bg-no-repeat bg-center border-gray-200 border inline-flex flex items-center justify-center w-10 h-10 pl-6 overflow-hidden rounded-full leading-none text-sm`;

export default function ArticleHeader({ article, isAmp, metadata }) {
  if (!article) {
    return null;
  }

  let categoryTitle;
  let headline;
  let postUrl;
  let searchDescription;

  if (article && article.category) {
    categoryTitle = hasuraLocaliseText(
      article.category.category_translations,
      'title'
    );
    headline = hasuraLocaliseText(article.article_translations, 'headline');
    postUrl = `${metadata.siteUrl}${article.category.slug}/${article.slug}`;
    searchDescription = hasuraLocaliseText(
      article.article_translations,
      'search_description'
    );
  }

  let authorPhoto;
  if (article && article.author_articles && article.author_articles[0]) {
    authorPhoto = article.author_articles[0].author.photoUrl;
  }

  let mainImageNode;
  let mainImage = null;
  let localisedContent = hasuraLocaliseText(
    article.article_translations,
    'content'
  );
  if (
    localisedContent !== undefined &&
    localisedContent !== null &&
    typeof localisedContent !== 'string'
  ) {
    try {
      mainImageNode = localisedContent.find(
        (node) => node.type === 'mainImage'
      );

      if (mainImageNode) {
        mainImage = mainImageNode.children[0];
      }
    } catch (err) {
      console.log('error finding main image in header: ', err);
    }
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
        <ArticleFeaturedMedia>
          <FeaturedMediaFigure>
            <FeaturedMediaWrapper>
              {mainImage && <MainImage article={article} isAmp={isAmp} />}
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
          <ArticleCommentCounter
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M3.83333 15.4373V14.9373H3.33333H0.5V0.5H19.5V14.9373H9.16667H8.99435L8.85862 15.0434L3.83333 18.9741V15.4373Z' fill='black' stroke='black'/%3E%3C/svg%3E%0A\")",
              backgroundPosition: 'left 1rem',
              backgroundSize: '0.9375rem 0.9375rem',
            }}
          >
            <CommentCounterNumber>52</CommentCounterNumber>
            <CommentCounterLabel>Comments</CommentCounterLabel>
          </ArticleCommentCounter>
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
              <ShareItem>
                <a>
                  <ShareButton
                    style={{
                      backgroundImage:
                        "url(\"data:image/svg+xml,%3Csvg width='16' height='4' viewBox='0 0 16 4' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M4 2C4 3.10467 3.10467 4 2 4C0.895333 4 0 3.10467 0 2C0 0.895333 0.895333 0 2 0C3.10467 0 4 0.895333 4 2ZM10 2C10 3.10467 9.10467 4 8 4C6.89533 4 6 3.10467 6 2C6 0.895333 6.89533 0 8 0C9.10467 0 10 0.895333 10 2ZM16 2C16 3.10467 15.1047 4 14 4C12.8953 4 12 3.10467 12 2C12 0.895333 12.8953 0 14 0C15.1047 0 16 0.895333 16 2Z' fill='black'/%3E%3C/svg%3E%0A\")",
                      backgroundSize: '0.9375rem auto',
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
