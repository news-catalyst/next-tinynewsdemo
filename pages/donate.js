import { useAmp } from 'next/amp';
import { hasuraGetPage } from '../lib/articles.js';
import { hasuraLocaliseText } from '../lib/utils';
import Layout from '../components/Layout';
import { renderBody } from '../lib/utils.js';
import DonationOptionsBlock from '../components/plugins/DonationOptionsBlock.js';

export default function Donate({ page, sections, siteMetadata }) {
  const isAmp = useAmp();

  console.log('siteMetadata:', siteMetadata);

  // there will only be one translation returned for a given page + locale
  const localisedPage = page.page_translations[0];
  const body = renderBody(page.page_translations, isAmp);

  return (
    <Layout meta={siteMetadata} sections={sections}>
      <div className="post">
        <article className="container">
          <section key="title" className="section post__header">
            <div className="section__container">
              <div className="post__title">{localisedPage.headline}</div>
              <div className="post__dek">{body}</div>
            </div>
          </section>
          <section className="section post__body rich-text" key="body">
            <div id="articleText" className="section__container">
              <DonationOptionsBlock metadata={siteMetadata} wrap={true} />
            </div>
          </section>
        </article>
      </div>
    </Layout>
  );
}

export async function getStaticProps({ locale }) {
  const apiUrl = process.env.HASURA_API_URL;
  const apiToken = process.env.ORG_SLUG;

  let page = {};
  let sections;
  let siteMetadata = {};

  const { errors, data } = await hasuraGetPage({
    url: apiUrl,
    orgSlug: apiToken,
    slug: 'donate',
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
    sections = data.categories;
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
