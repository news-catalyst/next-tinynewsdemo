import { GraphQLClient } from 'graphql-request';
import _ from 'lodash';

const CONTENT_DELIVERY_API_URL = process.env.CONTENT_DELIVERY_API_URL;
const CONTENT_DELIVERY_API_ACCESS_TOKEN =
  process.env.CONTENT_DELIVERY_API_ACCESS_TOKEN;

const LIST_HOMEPAGE_DATA = `{
  homepageLayoutDatas {
    listHomepageLayoutDatas {
      error{
        code
        message
      }
      data {
        id
        data
        layoutSchema {
          id
          name
          data
        }
      }
    }
  }
}`;

export async function getHomepageData() {
  const webinyHeadlessCms = new GraphQLClient(CONTENT_DELIVERY_API_URL, {
    headers: {
      authorization: CONTENT_DELIVERY_API_ACCESS_TOKEN,
    },
  });

  const homepageData = await webinyHeadlessCms.request(LIST_HOMEPAGE_DATA);

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

const LIST_LAYOUT_SCHEMAS = `{
  homepageLayoutSchemas {
    listHomepageLayoutSchemas {
      error {
        code
        message
      }
      data {
        id
        name
        data
      }
    }
  }
}`;

export async function listLayoutSchemas() {
  const webinyHeadlessCms = new GraphQLClient(CONTENT_DELIVERY_API_URL, {
    headers: {
      authorization: CONTENT_DELIVERY_API_ACCESS_TOKEN,
    },
  });

  const schemaData = await webinyHeadlessCms.request(LIST_LAYOUT_SCHEMAS);

  return schemaData.homepageLayoutSchemas.listHomepageLayoutSchemas.data;
}

export async function listLayoutSchemaIds() {
  const webinyHeadlessCms = new GraphQLClient(CONTENT_DELIVERY_API_URL, {
    headers: {
      authorization: CONTENT_DELIVERY_API_ACCESS_TOKEN,
    },
  });

  const schemaData = await webinyHeadlessCms.request(LIST_LAYOUT_SCHEMAS);

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
const CREATE_LAYOUT = `mutation CreateHomepageLayoutData($data: HomepageLayoutDataInput!) {
  homepageLayoutDatas {
      createHomepageLayoutData(data: $data) {
        data {
          id
          data
          layoutSchema {
            id
            name
            data
          }
        }
        error  {
          code
          message
          data
        }
      }
  }
}`;

const CREATE_LAYOUT_SCHEMA = `mutation CreateHomepageLayoutSchema($data: HomepageLayoutSchemaInput!) {
  homepageLayoutSchemas {
      createHomepageLayoutSchema(data: $data) {
        data {
          id
          name
          data
        }
        error  {
          code
          message
          data
        }
      }
  }
}`;

const UPDATE_LAYOUT = `mutation UpdateHomepageLayoutSchema($id: ID!, $data: HomepageLayoutSchemaInput!) {
  homepageLayoutSchemas {
    updateHomepageLayoutSchema(id: $id, data: $data) {
      data {
        id
        name
        data
      }
      error {
        code
        data
        message
      }
    }
  }
}`;

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
    CREATE_LAYOUT_SCHEMA,
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
    CREATE_LAYOUT,
    variables
  );

  return responseData;
}

const GET_LAYOUT = `query GetHomepageLayoutSchema($id: ID!) {
  homepageLayoutSchemas {
    getHomepageLayoutSchema(id: $id) {
      data {
        id
        name
        data
      }
      error {
        code
        data
        message
      }
    }
  }
}`;

export async function getHomepageLayout(id) {
  const webinyHeadlessCms = new GraphQLClient(CONTENT_DELIVERY_API_URL, {
    headers: {
      authorization: CONTENT_DELIVERY_API_ACCESS_TOKEN,
    },
  });

  const variables = {
    id: id,
  };

  const responseData = await webinyHeadlessCms.request(GET_LAYOUT, variables);

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
    UPDATE_LAYOUT,
    variables
  );

  return responseData;
}

const PUBLISH_LAYOUT = `mutation PublishHomepageLayoutData($revision: ID!) {
  content: publishHomepageLayoutData(revision: $revision) {
    data {
      id
    }
    error {
      message
      code
      data
    }
  }
}
`;
export async function publishLayout(url, token, layoutId) {
  const webinyHeadlessCms = new GraphQLClient(url, {
    headers: {
      authorization: token,
    },
  });

  const variables = {
    revision: layoutId,
  };
  const responseData = await webinyHeadlessCms.request(
    PUBLISH_LAYOUT,
    variables
  );
  return responseData;
}
