import { generateAllDomainPaths } from '../../../../lib/settings';
import { hasuraGetPage } from '../../../../lib/pages.js';
import AboutPage from '../../../../components/AboutPage';

export default function About(props) {
  const isAmp = false;

  return <AboutPage {...props} isAmp={isAmp} />;
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

export async function getStaticProps(context) {
  const preview = context.preview;
  const site = context.params.site;
  const apiUrl = process.env.HASURA_API_URL;
  const locale = 'en-US';

  if (!preview) {
    return {
      notFound: true,
    };
  }

  let page = {};
  let sections;
  let siteMetadata = {};

  const { errors, data } = await hasuraGetPage({
    url: apiUrl,
    site: site,
    slug: 'about',
    localeCode: locale,
  });
  if (errors || !data) {
    console.error('About page not found:', errors, data);
    return {
      notFound: true,
    };
    // throw errors;
  } else {
    if (!data.page_slug_versions || !data.page_slug_versions[0]) {
      console.error('About page slug versions not found');
      return {
        notFound: true,
      };
    }
    page = data.page_slug_versions[0].page;

    if (!page) {
      console.error(
        'About page slug version found but lacking page',
        data.page_slug_versions[0]
      );
      return {
        notFound: true,
      };
    }

    sections = data.categories;
    siteMetadata = data.site_metadatas[0].site_metadata_translations[0].data;
    for (var i = 0; i < sections.length; i++) {
      sections[i].title = sections[i].category_translations[0].title;
    }
  }

  return {
    props: {
      page,
      sections,
      siteMetadata,
    },
  };
}
