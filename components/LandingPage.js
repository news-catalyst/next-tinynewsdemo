import tw from 'twin.macro';
// import Markdown from 'markdown-to-jsx';
import Layout from './Layout';
import NewsletterBlock from './plugins/NewsletterBlock';

const Container = tw.div`flex items-center justify-center flex-col min-h-screen max-w-3xl mx-auto py-6 px-8`;
const Title = tw.h1`text-6xl font-bold mb-8`;
const Dek = tw.div`text-xl mb-6`;
const DekP = tw.p`mb-5 leading-relaxed`;
const DekA = tw.a`text-black cursor-pointer border-b border-blue-500`;
const BlockWrapper = tw.div`w-full`;

export default function LandingPage({ siteMetadata, sections }) {
  let landingDek = siteMetadata.landingPageDek || siteMetadata.aboutDek;
  return (
    <Layout meta={siteMetadata} sections={sections} renderNav={false}>
      <Container>
        <Title>{siteMetadata.shortName}</Title>
        <Dek dangerouslySetInnerHTML={{ __html: landingDek }} />
        <BlockWrapper>
          <NewsletterBlock metadata={siteMetadata} />
        </BlockWrapper>
      </Container>
    </Layout>
  );
}
