import { fetchGraphQL } from './graphql';

const HASURA_SEARCH_ARTICLES = `query FrontendSearchArticles($locale_code: String!, $term: String!) {
  articles(where: {article_translations: {headline: {_ilike: $term}, locale_code: {_eq: $locale_code}, published: {_eq: true}}}) {
    id
    article_translations(where: {locale_code: {_eq: $locale_code}, published: {_eq: true}}, order_by: {id: desc}, limit: 1) {
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
    }
    category {
      slug
      id
      category_translations(where: {locale_code: {_eq: $locale_code}}, order_by: {id: desc}, limit: 1) {
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
          title
        }
      }
    }
    tag_articles(where: {tag: {published: {_eq: true}, tag_translations: {locale_code: {_eq: $locale_code}}}}) {
      tag {
        tag_translations(order_by: {id: desc}, limit: 1) {
          title
        }
        slug
      }
    }
  }
}`;

const HASURA_PREVIEW_ARTICLE_PAGE = `query FrontendPreviewArticlePage($slug: String!, $category_slug: String!, $locale_code: String!) {
  articles(where: {slug: {_eq: $slug}, article_translations: {locale_code: {_eq: $locale_code}}, category: {slug: {_eq: $category_slug}}}) {
    published_article_translations(where: {locale_code: {_eq: $locale_code}}) {
      article_translation {
        id
        first_published_at
        last_published_at
      }
    }
    article_translations(where: {locale_code: {_eq: $locale_code}}, order_by: {id: desc}, limit: 1) {
      id
      content
      custom_byline
      facebook_description
      facebook_title
      first_published_at
      headline
      last_published_at
      locale_code
      search_description
      search_title
      twitter_description
      twitter_title
      updated_at
    }
    category {
      slug
      id
      category_translations(where: {locale_code: {_eq: $locale_code}}) {
        title
      }
    }
    canonical_url
    slug
    author_articles {
      author {
        first_names
        last_name
        photoUrl
        slug
        author_translations(where: {locale_code: {_eq: $locale_code}}) {
          title
        }
      }
    }
    tag_articles(where: {tag: {published: {_eq: true}, tag_translations: {locale_code: {_eq: $locale_code}}}}) {
      tag {
        tag_translations {
          title
        }
        slug
      }
    }
  }
  categories {
    category_translations(where:{locale_code:{_eq: $locale_code}}) {
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
  published_article_translations(where: {article: {slug: {_eq: $slug}}}) {
    locale_code
  }
  tags(where: {published: {_eq: true}}) {
    id
    slug
    tag_translations(where: {locale_code: {_eq: $locale_code}}) {
      title
    }
  }
  site_metadatas(where: {site_metadata_translations: {locale_code: {_eq: $locale_code}}, published: {_eq: true}}) {
    site_metadata_translations(where: {locale_code: {_eq: $locale_code}}) {
      data
      locale_code
    }
  }
}`;

const HASURA_ARTICLE_PAGE_SLUG_VERSION = `query FrontendArticlePageSlugVersion($category_slug: String!, $slug: String!, $locale_code: String) {
  article_slug_versions(where: {slug: {_eq: $slug}, category_slug: {_eq: $category_slug}, article: {article_translations: {published: {_eq: true}, locale_code: {_eq: $locale_code}}}}) {
    article {
      article_translations(where: {published: {_eq: true}, locale_code: {_eq: $locale_code}}, order_by: {id: desc}, limit: 1) {
        id
        content
        custom_byline
        facebook_description
        facebook_title
        first_published_at
        headline
        last_published_at
        locale_code
        search_description
        search_title
        twitter_description
        twitter_title
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
      canonical_url
      slug
      author_articles {
        author {
          first_names
          last_name
          photoUrl
          twitter
          slug
          author_translations(where: {locale_code: {_eq: $locale_code}}, order_by: {id: desc}, limit: 1) {
            title
            locale_code
            bio
          }
        }
      }
      tag_articles(where: {tag: {published: {_eq: true}}}) {
        tag {
          tag_translations(where: {locale_code: {_eq: $locale_code}}, order_by: {id: desc}, limit: 1) {
            locale_code
            title
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
    id
    published
    slug
  }
  organization_locales {
    locale {
      code
      name
    }
  }
  tags(where: {published: {_eq: true}}) {
    id
    slug
    tag_translations(where: {locale_code: {_eq: $locale_code}}, order_by: {id: desc}, limit: 1) {
      locale_code
      title
    }
  }
  site_metadatas(where: {published: {_eq: true}, site_metadata_translations: {locale_code: {_eq: $locale_code}}}) {
    site_metadata_translations(where: {locale_code: {_eq: $locale_code}}, order_by: {id: desc}, limit: 1) {
      data
      locale_code
    }
  }
  published_article_translations(where: {article: {slug: {_eq: $slug}}}) {
    locale_code
  }
}`;

