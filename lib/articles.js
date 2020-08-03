import { GraphQLClient } from 'graphql-request';

const CONTENT_DELIVERY_API_URL = process.env.CONTENT_DELIVERY_API_URL;
const CONTENT_DELIVERY_API_ACCESS_TOKEN =
  process.env.CONTENT_DELIVERY_API_ACCESS_TOKEN;

const LIST_ARTICLES = `
  {
    listBasicArticles {
    data {
      id
      headline
      byline
      body
      firstPublishedOn
      lastPublishedOn
      tags {
        title
      }
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

const LIST_TAGS = `
{
  listTags {
    data {
      title
    }
  }
}
`;

export async function listAllTags() {
  const webinyHeadlessCms = new GraphQLClient(CONTENT_DELIVERY_API_URL, {
    headers: {
      authorization: CONTENT_DELIVERY_API_ACCESS_TOKEN,
    },
  });

  const tagsData = await webinyHeadlessCms.request(LIST_TAGS);

  const titles = tagsData.listTags.data.map((tag) => {
    return {
      params: {
        title: tag.title,
      },
    };
  });
  return titles;
}

export async function listAllArticles() {
  const webinyHeadlessCms = new GraphQLClient(CONTENT_DELIVERY_API_URL, {
    headers: {
      authorization: CONTENT_DELIVERY_API_ACCESS_TOKEN,
    },
  });

  const articlesData = await webinyHeadlessCms.request(LIST_ARTICLES);

  return articlesData.listBasicArticles.data;
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
    for (var i = 0; i < article.tags.length; i++) {
      if (article.tags[i].title == tag) {
        articlesByTag.push(article);
        break;
      }
    }
  });
  return articlesByTag;
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

const GET_ARTICLE = `
  query Article($id: ID!) {
    getBasicArticle(where: {id: $id}) {
      data {
        id
        headline
        byline
        body 
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
  return articlesData.getBasicArticle.data;
}
