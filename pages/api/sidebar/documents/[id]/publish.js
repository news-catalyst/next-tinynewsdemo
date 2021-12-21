import { hasuraLookupGoogleDoc } from '../../../../../lib/articles';
import {
  processDocumentContents,
  saveArticle,
  savePage,
} from '../../../../../lib/document';

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

  // let imageID = req.query.imageId;
  let googleToken = bodyData['googleAuthToken'];
  let rawBodyData = bodyData['contents'];
  let listItems = bodyData['listInfo'];
  let imageList = bodyData['imageList'];
  let inlineObjects = bodyData['inlineObjects'];
  let slug = bodyData['slug'];
  let articleData = bodyData['articleData'];
  let pageData = bodyData['pageData'];

  if (articleData) {
    console.log(
      documentType,
      articleData['id'],
      'incoming article data keys:',
      Object.keys(articleData).sort()
    );
  }
  if (pageData) {
    console.log(
      documentType,
      pageData['id'],
      'incoming page data keys:',
      Object.keys(pageData).sort()
    );
  }

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
    console.log(data);

    let localeCode = 'en-US'; // default up front, override if existing article
    if (
      data.google_documents[0] &&
      data.google_documents[0].article_google_documents &&
      data.google_documents[0].article_google_documents[0]
    ) {
      localeCode =
        data.google_documents[0].article_google_documents[0].google_document
          .locale_code;
    }
    if (
      data.google_documents[0] &&
      data.google_documents[0].page_google_documents &&
      data.google_documents[0].page_google_documents[0]
    ) {
      localeCode =
        data.google_documents[0].page_google_documents[0].google_document
          .locale_code;
    }

    let processedData = await processDocumentContents(
      rawBodyData,
      listItems,
      inlineObjects,
      imageList,
      slug,
      googleToken
    );

    console.log('processedData:', Object.keys(processedData).sort());

    let publishUrl;
    let resultData;
    let categorySlug;

    if (documentType === 'article') {
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

      resultData = storeDataResult.data[0];
      slug = resultData.slug;
      categorySlug = resultData.category.slug;

      //construct the published article url
      var path = localeCode + '/articles/' + categorySlug + '/' + slug;
      publishUrl = new URL(path, process.env.NEXT_PUBLIC_SITE_URL).toString();
      console.log(publishUrl);

      // var articleID = data.id;
      // var categorySlug = data.category.slug;

      // if (articleID) {
      //   // store slug + article ID in slug versions table
      //   var result = await storeArticleIdAndSlug(articleID, slug, categorySlug);
      //   Logger.log("stored article id + slug: " + JSON.stringify(result));

      //   var publishedArticleData = await upsertPublishedArticle(articleID, translationID, formObject['article-locale'])
      //   if (publishedArticleData) {
      //     // Logger.log("Published Article Data:" + JSON.stringify(publishedArticleData));

      //     data.data.insert_articles.returning[0].published_article_translations = publishedArticleData.data.insert_published_article_translations.returning;
      //   }
      // }
    } else if (documentType === 'page') {
      pageData['content'] = processedData['formattedElements'];

      let storeDataResult = await savePage({
        data: pageData,
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

      resultData = storeDataResult.data[0];
      slug = resultData.slug;
      //construct published page url

      let path = `/${localeCode}`;
      if (slug !== 'about' && slug !== 'donate' && slug !== 'thank-you') {
        // these 3 pages have their own special routes
        path += '/static/' + slug;
      } else {
        path += '/' + slug;
      }
      publishUrl = new URL(path, process.env.NEXT_PUBLIC_SITE_URL).toString();

      console.log(publishUrl);
    }

    res.status(200).json({
      // s3Url: s3Url,
      status: 'success',
      documentType: documentType,
      googleToken: googleToken,
      publishUrl: publishUrl,
      data: resultData,
      body: processedData['formattedElements'],
      mainImage: processedData['mainImage'],
      updatedImageList: processedData['updatedImageList'],
    });
  }
}
