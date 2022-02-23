import { NextResponse } from 'next/server';

export default function middleware(req) {
  const url = req.nextUrl.clone(); // clone the request url
  const { pathname } = req.nextUrl; // get pathname of request (e.g. /blog-slug)
  const hostname = req.headers.get('host'); // get hostname of request (e.g. demo.vercel.pub)
  const currentHost = hostname
    .replace(`.localhost:3000`, '')
    .replace(`.tinynewsco.dev:3000`, '')
    .replace(`.tinynewsco.org:3000`, '')
    .replace(`.tinynewsco.dev`, '')
    .replace(`.tinynewsco.org`, '')
    .replace(`.vercel.app`, '')
    .replace(`.vercel.app:3000`, ''); // TBD if we need to change this

  console.log('middleware host / pathname', currentHost, '/', pathname);

  // Copied this over as commented code in case we want to redirect particular hosts to one central spot
  // only for demo purposes – remove this if you want to use your root domain as the landing page
  // if (hostname === "vercel.pub" || hostname === "platforms.vercel.app") {
  //   return NextResponse.redirect("https://demo.vercel.pub");
  // }

  // API routes and the TinyCMS are handled elsewhere tbd
  if (!pathname.includes('.') && !pathname.startsWith('/api')) {
    url.pathname = `/_sites/${currentHost}${pathname}`;
    console.log('middleware rewrote url:', url.pathname);
    return NextResponse.rewrite(url);
  }
}
