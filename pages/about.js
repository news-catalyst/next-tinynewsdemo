import { useAmp } from 'next/amp';
import { hasuraGetPage } from '../lib/articles.js';
import { hasuraLocaliseText } from '../lib/utils';
import Layout from '../components/Layout';
import { renderBody } from '../lib/utils.js';

export default function About({ page, sections, siteMetadata }) {
  const isAmp = useAmp();

  // there will only be one translation returned for a given page + locale
  const localisedPage = page.page_translations[0];
  const body = renderBody(page.page_translations, isAmp);

  return (
    <Layout meta={siteMetadata} sections={sections}>
      <article className="container">
        <div className="post__title">{localisedPage.headline}</div>
        <section className="section" key="body">
          <div id="articleText" className="content">
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
    slug: 'about',
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
