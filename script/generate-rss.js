const fs = require("fs");
const RSS = require("rss");
const shared = require("./shared");

require('dotenv').config({ path: '.env.local' })

const apiUrl = process.env.HASURA_API_URL;
const apiToken = process.env.ORG_SLUG;

const HASURA_GET_ARTICLES_RSS = `query MyQuery($locale_code: String!) {
  articles(limit: 10, order_by: {created_at: desc}, where: {article_translations: {locale_code: {_eq: $locale_code}}}) {
    slug
    article_translations(where: {locale_code: {_eq: $locale_code}, published: {_eq: true}}) {
      content
      custom_byline
      first_published_at
      headline
      last_published_at
      published
      search_description
      updated_at
    }
    author_articles {
      author {
        name
        photoUrl
        slug
        twitter
        author_translations(where: {locale_code: {_eq: $locale_code}}) {
          bio
          title
        }
      }
    }
    category {
      slug
      category_translations(where: {locale_code: {_eq: $locale_code}}) {
        title
      }
    }
  }
}`;

function hasuraGetArticlesRss(params) {
  return shared.fetchGraphQL({
    url: apiUrl,
    orgSlug: apiToken,
    query: HASURA_GET_ARTICLES_RSS,
    name: 'MyQuery',
    variables: {
      locale_code: params['localeCode'],
    },
  });
}

function getPubDate(article) {
  if (article && article.article_translations && article.article_translations[0] && article.article_translations[0].first_published_at) {
    let dateString = article.article_translations[0].first_published_at;
    return Date.parse(dateString);
  } else {
    return null;
  }
}

function dateSortDesc(a, b) {
  let aDate = getPubDate(a);
  let bDate = getPubDate(b);
  if (aDate > bDate) return -1;
  if (aDate < bDate) return 1;
  return 0;
}

function generate(locale) {
  const apiUrl = process.env.HASURA_API_URL;
  const apiToken = process.env.ORG_SLUG;

  let feed = new RSS({
    title: `${process.env.ORG_NAME} RSS Feed`,
    site_url: process.env.SITE_URL,
    feed_url: `${process.env.SITE_URL}/feed.xml`,
  });

  hasuraGetArticlesRss({
    url: apiUrl,
    orgSlug: apiToken,
    localeCode: locale,
  })
  .then((result) => {
    let articles = [];
    if (result.errors || !result.data) {
      console.error(
        'error getting stream articles:',
        result
      );
    } else {
      articles = result.data.articles;
    }

    articles.sort(dateSortDesc).map((article) => {
      if (!article.article_translations || !article.article_translations[0]) {
        return;
      }
      const articleHref = `${process.env.SITE_URL}/articles/${article.category.slug}/${article.slug}`
      const headline = article.article_translations[0].headline;
      const searchDescription = article.article_translations[0].search_description;
      let pubDate = getPubDate(article);

      if (!article.article_translations) {
        return;
      }

      let articleTranslation = article.article_translations[0];
      let authors;
      if (
        articleTranslation &&
        articleTranslation.custom_byline
      ) {
        authors = articleTranslation.custom_byline;
      }

      if (article.author_articles) {
        var authorList = [];
        article.author_articles.forEach(function (authorArticle, i) {
          authorList.push(authorArticle.author.name);
        });
        authors = authorList.join(', ');
      }

      let mainImageNode;
      let mainImage = null;
      let localisedContent = articleTranslation.content;
      if (
        localisedContent !== undefined &&
        localisedContent !== null &&
        typeof localisedContent !== 'string'
      ) {
        try {
          mainImageNode = localisedContent.find(
            (node) => node.type === 'mainImage'
          );
    
          if (mainImageNode) {
            mainImage = mainImageNode.children[0];
          }
        } catch (err) {
          console.log('error finding main image: ', err);
        }
      }

      let feedOptions = {
        title: headline,
        guid: articleHref,
        url: articleHref,
        date: pubDate,
        description: searchDescription,
        author: authors,
      }
      if (mainImageNode) {
        feedOptions["enclosure"] = { 'url'  : mainImage.imageUrl }
      }
      feed.item(feedOptions);
    })

    const rss = feed.xml({ indent: true });
    fs.writeFileSync("./public/feed.xml", rss);

  })
  .catch(console.error);
}

generate('en-US');
