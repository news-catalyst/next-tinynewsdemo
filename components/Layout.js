import Head from 'next/head';
import GlobalNav from './nav/GlobalNav';
import GlobalFooter from './nav/GlobalFooter.js';
import CookieConsentWrapper from './nav/CookieConsentWrapper.js';
import { useAmp } from 'next/amp';
import AmpAnalytics from './amp/AmpAnalytics.js';
import tw, { styled } from 'twin.macro';
import { trackingIdMapping } from '../lib/utils';

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
  article,
  page,
  sections,
  monkeypodLink,
  site,
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

  const siteUrl = meta['siteUrl'];

  const metaValues = {
    canonical: meta['canonicalUrl'] || meta['siteUrl'],
    favicon: meta['favicon'],
    siteName: meta['shortName'],
    searchTitle: meta['searchTitle'],
    searchDescription: meta['searchDescription'],
    twitterTitle: meta['twitterTitle'],
    twitterDescription: meta['twitterDescription'],
    coverImage: meta['coverImage'] || meta['defaultSocialImage'],
    footerTitle: meta['footerTitle'],
    footerBylineLink: meta['footerBylineLink'],
    footerBylineName: meta['footerBylineName'],
    founderTwitter: meta['founderTwitter'],
    founderInstagram: meta['founderInstagram'],
    founderFacebook: meta['founderFacebook'],
    documentType: 'article',
    facebookAdmins: meta['facebookAdmins'],
    facebookAppId: meta['facebookAppId'],
    siteTwitter: meta['siteTwitter'],
  };

  // figure out what dimensions to set for facebook cover image
  let dimensions = null;
  if (meta.coverImage && meta.coverImageWidth && meta.coverImageHeight) {
    dimensions = coverImageDimensions(
      meta.coverImageWidth,
      meta.coverImageHeight
    );
  } else if (
    meta.defaultSocialImage &&
    meta.defaultSocialImageWidth &&
    meta.defaultSocialImageHeight
  ) {
    dimensions = coverImageDimensions(
      meta.defaultSocialImageWidth,
      meta.defaultSocialImageHeight
    );
  }
  metaValues.coverImageWidth = dimensions?.width;
  metaValues.coverImageHeight = dimensions?.height;

  // override default canonical url if there's one specified on the article
  if (article && article.canonical_url) {
    metaValues['canonical'] = article.canonical_url;
  }

  if (page && ['about', 'donate', 'thank-you'].includes(page.slug)) {
    metaValues['canonical'] = `${siteUrl}/${page.slug}`;
  }

  let pageTitle = meta['homepageTitle'];

  let author;
  let translations;
  if (article) {
    translations = article.article_translations;
    if (
      article.author_articles &&
      article.author_articles[0] &&
      article.author_articles[0].author
    ) {
      author = article.author_articles[0].author;
    }
  }

  if (page) {
    translations = page.page_translations;
    metaValues['documentType'] = 'website';
  }
  if (translations && translations.length > 0) {
    pageTitle = translations[0]['search_title'];
    if (pageTitle === 'Untitled Document') {
      let headline = translations[0].headline;
      if (headline !== 'Untitled Document') {
        pageTitle = headline + ' | ' + metaValues.siteName;
      } else {
        pageTitle = metaValues.siteName;
      }
    } else {
      pageTitle += ' | ' + metaValues.siteName;
    }

  

    metaValues.twitterTitle = translations[0]['twitter_title'];
    if (!metaValues.twitterTitle) {
      metaValues.twitterTitle = metaValues.searchTitle;
    }
    metaValues.twitterDescription = translations[0]['twitter_description'];
    if (!metaValues.twitterDescription) {
      metaValues.twitterDescription = metaValues.searchDescription;
    }
    
  }

  if (article && article.firstPublishedOn) {
    metaValues['firstPublishedOn'] = article.firstPublishedOn;
  }
  if (article && article.lastPublishedOn) {
    metaValues['lastPublishedOn'] = article.lastPublishedOn;
  }

  if (author && author.twitter) {
    metaValues['authorTwitter'] = '@' + author.twitter;
  }
  let tagList = [];
  if (article && article.tags) {
    article.tags.map((tag) => {
      tagList.push(
        <meta
          property="article:tag"
          content={tag.tag_translations[0].title}
          key={tag.slug}
        />
      );
    });
  }

  const isAmp = useAmp();

  const mappingSiteTrackingID = trackingIdMapping();
  const trackingId = mappingSiteTrackingID[site];

  // console.log('Layout: returning page', children);
  return (
    <>
      <Head>
      
        {/* Twitter Card data */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={metaValues.twitterTitle} />
        <meta
          name="twitter:description"
          content={metaValues.twitterDescription}
        />
        {metaValues.siteTwitter && (
          <meta name="twitter:site" content={'@' + metaValues.siteTwitter} />
        )}
        {metaValues.authorTwitter && (
          <meta name="twitter:creator" content={metaValues.authorTwitter} />
        )}
        <meta name="twitter:image" content={metaValues.coverImage} />


        {metaValues.firstPublishedOn && (
          <meta
            property="article:published_time"
            content={metaValues.firstPublishedOn}
          />
        )}
        {metaValues.lastPublishedOn && (
          <meta
            property="article:modified_time"
            content={metaValues.lastPublishedOn}
          />
        )}
       
        {article !== undefined &&
          article.tags !== undefined &&
          article.tags.map((tag) => (
            <meta
              key={tag.tag_translations[0].title}
              property="article:tag"
              content={tag.tag_translations[0].title}
            />
          ))}
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
      <ThemeWrapper meta={meta}>
        {renderNav && (
          <GlobalNav
            metadata={meta}
            sections={sections}
            isAmp={isAmp}
            monkeypodLink={monkeypodLink}
          />
        )}
        <Main>
          {isAmp && (
            <AmpAnalytics
              type="googleanalytics"
              script={{
                vars: {
                  account: trackingId,
                  gtag_id: trackingId,
                  config: {
                    [trackingId]: { groups: 'default' },
                  },
                },
                triggers: {
                  trackPageview: {
                    on: 'visible',
                    request: 'pageview',
                  },
                },
              }}
            />
          )}
          {children}
        </Main>
        {renderFooter && <GlobalFooter metadata={metaValues} />}
        <CookieConsentWrapper meta={meta} />
      </ThemeWrapper>
    </>
  );
}
