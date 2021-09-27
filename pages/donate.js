import { useAmp } from 'next/amp';
import tw from 'twin.macro';
import { hasuraGetPage } from '../lib/articles.js';
import { hasuraLocaliseText } from '../lib/utils';
import Layout from '../components/Layout';
import ReadInOtherLanguage from '../components/articles/ReadInOtherLanguage';
import StaticMainImage from '../components/articles/StaticMainImage';
import { renderBody } from '../lib/utils.js';
import DonationOptionsBlock from '../components/plugins/DonationOptionsBlock.js';
import {
  ArticleTitle,
  PostTextContainer,
  PostText,
  SectionLayout,
  Block,
} from '../components/common/CommonStyles.js';

const SectionContainer = tw.div`flex flex-col flex-nowrap items-center px-5 mx-auto max-w-7xl w-full`;

export default function Donate({
  page,
  sections,
  siteMetadata,
  locales,
  locale,
}) {
  const isAmp = useAmp();

  // there will only be one translation returned for a given page + locale
  const localisedPage = page.page_translations[0];
  const body = renderBody(page.page_translations, [], isAmp, siteMetadata);

  return (
    <Layout meta={siteMetadata} sections={sections}>
      <SectionContainer>
        <article className="container">
          <ArticleTitle meta={siteMetadata} tw="text-center">
            {localisedPage.headline}
          </ArticleTitle>
          <StaticMainImage isAmp={isAmp} page={page} />
          <PostText>
            <PostTextContainer>{body}</PostTextContainer>
          </PostText>
          <DonationOptionsBlock metadata={siteMetadata} wrap={true} />
        </article>
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
    </Layout>
  );
}

export async function getStaticProps({ locale }) {
  const apiUrl = process.env.HASURA_API_URL;
  const apiToken = process.env.ORG_SLUG;

  let page = {};
  let sections;
  let siteMetadata = {};
  let locales = [];

  const { errors, data } = await hasuraGetPage({
    url: apiUrl,
    orgSlug: apiToken,
    slug: 'donate',
    localeCode: locale,
  });
  if (errors || !data) {
    return {
      notFound: true,
    };
    // throw errors;
  } else {
    if (!data.page_slug_versions || !data.page_slug_versions[0]) {
      return {
        notFound: true,
      };
    }
    page = data.page_slug_versions[0].page;

    var allPageLocales = page.page_translations;
    var distinctLocaleCodes = [];
    var distinctLocales = [];
    for (var i = 0; i < allPageLocales.length; i++) {
      let pageLocale = allPageLocales[i];

      if (
        pageLocale &&
        pageLocale.locale &&
        !distinctLocaleCodes.includes(pageLocale.locale.code)
      ) {
        distinctLocaleCodes.push(pageLocale.locale.code);
        distinctLocales.push(pageLocale);
      }
    }
    locales = distinctLocales;

    sections = data.categories;
    siteMetadata = data.site_metadatas[0].site_metadata_translations[0].data;
    for (i = 0; i < sections.length; i++) {
      sections[i].title = hasuraLocaliseText(
        sections[i].category_translations,
        'title'
      );
    }
  }

  return {
    props: {
      page,
      sections,
      siteMetadata,
      locales,
      locale,
    },
    revalidate: 1,
  };
}
