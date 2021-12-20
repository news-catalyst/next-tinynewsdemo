import { hasuraLookupGoogleDoc } from '../../../../../lib/articles';
import {
  processDocumentContents,
  saveArticle,
} from '../../../../../lib/document';

export default async function Handler(req, res) {
  const apiUrl = process.env.HASURA_API_URL;
  const apiToken = process.env.ORG_SLUG;

  // Check the API token
  if (req.query.token !== process.env.API_TOKEN || !req.query.id) {
    return res.status(401).json({ message: 'Invalid API token' });
  }

  let documentId = req.query.id;
  let bodyData = req.body;

  // let imageID = req.query.imageId;
  let googleToken = bodyData['googleAuthToken'];
  let rawBodyData = bodyData['contents'];
  let listItems = bodyData['listInfo'];
  let imageList = bodyData['imageList'];
  let inlineObjects = bodyData['inlineObjects'];
  let slug = bodyData['slug'];
  let articleData = bodyData['articleData'];

  const { errors, data } = await hasuraLookupGoogleDoc({
    url: apiUrl,
    orgSlug: apiToken,
    documentId: documentId,
  });
  if (errors || !data || !data.google_documents) {
    console.error(errors);
    return res.status(500).json({
      stauts: 'error',
      message:
        'Error looking up data by Google Doc ID: ' + JSON.stringify(errors),
      data: errors,
    });
  } else {
    let googleDoc = data.google_documents[0];
    let articleSlug = googleDoc.article_google_documents[0].article.slug;
    let articleGoogleDoc =
      googleDoc.article_google_documents[0].google_document;
    let localeCode = articleGoogleDoc.locale_code;

    let processedData = await processDocumentContents(
      rawBodyData,
      listItems,
      inlineObjects,
      imageList,
      slug,
      googleToken
    );

    console.log('processedData:', Object.keys(processedData).sort());
    articleData['content'] = processedData['formattedElements'];
    articleData['main_image'] = processedData['mainImage'];

    let storeDataResult = await saveArticle({
      data: articleData,
      url: apiUrl,
      orgSlug: apiToken,
    });
    console.log('storeDataResult keys:', Object.keys(storeDataResult));
    console.log('storeDataResult:', JSON.stringify(storeDataResult));

    if (storeDataResult.status === 'error') {
      return res.status(500).json({
        status: 'error',
        message: 'Error: ' + JSON.stringify(storeDataResult.message),
        data: JSON.stringify(storeDataResult),
      });
    }

    //construct preview url
    let previewUrl = new URL(
      `/api/preview?secret=${process.env.PREVIEW_TOKEN}&slug=${articleSlug}&locale=${localeCode}`,
      process.env.NEXT_PUBLIC_SITE_URL
    ).toString();

    console.log(previewUrl);

    res.status(200).json({
      // s3Url: s3Url,
      body: processedData['formattedElements'],
      mainImage: processedData['mainImage'],
      updatedImageList: processedData['updatedImageList'],
      googleToken: googleToken,
      previewUrl: previewUrl,
      status: 'success',
      data: storeDataResult.data,
    });
  }
}
