import { getArticleBySlug } from '../../lib/articles.js';

export default async (req, res) => {
  // Check the secret and next parameters
  // This secret should only be known to this API route and the CMS
  if (req.query.secret !== process.env.PREVIEW_TOKEN || !req.query.slug) {
    return res.status(401).json({ message: 'Invalid token' });
  }

  // Fetch the headless CMS to check if the provided `slug` exists
  const article = await getArticleBySlug(req.query.locale, req.query.slug);

  // If the slug doesn't exist prevent preview mode from being enabled
  if (!article) {
    return res.status(401).json({ message: 'Invalid slug' });
  }

  // Enable Preview Mode by setting the cookies
  res.setPreviewData({});

  // Redirect to the path from the fetched post
  // We don't redirect to req.query.slug as that might lead to open redirect vulnerabilities

  // BUG: this line of code taken from the nextjs docs doesn't work - throws a typeerror: res.redirect is not a function (??)
  // (https://nextjs.org/docs/advanced-features/preview-mode)
  // res.redirect(article.slug)

  const articlePath = '/preview/' + article.category.slug + '/' + article.slug;

  // this approach to the redirect does work
  res.writeHead(301, {
    Location: articlePath,
  });
  res.end();
};
