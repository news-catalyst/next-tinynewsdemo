import { GraphQLClient } from 'graphql-request';
import { localiseText } from './utils';

const CONTENT_DELIVERY_API_URL = process.env.CONTENT_DELIVERY_API_URL;
const CONTENT_DELIVERY_API_ACCESS_TOKEN =
  process.env.CONTENT_DELIVERY_API_ACCESS_TOKEN;

const LIST_ARTICLES = `
{
  articles {
  listArticles {
    data {
      id
      availableLocales
      headlineSearch
      firstPublishedOn
      lastPublishedOn
      slug
      headline {
        values {
          locale
          value
        }
      }
      content {
        values {
          locale
          value
        }
      }
      category {
        id
        title {
          values {
            locale
            value
          }
        }
        slug
      }
      tags {
        id
        title {
          values {
            locale
            value
          }
        }
        slug
      }
      authors {
        id
        name
        slug
      }
      authorSlugs
      twitterTitle {
        values {
          locale
          value
        }
      }
      twitterDescription {
        values {
          locale
          value
        }
      }
      facebookTitle {
        values {
          locale
          value
        }
      }
      facebookDescription {
        values {
          locale
          value
        }
      }
      searchTitle {
        values {
          locale
          value
        }
      }
      searchDescription {
        values {
          locale
          value
        }
      }
    }
  }
}
}`;

const LIST_ARTICLES_REVERSE_CHRON = `
{
  articles {
  listArticles(sort: {firstPublishedOn: -1}) {
    data {
      id
      availableLocales
      headlineSearch
      firstPublishedOn
      lastPublishedOn
      slug
      headline {
        values {
          locale
          value
        }
      }
      content {
        values {
          locale
          value
        }
      }
      category {
        id
        title {
          values {
            locale
            value
          }
        }
        slug
      }
      tags {
        id
        title{
          values {
            locale
            value
          }
        }
        slug
      }
      authors {
        id
        name
        slug
      }
      authorSlugs
    }
  }
}
  }`;

const LIST_ARTICLES_BY_SLUG = `
query SearchArticles($where: ArticleListWhere) {
  articles {
    listArticles(where: $where) {
      data {
        id
        headlineSearch
        firstPublishedOn
        lastPublishedOn
        slug
        headline {
          values {
            value
          }
        }
        content {
          values {
            value
          }
        }
        category {
          id
          title {
            values {
              value
            }
          }
          slug
        }
        tags {
          id
          title{
            values {
              value
            }
          }
          slug
        }
        authors {
          id
          name
        }
        authorSlugs
      }
    }
  }
}`;

const LIST_ARTICLES_BY_AUTHOR = `
query SearchArticles($where: ArticleListWhere) {
  articles {
    listArticles(where: $where) {
      data {
        id
        headlineSearch
        firstPublishedOn
        lastPublishedOn
        slug
        headline {
          values {
            value
          }
        }
        content {
          values {
            value
          }
        }
        category {
          id
          title {
            values {
              value
            }
          }
          slug
        }
        tags {
          id
          title{
            values {
              value
            }
          }
          slug
        }
        authors {
          id
          name
        }
        authorSlugs
      }
    }
  }
}`;

const LIST_IDS = `
{
  articles {
    listArticles {
      data {
        id
      }
    }
  }
}`;

const LIST_SLUGS = `
{
  articles {
    listArticles {
      data {
        category {
          slug
        }
        slug
      }
    }
  }
}`;

const LIST_SECTIONS = `
{
  categories {
    listCategories {
      data {
        id
        slug
        title {
          values {
            value
            locale
          }
        }
      }
    }
  }
}
`;

const LIST_AUTHORS = `
{
  authors {
    listAuthors {
      data {
        bio {
          values {
            value
          }
        }
        name
        title {
          values {
            value
          }
        }
        slug
      }
    }
  }
}`;

const LIST_TAGS = `{
  tags {
    listTags {
      data {
        id
        slug
        title {
          values {
            value
          }
        }
      }
    }
  }
}`;

