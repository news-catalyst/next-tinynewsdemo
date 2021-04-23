import tw from 'twin.macro';
import { hasuraLocaliseText } from '../lib/utils';
import Layout from './Layout';
import { renderBody } from '../lib/utils.js';
import {
  ArticleTitle,
  PostTextContainer,
  PostText,
  Paragraph,
  H2,
  H3,
} from './common/CommonStyles.js';

const SectionContainer = tw.div`flex flex-col flex-nowrap items-center px-5 mx-auto max-w-7xl w-full`;

export default function AboutPage({ page, sections, siteMetadata, isAmp }) {
  // there will only be one translation returned for a given page + locale
  const localisedPage = page.page_translations[0];
  const body = renderBody(page.page_translations, isAmp);

  return (
    <Layout meta={siteMetadata} sections={sections}>
      <article className="container">
        <SectionContainer>
          <div key="title" className="section post__header">
            <ArticleTitle>{localisedPage.headline}</ArticleTitle>
          </div>
          <div className="section post__body rich-text" key="body">
            <PostText>
              <PostTextContainer>
                {body}
                <H2>Our Staff</H2>
                {page.author_pages.map((authorPage) => (
                  <div className="author mb-4" key={authorPage.author.name}>
                    <H3>
                      {authorPage.author.name},{' '}
                      {hasuraLocaliseText(
                        authorPage.author.author_translations,
                        'title'
                      )}
                    </H3>
                    <Paragraph>
                      {hasuraLocaliseText(
                        authorPage.author.author_translations,
                        'bio'
                      )}
                    </Paragraph>
                  </div>
                ))}
              </PostTextContainer>
            </PostText>
          </div>
        </SectionContainer>
      </article>
    </Layout>
  );
}
