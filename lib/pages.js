import { fetchGraphQL } from './graphql';

const HASURA_GET_PAGE_SLUG_VERSION = `query FrontendGetPageSlugVersion($slug: String!, $locale_code: String!) {
  page_slug_versions(where: {slug: {_eq: $slug}, page: {page_translations: {published: {_eq: true}, locale_code: {_eq: $locale_code}}}}) {
    slug
    page {
      id
      author_pages {
        author {
          id
          first_names
          last_name
          slug
          photoUrl
          author_translations(where: {locale_code: {_eq: $locale_code}}, order_by: {id: desc}, limit: 1) {
            title
            locale_code
          }
        }
      }
      page_translations(where: {published: {_eq: true}, locale_code: {_eq: $locale_code}}, order_by: {id: desc}, limit: 1) {
        content
        facebook_description
        facebook_title
        first_published_at
        headline
        last_published_at
        locale_code
        locale {
          code
          name
        }
        published
        search_description
        search_title
        twitter_description
        twitter_title
      }
      slug
    }
  }
  authors(order_by: {last_name: asc}) {
    id
    first_names
    last_name
    created_at
    slug
    staff
    twitter
    photoUrl
    published
    author_translations(where: {locale_code: {_eq: $locale_code}}, order_by: {id: desc}, limit: 1) {
      title
      bio
      locale_code
    }
  }
  categories(where: {category_translations: {locale_code: {_eq: $locale_code}}}) {
    slug
    published
    category_translations(where: {locale_code: {_eq: $locale_code}}, order_by: {id: desc}, limit: 1) {
      title
      locale_code
    }
  }
  organization_locales {
    locale {
      code
      name
    }
  }
  pages(where: {slug: {_eq: $slug}, page_translations: {published: {_eq: true}, locale_code: {_eq: $locale_code}}}) {
    page_translations(where: {locale_code: {_eq: $locale_code}}, order_by: {id: desc}, limit: 1) {
      locale {
        code
        name
      }
      id
    }
  }
  site_metadatas(where: {site_metadata_translations: {locale_code: {_eq: $locale_code}}, published: {_eq: true}}) {
    site_metadata_translations(where: {locale_code: {_eq: $locale_code}}, order_by: {id: desc}, limit: 1) {
      data
      locale_code
    }
  }
}`;

export function hasuraGetPage(params) {
  return fetchGraphQL({
    url: params['url'],
    site: params['site'],
    query: HASURA_GET_PAGE_SLUG_VERSION,
    name: 'FrontendGetPageSlugVersion',
    variables: {
      locale_code: params['localeCode'],
      slug: params['slug'],
    },
  });
}

const HASURA_GET_PAGE_PREVIEW = `query FrontendGetPagePreview($slug: String!, $locale_code: String!) {
  page_slug_versions(where: {slug: {_eq: $slug}, page: {page_translations: {locale_code: {_eq: $locale_code}}}}) {
    slug
    page {
      id
      author_pages {
        author {
          id
          first_names
          last_name
          slug
          photoUrl
          author_translations(where: {locale_code: {_eq: $locale_code}}, order_by: {id: desc}, limit: 1) {
            title
          }
        }
      }
      page_translations(where: {locale_code: {_eq: $locale_code}}, order_by: {id: desc}, limit: 1) {
        content
        facebook_description
        facebook_title
        first_published_at
        headline
        last_published_at
        locale_code
        locale {
          code
          name
        }
        published
        search_description
        search_title
        twitter_description
        twitter_title
      }
      slug
    }
  }
  authors(order_by: {last_name: asc}) {
    id
    first_names
    last_name
    created_at
    slug
    staff
    twitter
    photoUrl
    published
    author_translations(where: {locale_code: {_eq: $locale_code}}, order_by: {id: desc}, limit: 1) {
      title
      bio
    }
  }
  categories(where: {category_translations: {locale_code: {_eq: $locale_code}}}) {
    slug
    published
    category_translations(where: {locale_code: {_eq: $locale_code}}, order_by: {id: desc}, limit: 1) {
      title
    }
  }
  organization_locales {
    locale {
      code
      name
    }
  }
  pages(where: {slug: {_eq: $slug}}) {
    page_translations(where: {locale_code: {_eq: $locale_code}}, order_by: {id: desc}, limit: 1) {
      locale {
        code
        name
      }
      id
    }
  }
  site_metadatas(where: {site_metadata_translations: {locale_code: {_eq: $locale_code}}, published: {_eq: true}}) {
    site_metadata_translations(where: {locale_code: {_eq: $locale_code}}, order_by: {id: desc}, limit: 1) {
      data
    }
  }
}`;

