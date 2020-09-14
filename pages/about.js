import { useAmp } from 'next/amp';
import { getAboutPage, listAllSections } from '../lib/articles.js';
import Layout from '../components/Layout';
import GlobalNav from '../components/nav/GlobalNav';
import GlobalFooter from '../components/nav/GlobalFooter';
import { renderBody } from '../lib/utils.js';

export default function About({ data, sections }) {
  const isAmp = useAmp();
  const body = renderBody(data, isAmp);
  return (
    <Layout meta={data}>
      <GlobalNav sections={sections} />
      <article>
        <section className="section" key="body">
          <div id="articleText" className="content">
            {body}
          </div>
        </section>
      </article>
      <GlobalFooter />
    </Layout>
  );
}

export async function getStaticProps() {
  //    get about page contents
  const data = await getAboutPage();

  const sections = await listAllSections();

  return {
    props: {
      data,
      sections,
    },
  };
}
