import { useAmp } from 'next/amp';
import {
  listAllLocales,
  getAboutPage,
  listAuthors,
  listAllSections,
} from '../lib/articles.js';
import { cachedContents } from '../lib/cached';
import Layout from '../components/Layout';
import GlobalNav from '../components/nav/GlobalNav';
import GlobalFooter from '../components/nav/GlobalFooter';
import { renderBody } from '../lib/utils.js';

export default function About({ data, authors, currentLocale, sections }) {
  const isAmp = useAmp();
  const body = renderBody(data, isAmp);
  return (
    <Layout meta={data} locale={currentLocale}>
      <GlobalNav sections={sections} />
      <article className="container">
        <section className="section" key="body">
          <div id="articleText" className="content">
            {body}
          </div>
        </section>
        <section className="section" key="authors">
          <div className="content">
            <h1 className="title">Authors</h1>
            {authors.map((author) => (
              <div className="author mb-4">
                <h4 className="subtitle is-4">
                  {author.name},{' '}
                  {author.title &&
                  author.title.values &&
                  author.title.values[0] &&
                  author.title.values[0].value
                    ? author.title.values[0].value
                    : ''}
                </h4>
                <p className="content is-medium">
                  {author.bio &&
                  author.bio.values &&
                  author.bio.values[0] &&
                  author.bio.values[0].value
                    ? author.bio.values[0].value
                    : ''}
                </p>
              </div>
            ))}
          </div>
        </section>
      </article>
      <GlobalFooter />
    </Layout>
  );
}

export async function getStaticProps({ locale }) {
  const localeMappings = await cachedContents('locales', listAllLocales);

  const currentLocale = localeMappings.find(
    (localeMap) => localeMap.code === locale
  );

  //    get about page contents
  const data = await getAboutPage();
  const authors = await listAuthors();
  const sections = await cachedContents('sections', listAllSections);
  return {
    props: {
      data,
      authors,
      currentLocale,
      sections,
    },
  };
}
