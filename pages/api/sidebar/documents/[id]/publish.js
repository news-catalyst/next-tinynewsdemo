import {
  getOrgSettings,
  hasuraLookupGoogleDoc,
} from '../../../../../lib/articles';
import {
  processDocumentContents,
  saveArticle,
  savePage,
  storeArticleIdAndSlug,
  storePageIdAndSlug,
  upsertPublishedArticle,
} from '../../../../../lib/document';
import { findSetting } from '../../../../../lib/utils.js';

export default async function Handler(req, res) {
  const apiUrl = process.env.HASURA_API_URL;
  const site = req.query.site;

  const settingsResult = await getOrgSettings({
    url: apiUrl,
    site: site,
  });

  if (settingsResult.errors) {
    console.error('DocAPI publish settings error:', settingsResult.errors);
    throw settingsResult.errors;
  }

  const settings = settingsResult.data.settings;
  const apiToken = findSetting(settings, 'API_TOKEN');
  const siteUrl = findSetting(settings, 'NEXT_PUBLIC_SITE_URL');

  // Check the API token
  if (req.query.token !== apiToken || !req.query.id) {
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

  const { errors, data } = await hasuraLookupGoogleDoc({
    url: apiUrl,
    site: site,
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

    // console.log('processedData:', Object.keys(processedData).sort());

    let publishUrl;
    let resultData;
    let categorySlug;
    let articleID;
    let idSlugResult;

    if (documentType === 'article') {
      articleData['content'] = processedData['formattedElements'];
      articleData['main_image'] = processedData['mainImage'];

      let storeDataResult = await saveArticle({
        data: articleData,
        url: apiUrl,
        site: site,
      });

      if (storeDataResult.status === 'error') {
        console.error(JSON.stringify(storeDataResult));
        return res.status(500).json({
          status: 'error',
          message:
            'Error saving article: ' + JSON.stringify(storeDataResult.message),
          data: JSON.stringify(storeDataResult),
        });
      }

      resultData = storeDataResult.data[0];
      slug = resultData.slug;
      categorySlug = resultData.category.slug;
      articleID = resultData.id;
      let translationID = resultData.article_translations[0].id;

      // store slug + article ID in slug versions table
      idSlugResult = await storeArticleIdAndSlug({
        url: apiUrl,
        site: site,
        article_id: articleID,
        slug: slug,
        category_slug: categorySlug,
      });
      // console.log('stored article id + slug + categorySlug: ', idSlugResult);
      if (idSlugResult.status === 'error') {
        console.error(JSON.stringify(idSlugResult));
        return res.status(500).json({
          status: 'error',
          message:
            'Error storing article slug version: ' +
            JSON.stringify(idSlugResult.message),
          data: JSON.stringify(idSlugResult),
        });
      }
      var publishedArticleData = await upsertPublishedArticle({
        url: apiUrl,
        site: site,
        article_id: articleID,
        article_translation_id: translationID,
        locale_code: localeCode,
      });
      if (publishedArticleData) {
        // console.log('Published Article Data:', publishedArticleData);
        if (publishedArticleData.status === 'error') {
          console.error(
            'Error saving published article translation: ' +
              JSON.stringify(publishedArticleData)
          );
          return res.status(500).json({
            status: 'error',
            message:
              'Error storing published article data: ' +
              JSON.stringify(publishedArticleData.message),
            data: JSON.stringify(publishedArticleData),
          });
        } else {
          resultData.published_article_translations =
            publishedArticleData.data.insert_published_article_translations.returning;
        }
      }

      //construct the published article url
      var path = localeCode + '/articles/' + categorySlug + '/' + slug;
      publishUrl = new URL(path, siteUrl).toString();
      // console.log(publishUrl);
    } else if (documentType === 'page') {
      pageData['content'] = processedData['formattedElements'];

      let storeDataResult = await savePage({
        data: pageData,
        url: apiUrl,
        site: site,
      });

      // console.log('storeDataResult keys:', Object.keys(storeDataResult));
      // console.log('storeDataResult:', JSON.stringify(storeDataResult));

      if (storeDataResult.status === 'error') {
        return res.status(500).json({
          status: 'error',
          message: 'Error: ' + JSON.stringify(storeDataResult.message),
          data: JSON.stringify(storeDataResult),
        });
      }

      resultData = storeDataResult.data[0];
      slug = resultData.slug;
      let pageID = resultData.id;

      // // store slug + page ID in slug versions table
      idSlugResult = await storePageIdAndSlug({
        url: apiUrl,
        site: site,
        page_id: pageID,
        slug: slug,
      });

      if (idSlugResult.status === 'error') {
        console.error(JSON.stringify(idSlugResult));
        return res.status(500).json({
          status: 'error',
          message:
            'Error storing page slug version: ' +
            JSON.stringify(idSlugResult.message),
          data: JSON.stringify(idSlugResult),
        });
      }

      // construct published page url
      let path = `/${localeCode}`;
      if (slug !== 'about' && slug !== 'donate' && slug !== 'thank-you') {
        // these 3 pages have their own special routes
        path += '/static/' + slug;
      } else {
        path += '/' + slug;
      }
      publishUrl = new URL(path, siteUrl).toString();

      // console.log(publishUrl);
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