const HASURA_PREVIEW_ARTICLE_BY_SLUG = `query FrontendPreviewArticleBySlug($slug: String!, $locale_code: String!) {
  articles(where: {slug: {_eq: $slug}, article_translations: {locale_code: {_eq: $locale_code}}}) {
    slug
    article_translations(where: {locale_code: {_eq: $locale_code}}, order_by: {id: desc}, limit: 1) {
      content
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
    }
    category {
      slug
      id
      category_translations(where: {locale_code: {_eq: $locale_code}}, order_by: {id: desc}, limit: 1) {
        title
      }
    }
    author_articles {
      author {
        first_names
        last_name
        photoUrl
        slug
        twitter
        author_translations(where: {locale_code: {_eq: $locale_code}}, order_by: {id: desc}, limit: 1) {
          bio
          title
        }
      }
    }
  }
}`;

const HASURA_GET_ARTICLE_BY_SLUG = `query FrontendGetArticleBySlug($slug: String!, $locale_code: String!) {
  articles(where: {slug: {_eq: $slug}, article_translations: {locale_code: {_eq: $locale_code}, published: {_eq: true}}}) {
    slug
    article_translations(where: {locale_code: {_eq: $locale_code}, published: {_eq: true}}, order_by: {id: desc}, limit: 1) {
      content
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
    }
    category {
      slug
      id
      category_translations(where: {locale_code: {_eq: $locale_code}}, order_by: {id: desc}, limit: 1) {
        title
      }
    }
    author_articles {
      author {
        first_names
        last_name
        photoUrl
        slug
        twitter
        author_translations(where: {locale_code: {_eq: $locale_code}}, order_by: {id: desc}, limit: 1) {
          bio
          title
        }
      }
    }
  }
}`;

export function hasuraSearchArticles(params) {
  let term = '%' + params['term'] + '%';
  let searchVariables = {
    locale_code: params['localeCode'],
    term: term,
  };

  return fetchGraphQL({
    url: params['url'],
    site: params['site'],
    query: HASURA_SEARCH_ARTICLES,
    name: 'FrontendSearchArticles',
    variables: searchVariables,
  });
}

export function hasuraPreviewArticleBySlug(params) {
  return fetchGraphQL({
    url: params['url'],
    site: params['site'],
    query: HASURA_PREVIEW_ARTICLE_BY_SLUG,
    name: 'FrontendPreviewArticleBySlug',
    variables: {
      slug: params['slug'],
      locale_code: params['localeCode'],
    },
  });
}
export function hasuraGetArticleBySlug(params) {
  let url = params['url'] || process.env.HASURA_API_URL;
  let orgSlug = params['orgSlug'] || process.env.ORG_SLUG;
  return fetchGraphQL({
    url: url,
    orgSlug: orgSlug,
    query: HASURA_GET_ARTICLE_BY_SLUG,
    name: 'FrontendGetArticleBySlug',
    variables: {
      slug: params['slug'],
      locale_code: params['localeCode'],
    },
  });
}

