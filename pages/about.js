import { useAmp } from 'next/amp';
import {
  listAllLocales,
  hasuraGetPage,
  listAuthors,
  listAllSections,
} from '../lib/articles.js';
import { cachedContents } from '../lib/cached';
import { localiseText } from '../lib/utils';
import Layout from '../components/Layout';
import { renderBody } from '../lib/utils.js';

export default function About({ page, authors, currentLocale, sections }) {
  const isAmp = useAmp();

  // there will only be one translation returned for a given page + locale
  const localisedPage = page.page_translations[0];
  const body = renderBody(localisedPage, isAmp);

  return (
    <Layout meta={localisedPage} locale={currentLocale} sections={sections}>
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
            {authors.map((author) => (
              <div className="author mb-4" key={author.name}>
                <h4 className="subtitle is-4">
                  {author.name}, {localiseText(currentLocale, author.title)}
                </h4>
                <p className="content is-medium">
                  {localiseText(currentLocale, author.bio)}
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
  const localeMappings = await cachedContents('locales', listAllLocales);

  const currentLocale = localeMappings.find(
    (localeMap) => localeMap.code === locale
  );

  const apiUrl = process.env.HASURA_API_URL;
  const apiToken = process.env.ORG_SLUG;

  let page = {};

  const { errors, data } = await hasuraGetPage({
    url: apiUrl,
    orgSlug: apiToken,
    slug: 'about',
    localeCode: currentLocale.code,
  });
  if (errors || !data) {
    return {
      notFound: true,
    };
    // throw errors;
  } else {
    page = data.pages[0];
  }

  const authors = await listAuthors();
  const sections = await cachedContents('sections', listAllSections);
  return {
    props: {
      page,
      authors,
      currentLocale,
      sections,
    },
  };
}
