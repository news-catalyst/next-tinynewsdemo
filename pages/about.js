import { useAmp } from 'next/amp';
import {
  listAllLocales,
  getAboutPage,
  listAuthors,
  listAllSections,
} from '../lib/articles.js';
import { cachedContents } from '../lib/cached';
import { localiseText } from '../lib/utils';
import Layout from '../components/Layout';
import GlobalNav from '../components/nav/GlobalNav';
import GlobalFooter from '../components/nav/GlobalFooter';
import { renderBody } from '../lib/utils.js';

export default function About({ data, authors, currentLocale, sections }) {
  const isAmp = useAmp();
  const body = renderBody(data, isAmp);
  console.log(authors[0].title.values);
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