const HASURA_LIST_ARTICLE_SLUGS = `query FrontendListArticlesPagePaths {
  organizations(where: {_or: [{subdomain: {_is_null: false}}, {customDomain: {_is_null: false}}]}) {
    customDomain
    subdomain
    organization_locales {
      locale {
        code
      }
    }
    articles(where: {article_translations: {published: {_eq: true}}}) {
      slug
      article_translations(where: {published: {_eq: true}}, distinct_on: locale_code) {
        locale_code
        published
      }
      category {
        slug
      }
    }
  }
}`;

export async function hasuraListAllArticleSlugs(params = {}) {
  let url = params['url'] || process.env.HASURA_API_URL;
  let adminSecret = params['adminSecret'] || process.env.HASURA_ADMIN_SECRET;
  return fetchGraphQL({
    url: url,
    adminSecret: adminSecret,
    query: HASURA_LIST_ARTICLE_SLUGS,
    name: 'FrontendListArticlesPagePaths',
  });
}

const HASURA_LIST_ARTICLE_PREVIEW_SLUGS = `query FrontendListArticlePreviewsPagePaths {
  organizations(where: {_or: [{subdomain: {_is_null: false}}, {customDomain: {_is_null: false}}]}) {
    customDomain
    subdomain
    organization_locales {
      locale {
        code
      }
    }
    articles {
      slug
      article_translations(distinct_on: locale_code) {
        locale_code
        published
      }
      category {
        slug
      }
    }
  }
}`;

export async function hasuraListAllArticlePreviewSlugs(params = {}) {
  let url = params['url'] || process.env.HASURA_API_URL;
  let adminSecret = params['adminSecret'] || process.env.HASURA_ADMIN_SECRET;
  return fetchGraphQL({
    url: url,
    adminSecret: adminSecret,
    query: HASURA_LIST_ARTICLE_PREVIEW_SLUGS,
    name: 'FrontendListArticlePreviewsPagePaths',
  });
}

export async function hasuraPreviewArticlePage(params) {
  let url = params['url'] || process.env.HASURA_API_URL;

  return fetchGraphQL({
    url: url,
    site: params['site'],
    query: HASURA_PREVIEW_ARTICLE_PAGE,
    name: 'FrontendPreviewArticlePage',
    variables: {
      slug: params['slug'],
      category_slug: params['categorySlug'],
      locale_code: params['localeCode'],
    },
  });
}

export async function hasuraArticlePage(params) {
  let url = params['url'] || process.env.HASURA_API_URL;
  return fetchGraphQL({
    url: url,
    site: params['site'],
    query: HASURA_ARTICLE_PAGE_SLUG_VERSION,
    name: 'FrontendArticlePageSlugVersion',
    variables: {
      category_slug: params['categorySlug'],
      slug: params['slug'],
      locale_code: params['localeCode'],
    },
  });
}

const HASURA_UPDATE_ARTICLE = `mutation FrontendTestingUpdateArticle($id: Int!, $locale_code: String!, $created_by_email: String, $headline: String!, $published: Boolean, $category_id: Int!, $slug: String!, $document_id: String, $url: String, $custom_byline: String, $content: jsonb, $facebook_description: String, $facebook_title: String, $search_description: String, $search_title: String, $twitter_description: String, $twitter_title: String, $article_sources: [article_source_insert_input!]!) {
  insert_articles(
    objects: {
      article_translations: {
        data: {
          created_by_email: $created_by_email,
          headline: $headline,
          locale_code: $locale_code,
          published: $published,
          content: $content,
          custom_byline: $custom_byline,
          facebook_description: $facebook_description,
          facebook_title: $facebook_title,
          search_description: $search_description,
          search_title: $search_title,
          twitter_description: $twitter_description,
          twitter_title: $twitter_title
        }
      },
      category_id: $category_id,
      slug: $slug,
      id: $id,
      article_sources: {
        data: $article_sources,
        on_conflict: {constraint: article_source_article_id_source_id_key, update_columns: article_id}
      },
      article_google_documents: {
        data: {
          google_document: {
            data: {
              document_id: $document_id,
              locale_code: $locale_code,
              url: $url
            },
            on_conflict: {
              constraint: google_documents_organization_id_document_id_key, update_columns: locale_code
            }
          }
        },
        on_conflict: {
          constraint: article_google_documents_article_id_google_document_id_key, update_columns: google_document_id
        }
      }
    },
    on_conflict: {
      constraint: articles_slug_category_id_organization_id_key, update_columns: [slug, updated_at]
    }
  ) {
    returning {
      id
      slug
      updated_at
      created_at
      article_google_documents {
        id
        google_document {
          document_id
          locale_code
          url
          id
        }
      }
      article_sources {
        source {
          affiliation
          age
          email
          ethnicity
          gender
          id
          name
          phone
          race
          role
          sexual_orientation
          zip
        }
      }
      category {
        slug
      }
      article_translations(where: { locale_code: {_eq: $locale_code}}, order_by: {id: desc}, limit: 1) {
        id
        article_id
        locale_code
        published
      }
      published_article_translations(where: {locale_code: {_eq: $locale_code}}) {
        article_translation {
          id
          first_published_at
          last_published_at
          locale_code
        }
      }
    }
  }
}`;

