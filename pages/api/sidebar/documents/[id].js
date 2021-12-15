import {
  hasuraLookupGoogleDoc,
  hasuraGetGoogleDocsForArticle,
} from '../../../../lib/articles';

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
      let articleGoogleDoc =
        googleDoc.article_google_documents[0].google_document;

      const articleResult = await hasuraGetGoogleDocsForArticle({
        url: apiUrl,
        orgSlug: apiToken,
        articleId: article.id,
        localeCode: articleGoogleDoc.locale_code,
      });
      if (articleResult.errors) {
        return res.status(500).json({
          message:
            'Error finding google docs for article id ' +
            article.id +
            ': ' +
            JSON.stringify(articleResult.errors),
        });
      }
      returnData.article_google_documents =
        articleResult.data.article_google_documents;
      returnData.published_article_translations =
        articleResult.data.published_article_translations;

      // page
    } else if (googleDoc.page_google_documents.length > 0) {
      returnData.documentType = 'page';
      let page = googleDoc.page_google_documents[0].page;
      returnData.page = page;

      const pageResult = await hasuraGetGoogleDocsForPage({
        url: apiUrl,
        orgSlug: apiToken,
        articleId: page.id,
      });
      if (pageResult.errors) {
        return res.status(500).json({
          message:
            'Error finding google docs for page id ' +
            page.id +
            ': ' +
            JSON.stringify(pageResult.errors),
        });
      }
      returnData.page_google_documents = pageResult.data.page_google_documents;
    } else {
      return res.status(500).json({
        message:
          'Error: unknown content associated with google doc ID ' + documentId,
      });
    }
  }

  res.status(200).json(returnData);
}
