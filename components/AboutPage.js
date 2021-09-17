import tw from 'twin.macro';
import Link from 'next/link';
import Layout from './Layout';
import { renderBody } from '../lib/utils.js';
import {
  ArticleTitle,
  PostTextContainer,
  PostText,
} from './common/CommonStyles.js';

const SectionContainer = tw.div`flex flex-col flex-nowrap items-center px-5 mx-auto max-w-7xl w-full`;

export default function AboutPage({ page, sections, siteMetadata, isAmp }) {
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
              <PostTextContainer>{body}</PostTextContainer>
            </PostText>
          </div>

          <SectionLayout>
            <SectionContainer>
              <Block>
                <Link href="/staff">
                  <a href="/staff">Staff</a>
                </Link>
              </Block>
            </SectionContainer>
          </SectionLayout>
        </SectionContainer>
      </article>
    </Layout>
  );
}
