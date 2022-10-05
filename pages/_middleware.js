import { NextResponse } from 'next/server';

export default function middleware(req) {
  const url = req.nextUrl.clone(); // clone the request url
  const { pathname, searchParams } = req.nextUrl; // get pathname of request (e.g. /blog-slug)
  const hostname = req.headers.get('host'); // get hostname of request (e.g. demo.vercel.pub)
  //console.log('[middleware] host header:', hostname);

  if (pathname.includes('/en-US')) {
    console.log('[middleware] pathname includes en-US, redirecting....');
    url.pathname = pathname.replace('/en-US', '');
    return NextResponse.redirect(url);
  }

  let currentHost;

  if (!hostname) {
    // revalidate requests from lambda come through (intermittently) without the 'host' header,
    // despite us setting it explicitly on revalidate requests to the /api/revalidate endpoint
    currentHost = searchParams.get('site');
  } else {
    currentHost = hostname
      .replace(`.localhost:3000`, '')
      .replace(`.tinynewsco.dev:3000`, '')
      .replace(`.tinynewsco.org:3000`, '')
      .replace(`.tinynewsco.dev`, '')
      .replace(`.tinynewsco.org`, '')
      .replace(`.vercel.app`, '')
      .replace(`.vercel.app:3000`, ''); // TBD if we need to change this

    // use the query param 'site' if currentHost isn't usable
    if (
      (currentHost === 'localhost:3000' ||
        currentHost.includes('ngrok.io') ||
        !currentHost) &&
      searchParams
    ) {
      currentHost = searchParams.get('site');
    }
  }

  //console.log('[middleware] currenthost: ', currentHost);

  if (
    (!pathname.includes('.') || pathname.includes('.xml')) && // exclude all files in the public folder
    !pathname.startsWith('/api') // exclude all API routes
  ) {
    // strip default locale from incoming request pathname
    const pathWithoutLocale = pathname.replace('/en-US', '');

    // console.log(
    //   `[middleware] host:pathname ${currentHost}:${pathWithoutLocale}`
    // );

    url.pathname = `/_sites/${currentHost}${pathWithoutLocale}`;
    // if (url && url.pathname) {
    //   console.log('[middleware] updated path:', url.pathname);
    // }
    return NextResponse.rewrite(url);
  } else if (pathname.startsWith('/api/auth/callback/google')) {
    console.log(`[middleware] google oauth callback`, req);
  }
}
