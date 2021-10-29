import Head from 'next/head';
import GlobalNav from './nav/GlobalNav';
import GlobalFooter from './nav/GlobalFooter.js';
import CookieConsentWrapper from './nav/CookieConsentWrapper.js';
import { useAmp } from 'next/amp';
import AmpAnalytics from './amp/AmpAnalytics.js';
import { hasuraLocalizeText } from '../lib/utils';
import tw, { styled } from 'twin.macro';

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
  locale,
  renderNav = true,
  renderFooter = true,
}) {
  if (meta === null || meta === undefined) {
    meta = {};
  }

  // console.log('Layout locale:', locale);

  const metaValues = {
    canonical: meta['canonicalUrl'] || meta['siteUrl'],
    favicon: meta['favicon'],
    siteName: meta['shortName'],
    searchTitle: meta['searchTitle'],
    searchDescription: meta['searchDescription'],
    facebookTitle: meta['facebookTitle'],
    facebookDescription: meta['facebookDescription'],
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
    pageTitle = hasuraLocalizeText(locale, translations, 'search_title');
    pageTitle += ' | ' + metaValues.siteName;

    if (article && article.category) {
      metaValues.section = hasuraLocalizeText(
        locale,
        article.category.category_translations,
        'title'
      );
    }
    metaValues.searchTitle = hasuraLocalizeText(
      locale,
      translations,
      'search_title'
    );
    metaValues.searchDescription = hasuraLocalizeText(
      locale,
      translations,
      'search_description'
    );

    metaValues.twitterTitle = hasuraLocalizeText(
      locale,
      translations,
      'twitter_title'
    );
    metaValues.twitterDescription = hasuraLocalizeText(
      locale,
      translations,
      'twitter_description'
    );
    metaValues.facebookTitle = hasuraLocalizeText(
      locale,
      translations,
      'facebook_title'
    );
    metaValues.facebookDescription = hasuraLocalizeText(
      locale,
      translations,
      'facebook_description'
    );
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
          content={hasuraLocalizeText(locale, tag.tag_translations, 'title')}
          key={tag.slug}
        />
      );
    });
  }

  const isAmp = useAmp();

  const trackingId = process.env.NEXT_PUBLIC_GA_TRACKING_ID;

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        {metaValues.favicon && <link rel="icon" href={metaValues.favicon} />}
        <meta property="description" content={metaValues.searchDescription} />
        {tagList}
        <link rel="canonical" href={metaValues.canonical} />
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
        <meta name="twitter:image:src" content={metaValues.coverImage} />

        {/* Facebook data */}
        <meta property="og:title" content={metaValues.facebookTitle} />
        <meta property="og:type" content={metaValues.documentType} />
        <meta property="og:url" content={metaValues.canonical} />
        <meta property="og:image" content={metaValues.coverImage} />
        <meta
          property="og:description"
          content={metaValues.facebookDescription}
        />
        <meta property="og:site_name" content={metaValues.siteName} />

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
        {metaValues.section && (
          <meta property="article:section" content={metaValues.section} />
        )}
        {article !== undefined &&
          article.tags !== undefined &&
          article.tags.map((tag) => (
            <meta
              key={hasuraLocalizeText(locale, tag.tag_translations, 'title')}
              property="article:tag"
              content={hasuraLocalizeText(
                locale,
                tag.tag_translations,
                'title'
              )}
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
            locale={locale}
            metadata={meta}
            sections={sections}
            isAmp={isAmp}
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
