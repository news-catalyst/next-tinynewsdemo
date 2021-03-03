import Head from 'next/head';
import 'bulma/css/bulma.min.css';
import { signIn, signOut, useSession } from 'next-auth/client';

export default function AdminLayout({ children }) {
  const [session, loading] = useSession();
  console.log('session:', session);
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
          <>
            Not signed in <br />
            <button
              onClick={() =>
                signIn('presspass', {
                  callbackUrl: 'http://localhost:3000/tinycms/',
                })
              }
            >
              Sign in
            </button>
          </>
        )}
        {session && (
          <>
            <button onClick={() => signOut()}>Sign out</button>
            {children}
          </>
        )}
      </main>
    </>
  );
}
