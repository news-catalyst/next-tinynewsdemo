import Head from 'next/head';
import GlobalNav from './nav/GlobalNav';
import GlobalFooter from './nav/GlobalFooter.js';
import CookieConsentWrapper from './nav/CookieConsentWrapper.js';
import { useAmp } from 'next/amp';
import tw, { styled } from 'twin.macro';
import BannerAd from './ads/BannerAd';

const Main = tw.main`pt-8 pb-24`;
const ThemeWrapper = styled.div(({ meta }) => ({
  '--headingFont': meta.headingFont,
  '--bodyFont': meta.bodyFont,
  fontFamily: meta.bodyFont,
  'h1,h2,h3,h4,h5,h6': {
    'font-family': meta.headingFont,
  },
}));

export default function Layout({
  children,
  meta,
  sections,
  monkeypodLink,
  site,
  bannerAds,
  renderNav = true,
  renderFooter = true,
}) {
  if (meta === null || meta === undefined) {
    meta = {};
  }

  // helper function to determine what to tell facebook width/height of image are
  function coverImageDimensions(w, h) {
    return {
      width: w > 1201 ? w : 1201,
      height: w > 1201 ? h : (h / w) * 1201,
    };
  }

  // console.log('Layout locale:', locale);

  const metaValues = {
    favicon: meta['favicon'],
    footerTitle: meta['footerTitle'],
    footerBylineLink: meta['footerBylineLink'],
    footerBylineName: meta['footerBylineName'],
    founderTwitter: meta['founderTwitter'],
    founderInstagram: meta['founderInstagram'],
    founderFacebook: meta['founderFacebook'],
    facebookAdmins: meta['facebookAdmins'],
    facebookAppId: meta['facebookAppId'],
  };

  const isAmp = useAmp();
  return (
    <>
      <Head>
        {metaValues.favicon && <link rel="icon" href={metaValues.favicon} />}

        {metaValues.facebookAppId && (
          <meta property="fb:app_id" content={metaValues.facebookAppId} />
        )}
        {metaValues.facebookAdmins && (
          <meta property="fb:admins" content={metaValues.facebookAdmins} />
        )}

        <link rel="preconnect" href="https://fonts.gstatic.com" />

        {meta.theme === 'styleone' && (
          <link
            href="https://fonts.googleapis.com/css2?family=Domine:wght@400;700&family=Libre+Franklin:ital,wght@0,400;0,700;1,400;1,700&display=swap"
            rel="stylesheet"
          />
        )}
        {meta.theme === 'styletwo' && (
          <link
            href="https://fonts.googleapis.com/css2?family=Source+Sans+Pro:ital,wght@0,400;0,700;1,400;1,700&family=Source+Serif+Pro:ital,wght@0,400;0,700;1,400;1,700&display=swap"
            rel="stylesheet"
          />
        )}
        {meta.theme === 'stylethree' && (
          <link
            href="https://fonts.googleapis.com/css2?family=Roboto+Condensed:ital,wght@0,400;0,700;1,400;1,700&family=Roboto:ital,wght@0,400;0,700;1,400;1,700&display=swap"
            rel="stylesheet"
          />
        )}
        {meta.theme === 'stylefour' && (
          <link
            href="https://fonts.googleapis.com/css2?family=Arbutus+Slab&family=Mulish:ital,wght@0,400;0,700;1,400;1,700&display=swap"
            rel="stylesheet"
          />
        )}
        {meta.theme === 'stylefive' && (
          <link
            href="https://fonts.googleapis.com/css2?family=Bodoni+Moda:ital,wght@0,400;0,700;1,400;1,700&family=Lato:ital,wght@0,400;0,700;1,400;1,700&display=swap"
            rel="stylesheet"
          />
        )}

        {isAmp && (
          <script
            async
            custom-element="amp-analytics"
            src="https://cdn.ampproject.org/v0/amp-analytics-0.1.js"
            key="amp-analytics"
          />
        )}
      </Head>
      {bannerAds?.length > 0 && (
        <BannerAd
          ad={{
            brand: bannerAds[0].promoterDisplayName,
            image: {
              url: bannerAds[0].promoterImage,
              alt: bannerAds[0].promoterImageAlternativeText,
            },
            url: bannerAds[0].callToActionUrl,
            pixel: bannerAds[0].pixel,
          }}
          isAmp={isAmp}
        />
      )}
      <ThemeWrapper meta={meta}>
        {renderNav && (
          <GlobalNav
            metadata={meta}
            sections={sections}
            isAmp={isAmp}
            monkeypodLink={monkeypodLink}
          />
        )}
        <Main>{children}</Main>
        {renderFooter && <GlobalFooter metadata={metaValues} />}
        <CookieConsentWrapper meta={meta} />
      </ThemeWrapper>
    </>
  );
}
