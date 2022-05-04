import { useRouter } from 'next/router';
import {
  getOrgSettings,
  findSetting,
  generateAllDomainPaths,
} from '../../../lib/settings';
import { hasuraGetPage } from '../../../lib/pages.js';
import AboutPage from '../../../components/AboutPage';

export default function About(props) {
  const isAmp = false;
  const router = useRouter();

  // If the page is not yet generated, this will be displayed
  // initially until getStaticProps() finishes running
  // See: https://nextjs.org/docs/basic-features/data-fetching#the-fallback-key-required
  if (router.isFallback) {
    return <div>Loading...</div>;
  }
  return (
    <>
      <AboutPage {...props} isAmp={isAmp} />;
    </>
  );
}

export async function getStaticPaths() {
  const apiUrl = process.env.HASURA_API_URL;
  const adminSecret = process.env.HASURA_ADMIN_SECRET;

  const mappedPaths = await generateAllDomainPaths({
    url: apiUrl,
    adminSecret: adminSecret,
    urlParams: { slug: 'about' },
  });

  return {
    paths: mappedPaths,
    fallback: true,
  };
}

export async function getStaticProps({ params }) {
  const apiUrl = process.env.HASURA_API_URL;
  const site = params.site;

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
    slug: 'about',
    localeCode: 'en-US',
  });
  if (errors || !data) {
    console.error(errors);
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

    siteMetadata = data.site_metadatas[0].site_metadata_translations[0].data;

    sections = data.categories;
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