const GET_AUTHOR_BY_SLUG = `query Author($slug: String) {
  authors {
    listAuthors(where: {slug: $slug}) {
      data {
        name
        slug
      }
    }
  }
}`;

const LIST_LOCALES = `
  query ListI18nLocales {
    i18n {
      listI18NLocales {
        data {
          id
          code
          default
        }
      }
    }
  }`;

export async function listAllLocales() {
  const webinyHeadlessCms = new GraphQLClient(CONTENT_DELIVERY_API_URL, {
    headers: {
      authorization: CONTENT_DELIVERY_API_ACCESS_TOKEN,
    },
  });

  const response = await webinyHeadlessCms.request(LIST_LOCALES);

  return response.i18n.listI18NLocales.data;
}

export async function listAllSections() {
  const webinyHeadlessCms = new GraphQLClient(CONTENT_DELIVERY_API_URL, {
    headers: {
      authorization: CONTENT_DELIVERY_API_ACCESS_TOKEN,
    },
  });

  const sectionsData = await webinyHeadlessCms.request(LIST_SECTIONS);

  return sectionsData.categories.listCategories.data;
}

export async function listAllSectionTitles() {
  const webinyHeadlessCms = new GraphQLClient(CONTENT_DELIVERY_API_URL, {
    headers: {
      authorization: CONTENT_DELIVERY_API_ACCESS_TOKEN,
    },
  });

  const sectionsData = await webinyHeadlessCms.request(LIST_SECTIONS);

  const sections = sectionsData.categories.listCategories.data.map(
    (section) => {
      return {
        params: {
          category: section.slug,
        },
      };
    }
  );
  return sections;
}

export async function listAllArticlesBySection(locale, section) {
  const webinyHeadlessCms = new GraphQLClient(CONTENT_DELIVERY_API_URL, {
    headers: {
      authorization: CONTENT_DELIVERY_API_ACCESS_TOKEN,
    },
  });

  const variables = {
    where: {
      availableLocales_contains: locale.code,
    },
  };
  const articlesData = await webinyHeadlessCms.request(
    LIST_ARTICLES,
    variables
  );
  let articlesBySection = [];
  articlesData.articles.listArticles.data.map((article) => {
    if (article.category.slug == section) {
      let articleContent;
      if (article.content && article.content.values) {
        articleContent = localiseText(locale, article.content);
      }
      try {
        article.content = JSON.parse(articleContent);
      } catch (e) {
        console.log(e);
        article.content = null;
      }
      // article.content = JSON.parse(article.content.values[0].value);
      articlesBySection.push(article);
    }
  });
  return articlesBySection;
}

export async function listAllAuthorPaths(locales) {
  const webinyHeadlessCms = new GraphQLClient(CONTENT_DELIVERY_API_URL, {
    headers: {
      authorization: CONTENT_DELIVERY_API_ACCESS_TOKEN,
    },
  });

  const authorData = await webinyHeadlessCms.request(LIST_AUTHORS);

  let slugs = [];
  for (const locale of locales) {
    authorData.authors.listAuthors.data.map((author) => {
      slugs.push({
        params: {
          slug: author.slug,
        },
        locale,
      });
    });
  }
  return slugs;
}

export async function listAllTagPaths(locales) {
  const webinyHeadlessCms = new GraphQLClient(CONTENT_DELIVERY_API_URL, {
    headers: {
      authorization: CONTENT_DELIVERY_API_ACCESS_TOKEN,
    },
  });

  const tagsData = await webinyHeadlessCms.request(LIST_TAGS);

  let slugs = [];
  for (const locale of locales) {
    tagsData.tags.listTags.data.map((tag) => {
      slugs.push({
        params: {
          slug: tag.slug,
        },
        locale,
      });
    });
  }
  return slugs;
}

