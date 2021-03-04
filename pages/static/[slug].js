import { useAmp } from 'next/amp';
import { hasuraGetPage, hasuraListAllPageSlugs } from '../../lib/articles.js';
import { hasuraLocaliseText } from '../../lib/utils';
import Layout from '../../components/Layout';
import { renderBody } from '../../lib/utils.js';

export default function StaticPage({ page, sections, siteMetadata }) {
  const isAmp = useAmp();

  // there will only be one translation returned for a given page + locale
  const localisedPage = page.page_translations[0];
  console.log('page translations:', page.page_translations);
  const body = renderBody(page.page_translations, isAmp);
  console.log('body:', body);

  return (
    <Layout meta={siteMetadata} sections={sections}>
      <div className="post">
        <article className="container">
          <div className="post__title">{localisedPage.headline}</div>
          <section className="section post__body rich-text" key="body">
            <div id="articleText" className="section__container">
              {body}
            </div>
          </section>
          <section className="section" key="authors">
            <div className="content">
              <h1 className="title">Authors</h1>
              {page.author_pages.map((authorPage) => (
                <div className="author mb-4" key={authorPage.author.name}>
                  <h4 className="subtitle is-4">
                    {authorPage.author.name},{' '}
                    {hasuraLocaliseText(
                      authorPage.author.author_translations,
                      'title'
                    )}
                  </h4>
                  <p className="content is-medium">
                    {hasuraLocaliseText(
                      authorPage.author.author_translations,
                      'bio'
                    )}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </article>
      </div>
    </Layout>
  );
}

export async function getStaticPaths() {
  const { errors, data } = await hasuraListAllPageSlugs();
  if (errors) {
    throw errors;
  }

  let paths = [];
  for (const page of data.pages) {
    for (const locale of page.page_translations) {
      paths.push({
        params: {
          slug: page.slug,
        },
        locale: locale.locale_code,
      });
    }
  }

  return {
    paths,
    fallback: true,
  };
}

export async function getStaticProps({ locale, params }) {
  const apiUrl = process.env.HASURA_API_URL;
  const apiToken = process.env.ORG_SLUG;

  let page = {};
  let sections;
  let siteMetadata = {};

  const { errors, data } = await hasuraGetPage({
    url: apiUrl,
    orgSlug: apiToken,
    slug: params.slug,
    localeCode: locale,
  });
  if (errors || !data) {
    return {
      notFound: true,
    };
    // throw errors;
  } else {
    console.log(data);
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
