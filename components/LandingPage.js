import Layout from './Layout';

export default function LandingPage({ siteMetadata, sections }) {
  return (
    <Layout meta={siteMetadata} sections={sections} renderNav={false}>
      <div>landing page</div>
    </Layout>
  );
}
