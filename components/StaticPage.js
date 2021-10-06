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

export default function StaticPage({
  siteMetadata,
  sections,
  page,
  isAmp,
  locales,
  currentLocale,
}) {
  let baseUrl = process.env.NEXT_PUBLIC_SITE_URL || siteMetadata['siteUrl'];
  // this is used for the canonical link tag in the Layout component
  let canonicalPageUrl = generatePageUrl(baseUrl, page);
  siteMetadata['canonicalUrl'] = canonicalPageUrl;

  let localisedPage;
  let body;
  if (page) {
    // there will only be one translation returned for a given page + locale
    localisedPage = page.page_translations[0];
    body = renderBody(page.page_translations, [], isAmp, siteMetadata);
  }

  return (
    <Layout meta={siteMetadata} sections={sections}>
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

        {locales.length > 1 && (
          <SectionLayout>
            <SectionContainer>
              <Block>
                <ReadInOtherLanguage
                  locales={locales}
                  currentLocale={currentLocale}
                />
              </Block>
            </SectionContainer>
          </SectionLayout>
        )}
      </SectionContainer>
    </Layout>
  );
}
