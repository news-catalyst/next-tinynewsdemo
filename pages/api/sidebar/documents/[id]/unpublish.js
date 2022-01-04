import { hasuraLookupGoogleDoc } from '../../../../../lib/articles';
import { saveArticle, savePage } from '../../../../../lib/document';

export default async function Handler(req, res) {
  const apiUrl = process.env.HASURA_API_URL;
  const apiToken = process.env.ORG_SLUG;

  // Check the API token
  if (req.query.token !== process.env.API_TOKEN || !req.query.id) {
    return res.status(401).json({ message: 'Invalid API token' });
  }

  let documentId = req.query.id;
  let documentType = req.query.documentType;

  let bodyData = req.body;

  let articleData = bodyData['articleData'];
  let pageData = bodyData['pageData'];

  const { errors, data } = await hasuraLookupGoogleDoc({
    url: apiUrl,
    orgSlug: apiToken,
    documentId: documentId,
  });
  if (errors || !data || !data.google_documents) {
    console.error(errors);
    return res.status(500).json({
      status: 'error',
      message:
        'Error looking up data by Google Doc ID: ' + JSON.stringify(errors),
      data: errors,
    });
  } else {
    // console.log(data);

    let resultData;

    if (documentType === 'article') {
      articleData['published'] = false;
      console.log(
        documentType,
        documentID,
        'incoming article data keys:',
        Object.keys(articleData).sort()
      );
      let storeDataResult = await saveArticle({
        data: articleData,
        url: apiUrl,
        orgSlug: apiToken,
      });

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

      resultData = storeDataResult.data[0];
      console.log(resultData);
      slug = resultData.slug;
      categorySlug = resultData.category.slug;
      articleID = resultData.id;
    } else if (documentType === 'page') {
      pageData['published'] = false;
      console.log(
        documentType,
        documentID,
        'incoming page data keys:',
        Object.keys(pageData).sort()
      );

      let storeDataResult = await savePage({
        data: pageData,
        url: apiUrl,
        orgSlug: apiToken,
      });

      if (storeDataResult.status === 'error') {
        return res.status(500).json({
          status: 'error',
          message:
            'Error unpublishing page: ' +
            JSON.stringify(storeDataResult.message),
          data: JSON.stringify(storeDataResult),
        });
      }

      resultData = storeDataResult.data[0];
      slug = resultData.slug;
    }

    res.status(200).json({
      status: 'success',
      documentType: documentType,
      data: resultData,
    });
  }
}
