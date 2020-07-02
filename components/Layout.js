import Head from 'next/head';

export default function Layout({ children }) {
  return (
    <>
      <Head>
        <title>Tiny News Demo</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        {children}
      </main>
    </>
  )
}
