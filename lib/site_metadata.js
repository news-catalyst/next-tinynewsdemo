import _ from 'lodash';
import { fetchGraphQL } from './graphql';

const HASURA_UPSERT_METADATA = `mutation FrontendUpsertMetadata($published: Boolean, $data: jsonb, $locale_code: String) {
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
    site: params['site'],
    query: HASURA_UPSERT_METADATA,
    name: 'FrontendUpsertMetadata',
    variables: {
      data: params['data'],
      published: params['published'],
      locale_code: 'en-US',
    },
  });
}

const HASURA_GET_METADATA_BY_LOCALE = `query FrontendGetMetadataByLocale($locale_code: String!) {
  organization_locales {
    locale {
      code
    }
  }
  site_metadatas(where: {site_metadata_translations: {locale_code: {_eq: $locale_code}}}) {
    id
    published
    site_metadata_translations(where: {locale_code: {_eq: $locale_code}}, order_by: {id: desc}, limit: 1) {
      data
      locale_code
    }
  }
  authors {
    first_names
    last_name
    slug
  }
  categories {
    slug
    category_translations(where: {locale_code: {_eq: $locale_code}}, order_by: {id: desc}, limit: 1) {
      title
      locale_code
    }
  }
  pages {
    slug
    page_translations(where: {locale_code: {_eq: $locale_code}}, order_by: {id: desc}, limit: 1) {
      headline
      locale_code
    }
  }
  tags {
    slug
    tag_translations(where: {locale_code: {_eq: $locale_code}}, order_by: {id: desc}, limit: 1) {
      title
      locale_code
    }
  }
}`;

export function hasuraGetMetadataByLocale(params) {
  return fetchGraphQL({
    url: params['url'],
    site: params['site'],
    query: HASURA_GET_METADATA_BY_LOCALE,
    name: 'FrontendGetMetadataByLocale',
    variables: {
      locale_code: params['localeCode'],
    },
  });
}

const HASURA_GET_SITE_METADATA = `query FrontendGetSiteMetadata($locale_code: String!) {
  site_metadatas(where: {site_metadata_translations: {locale_code: {_eq: $locale_code}}, published: {_eq: true}}) {
    site_metadata_translations(where: {locale_code: {_eq: $locale_code}}, order_by: {id: desc}, limit: 1) {
      data
      locale_code
    }
  }
}`;

export async function hasuraGetSiteMetadata(params) {
  return fetchGraphQL({
    url: params['url'],
    site: params['site'],
    query: HASURA_GET_SITE_METADATA,
    name: 'FrontendGetSiteMetadata',
    variables: {
      locale_code: params['localeCode'],
    },
  });
}
