import { GraphQLClient } from 'graphql-request';

const CONTENT_DELIVERY_API_URL = process.env.CONTENT_DELIVERY_API_URL;
const CONTENT_DELIVERY_API_ACCESS_TOKEN =
  process.env.CONTENT_DELIVERY_API_ACCESS_TOKEN;

const LIST_ARTICLES = `
  {
    listBasicArticles {
      data {
        id
        slug
        category {
          title
          slug
        }
        headline
        byline
        authorSlugs
        authors {
          id
          name
          slug
        }
        content
        firstPublishedOn
        lastPublishedOn
        tags {
          title
          slug
        }
      }
    }
  }
`;

const LIST_ARTICLES_REVERSE_CHRON = `
  query listBasicArticles {
    content: listBasicArticles(sort: lastPublishedOn_DESC) {
      data {
        id
        headline 
        byline
        slug
        authorSlugs
        authors {
          id
          name
          slug
        }
        content
        tags {
          title
        }
        category {
          slug
          title
        }
        firstPublishedOn
        lastPublishedOn
        searchTitle
        searchDescription
        facebookTitle
        facebookDescription
        twitterTitle
        twitterDescription
      } 
    }
  }`;

const LIST_ARTICLES_BY_SLUG = `
  query listBasicArticles($where: BasicArticleListWhereInput) {
    content: listBasicArticles(where: $where) {
      data {
        id
        headline
        byline
        slug
        authorSlugs
        authors {
          id
          name
          slug
        }
        content
        tags {
          title
        }
        category {
          slug
          title
        }
        firstPublishedOn
        lastPublishedOn
        searchTitle
        searchDescription
        facebookTitle
        facebookDescription
        twitterTitle
        twitterDescription
      }
    }
  }`;

const LIST_ARTICLES_BY_AUTHOR = `
  query listBasicArticles($where: BasicArticleListWhereInput) {
    content: listBasicArticles(where: $where) {
      data {
        id
        headline
        byline
        slug
        content
        authorSlugs
        authors {
          id
          name
          slug
        }
        tags {
          title
        }
        category {
          slug
          title
        }
        firstPublishedOn
        lastPublishedOn
        searchTitle
        searchDescription
        facebookTitle
        facebookDescription
        twitterTitle
        twitterDescription
      }
    }
}`;

const LIST_IDS = `
{
  listBasicArticles {
    data {
      id
    }
  }
}
`;
const LIST_SLUGS = `
{
  listBasicArticles {
    data {
      category {
        slug
      }
      slug
    }
  }
}
`;

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
  listAuthors {
    data {
      bio
      name
      title
      slug
    }
  }
}
`;

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

const GET_AUTHOR_BY_SLUG = `query getAuthor($slug: String) {
  content: getAuthor(where: {slug: $slug}) {
    data {
      id
      slug
      name
      title
      twitter
      bio
      staff
      photoUrl
    }
  }
}`;

export async function listAllSections() {
  console.log('listing all sections from API...');
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
  console.log(sectionsData);

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
  articlesData.listBasicArticles.data.map((article) => {
    if (article.category.slug == section) {
      article.content = JSON.parse(article.content);
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

  const slugs = authorData.listAuthors.data.map((author) => {
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

  const slugs = tagsData.listTags.data.map((tag) => {
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
  articlesData.listBasicArticles.data.map((article) => {
    article.content = JSON.parse(article.content);
  });
  return articlesData.listBasicArticles.data;
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
  articlesData.content.data.map((article) => {
    article.content = JSON.parse(article.content);
  });
  return articlesData.content.data;
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
  articlesData.content.data.map((article) => {
    try {
      article.content = JSON.parse(article.content);
    } catch (e) {
      console.log('error parsing json:', e);
    }
  });
  return articlesData.content.data;
}

export async function listAllArticlesByTag(tag) {
  const webinyHeadlessCms = new GraphQLClient(CONTENT_DELIVERY_API_URL, {
    headers: {
      authorization: CONTENT_DELIVERY_API_ACCESS_TOKEN,
    },
  });

  const articlesData = await webinyHeadlessCms.request(LIST_ARTICLES);
  let articlesByTag = [];
  articlesData.listBasicArticles.data.map((article) => {
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
      article.content = JSON.parse(article.content);
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

  articlesData.content.data.map((article) => {
    try {
      article.content = JSON.parse(article.content);
    } catch (e) {
      console.log('error parsing json:', e);
    }
  });

  return articlesData.content.data;
}

export async function listAllArticleIds() {
  const webinyHeadlessCms = new GraphQLClient(CONTENT_DELIVERY_API_URL, {
    headers: {
      authorization: CONTENT_DELIVERY_API_ACCESS_TOKEN,
    },
  });

  const articlesData = await webinyHeadlessCms.request(LIST_IDS);
  const ids = articlesData.listBasicArticles.data.map((article) => {
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
  const slugs = articlesData.listBasicArticles.data.map((article) => {
    return {
      params: {
        category: article.category.slug,
        slug: article.slug,
      },
    };
  });
  return slugs;
}

const GET_ARTICLE = `
  query Article($id: ID!) {
    getBasicArticle(where: {id: $id}) {
      data {
        id
        headline
        byline
        content
        tags {
          title
        }
        authorSlugs
        authors {
          id
          name
          slug
        }
        firstPublishedOn
        lastPublishedOn
        searchTitle
        searchDescription
        facebookTitle
        facebookDescription
        twitterTitle
        twitterDescription
      }
    }
  }
