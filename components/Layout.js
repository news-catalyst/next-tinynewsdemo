import Head from 'next/head';
import globalStyles from '../styles/global.js';
import { useAmp } from 'next/amp';
import AmpAnalytics from './amp/AmpAnalytics.js';
import { localiseText } from '../lib/utils';

export default function Layout({ children, locale, meta, article }) {
  if (meta === null || meta === undefined) {
    console.log('Layout meta is missing');
    meta = {};
  }
  if (locale === null || locale === undefined) {
    console.log('Layout locale is missing');
    meta = {};
  }

  const metaValues = {
    canonical: meta['siteUrl'],
    searchTitle: meta['searchTitle'],
    searchDescription: meta['searchDescription'],
    facebookTitle: meta['facebookTitle'],
    facebookDescription: meta['facebookDescription'],
    twitterTitle: meta['twitterTitle'],
    twitterDescription: meta['twitterDescription'],
    coverImage: meta['coverImage'],
  };
  if (article && article.firstPublishedOn) {
    metaValues['firstPublishedOn'] = article.firstPublishedOn;
  }
  if (article && article.lastPublishedOn) {
    metaValues['lastPublishedOn'] = article.lastPublishedOn;
  }

  let tagList = [];
  if (article && article.tags) {
    article.tags.map((tag) => {
      tagList.push(
        <meta
          property="article:tag"
          content={localiseText(locale, tag.title)}
          key={tag.slug}
        />
      );
    });
  }

  const isAmp = useAmp();

  const trackingId = process.env.GA_TRACKING_ID;

  return (
    <>
      <Head>
        <title>{meta['homepageTitle']}</title>
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
      <style jsx global>
        {globalStyles}
      </style>
    </>
  );
}
