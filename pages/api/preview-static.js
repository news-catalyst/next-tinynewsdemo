import { getAboutPage } from '../../lib/articles.js';

export default async (req, res) => {
  // Check the secret and next parameters
  // This secret should only be known to this API route and the CMS
  if (req.query.secret !== process.env.PREVIEW_TOKEN || !req.query.slug) {
    return res.status(401).json({ message: 'Invalid token' });
  }

  if (req.query.slug === 'about') {
    // Fetch the headless CMS to check if the about page data exists
    // TODO: generalise for all static pages?
    const aboutData = await getAboutPage();

    // If the above request fails prevent preview mode from being enabled
    if (!aboutData) {
      return res.status(401).json({ message: 'Invalid slug' });
    }
  }

  // Enable Preview Mode by setting the cookies
  res.setPreviewData({});

  // Redirect to the path from the fetched post
  // We don't redirect to req.query.slug as that might lead to open redirect vulnerabilities

  // BUG: this line of code taken from the nextjs docs doesn't work - throws a typeerror: res.redirect is not a function (??)
  // (https://nextjs.org/docs/advanced-features/preview-mode)
  // res.redirect(article.slug)

  const nextPath = '/' + req.query.slug;

  // this approach to the redirect does work
  res.writeHead(301, {
    Location: nextPath,
  });
  res.end();
};
