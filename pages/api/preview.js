import { hasuraPreviewArticleBySlug } from '../../lib/articles.js';

export default async function Handler(req, res) {
  const apiUrl = process.env.HASURA_API_URL;
  const site = req.query.site;

  // Check the secret and next parameters
  // This secret should only be known to this API route and the CMS
  if (req.query.secret !== process.env.PREVIEW_TOKEN || !req.query.slug) {
    return res.status(401).json({ message: 'Invalid token' });
  }

  let article;
  const localeCode = 'en-US';
  // Fetch the headless CMS to check if the provided `slug` exists
  const { errors, data } = await hasuraPreviewArticleBySlug({
    url: apiUrl,
    site: site,
    localeCode: localeCode,
    slug: req.query.slug,
  });

  if (errors || !data || !data.articles) {
    console.error(errors);
    return res.status(500).json({ message: 'Error looking up article' });
  } else {
    article = data.articles[0];
    // console.log(article.category.slug, 'article: ', article);
  }

  // If the slug doesn't exist prevent preview mode from being enabled
  if (!article) {
    return res.status(401).json({ message: 'Invalid slug' });
  }

  // Enable Preview Mode by setting the cookies
  res.setPreviewData({});

  let articlePath = '/preview/' + article.category.slug + '/' + article.slug;

  res.redirect(articlePath);
}