export async function listAllTags() {
  const webinyHeadlessCms = new GraphQLClient(CONTENT_DELIVERY_API_URL, {
    headers: {
      authorization: CONTENT_DELIVERY_API_ACCESS_TOKEN,
    },
  });

  const tagsData = await webinyHeadlessCms.request(LIST_TAGS);

  const slugs = tagsData.tags.listTags.data.map((tag) => {
    return {
      title: tag.title,
      slug: tag.slug,
    };
  });
  const slugsSorted = slugs.sort(function (a, b) {
    let comparison = 0;
    if (a.title > b.title) {
      comparison = 1;
    } else if (a.title < b.title) {
      comparison = -1;
    }
    return comparison;
  });
  return slugsSorted;
}

export async function listAllArticles() {
  const webinyHeadlessCms = new GraphQLClient(CONTENT_DELIVERY_API_URL, {
    headers: {
      authorization: CONTENT_DELIVERY_API_ACCESS_TOKEN,
    },
  });

  const articlesData = await webinyHeadlessCms.request(LIST_ARTICLES);
  articlesData.articles.listArticles.data.map((article) => {
    article.content = JSON.parse(article.content.values[0].value);
  });
  return articlesData.articles.listArticles.data;
}

export async function listMostRecentArticles(locale) {
  const articlesData = await listArticlesInLocale(
    CONTENT_DELIVERY_API_URL,
    CONTENT_DELIVERY_API_ACCESS_TOKEN,
    locale.code
  );
  articlesData.map((article) => {
    let articleContent;
    if (article.content && article.content.values) {
      articleContent = localiseText(locale, article.content);
    }
    try {
      article.content = JSON.parse(articleContent);
    } catch (e) {
      console.log(e);
      article.content = null;
    }
  });
  return articlesData;
}

export async function listArticlesBySlug(slugs) {
  const webinyHeadlessCms = new GraphQLClient(CONTENT_DELIVERY_API_URL, {
    headers: {
      authorization: CONTENT_DELIVERY_API_ACCESS_TOKEN,
    },
  });

  const variables = {
    where: {
      slug_in: slugs,
    },
  };
  const articlesData = await webinyHeadlessCms.request(
    LIST_ARTICLES_BY_SLUG,
    variables
  );
  articlesData.articles.listArticles.data.map((article) => {
    try {
      article.content = JSON.parse(article.content.values[0].value);
    } catch (e) {
      console.log('error parsing json:', e);
    }
  });
  return articlesData.articles.listArticles.data;
}

export async function listAllArticlesByTag(locale, tag) {
  const webinyHeadlessCms = new GraphQLClient(CONTENT_DELIVERY_API_URL, {
    headers: {
      authorization: CONTENT_DELIVERY_API_ACCESS_TOKEN,
    },
  });

  const variables = {
    where: {
      availableLocales_contains: locale.code,
    },
  };
  const articlesData = await webinyHeadlessCms.request(
    LIST_ARTICLES,
    variables
  );
  let articlesByTag = [];
  articlesData.articles.listArticles.data.map((article) => {
    if (article.tags !== null && article.tags !== undefined) {
      for (var i = 0; i < article.tags.length; i++) {
        if (
          article.tags[i] &&
          article.tags[i] !== null &&
          article.tags[i].slug == tag
        ) {
          articlesByTag.push(article);
          break;
        }
      }
    }
  });

  articlesByTag.map((article) => {
    let articleContent;
    if (article.content && article.content.values) {
      articleContent = localiseText(locale, article.content);
    }
    try {
      article.content = JSON.parse(articleContent);
    } catch (e) {
      console.log(e);
      article.content = null;
    }
  });

  return articlesByTag;
}

export async function listAllArticlesByAuthor(locale, authorSlug) {
  const webinyHeadlessCms = new GraphQLClient(CONTENT_DELIVERY_API_URL, {
    headers: {
      authorization: CONTENT_DELIVERY_API_ACCESS_TOKEN,
    },
  });

  const variables = {
    where: {
      authorSlugs_contains: authorSlug,
      availableLocales_contains: locale.code,
    },
  };
  const articlesData = await webinyHeadlessCms.request(
    LIST_ARTICLES_BY_AUTHOR,
    variables
  );

  articlesData.articles.listArticles.data.map((article) => {
    let articleContent;
    if (article.content && article.content.values) {
      articleContent = localiseText(locale, article.content);
    }
    try {
      article.content = JSON.parse(articleContent);
    } catch (e) {
      console.log('error parsing json:', e);
    }
  });

  return articlesData.articles.listArticles.data;
}

