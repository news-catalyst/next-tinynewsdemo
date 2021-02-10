import { GraphQLClient } from 'graphql-request';
import _ from 'lodash';
import { localiseText } from './utils';
import { fetchGraphQL } from './utils';

const gql = require('./graphql/queries');

const CONTENT_DELIVERY_API_URL = process.env.CONTENT_DELIVERY_API_URL;
const CONTENT_DELIVERY_API_ACCESS_TOKEN =
  process.env.CONTENT_DELIVERY_API_ACCESS_TOKEN;

const HASURA_GET_STREAM_ARTICLES = `query MyQuery($locale_code: String, $ids: [Int!]) {
  articles(where: {id: {_nin: $ids}, article_translations: {locale_code: {_eq: $locale_code}, published: {_eq: true}}}) {
    id
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

const HASURA_GET_HOMEPAGE_DATA = `query MyQuery($locale_code: String!) {
  homepage_layout_datas(limit: 1, order_by: {id: desc}) {
    data
    homepage_layout_schema {
      name
    }
  }
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
  site_metadatas(where: {site_metadata_translations: {locale_code: {_eq: $locale_code}}, published: {_eq: true}}) {
    site_metadata_translations(where: {locale_code: {_eq: $locale_code}}) {
      data
      locale_code
    }
  }
  categories(where: {published: {_eq: true}}) {
    category_translations(where: {locale_code: {_eq: $locale_code}}) {
      title
    }
    slug
  }
}`;

export async function hasuraStreamArticles(params) {
  return fetchGraphQL({
    url: process.env.HASURA_API_URL,
    orgSlug: process.env.ORG_SLUG,
    query: HASURA_GET_STREAM_ARTICLES,
    name: 'MyQuery',
    variables: {
      locale_code: params['localeCode'],
      ids: params['ids'],
    },
  });
}

export async function hasuraHomepage(params) {
  return fetchGraphQL({
    url: process.env.HASURA_API_URL,
    orgSlug: process.env.ORG_SLUG,
    query: HASURA_GET_HOMEPAGE_DATA,
    name: 'MyQuery',
    variables: {
      locale_code: params['localeCode'],
    },
  });
}

export async function getHomepageData() {
  const webinyHeadlessCms = new GraphQLClient(CONTENT_DELIVERY_API_URL, {
    headers: {
      authorization: CONTENT_DELIVERY_API_ACCESS_TOKEN,
    },
  });

  const homepageData = await webinyHeadlessCms.request(gql.LIST_HOMEPAGE_DATA);

  if (
    homepageData &&
    homepageData.homepageLayoutDatas &&
    homepageData.homepageLayoutDatas.listHomepageLayoutDatas
  ) {
    homepageData.homepageLayoutDatas.listHomepageLayoutDatas.data.sort(
      function (a, b) {
        return a.id > b.id;
      }
    );
    // let articlesBySection = [];
    let currentHomepageData =
      homepageData.homepageLayoutDatas.listHomepageLayoutDatas.data[0];

    if (!currentHomepageData) {
      return null;
    }

    let layoutComponentName = _.upperFirst(
      _.camelCase(currentHomepageData.layoutSchema.name)
    );
    let layoutSchemaId = currentHomepageData.layoutSchema.id;

    // parse JSON data
    let articleConfig = JSON.parse(currentHomepageData.data);

    let homepageSetup = {
      layoutSchemaId: layoutSchemaId, // TODO get rid of this
      layoutSchema: currentHomepageData.layoutSchema,
      layoutComponent: layoutComponentName,
      articles: articleConfig,
    };

    // sort by date
    return homepageSetup;
  } else {
    return null;
  }
}

export async function listLayoutSchemas() {
  const webinyHeadlessCms = new GraphQLClient(CONTENT_DELIVERY_API_URL, {
    headers: {
      authorization: CONTENT_DELIVERY_API_ACCESS_TOKEN,
    },
  });

  const schemaData = await webinyHeadlessCms.request(gql.LIST_LAYOUT_SCHEMAS);

  return schemaData.homepageLayoutSchemas.listHomepageLayoutSchemas.data;
}

export async function listLayoutSchemaIds() {
  const webinyHeadlessCms = new GraphQLClient(CONTENT_DELIVERY_API_URL, {
    headers: {
      authorization: CONTENT_DELIVERY_API_ACCESS_TOKEN,
    },
  });

  const schemaData = await webinyHeadlessCms.request(gql.LIST_LAYOUT_SCHEMAS);

  const layoutIds = schemaData.homepageLayoutSchemas.listHomepageLayoutSchemas.data.map(
    (layout) => {
      return {
        params: {
          id: layout.id,
        },
      };
    }
  );
  return layoutIds;
}
export async function createHomepageLayoutSchema(url, token, name, data) {
  const webinyHeadlessCms = new GraphQLClient(url, {
    headers: {
      authorization: token,
    },
  });

  const variables = {
    data: {
      name: name,
      data: JSON.stringify(data),
    },
  };

  const responseData = await webinyHeadlessCms.request(
    gql.CREATE_LAYOUT_SCHEMA,
    variables
  );

  return responseData;
}

export async function createHomepageLayout(url, token, layoutId, data) {
  const webinyHeadlessCms = new GraphQLClient(url, {
    headers: {
      authorization: token,
    },
  });

  const variables = {
    data: {
      layoutSchema: layoutId,
      data: JSON.stringify(data),
    },
  };

  const responseData = await webinyHeadlessCms.request(
    gql.CREATE_LAYOUT,
    variables
  );

  return responseData;
}

export async function getHomepageLayout(id) {
  const webinyHeadlessCms = new GraphQLClient(CONTENT_DELIVERY_API_URL, {
    headers: {
      authorization: CONTENT_DELIVERY_API_ACCESS_TOKEN,
    },
  });

  const variables = {
    id: id,
  };

  const responseData = await webinyHeadlessCms.request(
    gql.GET_LAYOUT,
    variables
  );

  return responseData.homepageLayoutSchemas.getHomepageLayoutSchema.data;
}

export async function updateHomepageLayout(url, token, layoutId, name, data) {
  const webinyHeadlessCms = new GraphQLClient(url, {
    headers: {
      authorization: token,
    },
  });

  const variables = {
    id: layoutId,
    data: {
      name: name,
      data: JSON.stringify(data),
    },
  };

  const responseData = await webinyHeadlessCms.request(
    gql.UPDATE_LAYOUT,
    variables
  );

  return responseData;
}
