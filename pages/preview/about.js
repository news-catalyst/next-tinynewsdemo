import { useAmp } from 'next/amp';
import { hasuraGetPage } from '../../lib/articles.js';
import { hasuraLocaliseText } from '../../lib/utils';
import AboutPage from '../../components/AboutPage';

export default function About(props) {
  const isAmp = useAmp();

  return <AboutPage {...props} isAmp={isAmp} />;
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
    sections = data.categories;
    page = data.pages[0];
    siteMetadata = data.site_metadatas[0].site_metadata_translations[0].data;
    for (var i = 0; i < sections.length; i++) {
      sections[i].title = hasuraLocaliseText(
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
    },
  };
}
