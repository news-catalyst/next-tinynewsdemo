import Head from 'next/head';
import { siteMetadata } from "../lib/siteMetadata.js";
import globalStyles from '../styles/global.js'
import { useAmp } from 'next/amp';
import AmpAnalytics from './amp/AmpAnalytics.js';

export default function Layout({ children, meta }) {
  const metaValues = {
    'title': meta.title || siteMetadata.title,
    'description': meta.description || siteMetadata.description,
    'ogTitle': meta.ogTitle || siteMetadata.title,
    'ogDescription': meta.ogDescrption || siteMetadata.description,
    'ogImage': meta.ogImage || "",
    'canonical': meta.canonical || siteMetadata.siteUrl,
  };

  const isAmp = useAmp();

  const trackingId = process.env.GA_TRACKING_ID;

  return (
    <>
      <Head>
        <title>{metaValues.title}</title>
        <link rel="icon" href="/favicon.ico" />
        <meta property="description" content={metaValues.description} />
        <meta property="og:title" content={metaValues.ogTitle} />
        <meta property="og:description" content={metaValues.ogDescription} />
        <meta property="og:image" content={metaValues.ogImage} />
        <link rel="canonical" href={metaValues.canonical} />
        <link href="https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Libre+Franklin:ital,wght@0,300;0,800;1,300;1,800&display=swap" rel="stylesheet" />
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
  )
}
