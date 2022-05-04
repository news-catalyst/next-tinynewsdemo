import tw, { styled } from 'twin.macro';
import { useRouter } from 'next/router';
import {
  booleanSetting,
  findSetting,
  getOrgSettings,
  generateAllDomainPaths,
} from '../../../lib/settings';
import { hasuraGetPage } from '../../../lib/pages.js';
import { avoidRateLimit, renderBody } from '../../../lib/utils';
import Layout from '../../../components/Layout';
import StaticMainImage from '../../../components/articles/StaticMainImage';
import DonationOptionsBlock from '../../../components/plugins/DonationOptionsBlock.js';
import {
  ArticleTitle,
  PostTextContainer,
  PostText,
} from '../../../components/common/CommonStyles.js';
import { NextSeo } from 'next-seo';
import TwitterMeta from '../../../components/TwitterMeta';

const SectionContainer = tw.div`flex flex-col flex-nowrap items-center px-5 mx-auto max-w-7xl w-full`;
const WideContainer = styled.div(() => ({
  ...tw`px-5 md:px-12 mx-auto w-full`,
  maxWidth: '1280px',
}));

export default function Donate({
  page,
  sections,
  siteMetadata,
  monkeypodLink,
  site,
}) {
  const isAmp = false;
  const router = useRouter();

  // If the page is not yet generated, this will be displayed
  // initially until getStaticProps() finishes running
  // See: https://nextjs.org/docs/basic-features/data-fetching#the-fallback-key-required
  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  if (!page.page_translations[0]) {
    return null;
  }

  const localisedPage = page.page_translations[0];
  // there will only be one translation returned for a given page
  const headline = localisedPage.headline;

  const body = renderBody(
    'en-US',
    page.page_translations,
    [],
    isAmp,
    siteMetadata
  );

  let mainImageNode;
  let mainImage = null;
  if (page) {
    try {
      mainImageNode = localisedPage?.content?.find(
        (node) => node.type === 'mainImage'
      );

      if (mainImageNode && mainImageNode.children[0]) {
        mainImage = mainImageNode.children[0];
        siteMetadata['coverImage'] = mainImage.imageUrl;
        siteMetadata['coverImageWidth'] = mainImage.width;
        siteMetadata['coverImageHeight'] = mainImage.height;
      }
    } catch (err) {
      console.log('error finding main image: ', err);
    }
  }

  return (
    <Layout
      meta={siteMetadata}
      page={page}
      sections={sections}
      monkeypodLink={monkeypodLink}
      site={site}
    >
      <SectionContainer>
        <article className="container">
          <ArticleTitle meta={siteMetadata} tw="text-center">
            {headline}
          </ArticleTitle>
          <StaticMainImage
            isAmp={isAmp}
            page={page}
            siteMetadata={siteMetadata}
          />
          <PostText>
            <PostTextContainer>{body}</PostTextContainer>
          </PostText>
        </article>
      </SectionContainer>
      <WideContainer>
        <DonationOptionsBlock
          metadata={siteMetadata}
          monkeypodLink={monkeypodLink}
          wrap={true}
        />
      </WideContainer>

      <NextSeo
        title={localisedPage.headline}
        description={localisedPage.search_description}
        canonical={`${siteMetadata.siteUrl}/donate`}
        openGraph={{
          title: localisedPage.facebook_title || localisedPage.headline,
          description:
            localisedPage.facebook_description ||
            localisedPage.search_description,
          url: `${siteMetadata.siteUrl}/donate`,
          images: [
            {
              url: mainImage?.imageUrl || siteMetadata.defaultSocialImage,
              width: mainImage?.width || siteMetadata.defaultSocialImageWidth,
              height:
                mainImage?.height || siteMetadata.defaultSocialImageHeight,
            },
          ],
        }}
      />
      <TwitterMeta
        override={{
          title: localisedPage.twitter_title || localisedPage.headline,
          description:
            localisedPage.twitter_description ||
            localisedPage.search_description,
          image: mainImage?.imageUrl || siteMetadata.defaultSocialImage,
        }}
        siteMetadata={siteMetadata}
      />
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

export async function getStaticProps({ params }) {
  await avoidRateLimit();

  const apiUrl = process.env.HASURA_API_URL;
  const site = params.site;

  const settingsResult = await getOrgSettings({
    url: apiUrl,
    site: site,
  });

  if (settingsResult.errors) {
    console.error('Donate page error:', settingsResult.errors);
    throw settingsResult.errors;
  }
  const settings = settingsResult.data.settings;
  const monkeypodLink = findSetting(settings, 'NEXT_PUBLIC_MONKEYPOD_URL');

  let page = {};
  let sections;
  let siteMetadata = {};

  const { errors, data } = await hasuraGetPage({
    url: apiUrl,
    site: site,
    slug: 'donate',
    localeCode: 'en-US',
  });
  if (errors || !data) {
    console.error('Returning a 404 - errors:', errors);

    return {
      notFound: true,
    };
    // throw errors;
  } else {
    if (!data.page_slug_versions || !data.page_slug_versions[0]) {
      console.error('Donate: returning a 404 - page slug version not found:');
      return {
        notFound: true,
      };
    }
    page = data.page_slug_versions[0].page;
    sections = data.categories;

    siteMetadata = data.site_metadatas[0].site_metadata_translations[0].data;

    for (var i = 0; i < sections.length; i++) {
      if (
        sections[i] &&
        sections[i].category_translations &&
        sections[i].category_translations[0] &&
        sections[i].category_translations[0].title
      ) {
        sections[i].title = sections[i].category_translations[0].title;
      }
    }
  }

  return {
    props: {
      page,
      sections,
      siteMetadata,
      monkeypodLink,
      site,
    },
    // revalidate: 1,
  };
}