export async function listAllArticleIds() {
  const webinyHeadlessCms = new GraphQLClient(CONTENT_DELIVERY_API_URL, {
    headers: {
      authorization: CONTENT_DELIVERY_API_ACCESS_TOKEN,
    },
  });

  const articlesData = await webinyHeadlessCms.request(LIST_IDS);
  const ids = articlesData.articles.listArticles.data.map((article) => {
    return {
      params: {
        id: article.id,
      },
    };
  });
  return ids;
}

export async function listAllArticleSlugs(locales) {
  const webinyHeadlessCms = new GraphQLClient(CONTENT_DELIVERY_API_URL, {
    headers: {
      authorization: CONTENT_DELIVERY_API_ACCESS_TOKEN,
    },
  });

  const articlesData = await webinyHeadlessCms.request(LIST_SLUGS);
  let slugs = [];
  for (const locale of locales) {
    articlesData.articles.listArticles.data.map((article) => {
      slugs.push({
        params: {
          category: article.category ? article.category.slug : null,
          slug: article.slug,
        },
        locale,
      });
    });
  }
  return slugs;
}

const GET_ARTICLE = `
query Article($id: ID!) {
  articles {
    getArticle(id: $id) {
      data {
        id
        headlineSearch
        firstPublishedOn
        lastPublishedOn
        slug
        headline {
          values {
            value
          }
        }
        content {
          values {
            value
          }
        }
        category {
          id
          title {
            values {
              value
            }
          }
          slug
        }
        tags {
          id
          title{
            values {
              value
            }
          }
          slug
        }
        authors {
          id
          name
        }
        authorSlugs
      }
    }
  }
  }`;

const GET_PAGE_BY_SLUG = `
query SearchPages($where: PageListWhere) {
  pages {
    listPages(where: $where) {
      data {
        id
        headline {
          values {
            value
          }
        }
        content {
          values {
            value
          }
        }
        twitterTitle {
          values {
            value
          }
        }
        twitterDescription {
          values {
            value
          }
        }
        facebookTitle {
          values {
            value
          }
        }
        facebookDescription {
          values {
            value
          }
        }
        searchTitle {
          values {
            value
          }
        }
        searchDescription {
          values {
            value
          }
        }
        slug
        published
      }
    }
  }
}`;

const GET_ARTICLE_BY_SLUG = `
query SearchArticles($where: ArticleListWhere) {
  articles {
    listArticles(where: $where) {
      data {
        id
        headlineSearch
        published
        availableLocales
        firstPublishedOn
        lastPublishedOn
        twitterTitle {
          values {
            locale
            value
          }
        }
        twitterDescription {
          values {
            locale
            value
          }
        }
        facebookTitle {
          values {
            locale
            value
          }
        }
        facebookDescription {
          values {
            locale
            value
          }
        }
        searchTitle {
          values {
            locale
            value
          }
        }
        searchDescription {
          values {
            locale
            value
          }
        }

        slug
        headline {
          values {
            locale
            value
          }
        }
        content {
          values {
            locale
            value
          }
        }
        category {
          id
          title {
            values {
              locale
              value
            }
          }
          slug
        }
        tags {
          id
          title {
            values {
              locale
              value
            }
          }
          slug
        }
        authors {
          id
          name
          slug
        }
        authorSlugs
      }
    }
  }
}`;

export async function getArticle(id) {
  const webinyHeadlessCms = new GraphQLClient(CONTENT_DELIVERY_API_URL, {
    headers: {
      authorization: CONTENT_DELIVERY_API_ACCESS_TOKEN,
    },
  });

  const articlesData = await webinyHeadlessCms.request(GET_ARTICLE, { id });

  articlesData.getBasicArticle.data.content = JSON.parse(
    articlesData.getBasicArticle.data.content
  );
  return articlesData.getBasicArticle.data;
}

