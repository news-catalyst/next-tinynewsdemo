import { fetchGraphQL } from './utils';
import _ from 'lodash';

const HASURA_GET_TAG_BY_ID = `query FrontendGetTagByID($id: Int!) {
  organization_locales {
    locale {
      code
    }
  }
  tags_by_pk(id: $id) {
    id
    published
    tag_translations {
      title
    }
    slug
  }
}`;

const HASURA_LIST_ALL_SECTIONS_BY_LOCALE = `query FrontendListAllSectionsByLocale($locale_code: String = "") {
  organization_locales {
    locale {
      code
    }
  }
  categories {
    id
    category_translations(where: {locale_code: {_eq: $locale_code}}) {
      title
    }
    published
    slug
  }
}`;

const HASURA_UPSERT_SECTION = `mutation FrontendUpsertSection($locale_code: String!, $title: String!, $slug: String!, $published: Boolean) {
  insert_categories(objects: {slug: $slug, category_translations: {data: {locale_code: $locale_code, title: $title}, on_conflict: {constraint: category_translations_locale_code_category_id_key, update_columns: [title]}}, published: $published}, on_conflict: {constraint: categories_organization_id_slug_key, update_columns: [slug, published]}) {
    returning {
      id
      slug
      published
    }
  }
}`;

const HASURA_INSERT_TAG = `mutation insert_single_tag($locale_code: String, $title: String, $published: Boolean, $slug: String) {
  insert_tags_one(object: {slug: $slug, published: $published, tag_translations: {data: {locale_code: $locale_code, title: $title}}}) {
    id
    slug
  }
}`;

const HASURA_INSERT_SECTION = `mutation insert_single_category($locale_code: String, $title: String, $published: Boolean, $slug: String) {
  insert_categories_one(object: {slug: $slug, published: $published, category_translations: {data: {locale_code: $locale_code, title: $title}}}) {
    id
    slug
  }
}`;

const HASURA_GET_SECTION_BY_ID = `query FrontendGetSectionByID($id: Int!) {
  organization_locales {
    locale {
      code
    }
  }
  categories_by_pk(id: $id) {
    id
    published
    category_translations {
      title
    }
    slug
  }
}`;

const HASURA_UPDATE_TAG = `mutation updateTagWithTranslations($tag_id: Int!, $locale_code: String!, $title: String, $published: Boolean, $slug: String) {
  delete_tag_translations(where: {tag_id: {_eq: $tag_id}, locale_code: {_eq: $locale_code}}) {
    affected_rows
  }
  insert_tag_translations(objects: [{tag_id: $tag_id, locale_code: $locale_code, title: $title}]) {
    affected_rows
  }
  update_tags_by_pk(pk_columns: {id: $tag_id}, _set: {published: $published, slug: $slug}) {
    published
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
    name: 'FrontendListAllSectionsByLocale',
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
    name: 'FrontendUpsertSection',
    variables: {
      locale_code: params['localeCode'],
      slug: params['slug'],
      published: params['published'],
      title: params['title'],
    },
  });
}

export function hasuraCreateTag(params) {
  return fetchGraphQL({
    url: params['url'],
    orgSlug: params['orgSlug'],
    query: HASURA_INSERT_TAG,
    name: 'insert_single_tag',
    variables: {
      locale_code: params['localeCode'],
      title: params['title'],
      published: params['published'],
      slug: params['slug'],
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

export function hasuraGetTagById(params) {
  return fetchGraphQL({
    url: params['url'],
    orgSlug: params['orgSlug'],
    query: HASURA_GET_TAG_BY_ID,
    name: 'FrontendGetTagByID',
    variables: {
      id: params['id'],
    },
  });
}

export function hasuraGetSectionById(params) {
  return fetchGraphQL({
    url: params['url'],
    orgSlug: params['orgSlug'],
    query: HASURA_GET_SECTION_BY_ID,
    name: 'FrontendGetSectionByID',
    variables: {
      id: params['id'],
    },
  });
}

export function hasuraUpdateTag(params) {
  return fetchGraphQL({
    url: params['url'],
    orgSlug: params['orgSlug'],
    query: HASURA_UPDATE_TAG,
    name: 'updateTagWithTranslations',
    variables: {
      tag_id: params['id'],
      locale_code: params['localeCode'],
      title: params['title'],
      published: params['published'],
      slug: params['slug'],
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
