import { GraphQLClient } from 'graphql-request';
import _ from 'lodash';

const CONTENT_DELIVERY_API_URL = process.env.CONTENT_DELIVERY_API_URL;
const CONTENT_DELIVERY_API_ACCESS_TOKEN =
  process.env.CONTENT_DELIVERY_API_ACCESS_TOKEN;

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
  console.log('all hp data found: ', homepageData);

  // sort by date
  homepageData.listHomepageLayoutData.data.sort(function (a, b) {
    var aDate = new Date(a.updatedOn);
    var bDate = new Date(b.updatedOn);
    return aDate > bDate;
  });
  // let articlesBySection = [];
  let currentHomepageData = homepageData.listHomepageLayoutData.data[0];
  let layoutComponentName = _.upperFirst(
    _.camelCase(currentHomepageData.layoutSchema.name)
  );

  // parse JSON data
  let articleConfig = JSON.parse(currentHomepageData.data);

  let homepageSetup = {
    layoutComponent: layoutComponentName,
    articles: articleConfig,
  };

  console.log('homepage setup: ', homepageSetup);
  return homepageSetup;
}
