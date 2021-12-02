require('dotenv').config({ path: '.env.local' });
const fetch = require('node-fetch');
const path = require('path');
const fs = require('fs');
const Importer = require('wxr-generator');
const shared = require('./shared');

const apiUrl = process.env.HASURA_API_URL;
const apiToken = process.env.ORG_SLUG;

async function processArticles(importer, localeCode, articles) {
  for (const article of articles) {
    let articleTranslation = article.article_translations.find(
      (t) => t.locale_code === localeCode
    );

    if (!articleTranslation) {
      console.error(
        ' ! ' +
          article.slug +
          ' failed finding translation in ' +
          localeCode +
          ', skipping'
      );
      continue;
    }
    let articleContent;

    let articleCategoryTranslation = article.category.category_translations.find(
      (c) => c.locale_code === localeCode
    );

    let articleCategories = [
      {
        slug: article.category.slug,
        name: articleCategoryTranslation.title,
      },
    ];
    let articleTags = [];
    if (article.tag_articles) {
      article.tag_articles.forEach((tagArticle) => {
        let tagTranslation = tagArticle.tag.tag_translations.find(
          (t) => t.locale_code === localeCode
        );
        // console.log('tag: ' + tagTranslation.title);
        if (tagTranslation) {
          articleTags.push({
            slug: tagArticle.tag.slug,
            name: tagTranslation.title,
          });
        }
      });
    }

    let articleAuthors = [];
    article.author_articles.forEach((authorArticle) => {
      let authorName =
        authorArticle.author.first_names + ' ' + authorArticle.author.last_name;
      // console.log('author: ' + authorName);
      importer.addUser({
        username: authorArticle.author.slug,
        display_name: authorName,
        first_name: authorArticle.author.first_names,
        last_name: authorArticle.author.last_name,
      });
      articleAuthors.push(authorName);
    });
    let articleUrl = `/articles/${article.category.slug}/${article.slug}`;
    let apiArticleUrl = `http://localhost:3000/api${articleUrl}?secret=${process.env.PREVIEW_TOKEN}`;

    console.log(' - retrieving article content from: ' + apiArticleUrl);
    const articleResult = await fetch(apiArticleUrl);
    const data = await articleResult.json();

    // console.log('data.content:', data.content);
    articleContent = data.content;

    if (articleTranslation) {
      console.log(
        ' - including article as post: ' + articleTranslation.headline
      );
      importer.addPost({
        id: article.id,
        title: articleTranslation.headline,
        url: articleUrl,
        slug: article.slug,
        date: articleTranslation.first_published_at,
        author: articleAuthors.join(', '),
        content: articleContent,
        summary: articleTranslation.search_description,
        comment_status: 'open',
        ping_status: 'closed',
        categories: articleCategories,
        tags: articleTags,
      });
    }
  }
}

function writeWXR(locale, data) {
  const wxrFile = path.join(
    process.cwd(),
    `wordpress-export-wxr-${locale}.xml`
  );

  fs.writeFileSync(wxrFile, data, { flag: 'w' }, (err) => {
    console.log('! failed to write WXR file:', err);
  });
  console.log(`* saved WXR as ${wxrFile}...`);
}

async function importSite() {
  let result = await shared.hasuraGetSiteData({
    url: apiUrl,
    orgSlug: apiToken,
  });

  if (result.errors) {
    console.error('Error getting site data:', result.errors);
    return;
  }
  let articles = result.data.articles;
  let categories = result.data.categories;
  let orgLocales = result.data.organization_locales;
  let siteMetadatas = result.data.site_metadatas;

  for (const orgLocale of orgLocales) {
    let localeCode = orgLocale.locale.code;

    let metadata = siteMetadatas[0].site_metadata_translations.find(
      (t) => t.locale_code === localeCode
    );

    if (!metadata) {
      console.error('Failed finding site metadata for locale ' + localeCode);
      return;
    }

    console.log('Generating wordpress WXR file for locale ' + localeCode);

    var importer = new Importer({
      name: metadata.data.shortName,
      url: metadata.data.siteUrl,
      description: metadata.data.aboutDek,
      language: localeCode,
    });

    categories.forEach((cat) => {
      let categoryTranslation = cat.category_translations.find(
        (t) => t.locale_code === localeCode
      );
      if (categoryTranslation) {
        console.log(
          ' - including site section:',
          cat.slug,
          categoryTranslation.title
        );
        importer.addCategory({
          slug: cat.slug,
          name: categoryTranslation.title,
        });
      }
    });

    await processArticles(importer, localeCode, articles);

    let wxrContent = importer.stringify();
    console.log();
    // console.log(wxrContent);
    writeWXR(localeCode, wxrContent);
  }
}

async function main() {
  importSite();
}

main().catch((error) => console.error(error));
