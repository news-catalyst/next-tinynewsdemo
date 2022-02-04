import { useEffect, useState } from 'react';
import tw from 'twin.macro';
import { useRouter } from 'next/router';
import { hasuraGetPage } from '../lib/articles.js';
import { useAnalytics } from '../lib/hooks/useAnalytics.js';
import { hasuraLocalizeText } from '../lib/utils';
import ReadInOtherLanguage from '../components/articles/ReadInOtherLanguage';
import Layout from '../components/Layout';
import NewsletterBlock from '../components/plugins/NewsletterBlock';
import { renderBody } from '../lib/utils.js';
import {
  ArticleTitle,
  PostTextContainer,
  PostText,
  SectionLayout,
  Block,
} from '../components/common/CommonStyles.js';

const SectionContainer = tw.div`flex flex-col flex-nowrap items-center px-5 mx-auto max-w-7xl w-full`;

export default function ThankYou({
  referrer,
  page,
  sections,
  siteMetadata,
  locales,
  locale,
}) {
  // const isAmp = useAmp();
  const isAmp = false;
  const router = useRouter();
  // sets a cookie if request comes from monkeypod.io marking this browser as a donor
  const { checkReferrer, setDonor, trackEvent } = useAnalytics();

  const [thanksHeadline, setThanksHeadline] = useState(null);
  const [thanksBody, setThanksBody] = useState(null);

  // If the page is not yet generated, this will be displayed
  // initially until getStaticProps() finishes running
  // See: https://nextjs.org/docs/basic-features/data-fetching#the-fallback-key-required
  if (router.isFallback) {
    // console.log('router.isFallback on thank you page');
    return <div>Loading...</div>;
  }

  // this will return true if the request came from monkeypod, false otherwise
  let isDonor = checkReferrer(referrer);

  // there will only be one translation returned for a given page + locale
  const localisedPage = page.page_translations[0];
  const body = renderBody(
    locale,
    page.page_translations,
    [],
    isAmp,
    siteMetadata
  );

  // // to-do
  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    if (siteMetadata && siteMetadata.thankYouHeadline) {
      setThanksHeadline(siteMetadata.thankYouHeadline);
    } else {
      setThanksHeadline(localisedPage.headline);
    }
    if (siteMetadata.thankYouSuccess) {
      setThanksBody(siteMetadata.thankYouSuccess);
    }
    // donation processed by stripe
    if (query.get('success')) {
      isDonor = true;
    }

    if (isDonor) {
      setDonor(true);

      setTimeout(() => {
        trackEvent({
          action: 'submit',
          category: 'NTG membership',
          label: 'success',
          non_interaction: false,
        });
      }, 100);
    }

    if (query.get('canceled') && siteMetadata.thankYouCancel) {
      setThanksBody(siteMetadata.thankYouCancel);
    }
  }, []);

  return (
    <Layout locale={locale} meta={siteMetadata} page={page} sections={sections}>
      <SectionContainer>
        <ArticleTitle meta={siteMetadata} tw="text-center">
          {thanksHeadline}
        </ArticleTitle>
        <PostText>
          <PostTextContainer
            dangerouslySetInnerHTML={{ __html: thanksBody }}
          ></PostTextContainer>
        </PostText>
        <NewsletterBlock
          metadata={siteMetadata}
          headline={thanksHeadline}
          wrap={false}
        />
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

export async function getServerSideProps(context) {
  const referrer = context.req.headers['referer'];
  const apiUrl = process.env.HASURA_API_URL;
  const apiToken = process.env.ORG_SLUG;

  let page = {};
  let sections;
  let siteMetadata = {};
  let locales = [];
  let locale = context.locale;

  const { errors, data } = await hasuraGetPage({
    url: apiUrl,
    orgSlug: apiToken,
    slug: 'thank-you',
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

    var allPageLocales = data.pages[0].page_translations;
    var distinctLocaleCodes = [];
    var distinctLocales = [];
    for (var i = 0; i < allPageLocales.length; i++) {
      if (!distinctLocaleCodes.includes(allPageLocales[i].locale.code)) {
        distinctLocaleCodes.push(allPageLocales[i].locale.code);
        distinctLocales.push(allPageLocales[i]);
      }
    }
    locales = distinctLocales;

    sections = data.categories;
    siteMetadata = data.site_metadatas[0].site_metadata_translations[0].data;
    for (i = 0; i < sections.length; i++) {
      sections[i].title = hasuraLocalizeText(
        locale,
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
      locales,
      locale,
    },
  };
}
