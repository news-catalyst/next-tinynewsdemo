import { hasuraGetPage } from '../../lib/articles.js';

export default async (req, res) => {
  // Check the secret and next parameters
  // This secret should only be known to this API route and the CMS
  if (req.query.secret !== process.env.PREVIEW_TOKEN || !req.query.slug) {
    return res.status(401).json({ message: 'Invalid token' });
  }

  if (req.query.slug === 'about') {
    const apiUrl = process.env.HASURA_API_URL;
    const apiToken = process.env.ORG_SLUG;

    let page = {};
    let sections;
    let siteMetadata = {};

    const { errors, data } = await hasuraGetPage({
      url: apiUrl,
      orgSlug: apiToken,
      slug: 'about',
      localeCode: locale,
    });
    if (errors || !data) {
      return res.status(401).json({ message: 'Invalid slug' });
      // } else {
      //   console.log(data);
      //   sections = data.categories;
      //   page = data.pages[0];
      //   siteMetadata = data.site_metadatas[0].site_metadata_translations[0].data;
      //   for (var i = 0; i < sections.length; i++) {
      //     sections[i].title = hasuraLocaliseText(
      //       sections[i].category_translations,
      //       'title'
      //     );
      //   }
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
