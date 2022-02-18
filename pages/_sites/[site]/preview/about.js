import {
  hasuraGetPage,
  generateAllDomainPaths,
} from '../../../../lib/articles.js';
import { hasuraLocalizeText } from '../../../../lib/utils';
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
  let locale = context.locale;
  let preview = context.preview;
  let site = context.params.site;

  if (!preview) {
    return {
      notFound: true,
    };
  }
  const apiUrl = process.env.HASURA_API_URL;

  let page = {};
  let sections;
  let siteMetadata = {};
  let locales = [];

  const { errors, data } = await hasuraGetPage({
    url: apiUrl,
    site: site,
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
      return {
        notFound: true,
      };
    }
    page = data.page_slug_versions[0].page;

    if (!page) {
      return {
        notFound: true,
      };
    }

    var allPageLocales = page.page_translations;
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
      page,
      sections,
      siteMetadata,
      locales,
      locale,
    },
  };
}
