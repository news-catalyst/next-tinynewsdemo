import { hasuraPreviewArticleBySlug } from '../../lib/articles.js';

export default async (req, res) => {
  const apiUrl = process.env.HASURA_API_URL;
  const apiToken = process.env.ORG_SLUG;

  // Check the secret and next parameters
  // This secret should only be known to this API route and the CMS
  if (req.query.secret !== process.env.PREVIEW_TOKEN || !req.query.slug) {
    return res.status(401).json({ message: 'Invalid token' });
  }

  let article;
  let localeCode = req.query.locale;
  // Fetch the headless CMS to check if the provided `slug` exists
  const { errors, data } = await hasuraPreviewArticleBySlug({
    url: apiUrl,
    orgSlug: apiToken,
    localeCode: localeCode,
    slug: req.query.slug,
  });

  if (errors || !data || !data.articles) {
    console.log(errors);
    return res.status(500).json({ message: 'Error looking up article' });
  } else {
    article = data.articles[0];
    console.log(article.category.slug, 'article: ', article);
  }

  // If the slug doesn't exist prevent preview mode from being enabled
  if (!article) {
    return res.status(401).json({ message: 'Invalid slug' });
  }

  // Enable Preview Mode by setting the cookies
  res.setPreviewData({});

  let articlePath;

  if (localeCode) {
    articlePath =
      '/' +
      localeCode +
      '/preview/' +
      article.category.slug +
      '/' +
      article.slug;
  } else {
    articlePath = '/preview/' + article.category.slug + '/' + article.slug;
  }

  console.log('article path:', articlePath);
  res.writeHead(301, {
    Location: articlePath,
  });
  res.end();
};
