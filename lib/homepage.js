import { GraphQLClient } from 'graphql-request';
import _ from 'lodash';

const CONTENT_DELIVERY_API_URL = process.env.CONTENT_DELIVERY_API_URL;
const CONTENT_DELIVERY_API_ACCESS_TOKEN =
  process.env.CONTENT_DELIVERY_API_ACCESS_TOKEN;
const ADMIN_CONTENT_DELIVERY_API_URL =
  process.env.ADMIN_CONTENT_DELIVERY_API_URL;
const ADMIN_CONTENT_DELIVERY_API_ACCESS_TOKEN =
  process.env.NEXT_PUBLIC_ADMIN_CONTENT_DELIVERY_API_ACCESS_TOKEN;

const LIST_HOMEPAGE_DATA = `
{
  listHomepageLayoutData	{
    data {
      id
      layoutSchema {
          id
          name
			}
      data
      createdOn
      updatedOn
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

  // sort by date
  homepageData.listHomepageLayoutData.data.sort(function (a, b) {
    var aDate = new Date(a.updatedOn);
    var bDate = new Date(b.updatedOn);
    return aDate > bDate;
  });
  // let articlesBySection = [];
  let currentHomepageData = homepageData.listHomepageLayoutData.data[0];
  console.log('currentHomepageData:', currentHomepageData);
  let layoutComponentName = _.upperFirst(
    _.camelCase(currentHomepageData.layoutSchema.name)
  );
  let layoutSchemaId = currentHomepageData.layoutSchema.id;
  console.log('layoutSchemaId:', layoutSchemaId);

  // parse JSON data
  let articleConfig = JSON.parse(currentHomepageData.data);
  console.log('articleConfig:', articleConfig);

  let homepageSetup = {
    layoutSchemaId: layoutSchemaId, // TODO get rid of this
    layoutSchema: currentHomepageData.layoutSchema,
    layoutComponent: layoutComponentName,
    articles: articleConfig,
  };

  return homepageSetup;
}

const LIST_LAYOUT_SCHEMAS = `
{
  listHomepageLayoutSchemas	{
    data {
      id
      name {
        value
      }
      data {
        value
      }
    }
  }
}
`;

export async function listLayoutSchemas() {
  const webinyHeadlessCms = new GraphQLClient(ADMIN_CONTENT_DELIVERY_API_URL, {
    headers: {
      authorization: ADMIN_CONTENT_DELIVERY_API_ACCESS_TOKEN,
    },
  });

  const schemaData = await webinyHeadlessCms.request(LIST_LAYOUT_SCHEMAS);

  return schemaData.listHomepageLayoutSchemas.data;
}
