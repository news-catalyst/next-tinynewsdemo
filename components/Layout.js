import Head from 'next/head';
import { siteMetadata } from '../lib/siteMetadata.js';
import globalStyles from '../styles/global.js';
import { useAmp } from 'next/amp';
import AmpAnalytics from './amp/AmpAnalytics.js';

export default function Layout({ children, meta }) {
  const metaValues = {
    title: meta.title || siteMetadata.title,
    description: meta.description || siteMetadata.description,
    ogTitle: meta.ogTitle || siteMetadata.title,
    ogDescription: meta.ogDescrption || siteMetadata.description,
    ogImage: meta.ogImage || '',
    canonical: meta.canonical || siteMetadata.siteUrl,
    searchTitle: meta.searchTitle || siteMetadata.searchTitle,
    searchDescription: meta.searchDescription || siteMetadata.searchDescription,
    facebookTitle: meta.facebookTitle || siteMetadata.facebookTitle,
    facebookDescription:
      meta.facebookDescription || siteMetadata.facebookDescription,
    twitterTitle: meta.twitterTitle || siteMetadata.twitterTitle,
    twitterDescription:
      meta.twitterDescription || siteMetadata.twitterDescription,
  };

  const isAmp = useAmp();

  const trackingId = process.env.GA_TRACKING_ID;

  return (
    <>
      <Head>
        <title>{meta.searchTitle}</title>
        <link rel="icon" href="/favicon.ico" />
        <meta property="description" content={metaValues.searchDescription} />
        <meta property="og:title" content={metaValues.ogTitle} />
        <meta property="og:description" content={metaValues.ogDescription} />
        <meta property="og:image" content={metaValues.ogImage} />
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
        <meta
          name="twitter:image:src"
          content="http://www.example.com/image.jpg"
        />

        {/* Facebook data */}
        <meta property="og:title" content={metaValues.facebookTitle} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content="http://www.example.com/" />
        <meta property="og:image" content="http://example.com/image.jpg" />
        <meta
          property="og:description"
          content={metaValues.facebookDescription}
        />
        <meta property="og:site_name" content="Site Name, i.e. Moz" />
        <meta
          property="article:published_time"
          content="2013-09-17T05:59:00+01:00"
        />
        <meta
          property="article:modified_time"
          content="2013-09-16T19:08:47+01:00"
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
      <main className="container">
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
