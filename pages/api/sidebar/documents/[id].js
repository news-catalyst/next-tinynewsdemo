import {
  getOrgSettings,
  hasuraLookupGoogleDoc,
  hasuraGetGoogleDocsForArticle,
  hasuraGetGoogleDocsForPage,
} from '../../../../lib/articles';
import { findSetting } from '../../../../lib/utils.js';

export default async function Handler(req, res) {
  const apiUrl = process.env.HASURA_API_URL;
  const site = req.query.site;

  const settingsResult = await getOrgSettings({
    url: apiUrl,
    site: site,
  });

  if (settingsResult.errors) {
    console.error('DocAPI id Settings error:', settingsResult.errors);
    throw settingsResult.errors;
  }

  const settings = settingsResult.data.settings;
  const apiToken = findSetting(settings, 'API_TOKEN');
  const siteUrl = findSetting(settings, 'NEXT_PUBLIC_SITE_URL');

  let returnData = {
    documentType: '',
    authors: [],
    categories: [],
    organization_locales: [],
    tags: [],
  };

  // Check the API token
  if (req.query.token !== apiToken || !req.query.id) {
    console.error(
      `Supplied token '${req.query.token}' doesn't match '${apiToken}'`
    );
    return res.status(401).json({ message: 'Invalid API token' });
  }

  let documentId = req.query.id;
  let documentType = req.query.documentType;

  // Find the article or page
  const { errors, data } = await hasuraLookupGoogleDoc({
    url: apiUrl,
    site: site,
    documentId: documentId,
  });

  if (errors || !data || !data.google_documents) {
    console.error(errors);
    return res
      .status(500)
      .json({ message: 'Error: ' + JSON.stringify(errors) });
  } else {
    // console.log('data:', data);

    let googleDoc = data.google_documents[0];

    returnData.authors = data.authors;
    returnData.categories = data.categories;
    returnData.organization_locales = data.organization_locales;
    returnData.tags = data.tags;
    returnData.homepage_layout_datas = data.homepage_layout_datas;
    returnData.editorUrl = new URL('/tinycms/homepage', siteUrl).toString();
    returnData.documentType = documentType;

    // article
    if (googleDoc && googleDoc.article_google_documents.length > 0) {
      returnData.documentType = 'article';
      let article = googleDoc.article_google_documents[0].article;
      returnData.article = article;
      let articleGoogleDoc =
        googleDoc.article_google_documents[0].google_document;

      const articleResult = await hasuraGetGoogleDocsForArticle({
        url: apiUrl,
        site: site,
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
    } else if (googleDoc && googleDoc.page_google_documents.length > 0) {
      returnData.documentType = 'page';
      let page = googleDoc.page_google_documents[0].page;
      returnData.page = page;

      const pageResult = await hasuraGetGoogleDocsForPage({
        url: apiUrl,
        site: site,
        pageId: page.id,
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
      returnData.documentType = null;
    }
  }

  // console.log('RETURNING:', returnData);
  res.status(200).json(returnData);
}
