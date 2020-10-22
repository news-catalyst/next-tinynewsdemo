import { GraphQLClient } from 'graphql-request';
import _ from 'lodash';

const CONTENT_DELIVERY_API_URL = process.env.CONTENT_DELIVERY_API_URL;
const CONTENT_DELIVERY_API_ACCESS_TOKEN =
  process.env.CONTENT_DELIVERY_API_ACCESS_TOKEN;

const LIST_METADATA = `{
  siteMetadatas {
    listSiteMetadatas {
      data {
        id
        data
        published
        firstPublishedOn
        lastPublishedOn
      }
    }
  }
}`;

// this always lists the metadata and grabs the most recent one
// NOTE: there should only be one record
export async function getSiteMetadata(apiUrl, apiToken) {
  const webinyHeadlessCms = new GraphQLClient(apiUrl, {
    headers: {
      authorization: apiToken,
    },
  });

  const response = await webinyHeadlessCms.request(LIST_METADATA);

  const metadataRecords = response.siteMetadatas.listSiteMetadatas.data;
  console.log('found', metadataRecords.length, 'metadata records');
  let metadata = metadataRecords[0];
  if (metadata && metadata.data !== null && metadata.data !== undefined) {
    metadata.data = JSON.parse(metadata.data);
    return metadata;
  } else if (metadata) {
    metadata.data = {};
    return metadata;
  } else {
    return null;
  }
}

const CREATE_METADATA = `mutation CreateSiteMetadata($data: SiteMetadataInput!) {
  siteMetadatas {
      createSiteMetadata(data: $data) {
        data {
          id
          data
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

export async function createSiteMetadata(url, token, data) {
  const webinyHeadlessCms = new GraphQLClient(url, {
    headers: {
      authorization: token,
    },
  });

  const variables = {
    data: {
      data: JSON.stringify(data),
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
        data
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

export async function updateSiteMetadata(url, token, id, data) {
  const webinyHeadlessCms = new GraphQLClient(url, {
    headers: {
      authorization: token,
    },
  });

  const variables = {
    id: id,
    data: {
      data: JSON.stringify(data),
      published: true,
    },
  };

  const responseData = await webinyHeadlessCms.request(
    UPDATE_METADATA,
    variables
  );
  return responseData;
}
