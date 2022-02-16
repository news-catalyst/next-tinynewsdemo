import {
  hasuraGetPage,
  generateAllDomainPaths,
} from '../../../../lib/articles.js';
import { hasuraLocalizeText } from '../../../../lib/utils';
import StaffPage from '../../../../components/StaffPage';

export default function Staff(props) {
  const isAmp = false;

  return <StaffPage {...props} isAmp={isAmp} />;
}
export async function getStaticPaths() {
  const apiUrl = process.env.HASURA_API_URL;
  const adminSecret = process.env.HASURA_ADMIN_SECRET;

  const mappedPaths = await generateAllDomainPaths({
    url: apiUrl,
    adminSecret: adminSecret,
    urlParams: { slug: 'staff' },
  });

  return {
    paths: mappedPaths,
    fallback: true,
  };
}
export async function getStaticProps(context) {
  let locale = context.locale;
  let preview = context.preview;

  if (!preview) {
    return {
      notFound: true,
    };
  }

  const apiUrl = process.env.HASURA_API_URL;
  const apiToken = process.env.ORG_SLUG;

  let page = {};
  let sections;
  let siteMetadata = {};
  let authors = [];

  const { errors, data } = await hasuraGetPage({
    url: apiUrl,
    orgSlug: apiToken,
    slug: 'about',
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
    sections = data.categories;
    authors = data.authors;
    siteMetadata = data.site_metadatas[0].site_metadata_translations[0].data;
    for (var i = 0; i < sections.length; i++) {
      sections[i].title = hasuraLocalizeText(
        locale,
        sections[i].category_translations,
        'title'
      );
    }
  }

  return {
    props: {
      authors,
      locale,
      sections,
      siteMetadata,
    },
    revalidate: 1,
  };
}
