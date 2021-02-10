import { useAmp } from 'next/amp';
import { hasuraGetPage } from '../lib/articles.js';
import { hasuraLocaliseText } from '../lib/utils';
import Layout from '../components/Layout';
import { renderBody } from '../lib/utils.js';

export default function About({ page, sections }) {
  const isAmp = useAmp();

  // there will only be one translation returned for a given page + locale
  const localisedPage = page.page_translations[0];
  const body = renderBody(localisedPage, isAmp);

  return (
    <Layout meta={localisedPage} sections={sections}>
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
  }

  return {
    props: {
      page,
      sections,
    },
  };
}