const HASURA_CREATE_ARTICLE = `mutation FrontendTestingCreateArticle($locale_code: String!, $created_by_email: String, $headline: String!, $published: Boolean, $category_id: Int!, $slug: String!, $document_id: String, $url: String, $custom_byline: String, $content: jsonb, $facebook_description: String, $facebook_title: String, $search_description: String, $search_title: String, $twitter_description: String, $twitter_title: String, $article_sources: [article_source_insert_input!]!) {
  insert_articles(
    objects: {
      article_translations: {
        data: {
          created_by_email: $created_by_email,
          headline: $headline,
          locale_code: $locale_code,
          published: $published,
          content: $content,
          custom_byline: $custom_byline,
          facebook_description: $facebook_description,
          facebook_title: $facebook_title,
          search_description: $search_description,
          search_title: $search_title,
          twitter_description: $twitter_description,
          twitter_title: $twitter_title
        }
      },
      category_id: $category_id,
      slug: $slug,

      article_sources: {
        data: $article_sources,
        on_conflict: {constraint: article_source_article_id_source_id_key, update_columns: article_id}
      },
      article_google_documents: {
        data: {
          google_document: {
            data: {
              document_id: $document_id,
              locale_code: $locale_code,
              url: $url
            },
            on_conflict: {
              constraint: google_documents_organization_id_document_id_key, update_columns: locale_code
            }
          }
        },
        on_conflict: {
          constraint: article_google_documents_article_id_google_document_id_key, update_columns: google_document_id
        }
      }
    },
    on_conflict: {
      constraint: articles_slug_category_id_organization_id_key, update_columns: [category_id, slug, updated_at]
    }
  ) {
    returning {
      id
      slug
      updated_at
      created_at
      article_google_documents {
        id
        google_document {
          document_id
          locale_code
          url
          id
        }
      }
      article_sources {
        source {
          affiliation
          age
          email
          ethnicity
          gender
          id
          name
          phone
          race
          role
          sexual_orientation
          zip
        }
      }
      category {
        id
        slug
      }
      article_translations(where: { locale_code: {_eq: $locale_code}}, order_by: {id: desc}, limit: 1) {
        id
        article_id
        locale_code
        published
      }
      published_article_translations(where: {locale_code: {_eq: $locale_code}}) {
        article_translation {
          id
          first_published_at
          last_published_at
          locale_code
        }
      }
    }
  }
}`;

export async function hasuraCreateArticle(params) {
  let url = params['url'] || process.env.HASURA_API_URL;
  let orgSlug = params['orgSlug'] || process.env.ORG_SLUG;
  return fetchGraphQL({
    url: url,
    orgSlug: orgSlug,
    query: HASURA_CREATE_ARTICLE,
    name: 'FrontendTestingCreateArticle',
    variables: {
      published: params['published'],
      slug: params['slug'],
      locale_code: params['locale_code'],
      headline: params['headline'],
      category_id: params['category_id'],
      content: params['content'],
      search_title: params['search_title'],
      search_description: params['search_description'],
      document_id: params['document_id'],
      url: params['url'],
      created_by_email: params['created_by_email'],
      article_sources: params['article_sources'],
    },
  });
}

