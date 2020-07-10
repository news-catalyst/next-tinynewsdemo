import Head from 'next/head';

export default function Layout({ children, meta }) {
  const metaValues = {
    'title': meta.title || "Tiny News Demo",
    'description': meta.description || "A default description of the site",
    'ogTitle': meta.ogTitle || "Tiny News Demo",
    'ogDescription': meta.ogDescrption || "A default description of the site",
    'ogImage': meta.ogImage || "",
    'canonical': meta.canonical || "",
  }

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
      <main>
        {children}
      </main>
    </>
  )
}
