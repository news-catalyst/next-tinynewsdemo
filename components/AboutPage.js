import tw from 'twin.macro';
import Link from 'next/link';
import Layout from './Layout';
import ReadInOtherLanguage from './articles/ReadInOtherLanguage';
import StaticMainImage from './articles/StaticMainImage';
import { renderBody } from '../lib/utils.js';
import {
  ArticleTitle,
  PostTextContainer,
  PostText,
  SectionLayout,
  Block,
  Paragraph,
  Anchor,
} from './common/CommonStyles.js';

const SectionContainer = tw.div`flex flex-col flex-nowrap items-center px-5 mx-auto max-w-7xl w-full`;

export default function AboutPage({
  page,
  sections,
  siteMetadata,
  settings,
  isAmp,
}) {
  const locale = 'en-US';

  // there will only be one translation returned for a given page + locale
  let localisedPage = page?.page_translations[0];

  if (!localisedPage) {
    return null;
  }

  const body = renderBody(
    locale,
    page.page_translations,
    [],
    isAmp,
    siteMetadata
  );
  let mainImageNode;
  let mainImage = null;
  if (page) {
    try {
      mainImageNode = localisedPage?.content.find(
        (node) => node.type === 'mainImage'
      );

      if (mainImageNode) {
        mainImage = mainImageNode.children[0];
        siteMetadata['coverImage'] = mainImage.imageUrl;
        siteMetadata['coverImageWidth'] = mainImage.width;
        siteMetadata['coverImageHeight'] = mainImage.height;
      }
    } catch (err) {
      console.error('error finding main image: ', err);
    }
  }

  return (
    <Layout
      meta={siteMetadata}
      page={page}
      sections={sections}
      settings={settings}
    >
      <article className="container">
        <SectionContainer>
          <div key="title" className="section post__header">
            <ArticleTitle meta={siteMetadata}>
              {localisedPage.headline}
            </ArticleTitle>
          </div>

          <StaticMainImage
            isAmp={isAmp}
            page={page}
            siteMetadata={siteMetadata}
          />

          <div className="section post__body rich-text" key="body">
            <PostText>
              <PostTextContainer>
                {body}
                <Paragraph>
                  <Link href="/staff" passHref>
                    <Anchor meta={siteMetadata}>Learn about our staff →</Anchor>
                  </Link>
                </Paragraph>
              </PostTextContainer>
            </PostText>
          </div>

          <SectionLayout>
            <SectionContainer>
              <Block></Block>
            </SectionContainer>
          </SectionLayout>
        </SectionContainer>
      </article>
    </Layout>
  );
}
