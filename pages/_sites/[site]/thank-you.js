import tw from 'twin.macro';
import { useRouter } from 'next/router';
import { hasuraGetPage } from '../../../lib/pages.js';
import { useAnalytics } from '../../../lib/hooks/useAnalytics.js';
import Layout from '../../../components/Layout';
import NewsletterBlock from '../../../components/plugins/NewsletterBlock';
import { renderBody } from '../../../lib/utils.js';
import { getOrgSettings, findSetting } from '../../../lib/settings';
import {
  ArticleTitle,
  PostTextContainer,
  PostText,
} from '../../../components/common/CommonStyles.js';
import { NextSeo } from 'next-seo';
import TwitterMeta from '../../../components/TwitterMeta';

const SectionContainer = tw.div`flex flex-col flex-nowrap items-center px-5 mx-auto max-w-7xl w-full`;

export default function ThankYou({
  referrer,
  page,
  sections,
  siteMetadata,
  monkeypodLink,
  site,
}) {
  const isAmp = false;
  const router = useRouter();
  // sets a cookie if request comes from monkeypod.io marking this browser as a donor
  const { checkReferrer, trackEvent } = useAnalytics();

  // If the page is not yet generated, this will be displayed
  // initially until getStaticProps() finishes running
  // See: https://nextjs.org/docs/basic-features/data-fetching#the-fallback-key-required
  if (router.isFallback) {
    // console.log('router.isFallback on thank you page');
    return <div>Loading...</div>;
  }

  // this will return true if the request came from monkeypod, false otherwise
  let isDonor = checkReferrer(referrer);
  if (isDonor) {
    setTimeout(() => {
      trackEvent({
        action: 'submit',
        category: 'NTG membership',
        label: 'success',
        non_interaction: false,
      });
    }, 100);
  }

  // there will only be one translation returned for a given page + locale
  const localisedPage = page.page_translations[0];
  const body = renderBody(
    'en-US',
    page.page_translations,
    [],
    isAmp,
    siteMetadata
  );

  //console.log(localisedPage)

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
      monkeypodLink={monkeypodLink}
      site={site}
    >
      <SectionContainer>
        <ArticleTitle meta={siteMetadata} tw="text-center">
          {localisedPage.headline}
        </ArticleTitle>
        <PostText>
          <PostTextContainer>{body}</PostTextContainer>
        </PostText>
        <NewsletterBlock
          metadata={siteMetadata}
          headline={localisedPage.headline}
          site={site}
          wrap={false}
        />
      </SectionContainer>

      <NextSeo
        title={localisedPage.headline}
        description={localisedPage.search_description}
        canonical={`${siteMetadata.siteUrl}/thank-you`}
        openGraph={{
          title: localisedPage.facebook_title || localisedPage.headline,
          description:
            localisedPage.facebook_description ||
            localisedPage.search_description,
          url: `${siteMetadata.siteUrl}/thank-you`,
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

export async function getServerSideProps(context) {
  const referrer = context.req.headers['referer'];
  const apiUrl = process.env.HASURA_API_URL;
  const site = context.params.site;

  const settingsResult = await getOrgSettings({
    url: apiUrl,
    site: site,
  });

  if (settingsResult.errors) {
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
    slug: 'thank-you',
    localeCode: 'en-US',
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

    sections = data.categories;
    siteMetadata = data.site_metadatas[0].site_metadata_translations[0].data;
    for (var i = 0; i < sections.length; i++) {
      sections[i].title = sections[i].category_translations[0].title;
    }
  }

  return {
    props: {
      referrer: referrer || '',
      page,
      sections,
      siteMetadata,
      monkeypodLink,
      site,
    },
  };
}
