import Head from 'next/head';
import { siteMetadata } from '../lib/siteMetadata.js';
import globalStyles from '../styles/global.js';
import { useAmp } from 'next/amp';
import AmpAnalytics from './amp/AmpAnalytics.js';
import { localiseText } from '../lib/utils.js';

export default function Layout({ children, locale, meta }) {
  if (meta === null || meta === undefined) {
    console.log('Layout meta is missing');
    meta = {};
  }
  if (locale === null || locale === undefined) {
    console.log('Layout locale is missing');
    meta = {};
  }
  const metaValues = {
    canonical: meta.canonical || siteMetadata.siteUrl,
    searchTitle: meta.searchTitle
      ? localiseText(locale, meta.searchTitle)
      : siteMetadata.searchTitle,
    searchDescription: meta.searchDescription
      ? localiseText(locale, meta.searchDescription)
      : siteMetadata.searchDescription,
    facebookTitle: meta.facebookTitle
      ? localiseText(locale, meta.facebookTitle)
      : siteMetadata.facebookTitle,
    facebookDescription: meta.facebookDescription
      ? localiseText(locale, meta.facebookDescription)
      : siteMetadata.facebookDescription,
    twitterTitle: meta.twitterTitle
      ? localiseText(locale, meta.twitterTitle)
      : siteMetadata.twitterTitle,
    twitterDescription: meta.twitterDescription
      ? localiseText(locale, meta.twitterDescription)
      : siteMetadata.twitterDescription,
    firstPublishedOn: meta.firstPublishedOn || siteMetadata.firstPublishedOn,
    lastPublishedOn: meta.lastPublishedOn || siteMetadata.lastPublishedOn,
    tags: meta.tags || siteMetadata.tags,
    coverImage: meta.coverImage || siteMetadata.coverImage,
  };

  let tagList = [];
  if (metaValues.tags) {
    for (const [index, value] of metaValues.tags.entries()) {
      tagList.push(
        <meta property="article:tag" content={value.title} key={value.slug} />
      );
    }
  }

  const isAmp = useAmp();

  const trackingId = process.env.GA_TRACKING_ID;

  let title;
  if (meta && meta.searchTitle) {
    title = localiseText(locale, meta.searchTitle);
  } else if (metaValues.searchTitle) {
    title = localiseText(locale, metaValues.searchTitle);
  }

  return (
    <>
      <Head>
        <title>{title}</title>
        <link rel="icon" href="/favicon.ico" />
        <meta property="description" content={metaValues.searchDescription} />
        {tagList}
        <link rel="canonical" href={metaValues.canonical} />
        <link
          href="https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Libre+Franklin:ital,wght@0,300;0,800;1,300;1,800&display=swap"
          rel="stylesheet"
        />
        {/* Twitter Card data */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@publisher_handle" />
        <meta name="twitter:title" content={metaValues.twitterTitle} />
        <meta
          name="twitter:description"
          content={metaValues.twitterDescription}
        />
        <meta name="twitter:creator" content="@author_handle" />
        <meta name="twitter:image:src" content={metaValues.coverImage} />

        {/* Facebook data */}
        <meta property="og:title" content={metaValues.facebookTitle} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={metaValues.canonical} />
        <meta property="og:image" content={metaValues.coverImage} />
        <meta
          property="og:description"
          content={metaValues.facebookDescription}
        />
        <meta property="og:site_name" content="Site Name, i.e. Moz" />
        <meta
          property="article:published_time"
          content={metaValues.firstPublishedOn}
        />
        <meta
          property="article:modified_time"
          content={metaValues.lastPublishedOn}
        />
        <meta property="article:section" content="Article Section" />
        <meta property="article:tag" content="Article Tag" />
        <meta property="fb:admins" content="Facebook numeric ID" />

        {isAmp && (
          <script
            async
            custom-element="amp-analytics"
            src="https://cdn.ampproject.org/v0/amp-analytics-0.1.js"
            key="amp-analytics"
          />
        )}
        <style jsx global>
          {globalStyles}
        </style>
      </Head>
      <main>
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
      </main>
    </>
  );
}
