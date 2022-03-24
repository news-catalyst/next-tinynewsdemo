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

const HASURA_HOMEPAGE_EDITOR = `query FrontendHomepageEditor($locale_code: String) {
  homepage_layout_schemas {
    id
    name
    data
  }
  homepage_layout_datas {
    first_article {
      id
      article_translations(where: {published: {_eq: true}, locale_code: {_eq: $locale_code}}, order_by: {id: desc}, limit: 1) {
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
        updated_at
        locale_code
      }
      category {
        slug
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
      tag_articles(where: {tag: {published: {_eq: true}, tag_translations: {locale_code: {_eq: $locale_code}}}}) {
        tag {
          tag_translations(where: {locale_code: {_eq: $locale_code}}, order_by: {id: desc}, limit: 1) {
            locale_code
            title
          }
          slug
        }
      }
    }
    homepage_layout_schema {
      id
      name
      data
    }
    second_article {
      id
      article_translations(where: {published: {_eq: true}, locale_code: {_eq: $locale_code}}, order_by: {id: desc}, limit: 1) {
        main_image
        custom_byline
        facebook_description
        facebook_title
        first_published_at
        headline
        last_published_at
        search_description
        search_title
        twitter_description
        twitter_title
        updated_at
        locale_code
      }
      category {
        slug
        id
        category_translations(order_by: {id: desc}, limit: 1) {
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
          author_translations(order_by: {id: desc}, limit: 1) {
            locale_code
            title
          }
        }
      }
      tag_articles(where: {tag: {published: {_eq: true}}}) {
        tag {
          tag_translations(order_by: {id: desc}, limit: 1) {
            locale_code
            title
          }
          slug
        }
      }
    }
    third_article {
      id
      article_translations(where: {published: {_eq: true}, locale_code: {_eq: $locale_code}}, order_by: {id: desc}, limit: 1) {
        main_image
        custom_byline
        facebook_description
        facebook_title
        first_published_at
        headline
        last_published_at
        search_description
        search_title
        twitter_description
        twitter_title
        updated_at
        locale_code
      }
      category {
        slug
        id
        category_translations(order_by: {id: desc}, limit: 1) {
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
          author_translations(order_by: {id: desc}, limit: 1) {
            locale_code
            title
          }
        }
      }
      tag_articles(where: {tag: {published: {_eq: true}}}) {
        tag {
          tag_translations(order_by: {id: desc}, limit: 1) {
            title
            locale_code
          }
          slug
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
  pages(where: {page_translations: {published: {_eq: true}, locale_code: {_eq: $locale_code}}}) {
    slug
    page_translations(where: {published: {_eq: true}, locale_code: {_eq: $locale_code}}, distinct_on: locale_code) {
      locale_code
      published
      headline
    }
  }
  site_metadatas(where: {published: {_eq: true}, site_metadata_translations: {locale_code: {_eq: $locale_code}}}) {
    site_metadata_translations(where: {locale_code: {_eq: $locale_code}}, order_by: {id: desc}, limit: 1) {
      data
      locale_code
    }
  }
  tags(where: {published: {_eq: true}, tag_translations: {locale_code: {_eq: $locale_code}}}) {
    id
    slug
    tag_translations(where: {locale_code: {_eq: $locale_code}}, order_by: {id: desc}, limit: 1) {
      title
      locale_code
    }
  }
}`;

export function hasuraGetHomepageEditor(params) {
  return fetchGraphQL({
    url: params['url'],
    site: params['site'],
    query: HASURA_HOMEPAGE_EDITOR,
    name: 'FrontendHomepageEditor',
    variables: {
      locale_code: params['localeCode'],
    },
  });
}

const HASURA_UPSERT_HOMEPAGE = `mutation upsert_homepage_layout_data($homepage_layout_schema_id: Int!, $article_priority_1: Int, $article_priority_2: Int, $article_priority_3: Int) {
  insert_homepage_layout_datas(objects: [{article_priority_1: $article_priority_1, article_priority_2: $article_priority_2, article_priority_3: $article_priority_3, homepage_layout_schema_id: $homepage_layout_schema_id}], on_conflict: {constraint: homepage_layout_datas_organization_id_key, update_columns: [article_priority_1, article_priority_2, article_priority_3, homepage_layout_schema_id]}) {
    returning {
      id
      homepage_layout_schema_id
      article_priority_1
      article_priority_2
      article_priority_3
    }
  }
}`;

export function hasuraSaveHomepageLayout(params) {
  return fetchGraphQL({
    url: params['url'],
    site: params['site'],
    query: HASURA_UPSERT_HOMEPAGE,
    name: 'upsert_homepage_layout_data',
    variables: {
      homepage_layout_schema_id: params['schemaId'],
      article_priority_1: params['article1'],
      article_priority_2: params['article2'],
      article_priority_3: params['article3'],
    },
  });
}

const HASURA_GET_HOMEPAGE_LAYOUTS = `query FrontendGetHomepageLayouts {
  homepage_layout_schemas {
    id
    name
    data
  }
}`;

export function hasuraGetHomepageLayouts(params) {
  return fetchGraphQL({
    url: params['url'],
    orgSlug: params['orgSlug'],
    query: HASURA_GET_HOMEPAGE_LAYOUTS,
    name: 'FrontendGetHomepageLayouts',
  });
}
