import tw from 'twin.macro';
import Layout from './Layout';
import NewsletterBlock from './plugins/NewsletterBlock';

const Container = tw.div`flex items-center justify-center flex-col min-h-screen max-w-3xl mx-auto py-6 px-8`;
const Title = tw.h1`text-4xl font-bold mb-4`;
const Dek = tw.p`text-xl mb-6`;
const BlockWrapper = tw.div`w-full`;

export default function LandingPage({ siteMetadata, sections }) {
  return (
    <Layout meta={siteMetadata} sections={sections} renderNav={false}>
      <Container>
        <Title>{siteMetadata.shortName}</Title>
        <Dek>{siteMetadata.aboutDek}</Dek>
        <BlockWrapper>
          <NewsletterBlock metadata={siteMetadata} />
        </BlockWrapper>
      </Container>
    </Layout>
  );
}
