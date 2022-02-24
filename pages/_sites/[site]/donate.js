import tw, { styled } from 'twin.macro';
import { useRouter } from 'next/router';
import {
  hasuraGetPage,
  generateAllDomainPaths,
} from '../../../lib/articles.js';
import { hasuraLocalizeText, renderBody } from '../../../lib/utils';
import Layout from '../../../components/Layout';
import ReadInOtherLanguage from '../../../components/articles/ReadInOtherLanguage';
import StaticMainImage from '../../../components/articles/StaticMainImage';
import DonationOptionsBlock from '../../../components/plugins/DonationOptionsBlock.js';
import {
  ArticleTitle,
  PostTextContainer,
  PostText,
  SectionLayout,
  Block,
} from '../../../components/common/CommonStyles.js';

const SectionContainer = tw.div`flex flex-col flex-nowrap items-center px-5 mx-auto max-w-7xl w-full`;
const WideContainer = styled.div(() => ({
  ...tw`px-5 md:px-12 mx-auto w-full`,
  maxWidth: '1280px',
}));

export default function Donate({
  page,
  sections,
  siteMetadata,
  locales,
  locale,
}) {
  const isAmp = false;
  const router = useRouter();

  // If the page is not yet generated, this will be displayed
  // initially until getStaticProps() finishes running
  // See: https://nextjs.org/docs/basic-features/data-fetching#the-fallback-key-required
  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  const localisedPage = page.page_translations[0];
  // there will only be one translation returned for a given page + locale
  const headline = hasuraLocalizeText(
    locale,
    page.page_translations,
    'headline'
  );

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
    <Layout locale={locale} meta={siteMetadata} page={page} sections={sections}>
      <SectionContainer>
        <article className="container">
          <ArticleTitle meta={siteMetadata} tw="text-center">
            {headline}
          </ArticleTitle>
          <StaticMainImage
            isAmp={isAmp}
            locale={locale}
            page={page}
            siteMetadata={siteMetadata}
          />
          <PostText>
            <PostTextContainer>{body}</PostTextContainer>
          </PostText>
        </article>
      </SectionContainer>
      <WideContainer>
        <DonationOptionsBlock metadata={siteMetadata} wrap={true} />
      </WideContainer>
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

export async function getStaticPaths() {
  const apiUrl = process.env.HASURA_API_URL;
  const adminSecret = process.env.HASURA_ADMIN_SECRET;

  const mappedPaths = await generateAllDomainPaths({
    url: apiUrl,
    adminSecret: adminSecret,
    urlParams: { slug: 'donate' },
  });

  return {
    paths: mappedPaths,
    fallback: true,
  };
}

export async function getStaticProps({ locale, params }) {
  const apiUrl = process.env.HASURA_API_URL;
  const apiToken = process.env.ORG_SLUG;
  const site = params.site;

  let page = {};
  let sections;
  let siteMetadata = {};
  let locales = [];

  const { errors, data } = await hasuraGetPage({
    url: apiUrl,
    site: site,
    slug: 'donate',
  });
  if (errors || !data) {
    console.error('Returning a 404 - errors:', errors);

    return {
      notFound: true,
    };
    // throw errors;
  } else {
    if (!data.page_slug_versions || !data.page_slug_versions[0]) {
      console.error(
        'Donate: returning a 404 - page slug version not found:',
        data
      );
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

    siteMetadata = hasuraLocalizeText(
      locale,
      data.site_metadatas[0].site_metadata_translations,
      'data'
    );

    for (i = 0; i < sections.length; i++) {
      sections[i].title = hasuraLocalizeText(
        locale,
        sections[i].category_translations,
        'title'
      );
    }
  }

  // why? Error: Error serializing `.locale` returned from `getStaticProps` in "/_sites/[site]/tags/[slug]".
  // Reason: `undefined` cannot be serialized as JSON. Please use `null` or omit this value.
  if (!locale) {
    locale = null;
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
