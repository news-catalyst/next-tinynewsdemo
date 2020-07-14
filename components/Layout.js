import Head from 'next/head';
import { siteMetadata } from "../lib/siteMetadata.js";
import globalStyles from '../styles/global.js'

export default function Layout({ children, meta }) {
  const metaValues = {
    'title': meta.title || siteMetadata.title,
    'description': meta.description || siteMetadata.description,
    'ogTitle': meta.ogTitle || siteMetadata.title,
    'ogDescription': meta.ogDescrption || siteMetadata.description,
    'ogImage': meta.ogImage || "",
    'canonical': meta.canonical || siteMetadata.siteUrl,
  };

  return (
    <>
      <Head>
        <title>{metaValues.title}</title>
        <link rel="icon" href="/favicon.ico" />
        <meta property="description" content={metaValues.description} />
        <meta property="og:title" content={metaValues.ogTitle} />
        <meta property="og:description" content={metaValues.ogDescription} />
        <meta property="og:image" content={metaValues.ogImage} />
        <meta property="canonical" content={metaValues.canonical} />
      </Head>
      <main className="container">
        {children}
      </main>
      <style jsx global>
        {globalStyles}
      </style>
    </>
  )
}
