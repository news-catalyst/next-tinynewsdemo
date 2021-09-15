import tw from 'twin.macro';
import { hasuraLocaliseText } from '../lib/utils';
import Layout from './Layout';
import ReadInOtherLanguage from './articles/ReadInOtherLanguage';
import { renderBody } from '../lib/utils.js';
import {
  ArticleTitle,
  PostTextContainer,
  PostText,
  Paragraph,
  H2,
  H3,
  SectionLayout,
  Block,
} from './common/CommonStyles.js';

const SectionContainer = tw.div`flex flex-col flex-nowrap items-center px-5 mx-auto max-w-7xl w-full`;

export default function AboutPage({
  page,
  sections,
  siteMetadata,
  authors,
  isAmp,
  locales,
  locale,
}) {
  // there will only be one translation returned for a given page + locale
  const localisedPage = page.page_translations[0];
  const body = renderBody(page.page_translations, [], isAmp, siteMetadata);

  return (
    <Layout meta={siteMetadata} sections={sections}>
      <article className="container">
        <SectionContainer>
          <div key="title" className="section post__header">
            <ArticleTitle meta={siteMetadata}>
              {localisedPage.headline}
            </ArticleTitle>
          </div>
          <div className="section post__body rich-text" key="body">
            <PostText>
              <PostTextContainer>
                {body}
                <H2>Our Staff</H2>
                {authors.map((author) => (
                  <div className="author mb-4" key={author.name}>
                    <H3>
                      {author.name},{' '}
                      {hasuraLocaliseText(author.author_translations, 'title')}
                    </H3>
                    <Paragraph>
                      {hasuraLocaliseText(author.author_translations, 'bio')}
                    </Paragraph>
                  </div>
                ))}
              </PostTextContainer>
            </PostText>
          </div>
        </SectionContainer>
        {locales.length > 1 && (
          <SectionLayout>
            <SectionContainer>
              <Block>
                <ReadInOtherLanguage locales={locales} currentLocale={locale} />
              </Block>
            </SectionContainer>
          </SectionLayout>
        )}
      </article>
    </Layout>
  );
}