export function hasuraGetPagePreview(params) {
  // console.log('url:', params['url'], 'orgSlug:', params['orgSlug']);
  return fetchGraphQL({
    url: params['url'],
    orgSlug: params['orgSlug'],
    query: HASURA_GET_PAGE_PREVIEW,
    name: 'FrontendGetPagePreview',
    variables: {
      slug: params['slug'],
      locale_code: 'en-US',
    },
  });
}

const HASURA_LIST_PAGE_SLUGS_PREVIEW = `query FrontendListPageSlugsPreview {
  pages {
    slug
    page_translations(distinct_on: locale_code) {
      locale_code
      published
      headline
    }
  }
}`;

const HASURA_LIST_PAGE_SLUGS = `query FrontendListPageSlugs {
  pages(where: {page_translations: {published: {_eq: true}}}) {
    slug
    page_translations(where: {published: {_eq: true}}, distinct_on: locale_code) {
      locale_code
      published
      headline
    }
  }
}`;

export async function hasuraListAllPageSlugsPreview(params = {}) {
  let url = params['url'] || process.env.HASURA_API_URL;
  let orgSlug = params['orgSlug'] || process.env.ORG_SLUG;
  return fetchGraphQL({
    url: url,
    orgSlug: orgSlug,
    query: HASURA_LIST_PAGE_SLUGS_PREVIEW,
    name: 'FrontendListPageSlugsPreview',
  });
}
export async function hasuraListAllPageSlugs(params = {}) {
  let url = params['url'] || process.env.HASURA_API_URL;
  let orgSlug = params['orgSlug'] || process.env.ORG_SLUG;
  return fetchGraphQL({
    url: url,
    orgSlug: orgSlug,
    query: HASURA_LIST_PAGE_SLUGS,
    name: 'FrontendListPageSlugs',
  });
}
const HASURA_CREATE_PAGE = `mutation FrontendTestingCreatePage($slug: String!, $locale_code: String!, $created_by_email: String, $document_id: String, $url: String, $facebook_title: String, $facebook_description: String, $search_title: String, $search_description: String, $headline: String, $twitter_title: String, $twitter_description: String, $content: jsonb, $published: Boolean) {
  insert_pages(
    objects: {
      page_google_documents: {
        data: {
          google_document: {
            data: {
              document_id: $document_id, locale_code: $locale_code, url: $url
            },
            on_conflict: {
              constraint: google_documents_organization_id_document_id_key,
              update_columns: [document_id]
            }
          }
        },
        on_conflict: {
          constraint: page_google_documents_page_id_google_document_id_key,
          update_columns: [google_document_id]
        }
      },
      slug: $slug,
      page_translations: {
        data: {
          created_by_email: $created_by_email, published: $published, search_description: $search_description, search_title: $search_title, twitter_description: $twitter_description, twitter_title: $twitter_title, locale_code: $locale_code, headline: $headline, facebook_title: $facebook_title, facebook_description: $facebook_description, content: $content
        }
      }
    },
    on_conflict: {
      constraint: pages_slug_organization_id_key,
      update_columns: [slug, updated_at]
    }) {
    returning {
      id
      slug
      page_google_documents {
        id
        google_document {
          document_id
          locale_code
          url
        }
      }
      page_translations(where: { locale_code: {_eq: $locale_code}}, order_by: {id: desc}, limit: 1) {
        published
      }
    }
  }
}`;

export async function hasuraCreatePage(params) {
  let url = params['url'] || process.env.HASURA_API_URL;
  let orgSlug = params['orgSlug'] || process.env.ORG_SLUG;
  return fetchGraphQL({
    url: url,
    orgSlug: orgSlug,
    query: HASURA_CREATE_PAGE,
    name: 'FrontendTestingCreatePage',
    variables: {
      published: params['published'],
      slug: params['slug'],
      locale_code: params['locale_code'],
      headline: params['headline'],
      content: params['content'],
      search_title: params['search_title'],
      search_description: params['search_description'],
      document_id: params['document_id'],
      created_by_email: params['created_by_email'],
    },
  });
}
