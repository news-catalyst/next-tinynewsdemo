import Link from 'next/link';
import tw from 'twin.macro';
import Layout from './Layout';
import NewsletterBlock from './plugins/NewsletterBlock';
import LandingPageNav from './nav/LandingPageNav';

const Container = tw.div`flex items-center justify-center flex-col min-h-screen max-w-3xl mx-auto py-6 px-8`;
const Title = tw.h1`text-6xl font-bold mb-8`;
const Dek = tw.div`text-xl mb-6`;
const BlockWrapper = tw.div`w-full`;

export default function LandingPage({ siteMetadata, sections, pages }) {
  let landingDek = siteMetadata.landingPageDek || siteMetadata.aboutDek;
  return (
    <Layout meta={siteMetadata} sections={sections} renderNav={false}>
      <Container>
        <Title>{siteMetadata.shortName}</Title>
        <Dek className="dek" dangerouslySetInnerHTML={{ __html: landingDek }} />
        <BlockWrapper>
          <NewsletterBlock metadata={siteMetadata} />
        </BlockWrapper>
        {pages && pages.length > 0 && (
          <LandingPageNav pages={pages} metadata={siteMetadata} />
        )}
      </Container>
      <style jsx global>{`
        .dek p {
          margin-bottom: 1.25rem;
          font-size: 1.25rem;
          line-height: 1.625;
        }
        .dek a {
          color: black;
          cursor: pointer;
          border-bottom: 1px solid ${siteMetadata.primaryColor};
        }
        .dek {
          margin-bottom: 1.25rem;
        }
      `}</style>
    </Layout>
  );
}
