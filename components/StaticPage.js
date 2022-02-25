import tw from 'twin.macro';
import Layout from './Layout';
import { generatePageUrl, renderBody } from '../lib/utils.js';
import {
  ArticleTitle,
  PostTextContainer,
  PostText,
  SectionLayout,
  Block,
} from './common/CommonStyles.js';
import ReadInOtherLanguage from '../components/articles/ReadInOtherLanguage';
import StaticMainImage from '../components/articles/StaticMainImage';

const SectionContainer = tw.div`flex flex-col flex-nowrap items-center px-5 mx-auto max-w-7xl w-full`;

export default function StaticPage({ siteMetadata, sections, page, isAmp }) {
  const locale = 'en-US';
  let baseUrl = process.env.NEXT_PUBLIC_SITE_URL || siteMetadata['siteUrl'];
  // this is used for the canonical link tag in the Layout component
  let canonicalPageUrl = generatePageUrl(baseUrl, page);
  siteMetadata['canonicalUrl'] = canonicalPageUrl;

  let localisedPage;
  let body;
  let mainImageNode;
  let mainImage = null;
  if (page) {
    // there will only be one translation returned for a given page + locale
    localisedPage = page.page_translations[0];
    body = renderBody(locale, page.page_translations, [], isAmp, siteMetadata);
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
    <Layout meta={siteMetadata} page={page} sections={sections}>
      <SectionContainer>
        <ArticleTitle meta={siteMetadata} tw="text-center">
          {localisedPage.headline}
        </ArticleTitle>

        <StaticMainImage
          isAmp={isAmp}
          page={page}
          siteMetadata={siteMetadata}
        />

        <PostText>
          <PostTextContainer>{body}</PostTextContainer>
        </PostText>
      </SectionContainer>
    </Layout>
  );
}
