import Layout from './Layout';
import NewsletterBlock from './plugins/NewsletterBlock';
import landingPageStyles from '../styles/landingpage.js';

export default function LandingPage({ siteMetadata, sections }) {
  return (
    <Layout meta={siteMetadata} sections={sections} renderNav={false}>
      <div className="landing-page-container">
        <h1>{siteMetadata.shortName}</h1>
        <p>{siteMetadata.aboutDek}</p>
        <NewsletterBlock metadata={siteMetadata} />
      </div>
      <style jsx global>
        {landingPageStyles}
      </style>
    </Layout>
  );
}
