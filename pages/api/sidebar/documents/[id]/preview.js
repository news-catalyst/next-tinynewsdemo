import { hasuraLookupGoogleDoc } from '../../../../../lib/articles';
import {
  processDocumentContents,
  saveArticle,
  savePage,
  storeArticleIdAndSlug,
  storePageIdAndSlug,
} from '../../../../../lib/document';

export default async function Handler(req, res) {
  const apiUrl = process.env.HASURA_API_URL;
  const site = req.query.site;

  const settingsResult = await getOrgSettings({
    url: apiUrl,
    site: site,
  });

  if (settingsResult.errors) {
    console.error('Settings error:', settingsResult.errors);
    throw settingsResult.errors;
  }

  const settings = settingsResult.data.settings;
  const apiToken = findSetting(settings, 'API_TOKEN');
  const apiToken = findSetting(settings, 'API_TOKEN');
  const previewToken = findSetting(settings, 'PREVIEW_TOKEN');
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
      stauts: 'error',
      message:
        'Error looking up data by Google Doc ID: ' + JSON.stringify(errors),
      data: errors,
    });
  } else {
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

    let idSlugResult;
    let articleID;
    let pageID;
    let previewUrl;
    let resultData;
    let categorySlug;

    if (documentType === 'article') {
      articleData['content'] = processedData['formattedElements'];
      articleData['main_image'] = processedData['mainImage'];

      let storeDataResult = await saveArticle({
        data: articleData,
        url: apiUrl,
        site: site,
      });

      if (storeDataResult.status === 'error') {
        return res.status(500).json({
          status: 'error',
          message: 'Error: ' + JSON.stringify(storeDataResult.message),
          data: JSON.stringify(storeDataResult),
        });
      }

      resultData = storeDataResult.data[0];
      slug = resultData.slug;
      articleID = resultData.id;
      categorySlug = resultData.category.slug;

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
      //construct preview url
      previewUrl = new URL(
        `/api/preview?secret=${previewToken}&slug=${slug}&locale=${localeCode}`,
        siteUrl
      ).toString();

      // console.log(previewUrl);
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

      pageID = resultData.id;

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

      //construct preview url
      previewUrl = new URL(
        `/api/preview-static?secret=${process.env.PREVIEW_TOKEN}&slug=${slug}&locale=${localeCode}`,
        siteUrl
      ).toString();

      // console.log(previewUrl);
    }

    let responseData = {
      // s3Url: s3Url,
      status: 'success',
      documentType: documentType,
      googleToken: googleToken,
      previewUrl: previewUrl,
      data: resultData,
      body: processedData['formattedElements'],
      mainImage: processedData['mainImage'],
      updatedImageList: processedData['updatedImageList'],
    };

    res.status(200).json(responseData);
  }
}
