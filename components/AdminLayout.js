import Head from 'next/head';
import 'bulma/css/bulma.min.css';
import { signIn, useSession } from 'next-auth/client';

export default function AdminLayout({ children }) {
  const [session, loading] = useSession();
  return (
    <>
      <Head>
        <title>tinycms</title>
        <link rel="icon" href="/favicon.ico" />
        <link
          href="https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Libre+Franklin:ital,wght@0,300;0,800;1,300;1,800&display=swap"
          rel="stylesheet"
        />
      </Head>
      <main className="container">
        {!session && (
          <section
            className="hero is-fullheight"
            style={{ minHeight: '100vh' }}
          >
            <div className="hero-body" style={{ padding: '3rem 3rem' }}>
              <p className="title">
                You must be signed in to view the tinycms.
              </p>
              <p className="subtitle">
                <button
                  className="button is-link"
                  onClick={() =>
                    signIn('presspass', {
                      callbackUrl: 'http://localhost:3000/tinycms/',
                    })
                  }
                >
                  Sign in
                </button>
              </p>
            </div>
          </section>
        )}
        {session && <>{children}</>}
      </main>
    </>
  );
}