export async function hasuraUpdateArticle(params) {
  let url = params['url'] || process.env.HASURA_API_URL;
  let orgSlug = params['orgSlug'] || process.env.ORG_SLUG;

  return fetchGraphQL({
    url: url,
    orgSlug: orgSlug,
    query: HASURA_UPDATE_ARTICLE,
    name: 'FrontendTestingUpdateArticle',
    variables: {
      id: params['id'],
      published: params['published'],
      slug: params['slug'],
      locale_code: params['locale_code'],
      headline: params['headline'],
      category_id: params['category_id'],
      content: params['content'],
      search_title: params['search_title'],
      search_description: params['search_description'],
      document_id: params['document_id'],
      url: params['url'],
      created_by_email: params['created_by_email'],
      article_sources: params['article_sources'],
    },
  });
}

const DELETE_ARTICLES_MUTATION = `mutation DeleteArticles {
  delete_article_google_documents(where: {id: {_gt: 0}}) {
    affected_rows
  }
  delete_article_source(where: {id: {_gt: 0}}) {
    affected_rows
  }
  delete_homepage_layout_datas(where: {id: {_gt: 0}}) {
    affected_rows
  }
  delete_tag_articles(where: {id: {_gt: 0}}) {
    affected_rows
  }
  delete_article_slug_versions(where: {article_id: {_gt: 0}}) {
    affected_rows
  }
  delete_published_article_translations(where:{id:{_gt: 0}}) {
    affected_rows
  }
  delete_article_translations(where: {id: {_gt: 0}}) {
    affected_rows
  }
  delete_author_articles(where: {id: {_gt: 0}}) {
    affected_rows
  }
  delete_articles(where: {id: {_gt: 0}}) {
    affected_rows
  }
}`;

export async function hasuraDeleteArticles(params) {
  return fetchGraphQL({
    url: params['url'],
    orgSlug: params['orgSlug'],
    query: DELETE_ARTICLES_MUTATION,
    name: 'DeleteArticles',
  });
}

const HASURA_LIST_ARTICLES_ARCHIVE_PAGES = `query FrontendPaginatedListArticlesArchivePages {
  organizations(where: {_or: [{subdomain: {_is_null: false}}, {customDomain: {_is_null: false}}]}) {
    customDomain
    subdomain
    organization_locales {
      locale {
        code
      }
    }
    articles_aggregate(where: {article_translations: {published: {_eq: true}}}) {
      aggregate {
        count
      }
    }
  }
}`;

const HASURA_PAGINATED_ARTICLES_ARCHIVE_PAGE = `query FrontendPaginatedArticlesArchivePage($limit: Int, $offset: Int, $locale_code: String!) {
  articles_aggregate(where: {article_translations: {published: {_eq: true}, locale_code: {_eq: $locale_code}}}) {
    aggregate {
      count
    }
  }
  articles(where: {article_translations: {published: {_eq: true}, locale_code: {_eq: $locale_code}}}, limit: $limit, offset: $offset, order_by: {article_translations_aggregate: {min: {first_published_at: desc}}}) {
    id
    slug
    article_translations(where: {published: {_eq: true}, locale_code: {_eq: $locale_code}}, order_by: {id: desc}) {
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
        author_translations(where: {locale_code: {_eq: $locale_code}}) {
          bio
          title
          locale_code
        }
      }
    }
    category {
      slug
      category_translations(where: {locale_code: {_eq: $locale_code}}) {
        title
        locale_code
      }
    }
  }
  categories {
    category_translations(where: {locale_code: {_eq: $locale_code}}) {
      title
      locale_code
    }
    published
    slug
  }
  site_metadatas(where: {site_metadata_translations: {locale_code: {_eq: $locale_code}}, published: {_eq: true}}) {
    site_metadata_translations(where: {locale_code: {_eq: $locale_code}}, order_by: {id: desc}, limit: 1) {
      data
      locale_code
    }
  }
  tags(where: {published: {_eq: true}}) {
    id
    slug
    tag_translations(where: {locale_code: {_eq: $locale_code}}, order_by: {id: desc}, limit: 1) {
      title
      locale_code
    }
  }
}`;

