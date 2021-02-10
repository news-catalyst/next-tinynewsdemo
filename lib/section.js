import { GraphQLClient } from 'graphql-request';
import { fetchGraphQL } from './utils';
import _ from 'lodash';

const CONTENT_DELIVERY_API_URL = process.env.CONTENT_DELIVERY_API_URL;
const CONTENT_DELIVERY_API_ACCESS_TOKEN =
  process.env.CONTENT_DELIVERY_API_ACCESS_TOKEN;

const gql = require('./graphql/queries');

const HASURA_LIST_ALL_SECTIONS_BY_LOCALE = `query MyQuery($locale_code: String = "") {
  categories(where: {published: {_eq: true}}) {
    category_translations(where: {locale_code: {_eq: $locale_code}}) {
      title
    }
    slug
  }
}`;

const HASURA_UPSERT_SECTION = `mutation MyMutation($locale_code: String!, $title: String!, $slug: String!, $published: Boolean) {
  insert_categories(objects: {slug: $slug, category_translations: {data: {locale_code: $locale_code, title: $title}, on_conflict: {constraint: category_translations_locale_code_category_id_key, update_columns: [title]}}, published: $published}, on_conflict: {constraint: categories_organization_id_slug_key, update_columns: [slug, published]}) {
    returning {
      id
      slug
      published
    }
  }
}`;

const HASURA_INSERT_SECTION = `mutation insert_single_category($locale_code: String, $title: String, $published: Boolean, $slug: String) {
  insert_categories_one(object: {slug: $slug, published: $published, category_translations: {data: {locale_code: $locale_code, title: $title}}}) {
    id
    slug
  }
}`;

const HASURA_GET_SECTION_BY_ID = `query MyQuery($id: Int!) {
  categories_by_pk(id: $id) {
    id
    published
    category_translations {
      title
    }
    slug
  }
}`;

const HASURA_UPDATE_SECTION = `mutation updateCategoryWithTranslations($category_id: Int!, $locale_code: String!, $title: String, $published: Boolean, $slug: String) {
  delete_category_translations(where: {category_id: {_eq: $category_id}, locale_code: {_eq: $locale_code}}) {
    affected_rows
  }
  insert_category_translations(objects: [{category_id: $category_id, locale_code: $locale_code, title: $title}]) {
    affected_rows
  }
  update_categories_by_pk(pk_columns: {id: $category_id}, _set: {published: $published, slug: $slug}) {
    published
    slug
  }
}`;

export function hasuraListAllSectionsByLocale(params) {
  return fetchGraphQL({
    url: params['url'],
    orgSlug: params['orgSlug'],
    query: HASURA_LIST_ALL_SECTIONS_BY_LOCALE,
    name: 'MyQuery',
    variables: {
      locale_code: params['localeCode'],
    },
  });
}

export function hasuraUpsertSection(params) {
  return fetchGraphQL({
    url: params['url'],
    orgSlug: params['orgSlug'],
    query: HASURA_UPSERT_SECTION,
    name: 'insert_categories',
    variables: {
      locale_code: params['localeCode'],
      slug: params['slug'],
      published: params['published'],
      title: params['title'],
    },
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

export function hasuraGetSectionById(params) {
  return fetchGraphQL({
    url: params['url'],
    orgSlug: params['orgSlug'],
    query: HASURA_GET_SECTION_BY_ID,
    name: 'MyQuery',
    variables: {
      id: params['id'],
    },
  });
}

export function hasuraUpdateSection(params) {
  return fetchGraphQL({
    url: params['url'],
    orgSlug: params['orgSlug'],
    query: HASURA_UPDATE_SECTION,
    name: 'updateCategoryWithTranslations',
    variables: {
      category_id: params['id'],
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
