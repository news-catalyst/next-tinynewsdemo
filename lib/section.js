import { fetchGraphQL } from './graphql';
import _ from 'lodash';

const HASURA_CATEGORY_PAGE = `query FrontendCategoryPage($category_slug: String!, $locale_code: String!) {
  articles(order_by: {article_translations_aggregate: {min: {first_published_at: desc}}}, where: {article_translations: {published: {_eq: true}, locale_code: {_eq: $locale_code}}, category: {slug: {_eq: $category_slug}}}) {
    article_translations(where: {locale_code: {_eq: $locale_code}, published: {_eq: true}},  order_by: {id: desc}, limit: 1) {
      custom_byline
      facebook_description
      facebook_title
      first_published_at
      headline
      last_published_at
      main_image
      search_description
      search_title
      twitter_description
      twitter_title
      locale_code
    }
    category {
      slug
      published
      id
      category_translations(where: {locale_code: {_eq: $locale_code}}, order_by: {id: desc}, limit: 1) {
        locale_code
        title
      }
    }
    slug
    author_articles {
      author {
        first_names
        last_name
        photoUrl
        slug
        author_translations(where: {locale_code: {_eq: $locale_code}}, order_by: {id: desc}, limit: 1) {
          locale_code
          title
        }
      }
    }
  }
  categories {
    category_translations(where: {locale_code: {_eq: $locale_code}}, order_by: {id: desc}, limit: 1) {
      title
      locale_code
    }
    published
    slug
  }
  organization_locales {
    locale {
      code
      name
    }
  }
  site_metadatas(where: {published: {_eq: true}, site_metadata_translations: {locale_code: {_eq: $locale_code}}}) {
    site_metadata_translations(order_by: {id: desc}, limit: 1, where: {locale_code: {_eq: $locale_code}}) {
      data
      locale_code
    }
  }
  tags(where: {published: {_eq: true}}) {
    slug
    tag_translations(where: {locale_code: {_eq: $locale_code}}, order_by: {id: desc}, limit: 1) {
      locale_code
      title
    }
  }
}`;

const HASURA_LIST_ALL_SECTIONS_BY_LOCALE = `query FrontendListAllSectionsByLocale($localeCode: String) {
  organization_locales {
    locale {
      code
    }
  }
  categories(order_by: {slug: asc}, where: {category_translations: {locale_code: {_eq: $localeCode}}}) {
    id
    category_translations(where: {locale_code: {_eq: $localeCode}}, order_by: {id: desc}, limit: 1) {
      locale_code
      title
    }
    published
    slug
    articles_aggregate {
      aggregate {
        count
      }
    }
  }
}`;
const HASURA_LIST_ALL_SECTIONS = `query FrontendListAllSections {
  categories {
    category_translations(where: {locale_code: {_eq: $locale_code}}, order_by: {id: desc}, limit: 1) {
      title
      locale_code
    }
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

const HASURA_INSERT_SECTION = `mutation insert_single_category($locale_code: String, $title: String, $published: Boolean, $slug: String) {
  insert_categories_one(object: {slug: $slug, published: $published, category_translations: {data: {locale_code: $locale_code, title: $title}, on_conflict: {constraint: category_translations_locale_code_category_id_key, update_columns: title}}}, on_conflict: {constraint: categories_organization_id_slug_key, update_columns: title}) {
    id
    category_translations {
      title
      locale_code
    }
    slug
  }
}`;

const HASURA_GET_SECTION_BY_ID = `query FrontendGetSectionByID($id: Int!, $localeCode: String, $_eq: String = "") {
  organization_locales {
    locale {
      code
    }
  }
  categories_by_pk(id: $id) {
    id
    published
    category_translations(where: {locale_code: {_eq: $localeCode}}, order_by: {id: desc}, limit: 1) {
      locale_code
      title
    }
    slug
    articles_aggregate {
      aggregate {
        count
      }
      nodes {
        id
        slug
        article_translations(where: {published: {_eq: true}, locale_code: {_eq: $localeCode}}, order_by: {id: desc}, limit: 1) {
          locale_code
          headline
        }
      }
    }
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
const HASURA_LIST_CATEGORY_PAGE_PATHS = `query FrontendListCategoryPagePaths {
  organizations(where: {_or: [{subdomain: {_is_null: false}}, {customDomain: {_is_null: false}}]}) {
    customDomain
    subdomain
    organization_locales {
      locale {
        code
      }
    }
    categories(where: {published: {_eq: true}}) {
      id
      slug
      category_translations {
        locale_code
        title
      }
      
    }
  }
}`;
export async function hasuraCategoryPage(params) {
  let url = params['url'] || process.env.HASURA_API_URL;

  return fetchGraphQL({
    url: url,
    site: params['site'],
    query: HASURA_CATEGORY_PAGE,
    name: 'FrontendCategoryPage',
    variables: {
      locale_code: params['localeCode'],
      category_slug: params['categorySlug'],
    },
  });
}

export async function listCategoryPagePaths(params) {
  return fetchGraphQL({
    url: params['url'],
    adminSecret: params['adminSecret'],
    query: HASURA_LIST_CATEGORY_PAGE_PATHS,
    name: 'FrontendListCategoryPagePaths',
  });
}

export function hasuraListAllSections(params) {
  return fetchGraphQL({
    url: params['url'],
    orgSlug: params['orgSlug'],
    query: HASURA_LIST_ALL_SECTIONS,
    name: 'FrontendListAllSections',
  });
}

export async function generateAllCategoryPagePaths(params = {}) {
  const { errors, data } = await listCategoryPagePaths(params);
  if (errors) {
    throw errors;
  }

  let allPaths = [];
  for (let i = 0; i < data.organizations.length; i++) {
    let org = data.organizations[i];

    for (let x = 0; x < org.categories.length; x++) {
      let category = org.categories[x];
      let siteParams = Object.assign({}, params['urlParams']);
      if (org.subdomain) {
        siteParams['site'] = org.subdomain;
      } else if (org.customDomain) {
        siteParams['site'] = org.customDomain;
      }
      siteParams['category'] = category.slug;
      allPaths.push({
        params: siteParams,
      });
    }
  }

  return allPaths;
}
export function hasuraListAllSectionsByLocale(params) {
  return fetchGraphQL({
    url: params['url'],
    site: params['site'],
    query: HASURA_LIST_ALL_SECTIONS_BY_LOCALE,
    name: 'FrontendListAllSectionsByLocale',
    variables: {
      localeCode: params['localeCode'],
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

export function hasuraCreateSection(params) {
  return fetchGraphQL({
    url: params['url'],
    site: params['site'],
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
    site: params['site'],
    query: HASURA_GET_SECTION_BY_ID,
    name: 'FrontendGetSectionByID',
    variables: {
      id: params['id'],
      localeCode: params['localeCode'],
    },
  });
}
export function hasuraUpdateSection(params) {
  return fetchGraphQL({
    url: params['url'],
    site: params['site'],
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
