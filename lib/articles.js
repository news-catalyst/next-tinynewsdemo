import { GraphQLClient } from 'graphql-request';

const CONTENT_DELIVERY_API_URL = process.env.CONTENT_DELIVERY_API_URL;
const CONTENT_DELIVERY_API_ACCESS_TOKEN =
  process.env.CONTENT_DELIVERY_API_ACCESS_TOKEN;

const LIST_ARTICLES = `
{
  articles {
  listArticles {
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
        slug
      }
      authorSlugs
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

export async function listAllArticlesBySection(section) {
  const webinyHeadlessCms = new GraphQLClient(CONTENT_DELIVERY_API_URL, {
    headers: {
      authorization: CONTENT_DELIVERY_API_ACCESS_TOKEN,
    },
  });

  const articlesData = await webinyHeadlessCms.request(LIST_ARTICLES);
  let articlesBySection = [];
  articlesData.articles.listArticles.data.map((article) => {
    if (article.category.slug == section) {
      article.content = JSON.parse(article.content.values[0].value);
      articlesBySection.push(article);
    }
  });
  return articlesBySection;
}

export async function listAllAuthorPaths() {
  const webinyHeadlessCms = new GraphQLClient(CONTENT_DELIVERY_API_URL, {
    headers: {
      authorization: CONTENT_DELIVERY_API_ACCESS_TOKEN,
    },
  });

  const authorData = await webinyHeadlessCms.request(LIST_AUTHORS);

  const slugs = authorData.authors.listAuthors.data.map((author) => {
    return {
      params: {
        slug: author.slug,
      },
    };
  });
  return slugs;
}

export async function listAllTagPaths() {
  const webinyHeadlessCms = new GraphQLClient(CONTENT_DELIVERY_API_URL, {
    headers: {
      authorization: CONTENT_DELIVERY_API_ACCESS_TOKEN,
    },
  });

  const tagsData = await webinyHeadlessCms.request(LIST_TAGS);

  const slugs = tagsData.tags.listTags.data.map((tag) => {
    return {
      params: {
        slug: tag.slug,
      },
    };
  });
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

export async function listMostRecentArticles() {
  const webinyHeadlessCms = new GraphQLClient(CONTENT_DELIVERY_API_URL, {
    headers: {
      authorization: CONTENT_DELIVERY_API_ACCESS_TOKEN,
    },
  });

  const articlesData = await webinyHeadlessCms.request(
    LIST_ARTICLES_REVERSE_CHRON
  );
  articlesData.articles.listArticles.data.map((article) => {
    let articleContent;
    if (
      article.content &&
      article.content.values &&
      article.content.values[0] &&
      article.content.values[0].value
    ) {
      articleContent = article.content.values[0].value;
    }
    try {
      article.content = JSON.parse(articleContent);
    } catch (e) {
      console.log('setting content to null from:', articleContent);
      console.log(e);
      article.content = null;
    }
  });
  return articlesData.articles.listArticles.data;
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

export async function listAllArticlesByTag(tag) {
  const webinyHeadlessCms = new GraphQLClient(CONTENT_DELIVERY_API_URL, {
    headers: {
      authorization: CONTENT_DELIVERY_API_ACCESS_TOKEN,
    },
  });

  const articlesData = await webinyHeadlessCms.request(LIST_ARTICLES);
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
    try {
      article.content = JSON.parse(article.content.values[0].value);
    } catch (e) {
      console.log('error parsing json:', e);
    }
  });

  return articlesByTag;
}

export async function listAllArticlesByAuthor(authorSlug) {
  const webinyHeadlessCms = new GraphQLClient(CONTENT_DELIVERY_API_URL, {
    headers: {
      authorization: CONTENT_DELIVERY_API_ACCESS_TOKEN,
    },
  });

  const variables = {
    where: {
      authorSlugs_contains: authorSlug,
    },
  };
  const articlesData = await webinyHeadlessCms.request(
    LIST_ARTICLES_BY_AUTHOR,
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

export async function listAllArticleSlugs() {
  const webinyHeadlessCms = new GraphQLClient(CONTENT_DELIVERY_API_URL, {
    headers: {
      authorization: CONTENT_DELIVERY_API_ACCESS_TOKEN,
    },
  });

  const articlesData = await webinyHeadlessCms.request(LIST_SLUGS);
  const slugs = articlesData.articles.listArticles.data.map((article) => {
    return {
      params: {
        category: article.category ? article.category.slug : null,
        slug: article.slug,
      },
    };
  });
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
        firstPublishedOn
        lastPublishedOn
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
          title {
            values {
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

export async function getArticleBySlug(slug, apiUrl) {
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
      slug: slug,
    },
  });

  let articleData = articlesData.articles.listArticles.data[0];
  try {
    articleData.content = JSON.parse(articleData.content.values[0].value);
  } catch (e) {
    console.log(slug, 'failed parsing json:', e);
  }
  return articleData;
}

export async function getHomepageArticles(hpData) {
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
          foundArticle = await getArticleBySlug(values);
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
    listArticles(where: $where) {
      data {
        id
        headlineSearch
        firstPublishedOn
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
