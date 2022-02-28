import tw from 'twin.macro';
import { useRouter } from 'next/router';
import { hasuraGetPage } from '../../../lib/articles.js';
import { useAnalytics } from '../../../lib/hooks/useAnalytics.js';
import { getLatestVersion } from '../../../lib/utils';
import ReadInOtherLanguage from '../../../components/articles/ReadInOtherLanguage';
import Layout from '../../../components/Layout';
import NewsletterBlock from '../../../components/plugins/NewsletterBlock';
import { renderBody } from '../../../lib/utils.js';
import {
  ArticleTitle,
  PostTextContainer,
  PostText,
  SectionLayout,
  Block,
} from '../../../components/common/CommonStyles.js';

const SectionContainer = tw.div`flex flex-col flex-nowrap items-center px-5 mx-auto max-w-7xl w-full`;

export default function ThankYou({ referrer, page, sections, siteMetadata }) {
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
    <Layout meta={siteMetadata} page={page} sections={sections}>
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
          wrap={false}
        />
      </SectionContainer>
    </Layout>
  );
}

export async function getServerSideProps(context) {
  const referrer = context.req.headers['referer'];
  const apiUrl = process.env.HASURA_API_URL;
  const site = context.params.site;

  let page = {};
  let sections;
  let siteMetadata = {};

  const { errors, data } = await hasuraGetPage({
    url: apiUrl,
    site: site,
    slug: 'thank-you',
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
    for (i = 0; i < sections.length; i++) {
      sections[i].title = getLatestVersion(
        sections[i].category_translations,
        'title'
      );
    }
  }

  return {
    props: {
      referrer: referrer || '',
      page,
      sections,
      siteMetadata,
    },
  };
}
