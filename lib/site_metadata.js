import { GraphQLClient } from 'graphql-request';
import _ from 'lodash';

const gql = require('./graphql/queries');
import { fetchGraphQL } from './utils';

const HASURA_GET_SITE_METADATA = `
`;

export function hasuraGetSiteMetadata(params) {
  return fetchGraphQL({
    url: params['url'],
    orgSlug: params['orgSlug'],
    query: HASURA_GET_SITE_METADATA,
    name: 'MyQuery',
    variables: {
      locale_code: params['localeCode'],
    },
  });
}

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

  const response = await webinyHeadlessCms.request(gql.LIST_METADATA);

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

  const response = await webinyHeadlessCms.request(gql.LIST_METADATA);

  const metadataRecords = response.siteMetadatas.listSiteMetadatas.data;

  let metadata = metadataRecords[0].data.values.find(
    (item) => item.locale === locale.id
  );
  if (metadata === null || metadata === undefined) {
    return null;
  }
  let parsedData = {};
  try {
    parsedData = JSON.parse(metadata.value);
  } catch (e) {
    console.log(e);
  }
  return parsedData;
}

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
    gql.CREATE_METADATA,
    variables
  );
  return responseData;
}
const HASURA_UPSERT_METADATA = `mutation MyMutation($published: Boolean, $data: jsonb, $locale_code: String) {
  insert_site_metadatas(objects: {published: $published, site_metadata_translations: {data: {data: $data, locale_code: $locale_code}, on_conflict: {constraint: site_metadata_translations_locale_code_site_metadata_id_key, update_columns: data}}}, on_conflict: {constraint: site_metadatas_organization_id_key, update_columns: published}) {
    returning {
      id
      published
    }
  }
}`;

export function hasuraUpsertMetadata(params) {
  return fetchGraphQL({
    url: params['url'],
    orgSlug: params['orgSlug'],
    query: HASURA_UPSERT_METADATA,
    name: 'MyMutation',
    variables: {
      data: params['data'],
      published: params['published'],
      locale_code: params['localeCode'],
    },
  });
}
export async function updateSiteMetadata(
  url,
  token,
  previousMetadata,
  locale,
  data
) {
  let id = previousMetadata.id;
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
    gql.UPDATE_METADATA,
    variables
  );
  return responseData;
}
