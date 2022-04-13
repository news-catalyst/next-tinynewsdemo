import Head from 'next/head';
import tw from 'twin.macro';
import yn from 'yn';
import { signIn, useSession } from 'next-auth/react';

const SignInButton = tw.a`hidden md:flex w-full md:w-auto px-4 py-2 text-right bg-blue-900 hover:bg-blue-500 text-white md:rounded`;

export default function AdminLayout({
  children,
  host,
  siteUrl,
  authorizedEmailDomains,
}) {
  const { data: session, status } = useSession();
  const loading = status === 'loading';

  let isAllowedToAccess = false;

  if (session && session.user && session.user.email) {
    console.log('session.user.email:', session.user.email);
    let authorizedDomains = authorizedEmailDomains.split(',');
    authorizedDomains.forEach((authorizedDomain) => {
      if (session.user.email.split('@')[1] === authorizedDomain) {
        isAllowedToAccess = true;
      }
    });
  }
  const cypressTesting = yn(process.env.NEXT_PUBLIC_CYPRESS_TESTING);

  let unauthorizedAccess;

  if (!isAllowedToAccess && session && session.user) {
    console.log(
      "You are logged in, but unfortunately you're not authorized for this tinycms"
    );
    unauthorizedAccess = (
      <span>
        Sorry, {session.user.email}, you're not authorized to access this
        organization's TinyCMS. Check the URL you're using to make sure it's the
        right one for your organization. Have we made a mistake? Let us know in
        Slack!
      </span>
    );
  } else {
    console.log('You are not logged in so you are not authorized.');
    unauthorizedAccess = <span>You must be signed in to use these tools.</span>;
  }

  // this is another flag to turn off Authentication similar to the cypress setting
  // I thought it would be clearer to intentionally skip authentication with a separate variable
  // when testing on localhost instead of repurposing the cypressTesting var
  let skipAuth = false;
  if (host.includes('localhost')) {
    console.log('debug: skipping auth on localhost');
    skipAuth = true;
  }
  const callbackUrl = new URL('/tinycms', siteUrl).toString();

  console.log(
    `debug: session=${typeof session} cypressTesting=${typeof cypressTesting} ${cypressTesting} skipAuth=${typeof skipAuth} ${skipAuth} isAllowedToAccess=${typeof isAllowedToAccess} ${isAllowedToAccess} callbackUrl=${callbackUrl}`
  );
  console.log(session);

  const signInScreen = (
    <section tw="bg-gray-200 text-gray-900 relative">
      <div tw="min-h-screen bg-right-top bg-cover flex">
        <div tw="relative container mx-auto p-4 flex items-center z-10">
          <div>
            <div tw="content float-left py-4 px-5 my-5">
              <div tw="mb-3 text-2xl md:text-4xl">TinyCMS</div>
              <div tw="leading-normal hidden sm:block">
                {unauthorizedAccess}
              </div>
            </div>
            <div tw="clear-left px-5">
              <div tw="flex justify-center items-center block sm:inline-block no-underline">
                <SignInButton
                  tw="cursor-pointer"
                  id="tinycms-signin-button"
                  onClick={() =>
                    signIn('google', {
                      callbackUrl: `${callbackUrl}`,
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
  );

  let showSigninScreen = true;

  // used to skip auth on localhost - I couldn't get it to work on `${subdomain}.localhost:3000`
  if (skipAuth) {
    showSigninScreen = false;
  }
  // used to skip auth in automated testing
  if (cypressTesting) {
    showSigninScreen = false;
  }
  // already signed in and authorized, don't display sign in screen
  if (isAllowedToAccess) {
    showSigninScreen = false;
  }

  if (showSigninScreen) {
    console.log('debug: should show the sign in screen');
  } else {
    console.log('debug: should not show sign in screen ');
  }

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
        {showSigninScreen ? <>{signInScreen}</> : <>{children}</>}
      </main>
    </>
  );
}