export async function getMostRecentArticle(locale, slug, apiUrl) {
  if (apiUrl === undefined) {
    apiUrl = CONTENT_DELIVERY_API_URL;
  }
  const webinyHeadlessCms = new GraphQLClient(apiUrl, {
    headers: {
      authorization: CONTENT_DELIVERY_API_ACCESS_TOKEN,
    },
  });

  const articlesData = await webinyHeadlessCms.request(SEARCH_ARTICLES, {
    where: {
      availableLocales_contains: locale.code,
    },
  });
  let articleData;
  try {
    articleData = articlesData.articles.listArticles.data[0];
  } catch (e) {
    console.log('error grabbing first article:', e);
    return null;
  }
  let localisedContent;
  localisedContent = articleData.content.values.find(
    (item) => item.locale === locale.id
  );

  try {
    articleData.content = JSON.parse(localisedContent.value);
  } catch (e) {
    console.log(slug, 'failed parsing json:', e);
    articleData.content = JSON.parse(articleData.content.values[0].value); // for now fallback to the default locale; TODO revisit this
  }
  return articleData;
}

export async function getArticleBySlug(locale, slug, apiUrl) {
  if (apiUrl === undefined) {
    apiUrl = CONTENT_DELIVERY_API_URL;
  }
  const webinyHeadlessCms = new GraphQLClient(apiUrl, {
    headers: {
      authorization: CONTENT_DELIVERY_API_ACCESS_TOKEN,
    },
  });

  const articlesData = await webinyHeadlessCms.request(GET_ARTICLE_BY_SLUG, {
    where: {
      availableLocales_contains: locale.code,
      slug: slug,
    },
  });
  // console.log("articlesData:", articlesData.articles.listArticles.data[0].content.values);
  let articleData;
  let localisedContent;
  if (
    articlesData &&
    articlesData.articles &&
    articlesData.articles.listArticles &&
    articlesData.articles.listArticles.data &&
    articlesData.articles.listArticles.data[0]
  ) {
    articleData = articlesData.articles.listArticles.data[0];
    localisedContent = articleData.content.values.find(
      (item) => item.locale === locale.id
    );
  } else {
    return null;
  }

  try {
    articleData.content = JSON.parse(localisedContent.value);
  } catch (e) {
    articleData.content = JSON.parse(articleData.content.values[0].value); // for now fallback to the default locale; TODO revisit this
  }

  return articleData;
}

export async function getHomepageArticles(locale, hpData) {
  if (hpData === null) {
    return [];
  }
  let hpArticles = {};
  let hpArticleData = hpData.articles;

  // if for some reason the homepage layout data is blank, fall back to
  // the layout schema which at least has the structure defined
  // this is used in the tinynews homepage editor
  if (hpArticleData === undefined || hpArticleData === null) {
    let articleConfig = JSON.parse(hpData.layoutSchema.data);
    Object.entries(articleConfig).map(([key, value]) => {
      if (value === 'string') {
        hpArticles[key] = null;
      } else {
        hpArticles[key] = [];
      }
    });
  }
  if (hpArticleData !== undefined && hpArticleData !== null) {
    Object.entries(hpArticleData).map(([key, values]) => {
      if (typeof values === 'string') {
        let foundArticle;
        (async () => {
          foundArticle = await getArticleBySlug(locale, values);
          hpArticles[key] = foundArticle;
        })();
      } else {
        let foundArticles;
        (async () => {
          foundArticles = await listArticlesBySlug(values);
          hpArticles[key] = foundArticles;
        })();
      }
    });
  }

  return hpArticles;
}

const GET_TAG_BY_SLUG = `
query Tag($slug: String) {
  tags {
    listTags(where: {slug: $slug}) {
      data {
        title {
          values {
            value
          }
        }
        slug
      }
    }
  }
}`;

export async function getTagBySlug(slug, apiUrl) {
  if (apiUrl === undefined) {
    apiUrl = CONTENT_DELIVERY_API_URL;
  }
  const webinyHeadlessCms = new GraphQLClient(apiUrl, {
    headers: {
      authorization: CONTENT_DELIVERY_API_ACCESS_TOKEN,
    },
  });

  const tagsData = await webinyHeadlessCms.request(GET_TAG_BY_SLUG, {
    slug,
  });
  return tagsData.tags.listTags.data[0];
}

