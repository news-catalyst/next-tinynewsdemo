import Link from 'next/link';
import tw, { styled } from 'twin.macro';
import { hasuraLocaliseText } from '../../lib/utils';
import ArticleFooterAuthor from './ArticleFooterAuthor';
import Typography from '../common/Typography';

const ArticleMetaBottom = styled.section(({ meta }) => ({
  ...tw`flex flex-col flex-nowrap justify-between`,
  fontFamily: Typography[meta.theme].ArticleMetaTop,
}));
const SectionContainer = tw.div`flex mx-auto flex-col flex-nowrap items-center px-5 max-w-7xl w-full`;
const ArticleByline = tw.div`max-w-2xl w-full flex flex-col flex-nowrap border-t border-b border-gray-200 mb-4 pt-6`;
const ArticleTags = tw.div`max-w-2xl w-full flex flex-row flex-nowrap mb-8`;
const TagsTitle = tw.div`flex-shrink-0 mb-4 py-2`;
const TagsList = tw.ul`flex flex-row flex-wrap pb-6 mb-2 list-outside w-full`;
const TagsListItem = tw.li`mb-4 ml-4`;
const TagsListLink = tw.a`text-gray-700 uppercase text-xs bg-gray-200 rounded flex justify-center p-3 cursor-pointer hover:bg-blue-500 hover:text-white`;

export default function ArticleFooter({ article, isAmp, metadata }) {
  let tagLinks;
  if (article.tag_articles) {
    tagLinks = article.tag_articles.map((tag_article) => (
      <TagsListItem key={tag_article.tag.slug}>
        <Link href={`/tags/${tag_article.tag.slug}`} passHref>
          <TagsListLink>
            {hasuraLocaliseText(tag_article.tag.tag_translations, 'title')}
          </TagsListLink>
        </Link>
      </TagsListItem>
    ));
  }
  return (
    <ArticleMetaBottom meta={metadata}>
      <SectionContainer>
        <ArticleByline>
          {article.author_articles &&
            article.author_articles.map((authorArticle, i) => (
              <ArticleFooterAuthor
                key={authorArticle.author.slug}
                author={authorArticle.author}
                isAmp={isAmp}
                i={i}
                last={i === article.author_articles.length - 1}
                metadata={metadata}
              />
            ))}
        </ArticleByline>
        <ArticleTags>
          {tagLinks && <TagsTitle>Read more:</TagsTitle>}
          <TagsList>{tagLinks}</TagsList>
        </ArticleTags>
      </SectionContainer>
    </ArticleMetaBottom>
  );
}
