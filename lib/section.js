import { GraphQLClient } from 'graphql-request';
import { fetchGraphQL } from './utils';
import _ from 'lodash';

const CONTENT_DELIVERY_API_URL = process.env.CONTENT_DELIVERY_API_URL;
const CONTENT_DELIVERY_API_ACCESS_TOKEN =
  process.env.CONTENT_DELIVERY_API_ACCESS_TOKEN;

const gql = require('./graphql/queries');

const HASURA_LIST_SECTIONS = `
  query MyQuery($localeCode: String) {
    categories {
      id
      published
      slug
      title
      category_translations(where: {locale_code: {_eq: $localeCode}}) {
        title
      }
    }
  }`;

const HASURA_INSERT_SECTION = `mutation insert_single_category($locale_code: String, $title: String, $published: Boolean, $slug: String) {
  insert_categories_one(object: {slug: $slug, published: $published, category_translations: {data: {locale_code: $locale_code, title: $title}}}) {
    id
    slug
  }
}`;

export function hasuraListAllSections(localeCode) {
  return fetchGraphQL({
    url: process.env.HASURA_API_URL,
    orgSlug: process.env.ORG_SLUG,
    query: HASURA_LIST_SECTIONS,
    name: 'MyQuery',
    variables: { localeCode: localeCode },
  });
}

export function hasuraCreateSection(params) {
  return fetchGraphQL({
    url: params['url'],
    orgSlug: params['orgSlug'],
    query: HASURA_INSERT_SECTION,
    name: 'insert_single_category',
    variables: {
      locale_code: params['localeCode'],
      title: params['title'],
      published: params['published'],
      slug: params['slug'],
    },
  });
}

export async function createSection(url, token, currentLocale, title, slug) {
  const webinyHeadlessCms = new GraphQLClient(url, {
    headers: {
      authorization: token,
    },
  });

  const variables = {
    data: {
      slug: slug,
      title: {
        values: [
          {
            value: title,
            locale: currentLocale.id,
          },
        ],
      },
      published: true,
    },
  };

  const responseData = await webinyHeadlessCms.request(
    gql.CREATE_CATEGORY,
    variables
  );
  return responseData;
}

const LIST_CATEGORIES = `{
  categories {
    listCategories {
      data {
        id
        slug
        title {
          values {
            value
            locale
          }
        }
      }
    }
  }
}`;

export async function listSectionIds() {
  const webinyHeadlessCms = new GraphQLClient(CONTENT_DELIVERY_API_URL, {
    headers: {
      authorization: CONTENT_DELIVERY_API_ACCESS_TOKEN,
    },
  });

  const sectionsData = await webinyHeadlessCms.request(LIST_CATEGORIES);

  const sections = sectionsData.categories.listCategories.data.map(
    (section) => {
      return {
        params: {
          id: section.id,
        },
      };
    }
  );
  return sections;
}

const UPDATE_CATEGORY = `mutation UpdateCategory($id: ID!, $data: CategoryInput!) {
  categories {
    updateCategory(id: $id, data: $data) {
      data {
        id
        title {
          values {
            value
          }
        }
        slug
      }
      error {
        code
        data
        message
      }
    }
  }
}`;

export async function updateSection(url, token, categoryID, titleValues, slug) {
  const webinyHeadlessCms = new GraphQLClient(url, {
    headers: {
      authorization: token,
    },
  });

  const variables = {
    id: categoryID,
    data: {
      slug: slug,
      title: {
        values: titleValues,
      },
      published: true,
    },
  };

  const responseData = await webinyHeadlessCms.request(
    UPDATE_CATEGORY,
    variables
  );
  return responseData;
}

const GET_CATEGORY = `query GetCategory($id: ID!) {
  categories {
    getCategory(id: $id) {
      data {
        id
        title {
          values {
            locale
            value
          }
        }
        slug
      }
      error {
        code
        data
        message
      }
    }
  }
}`;

export async function getSection(id) {
  const webinyHeadlessCms = new GraphQLClient(CONTENT_DELIVERY_API_URL, {
    headers: {
      authorization: CONTENT_DELIVERY_API_ACCESS_TOKEN,
    },
  });

  const variables = {
    id: id,
  };

  const responseData = await webinyHeadlessCms.request(GET_CATEGORY, variables);

  return responseData.categories.getCategory.data;
}

const DELETE_CATEGORY = `mutation DeleteCategory($id: ID!) {
  categories {
    deleteCategory(id: $id) {
      data
      error {
        code
        message
      }
    }
  }
}`;

export async function deleteSection(url, token, categoryID) {
  const webinyHeadlessCms = new GraphQLClient(url, {
    headers: {
      authorization: token,
    },
  });

  const variables = {
    id: categoryID,
  };

  const responseData = await webinyHeadlessCms.request(
    DELETE_CATEGORY,
    variables
  );
  return responseData;
}