export async function getAuthorBySlug(slug, apiUrl) {
  if (apiUrl === undefined) {
    apiUrl = CONTENT_DELIVERY_API_URL;
  }
  const webinyHeadlessCms = new GraphQLClient(apiUrl, {
    headers: {
      authorization: CONTENT_DELIVERY_API_ACCESS_TOKEN,
    },
  });

  const authorData = await webinyHeadlessCms.request(GET_AUTHOR_BY_SLUG, {
    slug,
  });
  return authorData.authors.listAuthors.data[0];
}

//MOVE TO lib/static.js?
export async function getAboutPage() {
  const data = getPage('about');
  return data;
}

export async function getPage(slug) {
  const webinyHeadlessCms = new GraphQLClient(CONTENT_DELIVERY_API_URL, {
    headers: {
      authorization: CONTENT_DELIVERY_API_ACCESS_TOKEN,
    },
  });

  const data = await webinyHeadlessCms.request(GET_PAGE_BY_SLUG, {
    slug,
  });
  let pageData = data.pages.listPages.data[0];
  try {
    pageData.content = JSON.parse(pageData.content.values[0].value);
  } catch (e) {
    console.log(slug, 'failed parsing json:', e);
  }
  return pageData;
}

export async function listAuthors() {
  const webinyHeadlessCms = new GraphQLClient(CONTENT_DELIVERY_API_URL, {
    headers: {
      authorization: CONTENT_DELIVERY_API_ACCESS_TOKEN,
    },
  });

  const authorsData = await webinyHeadlessCms.request(LIST_AUTHORS);

  return authorsData.authors.listAuthors.data;
}

const SEARCH_ARTICLES = `
query SearchArticles($where: ArticleListWhere) {
  articles {
    listArticles(sort: {firstPublishedOn: -1}, where: $where) {
      data {
        id
        availableLocales
        headlineSearch
        firstPublishedOn
        slug
        headline {
          values {
            locale
            value
          }
        }
        content {
          values {
            locale
            value
          }
        }
        category {
          id
          title {
            values {
              locale
              value
            }
          }
          slug
        }
        tags {
          id
          title {
            values {
              locale
              value
            }
          }
          slug
        }
        authors {
          id
          name
        }
        authorSlugs
      }
    }
  }
}`;

export async function searchArticles(url, token, term) {
  const webinyHeadlessCms = new GraphQLClient(url, {
    headers: {
      authorization: token,
    },
  });

  const variables = {
    where: {
      headline_contains: term,
    },
  };
  const articlesData = await webinyHeadlessCms.request(
    SEARCH_ARTICLES,
    variables
  );

  // this section maps the 'admin' API values to what the front-end expects from the read-only API
  // annoyingly the data structure differs
  let articles = [];
  articlesData.articles.listArticles.data.map((rawData) => {
    let article = {};
    article.id = rawData.id;
    article.headline = rawData.headline.values[0].value;
    let authors = [];
    if (rawData.authors) {
      rawData.authors.map((rawAuthor) => {
        let author = {
          name: rawAuthor.name,
          slug: rawAuthor.slug,
        };
        authors.push(author);
      });
    }
    article.authors = authors;
    article.tags = rawData.tags;
    article.category = rawData.category;
    article.slug = rawData.slug;
    article.authorSlugs = rawData.authorSlugs;
    article.content = JSON.parse(rawData.content.values[0].value);
    articles.push(article);
  });

  return articles;
}

export async function listArticlesInLocale(url, token, locale) {
  const webinyHeadlessCms = new GraphQLClient(url, {
    headers: {
      authorization: token,
    },
  });

  const variables = {
    where: {
      availableLocales_contains: locale,
    },
  };
  const articlesData = await webinyHeadlessCms.request(
    SEARCH_ARTICLES,
    variables
  );

  return articlesData.articles.listArticles.data;
}