export async function hasuraArticlesArchivePage(params) {
  let limit = parseInt(params['limit'] || '10');
  let offset = parseInt(params['offset'] || '0');

  return fetchGraphQL({
    url: params['url'],
    site: params['site'],
    query: HASURA_PAGINATED_ARTICLES_ARCHIVE_PAGE,
    name: 'FrontendPaginatedArticlesArchivePage',
    variables: {
      limit: limit,
      offset: offset,
      locale_code: params['localeCode'],
    },
  });
}

export async function hasuraListArticleArchivePages() {
  return fetchGraphQL({
    url: process.env.HASURA_API_URL,
    orgSlug: process.env.ORG_SLUG,
    query: HASURA_LIST_ARTICLES_ARCHIVE_PAGES,
    name: 'FrontendPaginatedListArticlesArchivePages',
  });
}

const HASURA_INSERT_ARTICLE_SLUG_VERSIONS = `mutation FrontendInsertArticleSlugVersions($objects: [article_slug_versions_insert_input!] = {}) {
  insert_article_slug_versions(objects: $objects, on_conflict: {constraint: slug_versions_pkey, update_columns: category_slug}) {
    affected_rows
  }
}
`;
export async function hasuraInsertArticleSlugVersions(params) {
  return fetchGraphQL({
    url: params['url'],
    site: params['site'],
    query: HASURA_INSERT_ARTICLE_SLUG_VERSIONS,
    name: 'FrontendInsertArticleSlugVersions',
    variables: {
      objects: params['objects'],
    },
  });
}

const HASURA_LOOKUP_GOOGLE_DOC = `query ApiLookupGoogleDoc($document_id: String!) {
  google_documents(where: {document_id: {_eq: $document_id}}) {
    article_google_documents {
      article {
        id
        slug
        canonical_url
        category {
          id
          slug
          title
        }
        author_articles {
          author {
            id
            first_names
            last_name
            slug
          }
        }
        article_sources {
          source {
            affiliation
            age
            created_at
            email
            ethnicity
            gender
            id
            name
            phone
            race
            role
            sexual_orientation
            updated_at
            zip
          }
        }
        tag_articles {
          tag_id
        }
        article_translations(order_by: {id: desc}, limit: 1) {
          custom_byline
          facebook_description
          facebook_title
          first_published_at
          headline
          id
          last_published_at
          locale_code
          published
          search_description
          search_title
          twitter_description
          twitter_title
          published_article_translations {
            article_translation {
              first_published_at
              id
              locale_code
              last_published_at
            }
          }
        }
      }
      google_document {
        locale_code
      }
    }
    page_google_documents {
      google_document {
        locale_code
      }
      page {
        id
        slug
        author_pages {
          author {
            first_names
            last_name
            id
            slug
          }
        }
        page_translations(limit: 1, order_by: {id: desc}) {
          facebook_description
          facebook_title
          first_published_at
          headline
          id
          last_published_at
          locale_code
          published
          search_description
          search_title
          twitter_title
          twitter_description
        }
      }
    }
  }
  authors {
    id
    slug
    first_names
    last_name
  }
  categories {
    id
    published
    slug
    category_translations(where: {locale_code: {_eq: "en-US"}}) {
      locale_code
      title
    }
  }
  homepage_layout_datas {
    article_priority_1
    article_priority_2
    article_priority_3
  }
  organization_locales {
    locale {
      code
      name
    }
  }
  tags {
    id
    slug
    tag_translations(where: {locale_code: {_eq: "en-US"}}) {
      locale_code
      title
    }
  }
}`;

