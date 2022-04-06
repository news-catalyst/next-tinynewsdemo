import { NextResponse } from 'next/server';

export default function middleware(req) {
  const url = req.nextUrl.clone(); // clone the request url
  const { pathname, searchParams } = req.nextUrl; // get pathname of request (e.g. /blog-slug)
  const hostname = req.headers.get('host'); // get hostname of request (e.g. demo.vercel.pub)

  if (pathname.includes('/en-US')) {
    url.pathname = pathname.replace('/en-US', '');
    return NextResponse.redirect(url);
  }

  let currentHost = hostname
    .replace(`.localhost:3000`, '')
    .replace(`.tinynewsco.dev:3000`, '')
    .replace(`.tinynewsco.org:3000`, '')
    .replace(`.tinynewsco.dev`, '')
    .replace(`.tinynewsco.org`, '')
    .replace(`.vercel.app`, '')
    .replace(`.vercel.app:3000`, ''); // TBD if we need to change this

  // use the query param 'site' if currentHost isn't usable
  if ((currentHost === 'localhost:3000' || !currentHost) && searchParams) {
    currentHost = searchParams.get('site');
  }

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
    console.log('[middleware] updated path:', url.pathname);
    return NextResponse.rewrite(url);
  } else if (pathname.startsWith('/api/auth/callback/google')) {
    console.log(`[middleware] google oauth callback`, req);
  }
}
