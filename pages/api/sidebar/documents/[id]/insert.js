import { getOrgSettings } from '../../../../../lib/articles';
import {
  hasuraInsertArticleGoogleDoc,
  hasuraInsertPageGoogleDoc,
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
    console.error('DocAPI insert Settings error:', settingsResult.errors);
    throw settingsResult.errors;
  }

  const settings = settingsResult.data.settings;
  const apiToken = findSetting(settings, 'API_TOKEN');

  // Check the API token
  if (req.query.token !== apiToken || !req.query.id) {
    return res.status(401).json({ message: 'Invalid API token' });
  }

  let documentId = req.query.id;
  let documentType = req.query.documentType;

  let bodyData = req.body;
  let resultData;

  console.log('bodyData:', bodyData);
  let localeCode = bodyData['locale_code'];
  let pageId = bodyData['page_id'];
  let articleId = bodyData['article_id'];
  let documentUrl = bodyData['document_url'];

  if (documentType === 'article') {
    let insertDocResult = await hasuraInsertArticleGoogleDoc({
      url: apiUrl,
      site: site,
      article_id: articleId,
      document_id: documentId,
      document_url: documentUrl,
      locale_code: localeCode,
    });

    if (insertDocResult.status === 'error') {
      console.error(JSON.stringify(insertDocResult));
      return res.status(500).json({
        status: 'error',
        message:
          'Error creating record for google doc: ' +
          JSON.stringify(insertDocResult.message),
        data: JSON.stringify(insertDocResult),
      });
    }

    resultData = insertDocResult.data;
  } else {
    console.log('insert google doc for page ID', pageId);
    let insertDocResult = await hasuraInsertPageGoogleDoc({
      url: apiUrl,
      site: site,
      page_id: pageId,
      document_id: documentId,
      document_url: documentUrl,
      locale_code: localeCode,
    });

    console.log('result:', insertDocResult);
    if (insertDocResult.status === 'error') {
      console.error(JSON.stringify(insertDocResult));
      return res.status(500).json({
        status: 'error',
        message:
          'Error creating record for google doc: ' +
          JSON.stringify(insertDocResult.message),
        data: JSON.stringify(insertDocResult),
      });
    }

    resultData = insertDocResult.data;
  }

  res.status(200).json({
    status: 'success',
    documentType: documentType,
    documentId: documentId,
    data: resultData,
  });
}