`;

const GET_PAGE_BY_SLUG = `
  query Page($slug: String) {
    getPage(where: {slug: $slug}) {
      data {
        id
        slug
        headline
        content
        searchTitle
        searchDescription
        facebookTitle
        facebookDescription
        twitterTitle
        twitterDescription
      }
    }
  }
`;

const GET_ARTICLE_BY_SLUG = `
  query Article($slug: String) {
    getBasicArticle(where: {slug: $slug}) {
      data {
        id
        slug
        authorSlugs
        authors {
          id
          name
          slug
        }
        category {
          title
          slug
        }
        headline
        byline
        content
        tags {
          title
          slug
        }
        firstPublishedOn
        lastPublishedOn
        searchTitle
        searchDescription
        facebookTitle
        facebookDescription
        twitterTitle
        twitterDescription
      }
    }
  }
`;

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
    slug,
  });
  try {
    articlesData.getBasicArticle.data.content = JSON.parse(
      articlesData.getBasicArticle.data.content
    );
  } catch (e) {
    console.log(slug, 'failed parsing json:', e);
  }
  return articlesData.getBasicArticle.data;
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
    getTag(where: {slug: $slug}) {
      data {
        title
        slug
      }
    }
  }
`;

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
  return tagsData.getTag.data;
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
  return authorData.content.data;
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
  try {
    data.getPage.data.content = JSON.parse(data.getPage.data.content);
  } catch (e) {
    console.log(slug, 'failed parsing json:', e);
  }
  return data.getPage.data;
}

export async function listAuthors() {
  const webinyHeadlessCms = new GraphQLClient(CONTENT_DELIVERY_API_URL, {
    headers: {
      authorization: CONTENT_DELIVERY_API_ACCESS_TOKEN,
    },
  });

  const authorsData = await webinyHeadlessCms.request(LIST_AUTHORS);

  return authorsData.listAuthors.data;
}

const SEARCH_ARTICLES = `
query listBasicArticles($where: BasicArticleListWhereInput) {
  content: listBasicArticles(where: $where) {
  	data {
      id
      tags {
        value {
          title {
            value
          }
          slug {
            value
          }
        }
      }
      authorSlugs {
        value
      }
      authors {
        value {
          name {
            value
          }
          slug {
            value
          }
        }
      }
      content {
        value
      }
      headline {
        value
      }
      slug {
        value
      }
      category {
        value {
          slug {
            value
          }
        }
      }
  	} 
  }
}
`;

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
  articlesData.content.data.map((rawData) => {
    let article = {};
    article.id = rawData.id;
    article.headline = rawData.headline.value;
    let authors = [];
    if (rawData.authors && rawData.authors.value) {
      rawData.authors.value.map((rawAuthor) => {
        let author = {
          name: rawAuthor.name.value,
          slug: rawAuthor.slug.value,
        };
        authors.push(author);
      });
    }
    article.authors = authors;
    article.tags = rawData.tags.value;
    article.category = rawData.category.value;
    article.slug = rawData.slug.value;
    article.authorSlugs = rawData.authorSlugs.value;
    article.content = JSON.parse(rawData.content.value);
    articles.push(article);
  });

  return articles;
}
