import { GraphQLClient } from "graphql-request";

const CONTENT_DELIVERY_API_URL = process.env.CONTENT_DELIVERY_API_URL;
const CONTENT_DELIVERY_API_ACCESS_TOKEN = process.env.CONTENT_DELIVERY_API_ACCESS_TOKEN;

const LIST_ARTICLES = `
  {
    listBasicArticles {
    data {
      id
      headline
      byline {
        fullName
      }
    }
  }
}
`;

export async function listAllArticles() {
  const webinyHeadlessCms = new GraphQLClient(CONTENT_DELIVERY_API_URL, {
    headers: {
      authorization: CONTENT_DELIVERY_API_ACCESS_TOKEN,
    },
  });

  const articlesData = await webinyHeadlessCms.request(LIST_ARTICLES);

  return articlesData;
}