export async function hasuraLookupGoogleDoc(params) {
  return fetchGraphQL({
    url: params['url'],
    site: params['site'],
    query: HASURA_LOOKUP_GOOGLE_DOC,
    name: 'ApiLookupGoogleDoc',
    variables: {
      document_id: params['documentId'],
    },
  });
}

const HASURA_GET_GOOGLE_DOCS_FOR_ARTICLE = `query ApiLookupGoogleDocsForArticle($article_id: Int!, $locale_code: String!) {
  article_google_documents(where: {article_id: {_eq: $article_id}}) {
    google_document {
      document_id
      locale_code
      locale {
        code
        name
      }
      url
    }
    article_id
  }
  published_article_translations(where: {locale_code: {_eq: $locale_code}, article_id: {_eq: $article_id}}) {
    article_translation {
      id
      first_published_at
      last_published_at
      locale_code
    }
  }
}`;

export async function hasuraGetGoogleDocsForArticle(params) {
  return fetchGraphQL({
    url: params['url'],
    site: params['site'],
    query: HASURA_GET_GOOGLE_DOCS_FOR_ARTICLE,
    name: 'ApiLookupGoogleDocsForArticle',
    variables: {
      article_id: params['articleId'],
      locale_code: params['localeCode'],
    },
  });
}

const HASURA_GET_GOOGLE_DOCS_FOR_PAGE = `query ApiLookupGoogleDocsForPage($page_id: Int!) {
  page_google_documents(where: {page_id: {_eq: $page_id}}) {
    google_document {
      document_id
      locale_code
      locale {
        code
        name
      }
      url
    }
    page_id
  }
}`;

export async function hasuraGetGoogleDocsForPage(params) {
  return fetchGraphQL({
    url: params['url'],
    site: params['site'],
    query: HASURA_GET_GOOGLE_DOCS_FOR_PAGE,
    name: 'ApiLookupGoogleDocsForPage',
    variables: {
      page_id: params['pageId'],
    },
  });
}

const HASURA_LIST_STATIC_PREVIEW_PAGE_PATHS = `query FrontendListStaticPreviewPagePaths {
  organizations(where: {_or: [{subdomain: {_is_null: false}}, {customDomain: {_is_null: false}}]}) {
    customDomain
    subdomain
    organization_locales {
      locale {
        code
      }
    }
    pages {
      slug
      page_translations(distinct_on: locale_code) {
        locale_code
        published
        headline
      }
    }
  }
}`;

export async function listStaticPreviewPagePaths(params) {
  return fetchGraphQL({
    url: params['url'],
    adminSecret: params['adminSecret'],
    query: HASURA_LIST_STATIC_PREVIEW_PAGE_PATHS,
    name: 'FrontendListStaticPreviewPagePaths',
  });
}

const HASURA_LIST_STATIC_PAGE_PATHS = `query FrontendListStaticPagePaths {
  organizations(where: {_or: [{subdomain: {_is_null: false}}, {customDomain: {_is_null: false}}]}) {
    customDomain
    subdomain
    organization_locales {
      locale {
        code
      }
    }
    pages(where: {page_translations: {published: {_eq: true}}}) {
      slug
      page_translations(where: {published: {_eq: true}}, distinct_on: locale_code) {
        locale_code
        published
        headline
      }
    }
  }
}`;

export async function listStaticPagePaths(params) {
  return fetchGraphQL({
    url: params['url'],
    adminSecret: params['adminSecret'],
    query: HASURA_LIST_STATIC_PAGE_PATHS,
    name: 'FrontendListStaticPagePaths',
  });
}

