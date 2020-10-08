import { GraphQLClient } from 'graphql-request';
import _ from 'lodash';

const CONTENT_DELIVERY_API_URL = process.env.CONTENT_DELIVERY_API_URL;
const CONTENT_DELIVERY_API_ACCESS_TOKEN =
  process.env.CONTENT_DELIVERY_API_ACCESS_TOKEN;
const ADMIN_CONTENT_DELIVERY_API_URL =
  process.env.ADMIN_CONTENT_DELIVERY_API_URL;
const ADMIN_CONTENT_DELIVERY_API_ACCESS_TOKEN =
  process.env.NEXT_PUBLIC_ADMIN_CONTENT_DELIVERY_API_ACCESS_TOKEN;
const LOCALE_ID = '5efce70db7dd5900074c4b73'; //TODO add to .env

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
    homepageData.homepageLayoutDatas.listHomepageLayoutData
  ) {
    homepageData.homepageLayoutDatas.listHomepageLayoutData.data.sort(function (
      a,
      b
    ) {
      var aDate = new Date(a.updatedOn);
      var bDate = new Date(b.updatedOn);
      return aDate > bDate;
    });
    // let articlesBySection = [];
    let currentHomepageData =
      homepageData.homepageLayoutDatas.listHomepageLayoutData.data[0];
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

export async function createHomepageLayout(url, token, layoutId, data) {
  console.log('changing layout:', layoutId);

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
