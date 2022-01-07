import { hasuraLookupGoogleDoc } from '../../../../../lib/articles';
import { unpublishArticle, unpublishPage } from '../../../../../lib/document';

export default async function Handler(req, res) {
  const apiUrl = process.env.HASURA_API_URL;
  const apiToken = process.env.ORG_SLUG;

  // Check the API token
  if (req.query.token !== process.env.API_TOKEN || !req.query.id) {
    return res.status(401).json({ message: 'Invalid API token' });
  }

  let documentId = req.query.id;
  let documentType = req.query.documentType;

  let articleId;
  let pageId;
  let localeCode;

  const { errors, data } = await hasuraLookupGoogleDoc({
    url: apiUrl,
    orgSlug: apiToken,
    documentId: documentId,
  });
  if (errors || !data || !data.google_documents || !data.google_documents[0]) {
    console.error(errors);
    return res.status(500).json({
      status: 'error',
      message:
        'Error looking up data by Google Doc ID: ' + JSON.stringify(errors),
      data: errors,
    });
  } else {
    console.log('Lookup Data: ', data.google_documents);

    let resultData;

    if (documentType === 'article') {
      articleId =
        data.google_documents[0].article_google_documents[0].article.id;
      localeCode =
        data.google_documents[0].article_google_documents[0].google_document
          .locale_code;

      if (!articleId) {
        console.error(
          'NO id found in lookup data :(',
          data.google_documents[0].article_google_documents[0]
        );
        return res.status(500).json({
          status: 'error',
          message: 'Error unpublishing article: unable to find article ID',
          data: JSON.stringify(data),
        });
      }
      console.log(documentType, documentId, articleId, localeCode);

      let storeDataResult = await unpublishArticle({
        article_id: articleId,
        url: apiUrl,
        orgSlug: apiToken,
        locale_code: localeCode,
      });

      console.log(storeDataResult);
      if (storeDataResult.status === 'error') {
        console.error(JSON.stringify(storeDataResult));
        return res.status(500).json({
          status: 'error',
          message:
            'Error unpublishing article: ' +
            JSON.stringify(storeDataResult.message),
          data: JSON.stringify(storeDataResult),
        });
      }

      resultData = storeDataResult.data;
    } else if (documentType === 'page') {
      pageId = data.google_documents[0].page_google_documents[0].page.id;
      localeCode =
        data.google_documents[0].page_google_documents[0].google_document
          .locale_code;
      if (!pageId) {
        console.error(
          'NO id found in lookup data :(',
          data.google_documents[0].page_google_documents[0]
        );
        return res.status(500).json({
          status: 'error',
          message: 'Error unpublishing page: unable to find page ID',
          data: JSON.stringify(data),
        });
      }
      console.log(documentType, documentId, pageId, localeCode);

      let storeDataResult = await unpublishPage({
        page_id: pageId,
        url: apiUrl,
        orgSlug: apiToken,
        locale_code: localeCode,
      });

      console.log(storeDataResult);

      if (storeDataResult.status === 'error') {
        return res.status(500).json({
          status: 'error',
          message:
            'Error unpublishing page: ' +
            JSON.stringify(storeDataResult.message),
          data: JSON.stringify(storeDataResult),
        });
      }

      resultData = storeDataResult.data;
    }

    let responseData = {
      status: 'success',
      documentType: documentType,
      data: resultData,
    };

    console.log('unpublish responding with:', responseData);

    res.status(200).json(responseData);
  }
}
