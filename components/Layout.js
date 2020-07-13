import Head from 'next/head';
import { siteMetadata } from "../lib/siteMetadata.js";

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
        <meta name="description" value={metaValues.description} />
        <meta name="og:title" value={metaValues.ogTitle} />
        <meta name="og:description" value={metaValues.ogDescription} />
        <meta name="og:image" value={metaValues.ogImage} />
        <meta name="canonical" value={metaValues.canonical} />
      </Head>
      <main className="container">
        {children}
      </main>
    </>
  )
}
