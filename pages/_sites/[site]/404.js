// import { useAmp } from 'next/amp';
import Layout from '../../../components/Layout';
import {
  hasuraGetLayout,
  generateAllDomainPaths,
} from '../../../lib/articles.js';
import { hasuraLocalizeText } from '../../../lib/utils';

export default function Custom404({ locale, sections, siteMetadata }) {
  let title;
  if (siteMetadata && siteMetadata.title404) {
    title = siteMetadata.title404;
  } else {
    title = '404 - Page Not Found';
  }

  let description;
  if (siteMetadata && siteMetadata.description404) {
    description = siteMetadata.description404;
  } else {
    description =
      "We're sorry, the content that you expected to find here has either moved without telling our website or we've just completely misplaced it.";
  }

  return (
    <Layout locale={locale} meta={siteMetadata} sections={sections}>
      <div className="post">
        <article className="container">
          <section key="title" className="section post__header">
            <div className="section__container">
              <div className="section__title">{title}</div>
            </div>
          </section>
          <section className="section post__body rich-text" key="body">
            <div id="articleText" className="section__container">
              <div className="post-text">
                <div>{description}</div>
              </div>
            </div>
          </section>
        </article>
      </div>
    </Layout>
  );
}

export async function getStaticPaths() {
  const apiUrl = process.env.HASURA_API_URL;
  const adminSecret = process.env.HASURA_ADMIN_SECRET;

  const mappedPaths = await generateAllDomainPaths({
    url: apiUrl,
    adminSecret: adminSecret,
    urlParams: { slug: '404' },
  });

  return {
    paths: mappedPaths,
    fallback: true,
  };
}

export async function getStaticProps({ locale, params }) {
  const apiUrl = process.env.HASURA_API_URL;
  const site = params.site;

  let sections;
  let siteMetadata = {};

  const { errors, data } = await hasuraGetLayout({
    url: apiUrl,
    site: site,
    localeCode: locale,
  });
  if (errors || !data) {
    console.error('an error occurred', errors);
    throw errors;
  } else {
    sections = data.categories;
    for (var i = 0; i < sections.length; i++) {
      sections[i].title = hasuraLocalizeText(
        locale,
        sections[i].category_translations,
        'title'
      );
    }
    try {
      siteMetadata = data.site_metadatas[0].site_metadata_translations[0].data;
    } catch (e) {
      console.error(e);
    }
  }

  // why? Error: Error serializing `.locale` returned from `getStaticProps` in "/_sites/[site]/tags/[slug]".
  // Reason: `undefined` cannot be serialized as JSON. Please use `null` or omit this value.
  if (!locale) {
    locale = null;
  }
  return {
    props: {
      locale,
      sections,
      siteMetadata,
    },
  };
}