export async function generateAllStaticPagePaths(params = {}) {
  let result;
  if (params['preview']) {
    result = await listStaticPreviewPagePaths(params);
  } else {
    result = await listStaticPagePaths(params);
  }

  if (result.errors) {
    throw result.errors;
  }

  let allPaths = [];
  for (let i = 0; i < result.data.organizations.length; i++) {
    let org = result.data.organizations[i];

    for (let x = 0; x < org.pages.length; x++) {
      let page = org.pages[x];
      let siteParams = Object.assign({}, params['urlParams']);
      if (org.subdomain) {
        siteParams['site'] = org.subdomain;
      } else if (org.customDomain) {
        siteParams['site'] = org.customDomain;
      }
      siteParams['slug'] = page.slug;
      allPaths.push({
        params: siteParams,
      });
      // for (let y = 0; y < page.page_translations.length; y++) {
      //   allPaths.push({
      //     params: siteParams,
      //     locale: page.page_translations[y].locale_code,
      //   });
      // }
    }
  }

  return allPaths;
}

const HASURA_LIST_ALL_ARTICLE_ARCHIVE_PAGES = `query FrontendPaginatedListArticlesArchivePages {
  organizations(where: {_or: [{subdomain: {_is_null: false}}, {customDomain: {_is_null: false}}]}) {
    customDomain
    subdomain
    organization_locales {
      locale {
        code
      }
    }
    articles_aggregate(where: {article_translations: {published: {_eq: true}}}) {
      aggregate {
        count
      }
    }
  }
}`;

export async function listArticleArchivePages(params) {
  return fetchGraphQL({
    url: params['url'],
    adminSecret: params['adminSecret'],
    query: HASURA_LIST_ALL_ARTICLE_ARCHIVE_PAGES,
    name: 'FrontendPaginatedListArticlesArchivePages',
  });
}

function range(size, startAt = 0) {
  return [...Array(size).keys()].map((i) => i + startAt);
}
export async function generateAllArticlePagePaths(params = {}) {
  const { errors, data } = await hasuraListAllArticleSlugs();
  if (errors) {
    throw errors;
  }
  let allPaths = [];
  for (let i = 0; i < data.organizations.length; i++) {
    let org = data.organizations[i];

    for (let x = 0; x < org.articles.length; x++) {
      let article = org.articles[x];
      let siteParams = Object.assign({}, params['urlParams']);
      if (org.subdomain) {
        siteParams['site'] = org.subdomain;
      } else if (org.customDomain) {
        siteParams['site'] = org.customDomain;
      }
      siteParams['category'] = article.category.slug;
      siteParams['slug'] = article.slug;
      allPaths.push({
        params: siteParams,
      });
    }
  }
  return allPaths;
}

export async function generateAllArticlePreviewPagePaths(params = {}) {
  const { errors, data } = await hasuraListAllArticlePreviewSlugs();
  if (errors) {
    throw errors;
  }
  let allPaths = [];
  for (let i = 0; i < data.organizations.length; i++) {
    let org = data.organizations[i];

    for (let x = 0; x < org.articles.length; x++) {
      let article = org.articles[x];
      let siteParams = Object.assign({}, params['urlParams']);
      if (org.subdomain) {
        siteParams['site'] = org.subdomain;
      } else if (org.customDomain) {
        siteParams['site'] = org.customDomain;
      }
      siteParams['category'] = article.category.slug;
      siteParams['slug'] = article.slug;
      allPaths.push({
        params: siteParams,
      });
    }
  }
  return allPaths;
}

export async function generateAllArticleArchivePages(params = {}) {
  const { errors, data } = await listArticleArchivePages(params);
  if (errors) {
    console.error('errors:', errors);
    throw errors;
  }

  let allPaths = [];
  for (let i = 0; i < data.organizations.length; i++) {
    let org = data.organizations[i];

    let siteParams = Object.assign({}, params['urlParams']);
    if (org.subdomain) {
      siteParams['site'] = org.subdomain;
    } else if (org.customDomain) {
      siteParams['site'] = org.customDomain;
    }

    let limit = 10;
    let totalCount = org.articles_aggregate.aggregate.count;
    let pageCount = Math.ceil(totalCount / limit);

    let pageNumbers = range(pageCount, 1);
    let paths = [];
    for (const pageNum of pageNumbers) {
      siteParams['pageNumber'] = pageNum.toString();

      paths.push({
        params: {
          params: siteParams,
        },
      });
    }
  }

  return allPaths;
}
