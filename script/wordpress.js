require('dotenv').config({ path: '.env.local' });
const fetch = require('node-fetch');
const path = require('path');
const fs = require('fs');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;
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

    // By default, WordPress only allows one author per post.
    let articleAuthor = article.author_articles[0];
    let articleAuthorName = '';
    if (articleAuthor) {
      articleAuthorName =
        articleAuthor.author.first_names + ' ' + articleAuthor.author.last_name;
      // console.log('author: ' + authorName);
      importer.addUser({
        username: articleAuthor.author.slug,
        email: articleAuthor.author.email,
        display_name: articleAuthorName,
        first_name: articleAuthor.author.first_names,
        last_name: articleAuthor.author.last_name,
      });
    }
    let articleUrl = `/articles/${article.category.slug}/${article.slug}`;
    let apiArticleUrl = `http://localhost:3000/api${articleUrl}?secret=${process.env.PREVIEW_TOKEN}`;

    console.log(' - retrieving article content...');
    const articleResult = await fetch(apiArticleUrl);
    const data = await articleResult.json();

    // console.log('data.content:', data.content);
    articleContent = data.content;

    if (articleTranslation) {
      let images = [];
      let mainImage;
      let mainImageId;
      articleTranslation.content.map((node) => {
        if (
          node.type === 'mainImage' &&
          node.children &&
          node.children.length === 1
        ) {
          // console.log('found mainImage:', node.children[0]);
          mainImage = node.children[0];
          mainImageId = article.id + 100;
        }
        if (
          node.type === 'image' &&
          node.children &&
          node.children.length === 1
        ) {
          // console.log('found image:', node.children[0]);
          images.push(node.children[0]);
        }
      });

      console.log(
        '\t\t* done! including article as post: ' + articleTranslation.headline
      );

      if (mainImage) {
        let description = 'article main image';
        if (mainImage.imageAlt) {
          description = mainImage.imageAlt;
        }
        // console.log(
        //   `Post ID#${article.id}`,
        //   `adding attachment for mainImage ID#${mainImageId}`,
        //   mainImage
        // );
        importer.addAttachment({
          id: mainImageId,
          url: mainImage.imageUrl,
          date: articleTranslation.first_published_at,
          author: articleAuthorName,
          description: description,
          title: mainImage.imageId,
          post_id: article.id,
        });
      }
      importer.addPost({
        id: article.id,
        title: articleTranslation.headline,
        url: articleUrl,
        slug: article.slug,
        date: articleTranslation.first_published_at,
        author: articleAuthorName,
        content: articleContent,
        summary: articleTranslation.search_description,
        comment_status: 'open',
        ping_status: 'closed',
        categories: articleCategories,
        tags: articleTags,
        image: mainImageId,
      });

      if (images) {
        images.map((image) => {
          let description = 'article image';
          if (image.imageAlt) {
            description = image.imageAlt;
          }
          // console.log(
          //   `Post ID#${article.id}`,
          //   'adding attachment for image:',
          //   image
          // );
          importer.addAttachment({
            url: image.imageUrl,
            description: description,
            title: image.imageId,
            date: articleTranslation.first_published_at,
            author: articleAuthorName,
            post_id: article.id,
          });
        });
      }
    }
  }
}

function writeWXR(locale, data) {
  const wxrFile = path.join(
    process.cwd(),
    `wordpress-export-wxr-${locale}.xml`
  );

  fs.writeFileSync(wxrFile, data, { flag: 'w' }, (err) => {
    console.log('! Error, failed to write WXR file:', err);
  });
  console.log(`Done. Saved WXR file as ${wxrFile}`);

  console.log();
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

    console.log(
      'Generating WordPress export file (WXR) for locale ' + localeCode + '... '
    );

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

    // console.log(wxrContent);
    writeWXR(localeCode, wxrContent);
  }
}

async function main() {
  importSite();
}

main().catch((error) => console.error(error));
