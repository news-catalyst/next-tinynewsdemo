import Link from 'next/link';
import Image from 'next/image';
import tw from 'twin.macro';
import Layout from './Layout';
import NewsletterBlock from './plugins/NewsletterBlock';
import LandingPageNav from './nav/LandingPageNav';

const Container = tw.div`flex items-center justify-center flex-col min-h-screen max-w-3xl mx-auto py-6 px-8`;
const Title = tw.h1`text-6xl font-bold mb-8`;
const Dek = tw.div`text-xl mb-6`;
const BlockWrapper = tw.div`w-full`;
const LogoWrapper = tw.div`w-full h-auto mb-4`;
const Logo = tw.div`w-full h-auto`;

export default function LandingPage({
  locale,
  siteMetadata,
  sections,
  pages,
  site,
}) {
  if (!siteMetadata) {
    return <div />;
  }

  let landingDek = siteMetadata.landingPageDek || siteMetadata.aboutDek;

  let title;
  let logo;
  title = siteMetadata['shortName'];
  logo = siteMetadata['logo'];

  let LogoComponent;
  if (logo) {
    const assetsDomain = process.env.NEXT_PUBLIC_ASSETS_DOMAIN;
    const logoUrl = new URL(logo);

    LogoComponent = (
      <LogoWrapper>
        <Logo>
          <img src={`https://${assetsDomain}${logoUrl.pathname}`} alt={title} />
        </Logo>
      </LogoWrapper>
    );
  }

  return (
    <Layout
      meta={siteMetadata}
      sections={sections}
      renderNav={false}
      locale={locale}
      site={site}
    >
      <Container>
        {logo ? LogoComponent : <Title>{title}</Title>}
        <Dek className="dek" dangerouslySetInnerHTML={{ __html: landingDek }} />
        <BlockWrapper>
          <NewsletterBlock metadata={siteMetadata} site={site} />
        </BlockWrapper>
        {pages && pages.length > 0 && (
          <LandingPageNav
            locale={locale}
            pages={pages}
            metadata={siteMetadata}
          />
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
