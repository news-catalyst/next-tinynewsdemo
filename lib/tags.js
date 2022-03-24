import { fetchGraphQL } from './graphql';

const HASURA_LIST_TAGS_BY_LOCALE = `query FrontendListTagsByLocale($locale_code: String!) {
  organization_locales {
    locale {
      code
    }
  }
  tags(where: {published: {_eq: true}}, order_by: {slug: asc}) {
    id
    slug
    tag_translations(where: {locale_code: {_eq: $locale_code}}, order_by: {id: desc}, limit: 1) {
      locale_code
      title
    }
    tag_articles_aggregate {
      aggregate {
        count
      }
    }
  }
}`;

const HASURA_LIST_TAGS = `query FrontendListTags {
  organization_locales {
    locale {
      code
    }
  }
  tags(where: {published: {_eq: true}}) {
    id
    slug
    tag_translations {
      locale_code
      title
    }
  }
}`;

const HASURA_TAG_PAGE = `query FrontendTagPage($tag_slug: String!, $locale_code: String!) {
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
  tags(where: {slug: {_eq: $tag_slug}, published: {_eq: true}, tag_translations: {locale_code: {_eq: $locale_code}}}) {
    id
    slug
    tag_translations(where: {locale_code: {_eq: $locale_code}}, order_by: {id: desc}, limit: 1) {
      title
      locale_code
    }
    tag_articles(where: {article: {article_translations: {published: {_eq: true}, locale_code: {_eq: $locale_code}}}}, order_by: {article: {article_translations_aggregate: {min: {first_published_at: desc}}}}) {
      article {
        article_translations(where: {locale_code: {_eq: $locale_code}}, order_by: {id: desc}, limit: 1) {
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
          id
          category_translations(where: {locale_code: {_eq: $locale_code}}, order_by: {id: desc}, limit: 1) {
            title
            locale_code
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
              title
              locale_code
            }
          }
        }
      }
    }
  }
}
`;

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
const HASURA_INSERT_TAG = `mutation insert_single_tag($locale_code: String, $title: String, $published: Boolean, $slug: String) {
  insert_tags_one(object: {slug: $slug, published: $published, tag_translations: {data: {locale_code: $locale_code, title: $title}}}) {
    id
    slug
    tag_translations {
      locale_code
      title
    }
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
const DELETE_TAG_MUTATION = `mutation DeleteSingleTag($id: Int!) {
  delete_tag_translations(where: {tag_id: {_eq: $id}}) {
    affected_rows
  }
  delete_tag_articles(where: {tag_id: {_eq: $id}}) {
    affected_rows
  }
  delete_tags(where: {id: {_eq: $id}}) {
    affected_rows
  }
}`;
const HASURA_LIST_TAG_PAGE_PATHS = `query FrontendListTagPagePaths {
  organizations(where: {_or: [{subdomain: {_is_null: false}}, {customDomain: {_is_null: false}}]}) {
    customDomain
    subdomain
    organization_locales {
      locale {
        code
      }
    }
    tags(where: {published: {_eq: true}}) {
      id
      slug
      tag_translations {
        locale_code
        title
      }
    }
  }
}`;
export function hasuraListAllTags(params) {
  return fetchGraphQL({
    url: params['url'],
    orgSlug: params['orgSlug'],
    query: HASURA_LIST_TAGS,
    name: 'FrontendListTags',
  });
}

export function hasuraListAllTagsByLocale(params) {
  return fetchGraphQL({
    url: params['url'],
    site: params['site'],
    query: HASURA_LIST_TAGS_BY_LOCALE,
    name: 'FrontendListTagsByLocale',
    variables: {
      locale_code: 'en-US',
    },
  });
}

export async function hasuraTagPage(params) {
  let url = params['url'] || process.env.HASURA_API_URL;
  return fetchGraphQL({
    url: url,
    site: params['site'],
    query: HASURA_TAG_PAGE,
    name: 'FrontendTagPage',
    variables: {
      locale_code: params['localeCode'],
      tag_slug: params['tagSlug'],
    },
  });
}

export async function listTagPagePaths(params) {
  return fetchGraphQL({
    url: params['url'],
    adminSecret: params['adminSecret'],
    query: HASURA_LIST_TAG_PAGE_PATHS,
    name: 'FrontendListTagPagePaths',
  });
}

export async function generateAllTagPagePaths(params = {}) {
  const { errors, data } = await listTagPagePaths(params);
  if (errors) {
    throw errors;
  }

  let allPaths = [];
  for (let i = 0; i < data.organizations.length; i++) {
    let org = data.organizations[i];

    for (let x = 0; x < org.tags.length; x++) {
      let tag = org.tags[x];
      let siteParams = Object.assign({}, params['urlParams']);
      if (org.subdomain) {
        siteParams['site'] = org.subdomain;
      } else if (org.customDomain) {
        siteParams['site'] = org.customDomain;
      }
      siteParams['slug'] = tag.slug;
      allPaths.push({
        params: siteParams,
      });
    }
  }

  return allPaths;
}

export function deleteSingleTag(params) {
  return fetchGraphQL({
    url: params['url'],
    site: params['site'],
    query: DELETE_TAG_MUTATION,
    name: 'DeleteSingleTag',
    variables: {
      id: params['id'],
    },
  });
}

export function hasuraCreateTag(params) {
  return fetchGraphQL({
    url: params['url'],
    site: params['site'],
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
export function hasuraGetTagById(params) {
  return fetchGraphQL({
    url: params['url'],
    site: params['site'],
    query: HASURA_GET_TAG_BY_ID,
    name: 'FrontendGetTagByID',
    variables: {
      id: params['id'],
    },
  });
}
export function hasuraUpdateTag(params) {
  return fetchGraphQL({
    url: params['url'],
    site: params['site'],
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
