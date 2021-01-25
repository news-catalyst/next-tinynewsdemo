import { GraphQLClient } from 'graphql-request';
import _ from 'lodash';

const gql = require('./graphql/queries');

const CONTENT_DELIVERY_API_URL = process.env.CONTENT_DELIVERY_API_URL;
const CONTENT_DELIVERY_API_ACCESS_TOKEN =
  process.env.CONTENT_DELIVERY_API_ACCESS_TOKEN;

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
