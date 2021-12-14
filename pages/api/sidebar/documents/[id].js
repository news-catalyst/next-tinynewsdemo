import { hasuraLookupGoogleDoc } from '../../../../lib/articles';

export default async function Handler(req, res) {
  const apiUrl = process.env.HASURA_API_URL;
  const apiToken = process.env.ORG_SLUG;

  let returnData = {
    documentType: '',
    authors: [],
    categories: [],
    organization_locales: [],
    tags: [],
  };

  // Check the API token
  if (req.query.token !== process.env.API_TOKEN || !req.query.id) {
    return res.status(401).json({ message: 'Invalid API token' });
  }

  let documentId = req.query.id;
  // Find the article or page
  const { errors, data } = await hasuraLookupGoogleDoc({
    url: apiUrl,
    orgSlug: apiToken,
    documentId: documentId,
  });

  if (errors || !data || !data.google_documents) {
    console.error(errors);
    return res
      .status(500)
      .json({ message: 'Error: ' + JSON.stringify(errors) });
  } else {
    console.log(data);

    let googleDoc = data.google_documents[0];

    returnData.authors = data.authors;
    returnData.categories = data.categories;
    returnData.organization_locales = data.organization_locales;
    returnData.tags = data.tags;

    // article
    if (googleDoc.article_google_documents.length > 0) {
      returnData.documentType = 'article';
      let article = googleDoc.article_google_documents[0].article;
      returnData.article = article;

      // page
    } else if (googleDoc.page_google_documents.length > 0) {
      returnData.documentType = 'page';
      let page = googleDoc.page_google_documents[0].page;
      returnData.page = page;
    } else {
      return res.status(500).json({
        message:
          'Error: unknown content associated with google doc ID ' + documentId,
      });
    }
  }

  // let articlePath;

  // if (localeCode) {
  //   articlePath =
  //     '/' +
  //     localeCode +
  //     '/preview/' +
  //     article.category.slug +
  //     '/' +
  //     article.slug;
  // } else {
  //   articlePath = '/preview/' + article.category.slug + '/' + article.slug;
  // }

  res.status(200).json(returnData);
}
