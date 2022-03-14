import _ from 'lodash';
import { fetchGraphQL } from './graphql';

const HASURA_LIST_HOMEPAGE_LAYOUT_SCHEMAS = `query FrontendListHomepageLayoutSchemas {
  homepage_layout_schemas {
    id
    name
    data
  }
}`;

const HASURA_UPDATE_HOMEPAGE_LAYOUT_SCHEMA = `mutation FrontendUpdateHomepageLayoutSchema($id: Int!, $data: jsonb, $name: String) {
  update_homepage_layout_schemas_by_pk(pk_columns: {id: $id}, _set: {data: $data, name: $name}) {
    id
  }
}`;

const HASURA_GET_STREAM_ARTICLES = `query FrontendGetStreamArticles($ids: [Int!], $limit: Int) {
  articles(where: {id: {_nin: $ids}, article_translations: {published: {_eq: true}}}, limit: $limit, order_by: {article_translations_aggregate: {min: {first_published_at: desc}}}) {
    id
    slug
    article_translations(where: {published: {_eq: true}}, order_by: {id: desc}, limit: 1) {
      custom_byline
      first_published_at
      headline
      last_published_at
      main_image
      published
      search_description
      updated_at
      locale_code
    }
    author_articles {
      author {
        first_names
        last_name
        photoUrl
        slug
        twitter
        author_translations(order_by: {id: desc}, limit: 1) {
          bio
          title
          locale_code
        }
      }
    }
    category {
      slug
      category_translations(order_by: {id: desc}, limit: 1) {
        locale_code
        title
      }
    }
  }
}`;

const HASURA_GET_HOMEPAGE_LAYOUT_BY_ID = `query FrontendGetHomepageLayoutByID($id: Int!) {
  homepage_layout_schemas_by_pk(id: $id) {
    id
    data
    name
  }
}`;

export function hasuraGetHomepageLayout(params) {
  return fetchGraphQL({
    url: params['url'],
    site: params['site'],
    query: HASURA_GET_HOMEPAGE_LAYOUT_BY_ID,
    name: 'FrontendGetHomepageLayoutByID',
    variables: {
      id: params['id'],
    },
  });
}

const HASURA_UPSERT_LAYOUT = `mutation FrontendUpsertHomepageLayoutSchema($name: String!, $data: jsonb!) {
  insert_homepage_layout_schemas(objects: {name: $name, data: $data}, on_conflict: {constraint: homepage_layout_schemas_name_organization_id_key, update_columns: [name, data]}) {
    returning {
      id
      name
    }
  }
}`;

export function hasuraUpdateHomepageLayout(params) {
  return fetchGraphQL({
    url: params['url'],
    site: params['site'],
    query: HASURA_UPDATE_HOMEPAGE_LAYOUT_SCHEMA,
    name: 'FrontendUpdateHomepageLayoutSchema',
    variables: {
      id: params['id'],
      name: params['name'],
      data: params['data'],
    },
  });
}
export function hasuraUpsertHomepageLayout(params) {
  return fetchGraphQL({
    url: params['url'],
    orgSlug: params['orgSlug'],
    query: HASURA_UPSERT_LAYOUT,
    name: 'FrontendUpsertHomepageLayoutSchema',
    variables: {
      name: params['name'],
      data: params['data'],
    },
  });
}

export async function hasuraStreamArticles(params) {
  return fetchGraphQL({
    url: process.env.HASURA_API_URL,
    site: params['site'],
    query: HASURA_GET_STREAM_ARTICLES,
    name: 'FrontendGetStreamArticles',
    variables: {
      ids: params['ids'],
      limit: params['limit'],
    },
  });
}

export async function hasuraListHomepageLayoutSchemas(params) {
  return fetchGraphQL({
    url: params['url'],
    site: params['site'],
    query: HASURA_LIST_HOMEPAGE_LAYOUT_SCHEMAS,
    name: 'FrontendListHomepageLayoutSchemas',
  });
}
