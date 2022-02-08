import Head from 'next/head';
import tw from 'twin.macro';
import { signIn, useSession } from 'next-auth/client';

const SignInButton = tw.a`hidden md:flex w-full md:w-auto px-4 py-2 text-right bg-blue-900 hover:bg-blue-500 text-white md:rounded`;

export default function AdminLayout({ children }) {
  const [session, loading] = useSession();
  const cypressTesting = process.env.NEXT_PUBLIC_CYPRESS_TESTING;

  return (
    <>
      <Head>
        <title>TinyCMS</title>
        <link rel="icon" href="/favicon.ico" />
        <link
          href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Domine:wght@400;700&family=Libre+Franklin:ital,wght@0,400;0,700;1,400;1,700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Source+Sans+Pro:ital,wght@0,400;0,700;1,400;1,700&family=Source+Serif+Pro:ital,wght@0,400;0,700;1,400;1,700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto+Condensed:ital,wght@0,400;0,700;1,400;1,700&family=Roboto:ital,wght@0,400;0,700;1,400;1,700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Arbutus+Slab&family=Mulish:ital,wght@0,400;0,700;1,400;1,700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Bodoni+Moda:ital,wght@0,400;0,700;1,400;1,700&family=Lato:ital,wght@0,400;0,700;1,400;1,700&display=swap"
          rel="stylesheet"
        />
        <script async src="https://apis.google.com/js/client:platform.js" />
      </Head>
      <main className="container">
        {!session && !cypressTesting && (
          <section tw="bg-gray-200 text-gray-900 relative">
            <div tw="min-h-screen bg-right-top bg-cover flex">
              <div tw="relative container mx-auto p-4 flex items-center z-10">
                <div>
                  <div tw="content float-left py-4 px-5 my-5">
                    <div tw="mb-3 text-2xl md:text-4xl">TinyCMS</div>
                    <div tw="leading-normal hidden sm:block">
                      You must be signed in to use these tools.
                    </div>
                  </div>
                  <div tw="clear-left px-5">
                    <div tw="flex justify-center items-center block sm:inline-block no-underline">
                      <SignInButton
                        tw="cursor-pointer"
                        id="tinycms-signin-button"
                        onClick={() =>
                          signIn('google', {
                            callbackUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/tinycms/`,
                          })
                        }
                      >
                        Sign in
                      </SignInButton>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}
        {(session || cypressTesting) && <>{children}</>}
      </main>
    </>
  );
}
