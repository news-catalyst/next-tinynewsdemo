import { useAmp } from 'next/amp';
import { useRouter } from 'next/router';
import { hasuraGetPage } from '../lib/articles.js';
import { hasuraLocalizeText } from '../lib/utils';
import AboutPage from '../components/AboutPage';

export default function About(props) {
  // const isAmp = useAmp();
  const isAmp = false;
  const router = useRouter();

  // If the page is not yet generated, this will be displayed
  // initially until getStaticProps() finishes running
  // See: https://nextjs.org/docs/basic-features/data-fetching#the-fallback-key-required
  if (router.isFallback) {
    return <div>Loading...</div>;
  }
  return <AboutPage {...props} isAmp={isAmp} />;
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
    slug: 'about',
    localeCode: locale,
  });
  if (errors || !data) {
    return {
      notFound: true,
    };
    // throw errors;
  } else {
    if (!data.page_slug_versions || !data.page_slug_versions[0]) {
      console.error('Returning a 404 - page slug version not found:', data);

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

    siteMetadata = data.site_metadatas[0].site_metadata_translations[0].data;

    sections = data.categories;
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
      page,
      sections,
      siteMetadata,
      locales,
      locale,
    },
    revalidate: 1,
  };
}
