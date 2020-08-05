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
          slug
        }
        headline
        byline
        content
        firstPublishedOn
        lastPublishedOn
      }
    }
  }
`;

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
  listCategories {
  	data {
      title
      slug
    }
  }
}
`;

const LIST_TAGS = `
{
  listTags {
    data {
      title
    }
  }
}
`;

export async function listAllSections() {
  const webinyHeadlessCms = new GraphQLClient(CONTENT_DELIVERY_API_URL, {
    headers: {
      authorization: CONTENT_DELIVERY_API_ACCESS_TOKEN,
    },
  });

  const tagsData = await webinyHeadlessCms.request(LIST_SECTIONS);

  return tagsData.listCategories.data;
}

export async function listAllTags() {
  const webinyHeadlessCms = new GraphQLClient(CONTENT_DELIVERY_API_URL, {
    headers: {
      authorization: CONTENT_DELIVERY_API_ACCESS_TOKEN,
    },
  });

  const tagsData = await webinyHeadlessCms.request(LIST_TAGS);

  return tagsData.listTags.data;
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

const GET_ARTICLE_BY_SLUG = `
  query Article($slug: String) {
    getBasicArticle(where: {slug: $slug}) {
      data {
        id
        slug
        headline
        byline
        content
        tags {
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

export async function getArticleBySlug(slug) {
  const webinyHeadlessCms = new GraphQLClient(CONTENT_DELIVERY_API_URL, {
    headers: {
      authorization: CONTENT_DELIVERY_API_ACCESS_TOKEN,
    },
  });

  const articlesData = await webinyHeadlessCms.request(GET_ARTICLE_BY_SLUG, {
    slug,
  });
  articlesData.getBasicArticle.data.content = JSON.parse(
    articlesData.getBasicArticle.data.content
  );
  return articlesData.getBasicArticle.data;
}
