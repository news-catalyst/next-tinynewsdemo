import { GraphQLClient } from 'graphql-request';
import _ from 'lodash';

const LIST_METADATA = `{
  siteMetadatas {
    listSiteMetadatas {
      data {
        id
        data {
          values {
            locale
            value
          }
        }
        published
      }
    }
  }
}`;

// this always lists the metadata and grabs the most recent one
// NOTE: there should only be one record
export async function getSiteMetadata(apiUrl, apiToken) {
  if (apiUrl === undefined) {
    apiUrl = process.env.CONTENT_DELIVERY_API_URL;
  }
  if (apiToken === undefined) {
    apiToken = process.env.CONTENT_DELIVERY_API_ACCESS_TOKEN;
  }
  const webinyHeadlessCms = new GraphQLClient(apiUrl, {
    headers: {
      authorization: apiToken,
    },
  });

  const response = await webinyHeadlessCms.request(LIST_METADATA);

  const metadataRecords = response.siteMetadatas.listSiteMetadatas.data;
  let metadata = metadataRecords[0];
  if (metadata && (metadata.data === null || metadata.data === undefined)) {
    metadata.data = {};
  }
  return metadata;
}

export async function getSiteMetadataForLocale(locale) {
  const webinyHeadlessCms = new GraphQLClient(
    process.env.CONTENT_DELIVERY_API_URL,
    {
      headers: {
        authorization: process.env.CONTENT_DELIVERY_API_ACCESS_TOKEN,
      },
    }
  );

  const response = await webinyHeadlessCms.request(LIST_METADATA);

  const metadataRecords = response.siteMetadatas.listSiteMetadatas.data;
  console.log(metadataRecords[0]);
  let metadata = metadataRecords[0].data.values.find(
    (item) => item.locale === locale.id
  );
  let parsedData = {};
  try {
    console.log('parsing:', metadata.value);
    parsedData = JSON.parse(metadata.value);
    console.log('result:', parsedData);
  } catch (e) {
    console.log(e);
  }
  return parsedData;
}

const CREATE_METADATA = `mutation CreateSiteMetadata($data: SiteMetadataInput!) {
  siteMetadatas {
      createSiteMetadata(data: $data) {
        data {
          id
          data {
            values { 
              locale
              value
            }
          }
          published
          firstPublishedOn
          lastPublishedOn
        }
        error  {
          code
          message
          data
        }
      }
  }
}`;

export async function createSiteMetadata(url, token, locale, data) {
  const webinyHeadlessCms = new GraphQLClient(url, {
    headers: {
      authorization: token,
    },
  });

  const variables = {
    data: {
      data: {
        values: [
          {
            value: data,
            locale: locale.id,
          },
        ],
      },
      published: true,
    },
  };

  const responseData = await webinyHeadlessCms.request(
    CREATE_METADATA,
    variables
  );
  return responseData;
}

const UPDATE_METADATA = `mutation UpdateSiteMetadata($id: ID!, $data: SiteMetadataInput!) {
  siteMetadatas {
    updateSiteMetadata(id: $id, data: $data) {
      data {
        id
        data {
          values {
            locale
            value
          }
        }
        published
        firstPublishedOn
        lastPublishedOn
      }
      error {
        code
        data
        message
      }
    }
  }
}`;

export async function updateSiteMetadata(
  url,
  token,
  previousMetadata,
  locale,
  data
) {
  let id = previousMetadata.id;
  console.log('previousMetadata:', previousMetadata, 'new data:', data);
  // let dataValues = [];
  let foundIt = false;
  // look for content in the specified locale; if it exists, update the data
  previousMetadata.data.values.map((item) => {
    if (item.locale === locale.id) {
      foundIt = true;
      console.log('found previous entry for this locale:', item);
      item.value = JSON.stringify(data);
      console.log('updated entry:', item);
    }
  });

  // if we didn't find data for the specified locale, we should add it to the array
  if (!foundIt) {
    previousMetadata.data.values.push({
      value: JSON.stringify(data),
      locale: locale.id,
    });
  }

  const webinyHeadlessCms = new GraphQLClient(url, {
    headers: {
      authorization: token,
    },
  });

  const variables = {
    id: id,
    data: {
      data: {
        values: previousMetadata.data.values,
      },
      published: true,
    },
  };

  const responseData = await webinyHeadlessCms.request(
    UPDATE_METADATA,
    variables
  );
  return responseData;
}
